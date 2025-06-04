require('dotenv').config(); // .env 파일 로드

const express = require('express');
const cors = require('cors');
const path = require('path'); // 🔧 정적 경로 처리를 위한 path
const connectDB = require('./config/db');
const authRoutes = require('./api/auth');
const homeRoutes = require('./api/home');
const uploadRoutes = require('./api/upload'); // ✅ 업로드 라우터 추가
const chatRoutes = require('./api/chat'); // 💬 채팅 라우터 추가
const recordRoutes = require('./routes/record_routes');

const app = express();

// 🧠 DB 연결
connectDB();

// 🌐 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 이미지 정적 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📡 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/upload', uploadRoutes); // ✅ 이미지 업로드 라우터
app.use('/api/chat', chatRoutes); // 💬 채팅 라우터 등록
app.use('/api/record', recordRoutes); // 기록 관련 라우터

// 🚀 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌍 Server is running on http://localhost:${PORT}`);
});

