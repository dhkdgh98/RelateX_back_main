const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  friend: { type: String, required: true },
  location: String,
  emotion: String,
  category: String,
  recordType: String,
  date: { type: Date, default: Date.now },
  imageUrls: [String], // ✅ 이미지 URL 배열 추가!
});

module.exports = mongoose.model('Timeline', timelineSchema);
