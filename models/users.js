const mongoose = require('mongoose');

// 유저 스키마 정의
const userSchema = new mongoose.Schema({
  // 사용자 고유 식별자
  user_id: {
    type: String,
    required: true,
    unique: true,  // 고유값
  },

  // 이메일 (로그인 아이디로 사용)
  email: {
    type: String,
    required: true,
    unique: true,  // 고유값
    lowercase: true,  // 이메일은 소문자로 저장
    trim: true,  // 공백 제거
  },

  // 비밀번호
  password: {
    type: String,
    required: true,
  },

  // 로그인 상태 (active, inactive, banned)
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
  },

  // 성별
  gender: {
    type: String,
    enum: ['male', 'female'],  // 문자열의 나열 수정
    required: true,
  },

  // 사용자 구분 (사장님 또는 알바생)
  is_boss: {
    type: Boolean,
    required: true,
  },

  // 연락처
  phone: {
    type: String,
    required: true,
    trim: true,  // 공백 제거
  },

  // 사용자 이름
  name: {
    type: String,
    required: true,
    trim: true,  // 공백 제거
  },

  // 생일
  birthday: {
    type: String,
    required: true,
  },

  // 주소
  address: {
    type: String,
    required: true,
  },

  address1: {
    type: String,
    required: true,
  },

  address2: {
    type: String,
    required: true,
  },

  // 선호 직업
  jobs: {
    type: [String],  // 배열 형태
    required: true,
  },

  // 계정 생성 시간
  created: {
    type: Date,
    default: Date.now,
  },

  // 마지막 업데이트 시간
  updated: {
    type: Date,
    default: Date.now,
  },

  // 마지막 로그인 시간 (선택 사항)
  last_login: {
    type: Date,
    required: false,
  },

  // 소셜 로그인 제공자 (선택 사항)
  social_provider: {
    type: String,
    enum: ['google', 'facebook', 'kakao', 'naver'],  // 지원할 SNS 제공자
    required: false,
  },

  // 소셜 로그인 시 사용자 고유 ID (선택 사항)
  social_id: {
    type: String,
    required: false,
  },
});

// 모델 정의
const User = mongoose.model('User', userSchema);

module.exports = User;
