const mongoose = require('mongoose');

// 유저 스키마 정의 (Relate X 기준)
const userSchema = new mongoose.Schema({
  // 사용자 아이디 (username)
  user_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  // 이름
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // 성별
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },

  // 생년월일 (YYYY-MM-DD 형식 문자열)
  birthday: {
    type: String,
    required: true,
  },

  // 이메일
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  // 비밀번호 (해싱 필요!)
  password: {
    type: String,
    required: true,
  },

  // 계정 상태
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
  },

  // 생성 및 수정일
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
