

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

module.exports = {
  getTimeline,
};
