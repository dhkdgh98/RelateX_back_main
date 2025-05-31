// 💬 Chat Controller
const OpenAI = require('openai');
const { ALLOWED_MESSAGE_TYPES, PROMPT_TEMPLATES, SUMMARY_PROMPT } = require('../config/promptTemplates');
require('dotenv').config();

// OpenAI 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 사용자별 대화 기록 저장
const chatHistories = new Map();

// POST /chat
const getBotReply = async (req, res) => {
  const { userId, message, messageType } = req.body;

  console.log('📩 [챗봇 메시지 요청] 도착!');
  console.log('📋 받은 데이터:', { userId, message, messageType });

  // 유효성 검사
  if (!userId || !message) {
    console.warn('⚠ userId 또는 message 누락됨!');
    return res.status(400).json({ 
      success: false,
      message: 'userId와 message는 필수입니다.',
      data: null
    });
  }

  // messageType 유효성 검사
  if (messageType && !ALLOWED_MESSAGE_TYPES.includes(messageType)) {
    console.warn(`⚠ 잘못된 messageType: ${messageType}`);
    return res.status(400).json({
      success: false,
      message: '유효하지 않은 메시지 타입입니다.',
      data: null
    });
  }

  try {
    // 사용자별 대화 기록 초기화 또는 가져오기
    if (!chatHistories.has(userId)) {
      chatHistories.set(userId, []);
    }
    const userHistory = chatHistories.get(userId);
    userHistory.push({ role: "user", content: message });
  
    // messageType에 따른 프롬프트 선택
    const basePrompt = PROMPT_TEMPLATES[messageType] || PROMPT_TEMPLATES.default;

    // 최근 3턴(6 메시지)만 유지
    const recentHistory = userHistory.slice(-6);
    const messages = [
      { role: "system", content: basePrompt },
      ...recentHistory,
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
    console.error('❌ [챗봇 응답 에러]', {
      error: err.message,
      stack: err.stack,
      userId,
      messageType
    });
    
    res.status(500).json({
      success: false,
      message: '챗봇 응답 중 오류가 발생했어요 ㅠㅠ',
      data: null
    });
  }
};

// POST /chat/save
const saveChat = async (req, res) => {
  const { userId, messages, messageType } = req.body;

  console.log('📝 [채팅 기록 저장] 요청!');
  console.log('📋 받은 데이터:', { userId, messageType, messageCount: messages.length });

  // 유효성 검사
  if (!userId || !messages || !messageType || !Array.isArray(messages)) {
    console.warn('⚠ 필수 데이터 누락됨!');
    return res.status(400).json({
      success: false,
      message: 'userId, messages(배열), messageType은 필수입니다.',
      data: null
    });
  }

  // messageType 유효성 검사
  if (!ALLOWED_MESSAGE_TYPES.includes(messageType)) {
    console.warn(`⚠ 잘못된 messageType: ${messageType}`);
    return res.status(400).json({
      success: false,
      message: '유효하지 않은 메시지 타입입니다.',
      data: null
    });
  }

  try {
    // messageType에 따른 프롬프트 선택
    const basePrompt = PROMPT_TEMPLATES[messageType] || PROMPT_TEMPLATES.default;
    const summaryPrompt = SUMMARY_PROMPT[messageType] || SUMMARY_PROMPT.default;

    // 대화 내용을 GPT에 전달하여 정리
    const formattedMessages = messages.map(msg => 
      `${msg.sender === 'user' ? '사용자' : '챗봇'}: ${msg.text}`
    ).join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: summaryPrompt.system
        },
        { 
          role: "user", 
          content: summaryPrompt.user + formattedMessages
        }
      ],
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content.trim();
    console.log(`✅ [채팅 기록 저장] 성공! user(${userId})의 ${messageType} 기록 ${messages.length}개 메시지 저장됨`);
    console.log('📝 정리된 내용:', summary);

    // TODO: 여기에 실제 데이터베이스 저장 로직 구현
    // 현재는 성공 응답만 반환

    res.status(200).json({
      success: true,
      message: '채팅 기록 저장 성공',
      data: {
        timestamp: new Date().toISOString(),
        messageCount: messages.length,
        summary: summary
      }
    });

  } catch (err) {
    console.error('❌ [채팅 기록 저장 에러]', {
      error: err.message,
      stack: err.stack,
      userId,
      messageType,
      messageCount: messages.length
    });
    
    res.status(500).json({
      success: false,
      message: '채팅 기록 저장 중 오류가 발생했어요 ㅠㅠ',
      data: null
    });
  }
};

module.exports = {
  getBotReply,
  saveChat,
};
