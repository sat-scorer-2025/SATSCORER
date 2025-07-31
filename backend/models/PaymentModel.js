import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    paymentDate: { type: Date },
    cashfreeOrderId: { type: String, required: true },
    transactionId: { type: String },
    paymentMethod: { type: String },
    invoiceDetails: {
      invoiceNumber: { type: String },
      coursePrice: { type: String },
      tax: { type: String },
      total: { type: String },
      purchaseDate: { type: String },
      studentName: { type: String },
    },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1 });

const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

export default PaymentModel;
