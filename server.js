
require ('dotenv').config(); // .env 파일 로드

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./api/auth');  // 라우터

const app = express();

// DB 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우터 등록
app.use('/api/auth', authRoutes);

// 서버 시작 - 모든 IP에서 접근 가능하게 0.0.0.0으로 바인딩!
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
