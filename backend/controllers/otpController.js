import userModel from '../models/UserModel.js';
import otpModel from '../models/OtpModel.js';
import { google } from 'googleapis';
import { oauth2Client, getAccessToken } from '../config/googleAuth.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async (email, otp) => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Failed to obtain Gmail API access token');
    }
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const subject = 'SATscorer OTP Verification';
    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(to right, #3b82f6, #8b5cf6); padding: 20px; text-align: center; color: white; }
          .content { padding: 30px; }
          .otp { font-size: 24px; font-weight: bold; color: #3b82f6; text-align: center; margin: 20px 0; }
          .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SATscorer</h1>
            <h3>OTP Verification</h3>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>Your One-Time Password (OTP) for SATscorer admin panel access is:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for ${email.includes('admin') ? '1 minute' : '2 minutes'}. Please do not share this OTP with anyone for security reasons.</p>
            <p>If you didn't request this OTP, please contact our support team immediately.</p>
            <a href="mailto:support@satscorer.com" class="button">Contact Support</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} SATscorer. All rights reserved.</p>
            <p>123 Education Lane, Learning City, ED 12345</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const rawMessage = [
      `To: ${email}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n');

    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    const recentOtp = await otpModel.findOne({
      userId: user._id,
      createdAt: { $gte: new Date(Date.now() - 1.5 * 60 * 1000) },
    });

    if (recentOtp && user.role === 'admin') {
      return res.status(429).json({ message: 'Please wait before requesting a new OTP' });
    }

    const otp = generateOtp();
    const expiresAt = new Date(
      Date.now() + (user.role === 'admin' ? 2 * 60 * 1000 : 2 * 60 * 1000)
    );

    const otpRecord = new otpModel({
      userId: user._id,
      otp,
      expiresAt,
    });

    await otpRecord.save();
    await userModel.findByIdAndUpdate(user._id, { $push: { otps: otpRecord._id } });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ message: error.message || 'Server error while requesting OTP' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    const otpRecord = await otpModel.findOne({
      userId: user._id,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    await otpModel.deleteOne({ _id: otpRecord._id });
    await userModel.findByIdAndUpdate(user._id, { $pull: { otps: otpRecord._id } });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
};

export { requestOtp, verifyOtp };
