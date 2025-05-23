// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { v4: uuidv4 } = require('uuid');
// const User = require('../models/users'); // User 모델

// const SALT_ROUNDS = 10; // bcrypt 해싱 강도

// // 회원가입
// const signup = async (req, res) => {
//   const { name, gender, birthday, email, password, user_id } = req.body;

//   try {
//     // 이미 존재하는 이메일 또는 user_id인지 확인
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
//     }

//     const existingUserId = await User.findOne({ user_id });
//     if (existingUserId) {
//       return res.status(400).json({ message: '이미 사용중인 사용자 아이디입니다.' });
//     }

//     // 비밀번호 해싱
//     const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

//     // 새 사용자 생성 (user_id는 프론트에서 받아오거나 UUID로 자동 생성 가능)
//     const newUser = new User({
//       user_id: user_id || uuidv4(), // 없으면 UUID 생성
//       name,
//       gender,
//       birthday,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ message: '회원가입이 완료되었습니다.' });
//   } catch (err) {
//     console.error('회원가입 에러:', err);
//     res.status(500).json({ message: '서버 오류로 인해 회원가입에 실패했습니다.' });
//   }
// };



// const login = async (req, res) => {
//   const { user_id, password } = req.body;

//   try {
//     // user_id로 사용자 조회
//     const user = await User.findOne({ user_id });

//     if (!user) {
//       return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
//     }

//     if (user.status !== 'active') {
//       return res.status(403).json({ message: '계정이 비활성화되었습니다.' });
//     }

//     // 비밀번호 비교
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
//     }

//     // 로그인 성공 시 userId 같이 보내기!
//     res.status(200).json({ message: '로그인 성공', userId: user.user_id });
//   } catch (err) {
//     console.error('로그인 에러:', err);
//     res.status(500).json({ message: '서버 오류로 인해 로그인에 실패했습니다.' });
//   }
// };

// module.exports = {
//   signup,
//   login,
// };


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/users');

const SALT_ROUNDS = 10;

// 회원가입
const signup = async (req, res) => {
  const { name, gender, birthday, email, password, user_id } = req.body;

  console.log('📩 [회원가입 요청] 도착!');
  console.log('📋 받은 데이터:', { name, gender, birthday, email, user_id });

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.warn('⚠ 이미 존재하는 이메일:', email);
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    const existingUserId = await User.findOne({ user_id });
    if (existingUserId) {
      console.warn('⚠ 이미 사용 중인 user_id:', user_id);
      return res.status(400).json({ message: '이미 사용중인 사용자 아이디입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const generatedUserId = user_id || uuidv4();

    const newUser = new User({
      user_id: generatedUserId,
      name,
      gender,
      birthday,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log('✅ 회원가입 성공! user_id:', generatedUserId);
    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error('❌ [회원가입 에러]', err.message);
    res.status(500).json({ message: '서버 오류로 인해 회원가입에 실패했습니다.' });
  }
};

// 로그인
const login = async (req, res) => {
  const { user_id, password } = req.body;

  console.log('🔐 [로그인 요청] user_id:', user_id);

  try {
    const user = await User.findOne({ user_id });

    if (!user) {
      console.warn('❗ 존재하지 않는 user_id:', user_id);
      return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    if (user.status !== 'active') {
      console.warn('🚫 비활성화된 계정 user_id:', user_id);
      return res.status(403).json({ message: '계정이 비활성화되었습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('❌ 비밀번호 불일치! user_id:', user_id);
      return res.status(400).json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    console.log('✅ 로그인 성공! user_id:', user.user_id);
    res.status(200).json({ message: '로그인 성공', userId: user.user_id });
  } catch (err) {
    console.error('❌ [로그인 에러]', err.message);
    res.status(500).json({ message: '서버 오류로 인해 로그인에 실패했습니다.' });
  }
};

module.exports = {
  signup,
  login,
};
