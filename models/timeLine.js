// const mongoose = require('mongoose');

// const timelineSchema = new mongoose.Schema({
//   userId: { type: String, required: true },       // 로그인한 유저 ID
//   friend: { type: String, required: true },   // 관계는 필수
//   title: { type: String, required: true },        // 제목은 필수
//   content: { type: String, required: true },      // 내용도 필수
//   location: { type: String, default: '' },        // 선택
//   emotion: { type: String, default: '' },         // 선택
//   recordType: {
//     type: String,
//     enum: ['대화', '이벤트', '생각'],
//     default: '생각',                              // 선택 & 기본값 설정 가능
//   },
//   category: { type: String, default: '' },        // 선택
//   date: { type: Date, default: Date.now },        // 자동 현재시간
// }, {
//   timestamps: true, // createdAt, updatedAt 자동 생성
// });

// module.exports = mongoose.model('Timeline', timelineSchema);

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
