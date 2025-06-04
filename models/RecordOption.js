const mongoose = require('mongoose');

const recordOptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  friends: [String],
  locations: [String],
  emotions: [String],
  categories: [String],
  recordTypes: [String]
}, {
  timestamps: true
});

// 옵션 업데이트 시 updatedAt 자동 갱신
recordOptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RecordOption', recordOptionSchema); 