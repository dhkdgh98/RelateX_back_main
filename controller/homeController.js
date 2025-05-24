

const Timeline = require('../models/timeLine');

const getTimeline = async (req, res) => {
  const { userId } = req.query;

  console.log('📥 타임라인 요청 들어옴! userId:', userId);  // 🔍 요청 확인용 로그

  if (!userId) {
    console.warn('⚠ userId 누락됨');
    return res.status(400).json({ message: 'userId가 필요합니다.' });
  }

  try {
    const entries = await Timeline.find({ userId }).sort({ date: -1 });

    console.log(`✅ 타임라인 조회 성공! 총 ${entries.length}개 불러옴.`);  // 🔍 결과 수 확인

    res.status(200).json(entries);
  } catch (err) {
    console.error('❌ 타임라인 조회 실패:', err.message);  // 🔍 에러 메시지 출력
    res.status(500).json({ message: '서버 오류로 인해 타임라인을 불러오지 못했습니다.' });
  }
};

// ✨ 타임라인 기록 추가
const postRecord = async (req, res) => {
  const {
    userId,
    title,
    content,
    friend,
    location,
    emotion,
    category,
    recordType,
    date,
  } = req.body;

  console.log('📝 기록 추가 요청!', req.body);

  // 필수값 검사
  if (!userId || !title || !content || !friend) {
    return res.status(400).json({ message: 'userId, title, content, friend는 필수 항목입니다.' });
  }

  try {
    const newRecord = new Timeline({
      userId,
      title,
      content,
      friend,
      location: location || '',
      emotion: emotion || '',
      category: category || '',
      recordType: recordType || '',
      date: date ? new Date(date) : new Date(),
    });

    await newRecord.save();
    console.log('✅ 기록 저장 성공!');
    res.status(201).json({ message: '기록이 성공적으로 저장되었습니다.' });
  } catch (err) {
    console.error('❌ 기록 저장 실패:', err.message);
    res.status(500).json({ message: '서버 오류로 인해 기록을 저장하지 못했습니다.' });
  }
};

module.exports = {
  getTimeline,
  postRecord,
};
