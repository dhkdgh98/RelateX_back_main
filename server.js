require('dotenv').config();  // .env 파일을 로드
const app = require('./app');  // app.js에서 app 객체를 가져옵니다.
const connectDB = require('./config/db');  // db.js에서 connectDB 함수 가져오기

// MongoDB 연결
connectDB();

// 서버 포트 설정
const PORT = process.env.PORT || 5000;



// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

