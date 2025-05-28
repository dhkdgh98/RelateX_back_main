// 💬 Chat Controller
const OpenAI = require('openai');
require('dotenv').config();

// OpenAI 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 사용자별 대화 기록 저장
const chatHistories = new Map();

// POST /chat
const getBotReply = async (req, res) => {
  const { userId, message } = req.body;

  console.log('📩 [챗봇 메시지 요청] 도착!');
  console.log('📋 받은 데이터:', { userId, message });

  // 유효성 검사
  if (!userId || !message) {
    console.warn('⚠ userId 또는 message 누락됨!');
    return res.status(400).json({ 
      success: false,
      message: 'userId와 message는 필수입니다.',
      data: null
    });
  }

  try {
    // 사용자별 대화 기록 초기화 또는 가져오기
    if (!chatHistories.has(userId)) {
      chatHistories.set(userId, []);
    }
    const userHistory = chatHistories.get(userId);

    // 사용자 발화 저장
    userHistory.push({ role: "user", content: message });

    // 베이스 프롬프트
    const basePrompt = 
      "너는 상담박사이자 경청하는 친구야. 사용자가 자신의 일이나 감정을 말하면 다음 기준에 따라 반응해줘. " +
      "1. 고민이나 힘든 일 → 진심 어린 공감과 따뜻한 반응. " +
      "2. 생각이 정리되지 않을 때 → 30자 이내의 간단한 질문으로 유도. " +
      "3. 감정 표현이 적을 때 → 지금 감정을 직접 묻거나 감정 이름을 제시. " +
      "4. 자책하거나 지쳐 있을 때 → 노력과 회복력에 대한 구체적 칭찬. " +
      "5. 해결책을 요구할 때 → 직접 말하지 말고 제안형 표현으로 선택 유도. " +
      "모든 말은 귀엽고 친근하게, 300자 이내로 작성해줘.";

    // 최근 5턴(10 메시지)만 유지 (user+assistant)
    const recentHistory = userHistory.slice(-10);

    // 메시지 배열 구성 (system + 최근 대화)
    const messages = [
      { role: "system", content: basePrompt },
      ...recentHistory
    ];

    // GPT 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.9,
    });

    const reply = completion.choices[0].message.content.trim();
    console.log(`🤖 [챗봇 응답] user(${userId})에게: ${reply}`);

    // GPT 답변 저장
    userHistory.push({ role: "assistant", content: reply });

    res.status(200).json({ 
      success: true,
      message: '채팅 응답 성공',
      data: {
        reply,
        timestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('❌ [챗봇 응답 에러]', err.message);
    res.status(500).json({ 
      success: false,
      message: '챗봇 응답 중 오류가 발생했어요 ㅠㅠ',
      data: null
    });
  }
};

module.exports = {
  getBotReply,
};
