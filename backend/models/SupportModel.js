import mongoose from "mongoose";

const SupportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Many-to-one with User
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Many-to-one with Course (optional)
  query: { type: String, required: true }, // User's query or issue
  status: { type: String, enum: ['open', 'resolved', 'closed'], default: 'open' },
  response: { type: String }, // Admin's response
}, { timestamps: true });

SupportSchema.index({ userId: 1 });

const SupportModel = mongoose.models.Support || mongoose.model("Support", SupportSchema);

export default SupportModel;