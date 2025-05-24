const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Timeline = require('../models/timeLine'); // 모델 경로 확인 필수~!

const router = express.Router();

// 1. Multer 세팅 - 업로드 저장 위치와 파일 이름 관리
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 업로드된 파일 저장할 폴더(서버에)
  },
  filename: (req, file, cb) => {
    // 중복방지용으로 날짜 + 랜덤 숫자 + 확장자 붙이기
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Multer 미들웨어 (이미지 파일만 허용, 최대 5MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      return cb(new Error('이미지 파일만 업로드할 수 있어요~'));
    }
    cb(null, true);
  }
});

// --- GET 타임라인 (사진 Base64 포함해서 보내기) ---
const getTimeline = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'userId가 필요합니다.' });
  }

  try {
    const entries = await Timeline.find({ userId }).sort({ date: -1 });

    // 각 타임라인 항목에 대해 imageUrls 배열의 이미지 파일들을 Base64로 인코딩해서 넣기
    const entriesWithImages = await Promise.all(entries.map(async (entry) => {
      // 이미지 파일들을 읽고 Base64 data URI로 변환
      const imagesBase64 = await Promise.all(entry.imageUrls.map(async (url) => {
        try {
          // URL에서 파일명만 추출
          const fileName = url.split('/').pop();
          // uploads 디렉토리 내의 파일 경로 생성
          const imagePath = path.join(__dirname, '..', 'uploads', fileName);
          console.log('이미지 파일 경로:', imagePath);

          // 파일 존재 여부 확인
          if (!fs.existsSync(imagePath)) {
            console.error('이미지 파일이 존재하지 않음:', imagePath);
            return null;
          }

          const fileData = await fs.promises.readFile(imagePath);
          const ext = path.extname(imagePath).slice(1).toLowerCase(); // 확장자만 추출 (jpg, png 등)
          return `data:image/${ext};base64,${fileData.toString('base64')}`;
        } catch (err) {
          console.error('이미지 읽기 실패:', url, err.message);
          return null;
        }
      }));

      // null 제거
      const filteredImages = imagesBase64.filter(img => img !== null);

      // entry 객체에 imagesBase64 필드 추가해서 반환
      return {
        ...entry.toObject(),
        imagesBase64: filteredImages,
      };
    }));

    console.log('타임라인 데이터 전송 성공:', entriesWithImages.length, '개 항목');
    res.status(200).json(entriesWithImages);

  } catch (err) {
    console.error('서버 오류:', err.message);
    res.status(500).json({ message: '서버 오류로 인해 타임라인을 불러오지 못했습니다.' });
  }
};

// --- POST 기록 + 이미지 업로드 ---
router.post('/record', upload.array('images', 5), async (req, res) => {
  const {
    userId,
    title,
    content,
    friend,
    location = '',
    emotion = '',
    category = '',
    recordType = '',
    date,
  } = req.body;

  if (!userId || !title || !content || !friend) {
    return res.status(400).json({ message: 'userId, title, content, friend는 필수 항목입니다.' });
  }

  // 업로드된 파일들에서 저장 경로만 뽑기
  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

  try {
    const newRecord = new Timeline({
      userId,
      title,
      content,
      friend,
      location,
      emotion,
      category,
      recordType,
      date: date ? new Date(date) : new Date(),
      imageUrls,
    });

    await newRecord.save();

    res.status(201).json({
      message: '기록이 성공적으로 저장되었습니다.',
      record: newRecord,
    });
  } catch (err) {
    console.error('기록 저장 실패:', err.message);
    res.status(500).json({ message: '서버 오류로 인해 기록을 저장하지 못했습니다.' });
  }
});

module.exports = {
  getTimeline,
  postRecord: router,  // 이거는 Express 라우터 모듈이라서 이렇게 내보내고, 필요하면 분리 가능해쪄~
};
