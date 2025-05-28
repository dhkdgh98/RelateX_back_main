

const express = require('express');
const router = express.Router();
const { getTimeline, postRecord } = require('../controller/homeController');

// GET /api/home/timeline?userId=xxx
router.get('/timeline', getTimeline);

// POST /api/home/record : 기록 추가
router.post('/record', postRecord);

module.exports = router;
