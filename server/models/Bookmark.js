const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Đảm bảo một user chỉ bookmark một plant một lần
BookmarkSchema.index({ user: 1, plant: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);