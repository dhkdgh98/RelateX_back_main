const RecordOption = require('../models/RecordOption');
const mongoose = require('mongoose');

// 기본 옵션 설정
const defaultOptions = {
  friends: ['나', '가족', '친구', '동료', '연인', '기타'],
  locations: ['집', '회사', '학교', '카페', '공원', '도서관', '자취방', '영화관', '기타'],
  emotions: ['행복', '기쁨', '설렘', '평온', '차분함', '불안', '걱정', '슬픔', '화남', '자신감', '의욕', '피곤함', '지루함', '기타'],
  categories: ['일상', '성장', '자기성찰', '관계', '건강', '취미', '학업', '직장', '기타'],
  recordTypes: ['이벤트', '생각', '대화', '느낌', '목표', '성취', '기타']
};

// 기록 옵션 조회
exports.getRecordOptions = async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log('요청된 userId:', userId);

    if (!userId) {
      return res.status(400).json({ message: 'userId가 필요합니다.' });
    }

    // 사용자의 옵션 조회
    let recordOption = await RecordOption.findOne({ userId: userId });
    console.log('조회된 옵션:', recordOption);

    // 옵션이 없으면 기본 옵션으로 생성
    if (!recordOption) {
      console.log('옵션이 없어 기본 옵션으로 생성합니다.');
      recordOption = await RecordOption.create({
        userId: userId,
        ...defaultOptions
      });
      console.log('생성된 옵션:', recordOption);
    }

    res.status(200).json({
      friends: recordOption.friends,
      locations: recordOption.locations,
      emotions: recordOption.emotions,
      categories: recordOption.categories,
      recordTypes: recordOption.recordTypes
    });
  } catch (error) {
    console.error('기록 옵션 조회 중 오류 발생:', error);
    console.error('에러 스택:', error.stack);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.',
      error: error.message 
    });
  }
};

// 기록 옵션 업데이트
exports.updateRecordOptions = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { friends, locations, emotions, categories, recordTypes } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId가 필요합니다.' });
    }

    // 기존 옵션 조회 또는 새로 생성
    let recordOption = await RecordOption.findOne({ userId: userId });
    
    if (!recordOption) {
      recordOption = new RecordOption({ userId: userId });
    }

    // 옵션 업데이트
    if (friends) recordOption.friends = friends;
    if (locations) recordOption.locations = locations;
    if (emotions) recordOption.emotions = emotions;
    if (categories) recordOption.categories = categories;
    if (recordTypes) recordOption.recordTypes = recordTypes;

    await recordOption.save();

    res.status(200).json({
      message: '옵션이 성공적으로 업데이트되었습니다.',
      options: {
        friends: recordOption.friends,
        locations: recordOption.locations,
        emotions: recordOption.emotions,
        categories: recordOption.categories,
        recordTypes: recordOption.recordTypes
      }
    });
  } catch (error) {
    console.error('기록 옵션 업데이트 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 카테고리에 옵션 추가
exports.addOption = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { category, value } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId가 필요합니다.' });
    }

    if (!category || !value) {
      return res.status(400).json({ message: '카테고리와 값이 필요합니다.' });
    }

    const recordOption = await RecordOption.findOne({ userId: userId });
    if (!recordOption) {
      return res.status(404).json({ message: '사용자 옵션을 찾을 수 없습니다.' });
    }

    // 카테고리에 값 추가 (중복 방지)
    if (recordOption[category].includes(value)) {
      return res.status(400).json({ message: '이미 존재하는 옵션입니다.' });
    }

    recordOption[category].push(value);
    await recordOption.save();

    res.status(200).json({
      message: '옵션이 추가되었습니다.',
      options: recordOption[category]
    });
  } catch (error) {
    console.error('옵션 추가 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 