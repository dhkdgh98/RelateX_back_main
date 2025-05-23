// models/Timeline.js

const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  userId: { type: String, required: true },       // 로그인한 유저 ID
  friendName: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  content: { type: String, required: true },
  emotion: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Timeline', timelineSchema);
