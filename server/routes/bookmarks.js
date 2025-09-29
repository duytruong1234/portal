const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const Plant = require('../models/Plant');
const { auth, userOnly } = require('../middleware/auth');

// @route   POST /api/bookmarks
// @desc    Thêm bookmark
// @access  Private (User only)
router.post('/', auth, userOnly, async (req, res) => {
  try {
    const { plantId } = req.body;
    const userId = req.user._id || req.user.id;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        message: 'Plant ID là bắt buộc'
      });
    }

    // Kiểm tra plant tồn tại
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực vật'
      });
    }

    // Kiểm tra đã bookmark chưa
    const existingBookmark = await Bookmark.findOne({ user: userId, plant: plantId });
    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'Thực vật này đã có trong danh sách yêu thích'
      });
    }

    // Tạo bookmark
    const bookmark = new Bookmark({ user: userId, plant: plantId });
    await bookmark.save();

    res.json({
      success: true,
      message: 'Đã thêm vào yêu thích',
      data: bookmark
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Thực vật này đã có trong danh sách yêu thích'
      });
    }
    console.error('Error adding bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm vào yêu thích'
    });
  }
});

// @route   DELETE /api/bookmarks/:plantId
// @desc    Xóa bookmark
// @access  Private (User only)
router.delete('/:plantId', auth, userOnly, async (req, res) => {
  try {
    const plantId = req.params.plantId;
    const userId = req.user._id || req.user.id;

    const bookmark = await Bookmark.findOneAndDelete({ user: userId, plant: plantId });
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bookmark'
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa khỏi yêu thích'
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa khỏi yêu thích'
    });
  }
});

// @route   GET /api/bookmarks
// @desc    Lấy danh sách bookmark của user
// @access  Private (User only)
router.get('/', auth, userOnly, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const bookmarks = await Bookmark.find({ user: userId })
      .populate('plant')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tải danh sách yêu thích'
    });
  }
});

// @route   GET /api/bookmarks/check/:plantId
// @desc    Kiểm tra plant có được bookmark chưa
// @access  Private (User only)
router.get('/check/:plantId', auth, userOnly, async (req, res) => {
  try {
    const plantId = req.params.plantId;
    const userId = req.user._id || req.user.id;

    const bookmark = await Bookmark.findOne({ user: userId, plant: plantId });

    res.json({
      success: true,
      isBookmarked: !!bookmark
    });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra bookmark'
    });
  }
});

module.exports = router;