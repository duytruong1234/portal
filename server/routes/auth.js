const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Đăng ký tài khoản mới
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body

    // Kiểm tra input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      })
    }

    // Kiểm tra username đã tồn tại
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập đã tồn tại'
      })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Tạo user mới
    const newUser = new User({
      username,
      password: hashedPassword,
      email: email || '',
      fullName: fullName || '',
      role: 'user'
    })

    const savedUser = await newUser.save()

    // Tạo JWT token
    const token = jwt.sign(
      { 
        userId: savedUser._id,
        username: savedUser.username,
        role: savedUser.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role
      }
    })

  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký'
    })
  }
})

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    // Kiểm tra admin mặc định - tạo nếu chưa tồn tại
    if (username === 'admin' && password === '123456') {
      let adminUser = await User.findOne({ username: 'admin' });

      if (!adminUser) {
        // Tạo admin user nếu chưa tồn tại
        const hashedPassword = await bcrypt.hash('123456', 10);
        adminUser = new User({
          username: 'admin',
          email: 'admin@plantportal.com',
          password: hashedPassword,
          fullName: 'Administrator',
          role: 'admin'
        });
        await adminUser.save();
      }

      // Tạo JWT token
      const token = jwt.sign(
        {
          userId: adminUser._id,
          username: adminUser.username,
          role: adminUser.role
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: adminUser._id,
          username: adminUser.username,
          role: adminUser.role
        }
      });
    }

    // Kiểm tra user trong database (nếu có)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập'
    });
  }
});

// @route   POST /api/auth/verify
// @desc    Xác thực token
// @access  Private
router.post('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có token xác thực'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Tìm user trong database (bao gồm admin)
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }
});

module.exports = router;