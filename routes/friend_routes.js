const express = require('express');
const router = express.Router();
const friendController = require('../controller/friend_controller');

// 친구 목록 조회
router.get('/', friendController.getFriends);

// 친구 추가
router.post('/', friendController.addFriend);

// 친구 정보 수정
router.put('/:id', friendController.updateFriend);

// 친구 삭제
router.delete('/:id', friendController.deleteFriend);

module.exports = router; 