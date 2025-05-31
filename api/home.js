const express = require('express');
const router = express.Router();
const { getTimeline, postRecord } = require('../controller/homeController');
const Timeline = require('../models/timeLine');

// GET /api/home/timeline?userId=xxx
router.get('/timeline', getTimeline);

// POST /api/home/record : 기록 추가
router.post('/record', postRecord);

// DELETE /api/home/records/:id : 기록 삭제
router.delete('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Timeline.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
    }
    
    res.status(200).json({ message: '기록이 삭제되었습니다.' });
  } catch (err) {
    console.error('기록 삭제 실패:', err.message);
    res.status(500).json({ message: '서버 오류로 인해 기록을 삭제하지 못했습니다.' });
  }
});

module.exports = router;
