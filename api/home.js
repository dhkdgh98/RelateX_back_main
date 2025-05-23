// routes/homeRoutes.js

const express = require('express');
const router = express.Router();
const { getTimeline } = require('../controller/homeController');

// GET /api/home/timeline?userId=xxx
router.get('/timeline', getTimeline);

module.exports = router;
