

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');  // uuid 모듈 임포트
const User = require('../models/users');  // User 모델 가져오기



const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 이메일을 기준으로 사용자 검색
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 사용자 상태 체크 (예: 비활성화 또는 차단된 사용자)
    if (user.status !== 'active') {
      return res.status(400).json({ message: '계정이 비활성화되었습니다. 관리자에게 문의하세요.' });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Incorrect password attempt for user:', email);
      return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // JWT 토큰 생성
    // const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET_KEY);

    // 로그인 성공 시 토큰과 사용자 정보를 반환
    return res.status(200).json({
      message: '로그인 성공',
      // token: token,
      user: {
        name : user.name,
        email: user.email,
        user_id:user.user_id,
        is_boss: user.is_boss,
        status: user.status,
        address:user.address,
        address1:user.address,
        address2:user.address,
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({ message: '서버 오류, 나중에 다시 시도해주세요.' });
  }
};




const signup = async (req, res) => {
  const { email, password, is_boss, phone, name, gender, birthday, address, address1, address2, jobs } = req.body;

  console.log('[Signup] Received signup request.');

  try {
    // 필수 필드 확인
    if (!email || !password || !phone || !name || !gender || !birthday || !address || !address1 || !address2 || !jobs || !Array.isArray(jobs) || jobs.length === 0) {
      console.log('[Signup] Validation failed: Missing or invalid fields.');
      return res.status(400).json({ message: '모든 필드를 올바르게 입력해주세요.' });
    }

    console.log('[Signup] Validation passed: All required fields are provided.');

    // 이미 존재하는 이메일 확인
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log(`[Signup] Email already exists: ${email}`);
      return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    console.log('[Signup] Email is available.');

    // user_id를 UUID로 생성
    const user_id = uuidv4();
    console.log(`[Signup] Generated user_id: ${user_id}`);

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[Signup] Password hashed successfully.');

    // 새로운 사용자 생성
    const newUser = new User({
      user_id,  // 자동 생성된 user_id
      email,
      password: hashedPassword,
      is_boss,
      phone,
      name,
      gender,
      birthday,
      address,
      address1,
      address2,
      jobs,
      status: 'active',  // 기본적으로 'active'로 설정
      created: new Date(),
      updated: new Date(),
    });

    console.log('[Signup] New user object created.');

    // 사용자 저장
    await newUser.save();
    console.log('[Signup] New user saved to database.');

    // 회원가입 성공 메시지
    console.log('[Signup] Signup successful.');
    return res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error('[Signup] Error occurred:', err);
    return res.status(500).json({ message: '서버 오류, 나중에 다시 시도해주세요.' });
  }
};




// 토큰 유효성 검증 함수



module.exports = {
  login,
  signup,
 
};

