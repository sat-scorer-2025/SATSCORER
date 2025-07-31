import mongoose from 'mongoose';
import SupportModel from '../models/SupportModel.js';
import UserModel from '../models/UserModel.js';
import CourseModel from '../models/CourseModel.js';
import EnrollmentModel from '../models/EnrollmentModel.js';

// Create a support ticket (Authenticated users)
const createSupportTicket = async (req, res) => {
    try {
        const { courseId, query } = req.body;
        const userId = req.user.userId;
        console.log('createSupportTicket: Processing for userId:', userId);

        // Validate required fields
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        // Validate userId
        if (!mongoose.isValidObjectId(userId)) {
            console.error('createSupportTicket: Invalid userId format:', userId);
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Verify user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate courseId if provided
        if (courseId) {
            if (!mongoose.isValidObjectId(courseId)) {
                return res.status(400).json({ message: 'Invalid course ID' });
            }
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }
            // Check if user is enrolled in the course
            const enrollment = await EnrollmentModel.findOne({ userId, courseId, status: 'active' });
            if (!enrollment) {
                return res.status(403).json({ message: 'You must be enrolled in the course to create a support ticket' });
            }
        }

        // Create support ticket
        const supportTicket = new SupportModel({
            userId,
            courseId: courseId || null,
            query,
            status: 'open'
        });

        await supportTicket.save();

        // Update user's support tickets
        await UserModel.findByIdAndUpdate(userId, { $push: { support: supportTicket._id } });

        res.status(201).json({
            message: 'Support ticket created successfully',
            supportTicket
        });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        res.status(500).json({ message: 'Server error while creating support ticket', error: error.message });
    }
};

// Get user's own support tickets (Authenticated users)
const getSupportTicket = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('getSupportTicket: Fetching tickets for userId:', userId);

        if (!mongoose.isValidObjectId(userId)) {
            console.error('getSupportTicket: Invalid userId format:', userId);
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const supportTickets = await SupportModel
            .find({ userId })
            .populate('userId', 'name email')
            .populate('courseId', 'title examType')
            .sort({ createdAt: -1 });

        if (!supportTickets || supportTickets.length === 0) {
            return res.status(404).json({ message: 'No support tickets found for this user' });
        }

        res.status(200).json({
            message: 'Support tickets retrieved successfully',
            count: supportTickets.length,
            supportTickets
        });
    } catch (error) {
        console.error('Error fetching user support tickets:', error);
        res.status(500).json({ message: 'Server error while fetching support tickets', error: error.message });
    }
};

// Get all support tickets (Admin only)
const getAllSupportTicket = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const supportTickets = await SupportModel
            .find()
            .populate('userId', 'name email')
            .populate('courseId', 'title examType')
            .sort({ createdAt: -1 });

        if (!supportTickets || supportTickets.length === 0) {
            return res.status(404).json({ message: 'No support tickets found' });
        }

        res.status(200).json({
            message: 'All support tickets retrieved successfully',
            count: supportTickets.length,
            supportTickets
        });
    } catch (error) {
        console.error('Error fetching all support tickets:', error);
        res.status(500).json({ message: 'Server error while fetching all support tickets', error: error.message });
    }
};

// Update a support ticket (Admin only)
const updateSupportTicket = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const supportTicketId = req.params.id;
        const { status, response } = req.body;

        if (!mongoose.isValidObjectId(supportTicketId)) {
            return res.status(400).json({ message: 'Invalid support ticket ID' });
        }

        if (!status && !response) {
            return res.status(400).json({ message: 'At least one of status or response is required' });
        }

        if (status && !['open', 'resolved', 'closed'].includes(status)) {
            return res.status(400).json({ message: 'Status must be open, resolved, or closed' });
        }

        const updateFields = {};
        if (status) updateFields.status = status;
        if (response) updateFields.response = response;

        const supportTicket = await SupportModel
            .findByIdAndUpdate(
                supportTicketId,
                { $set: updateFields },
                { new: true, runValidators: true }
            )
            .populate('userId', 'name email')
            .populate('courseId', 'title examType');

        if (!supportTicket) {
            return res.status(404).json({ message: 'Support ticket not found' });
        }

        res.status(200).json({
            message: 'Support ticket updated successfully',
            supportTicket
        });
    } catch (error) {
        console.error('Error updating support ticket:', error);
        res.status(500).json({ message: 'Server error while updating support ticket', error: error.message });
    }
};

// Delete a support ticket (Admin only)
const deleteSupportTicket = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        const supportTicketId = req.params.id;
        if (!mongoose.isValidObjectId(supportTicketId)) {
            return res.status(400).json({ message: 'Invalid support ticket ID' });
        }

        const supportTicket = await SupportModel.findById(supportTicketId);
        if (!supportTicket) {
            return res.status(404).json({ message: 'Support ticket not found' });
        }

        // Remove support ticket from user
        await UserModel.findByIdAndUpdate(supportTicket.userId, { $pull: { support: supportTicketId } });

        await SupportModel.findByIdAndDelete(supportTicketId);

        res.status(200).json({ message: 'Support ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting support ticket:', error);
        res.status(500).json({ message: 'Server error while deleting support ticket', error: error.message });
    }
};

export { createSupportTicket, getSupportTicket, getAllSupportTicket, updateSupportTicket, deleteSupportTicket };