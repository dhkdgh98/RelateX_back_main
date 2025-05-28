const express = require('express');
const router = express.Router();
const { getBotReply } = require('../controller/chatController');

// POST /api/chat/reply - 챗봇 응답 받기
router.post('/reply', getBotReply);

module.exports = router;
