const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const { auth, userOnly, adminOnly } = require('../middleware/auth');

// @route   GET /api/plants
// @desc    Lấy tất cả thực vật
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    
    // Debug: log first plant ID to see format
    if (plants.length > 0) {
      console.log('Sample plant ID from database:', plants[0]._id);
      console.log('Sample plant ID type:', typeof plants[0]._id);
      console.log('Sample plant ID toString:', plants[0]._id.toString());
      console.log('Sample plant ID length:', plants[0]._id.toString().length);
    }
    
    res.json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách thực vật'
    });
  }
});

// @route   GET /api/plants/search
// @desc    Tìm kiếm thực vật
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Từ khóa tìm kiếm không được để trống'
      });
    }

    // Tìm kiếm theo tên hoặc tên khoa học
    const plants = await Plant.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { scientificName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      count: plants.length,
      query: q,
      data: plants
    });
  } catch (error) {
    console.error('Error searching plants:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm thực vật'
    });
  }
});

// @route   GET /api/plants/suggestions
// @desc    Gợi ý tìm kiếm
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json([]);
    }

    // Gợi ý theo tên
    const plants = await Plant.find({
      name: { $regex: q, $options: 'i' }
    }).limit(10).select('name _id');

    res.json(plants);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải gợi ý'
    });
  }
});

// @route   GET /api/plants/advanced
// @desc    Tìm kiếm nâng cao
// @access  Public
router.get('/advanced', async (req, res) => {
  try {
    const filters = {};
    if (req.query.family) filters.family = { $regex: req.query.family, $options: 'i' };
    if (req.query.habitat) filters.habitat = { $regex: req.query.habitat, $options: 'i' };
    if (req.query.uses) filters.uses = { $regex: req.query.uses, $options: 'i' };
    if (req.query.distribution) filters.distribution = { $regex: req.query.distribution, $options: 'i' };

    const plants = await Plant.find(filters);

    res.json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Error advanced search:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm nâng cao'
    });
  }
});

// @route   GET /api/plants/:id
// @desc    Lấy thông tin chi tiết thực vật
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực vật'
      });
    }

    res.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải thông tin thực vật'
    });
  }
});

// @route   POST /api/plants
// @desc    Thêm thực vật mới
// @access  Private (Admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      scientificName,
      description,
      image,
      distribution,
      characteristics,
      uses,
      family,
      habitat,
      growthConditions
    } = req.body;

    // Kiểm tra thực vật đã tồn tại
    const existingPlant = await Plant.findOne({ scientificName });
    if (existingPlant) {
      return res.status(400).json({
        success: false,
        message: 'Thực vật với tên khoa học này đã tồn tại'
      });
    }

    const plant = new Plant({
      name,
      scientificName,
      description,
      image,
      distribution,
      characteristics,
      uses,
      family,
      habitat,
      growthConditions
    });

    const savedPlant = await plant.save();

    res.status(201).json({
      success: true,
      message: 'Thêm thực vật thành công',
      data: savedPlant
    });
  } catch (error) {
    console.error('Error creating plant:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm thực vật'
    });
  }
});

// @route   PUT /api/plants/:id
// @desc    Cập nhật thực vật
// @access  Private (Admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực vật'
      });
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Cập nhật thực vật thành công',
      data: updatedPlant
    });
  } catch (error) {
    console.error('Error updating plant:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thực vật'
    });
  }
});

// @route   DELETE /api/plants/:id
// @desc    Xóa thực vật
// @access  Private (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const plantId = req.params.id;
    console.log('DELETE request received for plant ID:', plantId);
    console.log('Plant ID length:', plantId?.length);
    console.log('Plant ID characters:', [...plantId]);
    console.log('User role:', req.user?.role);
    console.log('User ID:', req.user?._id);
    
    // Validate ObjectId format - 24 character hex string
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(plantId)) {
      console.log('Invalid ObjectId format. Expected 24 hex chars, got:', plantId);
      console.log('Regex test result:', objectIdPattern.test(plantId));
      return res.status(400).json({
        success: false,
        message: `ID không hợp lệ - định dạng ObjectId không đúng. Nhận được: "${plantId}" (${plantId?.length} ký tự)`
      });
    }

    console.log('ObjectId format is valid, attempting to find plant...');
    const plant = await Plant.findById(plantId);
    
    if (!plant) {
      console.log('Plant not found with ID:', plantId);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực vật'
      });
    }

    console.log('Found plant to delete:', plant.name);
    await Plant.findByIdAndDelete(plantId);
    console.log('Plant deleted successfully');

    res.json({
      success: true,
      message: 'Xóa thực vật thành công'
    });
  } catch (error) {
    console.error('Error deleting plant:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ - CastError'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa thực vật'
    });
  }
});

// @route   POST /api/plants/:id/rate
// @desc    Đánh giá thực vật
// @access  Private (User only)
router.post('/:id/rate', auth, userOnly, async (req, res) => {
  try {
    const { rating } = req.body;
    const plantId = req.params.id;
    const userId = req.user._id || req.user.id;

    // Validation
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải là số nguyên từ 1 đến 5'
      });
    }

    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: 'Plant ID là bắt buộc'
      });
    }

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực vật'
      });
    }

    // Kiểm tra xem user đã đánh giá chưa
    const existingRating = plant.ratings.find(r => r.user.toString() === userId.toString());
    if (existingRating) {
      existingRating.rating = rating;
      existingRating.createdAt = Date.now();
    } else {
      plant.ratings.push({ user: userId, rating });
    }

    // Tính average rating
    const totalRating = plant.ratings.reduce((sum, r) => sum + r.rating, 0);
    plant.averageRating = totalRating / plant.ratings.length;

    await plant.save();

    res.json({
      success: true,
      message: 'Đánh giá thành công',
      data: { averageRating: plant.averageRating, userRating: rating }
    });
  } catch (error) {
    console.error('Error rating plant:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh giá'
    });
  }
});

// @route   POST /api/plants/:id/comment
// @desc    Bình luận thực vật
// @access  Private (User only)
router.post('/:id/comment', auth, userOnly, async (req, res) => {
  try {
    const { comment } = req.body;
    const plantId = req.params.id;
    const userId = req.user._id || req.user.id;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Bình luận không được để trống'
      });
    }

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực vật'
      });
    }

    plant.comments.push({ user: userId, comment: comment.trim() });
    await plant.save();

    // Populate user info
    await plant.populate('comments.user', 'username');

    res.json({
      success: true,
      message: 'Bình luận thành công',
      data: plant.comments[plant.comments.length - 1]
    });
  } catch (error) {
    console.error('Error commenting plant:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi bình luận'
    });
  }
});

// @route   DELETE /api/plants/:id/comment/:commentId
// @desc    Xóa bình luận
// @access  Private (User or Admin)
router.delete('/:id/comment/:commentId', auth, async (req, res) => {
  try {
    const plantId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user._id || req.user.id;

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực vật'
      });
    }

    const comment = plant.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình luận'
      });
    }

    // Chỉ cho phép user xóa bình luận của mình hoặc admin
    if (comment.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa bình luận này'
      });
    }

    plant.comments.pull(commentId);
    await plant.save();

    res.json({
      success: true,
      message: 'Xóa bình luận thành công'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bình luận'
    });
  }
});

module.exports = router;