const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');  // 컨트롤러 가져오기

// 로그인 API
router.post('/login', authController.login);

// 회원가입 API
router.post('/signup', authController.signup);




module.exports = router;
