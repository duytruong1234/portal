const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên thực vật là bắt buộc'],
    trim: true
  },
  scientificName: {
    type: String,
    required: [true, 'Tên khoa học là bắt buộc'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Mô tả là bắt buộc']
  },
  image: {
    type: String,
    required: [true, 'Hình ảnh là bắt buộc'],
    default: 'https://via.placeholder.com/400x300?text=Plant+Image'
  },
  distribution: {
    type: String,
    required: [true, 'Vùng phân bố là bắt buộc']
  },
  characteristics: {
    type: String,
    required: [true, 'Đặc điểm là bắt buộc']
  },
  uses: {
    type: String,
    required: [true, 'Công dụng là bắt buộc']
  },
  family: {
    type: String,
    required: false
  },
  habitat: {
    type: String,
    required: false
  },
  growthConditions: {
    type: String,
    required: false
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Tạo text index để tìm kiếm
PlantSchema.index({
  name: 'text',
  scientificName: 'text',
  description: 'text',
  characteristics: 'text'
});

module.exports = mongoose.model('Plant', PlantSchema);