const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');

    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({
        success: false,
        message: 'Không có token, truy cập bị từ chối'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Auth middleware - Decoded token userId:', decoded.userId);

    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('Auth middleware - User not found for ID:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    console.log('Auth middleware - User found:', user.username, 'Role:', user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }
};

// Middleware chỉ cho phép user thường (không phải admin)
const userOnly = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin không được phép thực hiện hành động này'
    });
  }
  next();
};

// Middleware chỉ cho phép admin
const adminOnly = (req, res, next) => {
  console.log('AdminOnly middleware - User role:', req.user?.role);
  if (req.user.role !== 'admin') {
    console.log('AdminOnly middleware - Access denied for role:', req.user.role);
    return res.status(403).json({
      success: false,
      message: 'Chỉ admin mới được phép thực hiện hành động này'
    });
  }
  console.log('AdminOnly middleware - Access granted for admin');
  next();
};

module.exports = { auth, userOnly, adminOnly };