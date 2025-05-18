

const express = require('express');
const cors = require('cors');
const authRoutes = require('./api/auth');  // auth 라우터 가져오기


const app = express();

// 미들웨어 설정
app.use(cors());  // 기본 CORS 설정
app.use(express.json());  // 요청 본문을 JSON 형태로 파싱

// 인증 관련 API 라우트 추가
app.use('/api/auth', authRoutes);

module.exports = app;


