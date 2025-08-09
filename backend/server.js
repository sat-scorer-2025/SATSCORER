import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocket } from './utils/Socket.js';
import { connectDB } from './config/mongoDb.js';
import { connectCloudinary, upload } from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import testRouter from './routes/testRoutes.js';
import questionRouter from './routes/questionRoutes.js';
import videoRouter from './routes/videoRoutes.js';
import notesRouter from './routes/notesRoutes.js';
import liveSessionRouter from './routes/liveSessionRoutes.js';
import testResultRouter from './routes/testResultRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import enrollmentRouter from './routes/enrollmentRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import emailRouter from './routes/emailRoutes.js';
import feedbackRouter from './routes/feedbackRoutes.js';
import supportRouter from './routes/supportRoutes.js';
import otpRouter from './routes/otpRoutes.js';
import './models/UserModel.js';
import './models/CourseModel.js';
import './models/EnrollmentModel.js';
import './models/NotificationModel.js';
import './models/FeedbackModel.js';
import './models/TestResultModel.js';
import './models/SupportModel.js';
import './models/PaymentModel.js';
import './models/TestModel.js';
import './models/VideoModel.js';
import './models/NotesModel.js';
import './models/LiveSessionModel.js';
import './models/QuestionModel.js';
import './models/OtpModel.js';
import { scheduleNotifications } from './utils/scheduleNotifications.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = initializeSocket(server);

// Middleware to capture raw body for webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

connectDB();
connectCloudinary();
scheduleNotifications(io);

app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/test', testRouter);
app.use('/api/question', questionRouter);
app.use('/api/video', videoRouter);
app.use('/api/notes', notesRouter);
app.use('/api/livesession', liveSessionRouter);
app.use('/api/testresult', testResultRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/enrollment', enrollmentRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/email', emailRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/support', supportRouter);
app.use('/api/otp', otpRouter);

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('API WORKING');
});

console.log('Environment Variables Loaded:', {
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID ? 'Set' : 'Missing',
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY ? 'Set' : 'Missing',
  CASHFREE_API_URL: process.env.CASHFREE_API_URL,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME ? 'Set' : 'Missing',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
  CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY ? 'Set' : 'Missing',
  GMAIL_USER: process.env.GMAIL_USER ? 'Set' : 'Missing',
  CLIENT_ID: process.env.CLIENT_ID ? 'Set' : 'Missing',
  CLIENT_SECRET: process.env.CLIENT_SECRET ? 'Set' : 'Missing',
  REFRESH_TOKEN: process.env.REFRESH_TOKEN ? 'Set' : 'Missing',
});

server.listen(port, '0.0.0.0', () => console.log(`Server started at port ${port}...`));
