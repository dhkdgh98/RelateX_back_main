// require('dotenv').config(); // .env 파일 로드

// const express = require('express');
// const cors = require('cors');
// const path = require('path'); // 🔧 정적 경로 처리를 위한 path
// const connectDB = require('./config/db');
// const authRoutes = require('./api/auth');
// const homeRoutes = require('./api/home');
// const uploadRoutes = require('./api/upload'); // ✅ 업로드 라우터 추가

// const app = express();

// // 🧠 DB 연결
// connectDB();

// // 🌐 미들웨어
// app.use(cors());
// app.use(express.json());

// // 📂 이미지 정적 파일 서빙
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // 📡 라우터 등록
// app.use('/api/auth', authRoutes);
// app.use('/api/home', homeRoutes);
// app.use('/api/upload', uploadRoutes); // ✅ 이미지 업로드 라우터

// // 🚀 서버 시작
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🌍 Server is running on http://localhost:${PORT}`);
// });

require('dotenv').config(); // .env 파일 로드

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./api/auth');
const homeRoutes = require('./api/home');
const uploadRoutes = require('./api/upload');
const ngrok = require('ngrok'); // ✅ ngrok 불러오기

const app = express();

// 🧠 DB 연결
connectDB();

// 🌐 미들웨어
app.use(cors());
app.use(express.json());

// 📂 이미지 정적 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📡 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/upload', uploadRoutes);

// 🚀 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🌍 Server is running on http://localhost:${PORT}`);

  // ✅ ngrok 연결 (하드코딩 없이 .env에서 토큰 가져오기)
  if (process.env.NODE_ENV !== 'production') {
    const token = process.env.NGROK_AUTH_TOKEN;

    if (!token) {
      console.warn('⚠️ NGROK_AUTH_TOKEN이 설정되어 있지 않아요! .env 파일 확인해줘~');
      return;
    }

    try {
      const url = await ngrok.connect({
        addr: PORT,
        authtoken: token,
      });

      console.log(`🔗 Public URL (ngrok): ${url}`);
    } catch (err) {
      console.error('❌ ngrok 연결 실패:', err);
    }
  }
});
