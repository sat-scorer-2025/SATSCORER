import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import PaymentModel from '../models/PaymentModel.js';
import CourseModel from '../models/CourseModel.js';
import UserModel from '../models/UserModel.js';
import EnrollmentModel from '../models/EnrollmentModel.js';
import { verifyWebhookSignature } from '../utils/CashfreeWebhook.js';

const CASHFREE_API_URL = process.env.CASHFREE_API_URL || 'https://sandbox.cashfree.com/pg';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const initiatePayment = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const userId = req.user.userId;

    console.log('Initiate Payment Request:', { courseId, amount, userId });

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      console.error('Missing Cashfree credentials:', {
        appIdSet: !!CASHFREE_APP_ID,
        secretKeySet: !!CASHFREE_SECRET_KEY,
      });
      return res.status(500).json({ message: 'Payment gateway configuration error' });
    }

    if (!mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid course ID or user ID' });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid amount:', amount);
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.status !== 'published') {
      return res.status(400).json({ message: 'Course is not available for enrollment' });
    }

    if (amount !== course.price) {
      console.error(`Amount mismatch: Provided ${amount}, Expected ${course.price}`);
      return res.status(400).json({ message: 'Amount does not match course price' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingEnrollment = await EnrollmentModel.findOne({ userId, courseId, status: 'active' });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    const invoiceNumber = `INV-${Date.now()}-${userId.slice(-4)}`;
    const coursePrice = (amount / 1.18).toFixed(2);
    const tax = (amount - coursePrice).toFixed(2);
    const payment = new PaymentModel({
      userId,
      courseId,
      amount,
      status: 'pending',
      paymentDate: new Date(),
      cashfreeOrderId: `order_${Date.now()}_${userId}`,
      paymentMethod: 'Cashfree',
      invoiceDetails: {
        invoiceNumber,
        coursePrice: `₹${coursePrice}`,
        tax: `₹${tax}`,
        total: `₹${amount.toFixed(2)}`,
        purchaseDate: new Date().toLocaleDateString(),
        studentName: user.name,
      },
    });
    await payment.save();

    const orderData = {
      order_id: payment.cashfreeOrderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: userId.toString(),
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone || '1234567890',
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/payment/success?order_id={order_id}`,
        notify_url: `${process.env.SERVER_URL}/api/payment/webhook`,
      },
    };

    console.log('Sending Cashfree order request:', {
      order_id: orderData.order_id,
      order_amount: orderData.order_amount,
      api_url: CASHFREE_API_URL,
    });

    const response = await axios.post(`${CASHFREE_API_URL}/orders`, orderData, {
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    const { payment_session_id, order_id } = response.data;

    await UserModel.findByIdAndUpdate(userId, { $push: { payments: payment._id } });

    res.status(200).json({ payment_session_id, order_id });
  } catch (error) {
    console.error('Error initiating payment:', error.response?.data || error.message);
    res.status(500).json({ message: 'Server error while initiating payment', error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const signature = req.headers['x-webhook-signature'];

    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(401).json({ message: 'Invalid webhook signature' });
    }

    const { data } = req.body;
    const { order, payment } = data;

    if (!order || !payment || !order.order_id) {
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }

    const paymentRecord = await PaymentModel.findOne({ cashfreeOrderId: order.order_id });
    if (!paymentRecord) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (paymentRecord.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        paymentRecord.status = payment.payment_status === 'SUCCESS' ? 'completed' : 'failed';
        paymentRecord.paymentDate = new Date();
        paymentRecord.transactionId = payment.cf_payment_id || payment.transaction_id;
        paymentRecord.paymentMethod = payment.payment_method?.type || 'Unknown';
        await paymentRecord.save({ session });

        if (payment.payment_status === 'SUCCESS') {
          const existingEnrollment = await EnrollmentModel.findOne({
            userId: paymentRecord.userId,
            courseId: paymentRecord.courseId,
            status: 'active',
          }).session(session);

          if (!existingEnrollment) {
            const enrollment = new EnrollmentModel({
              userId: paymentRecord.userId,
              courseId: paymentRecord.courseId,
              enrolledAt: new Date(),
              status: 'active',
            });
            await enrollment.save({ session });

            await Promise.all([
              UserModel.findByIdAndUpdate(
                paymentRecord.userId,
                { $push: { enrolledCourses: enrollment._id } },
                { session }
              ),
              CourseModel.findByIdAndUpdate(
                paymentRecord.courseId,
                { $push: { enrollments: enrollment._id } },
                { session }
              ),
            ]);
          }
        }
      });
    } finally {
      await session.endSession();
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Server error while processing webhook', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, courseId, userId } = req.body;

    if (!orderId || !mongoose.isValidObjectId(courseId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: `Invalid order ID, course ID, or user ID` });
    }

    const paymentRecord = await PaymentModel.findOne({ cashfreeOrderId: orderId });
    if (!paymentRecord) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (paymentRecord.status === 'completed') {
      return res.status(200).json({ message: 'Payment already processed and user enrolled' });
    }

    const response = await axios.get(`${CASHFREE_API_URL}/orders/${orderId}`, {
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
    });

    const orderStatus = response.data.order_status;
    if (orderStatus !== 'PAID') {
      paymentRecord.status = 'failed';
      await paymentRecord.save();
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        paymentRecord.status = 'completed';
        paymentRecord.paymentDate = new Date();
        paymentRecord.transactionId = response.data.cf_payment_id || response.data.transaction_id;
        paymentRecord.paymentMethod = response.data.payment_method?.type || 'Unknown';
        await paymentRecord.save({ session });

        const existingEnrollment = await EnrollmentModel.findOne({
          userId,
          courseId,
          status: 'active',
        }).session(session);

        if (!existingEnrollment) {
          const enrollment = new EnrollmentModel({
            userId,
            courseId,
            enrolledAt: new Date(),
            status: 'active',
          });
          await enrollment.save({ session });

          await Promise.all([
            UserModel.findByIdAndUpdate(userId, { $push: { enrolledCourses: enrollment._id } }, { session }),
            CourseModel.findByIdAndUpdate(courseId, { $push: { enrollments: enrollment._id } }, { session }),
          ]);
        }
      });
    } finally {
      await session.endSession();
    }

    res.status(200).json({ message: 'Payment verified and user enrolled successfully' });
  } catch (error) {
    console.error('Error verifying payment:', error.response?.data || error);
    res.status(500).json({ message: 'Server error while verifying payment', error: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const payments = await PaymentModel.find({ userId })
      .populate('courseId', 'title')
      .populate('userId', 'name email address')
      .sort({ paymentDate: -1 }) // Sort by most recent
      .lean();
    res.status(200).json({
      message: 'Payment history retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Server error while fetching payment history', error: error.message });
  }
};

const getAllPayment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const { startDate, endDate, allStatuses, previousStartDate, previousEndDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (previousStartDate && previousEndDate) {
      query.paymentDate = {
        $gte: new Date(previousStartDate),
        $lte: new Date(previousEndDate),
      };
    }
    if (!allStatuses) {
      query.status = 'completed';
    }
    const payments = await PaymentModel.find(query)
      .populate('userId', 'name email address')
      .populate('courseId', 'title')
      .sort({ paymentDate: -1 }) // Sort by most recent
      .lean();
    res.status(200).json({
      message: 'All payments retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({ message: 'Server error while fetching all payments', error: error.message });
  }
};

const getPaymentForAUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const payments = await PaymentModel.find({ userId })
      .populate('courseId', 'title')
      .populate('userId', 'name email address')
      .sort({ paymentDate: -1 }) // Sort by most recent
      .lean();
    res.status(200).json({
      message: 'User payments retrieved successfully',
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Server error while fetching user payments', error: error.message });
  }
};

export { initiatePayment, updatePaymentStatus, verifyPayment, getPaymentHistory, getAllPayment, getPaymentForAUser };
