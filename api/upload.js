// // api/upload.js
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();

// // 저장 설정
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, filename);
//   },
// });

// const upload = multer({ storage });

// // POST /api/upload
// router.post('/', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
//   }

//   const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//   res.status(200).json({ imageUrl });
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`; // ✅ 백틱 사용!
    cb(null, filename);
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // ✅ 여기도 백틱!
  res.status(200).json({ imageUrl });
});

module.exports = router;
