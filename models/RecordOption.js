const mongoose = require('mongoose');

const recordOptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  friends: {
    type: [String],
    default: []
  },
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

// 초기 데이터 설정
const RecordOption = mongoose.model('RecordOption', recordOptionSchema);

// 초기 데이터가 없으면 빈 배열로 생성
RecordOption.findOne().then(option => {
  if (!option) {
    RecordOption.create({ friends: [] });
  }
});

module.exports = RecordOption; 