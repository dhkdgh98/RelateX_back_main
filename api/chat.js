const express = require('express');
const router = express.Router();
const { getBotReply, saveChat } = require('../controller/chatController');

// POST /api/chat/reply - 챗봇 응답 받기
router.post('/reply', getBotReply);

// POST /api/chat/save - 대화 내용 저장하기
router.post('/save', saveChat);

module.exports = router;
