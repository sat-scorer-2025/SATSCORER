import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // For admin-specific routes, check role
    if (req.path.includes('/users') || req.path.includes('/inactive') || req.path.includes('/status')) {
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required' });
      }
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

