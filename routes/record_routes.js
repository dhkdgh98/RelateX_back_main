const express = require('express');
const router = express.Router();
const recordController = require('../controller/record_controller');

// 기록 옵션 제공
router.get('/options', recordController.getRecordOptions);
router.put('/options', recordController.updateRecordOptions);
router.post('/options/add', recordController.addOption);

module.exports = router; 