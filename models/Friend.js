const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mbti: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  interests: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// 목업 데이터
const mockFriends = [
  {
    name: '김민준',
    mbti: 'ENFP',
    birthday: '1995-03-15',
    interests: ['여행'],
    tags: ['대학교'],
    userId: 'wangho98'
  },
  {
    name: '이서연',
    mbti: 'INTJ',
    birthday: '1996-07-22',
    interests: ['독서'],
    tags: ['동아리'],
    userId: 'wangho98'
  },
  {
    name: '박지훈',
    mbti: 'ISTP',
    birthday: '1994-11-08',
    interests: ['게임'],
    tags: ['고등학교'],
    userId: 'wangho98'
  },
  {
    name: '최수아',
    mbti: 'ESFJ',
    birthday: '1997-05-30',
    interests: ['요리'],
    tags: ['동네친구'],
    userId: 'wangho98'
  },
  {
    name: '정도윤',
    mbti: 'INFP',
    birthday: '1993-09-14',
    interests: ['음악'],
    tags: ['취미동호회'],
    userId: 'wangho98'
  },
  {
    name: '강하은',
    mbti: 'ESTJ',
    birthday: '1998-01-25',
    interests: ['운동'],
    tags: ['헬스장'],
    userId: 'wangho98'
  },
  {
    name: '윤서준',
    mbti: 'ENTP',
    birthday: '1995-12-03',
    interests: ['프로그래밍'],
    tags: ['스터디'],
    userId: 'wangho98'
  },
  {
    name: '임지민',
    mbti: 'ISFJ',
    birthday: '1996-08-17',
    interests: ['그림'],
    tags: ['미술학원'],
    userId: 'wangho98'
  },
  {
    name: '한유진',
    mbti: 'ENTJ',
    birthday: '1994-04-09',
    interests: ['사진'],
    tags: ['여행동호회'],
    userId: 'wangho98'
  },
  {
    name: '송민서',
    mbti: 'INFJ',
    birthday: '1997-06-28',
    interests: ['글쓰기'],
    tags: ['작문반'],
    userId: 'wangho98'
  },
  {
    name: '오현우',
    mbti: 'ESTP',
    birthday: '1993-10-11',
    interests: ['등산'],
    tags: ['등산동호회'],
    userId: 'wangho98'
  },
  {
    name: '장서연',
    mbti: 'ENFJ',
    birthday: '1998-02-19',
    interests: ['댄스'],
    tags: ['댄스학원'],
    userId: 'wangho98'
  },
  {
    name: '조현준',
    mbti: 'ISTJ',
    birthday: '1995-07-07',
    interests: ['영화'],
    tags: ['영화동아리'],
    userId: 'wangho98'
  },
  {
    name: '백지원',
    mbti: 'ESFP',
    birthday: '1996-12-31',
    interests: ['노래'],
    tags: ['밴드'],
    userId: 'wangho98'
  },
  {
    name: '신민재',
    mbti: 'INTP',
    birthday: '1994-05-23',
    interests: ['과학'],
    tags: ['과학동아리'],
    userId: 'wangho98'
  },
  {
    name: '안서윤',
    mbti: 'ISFP',
    birthday: '1997-09-05',
    interests: ['공예'],
    tags: ['공예학원'],
    userId: 'wangho98'
  },
  {
    name: '유준호',
    mbti: 'ENFP',
    birthday: '1993-11-18',
    interests: ['연극'],
    tags: ['연극동아리'],
    userId: 'wangho98'
  },
  {
    name: '권수진',
    mbti: 'INTJ',
    birthday: '1998-03-27',
    interests: ['체스'],
    tags: ['체스클럽'],
    userId: 'wangho98'
  },
  {
    name: '황민지',
    mbti: 'ESFJ',
    birthday: '1995-08-14',
    interests: ['요가'],
    tags: ['요가원'],
    userId: 'wangho98'
  },
  {
    name: '고승우',
    mbti: 'ENTP',
    birthday: '1996-04-02',
    interests: ['마케팅'],
    tags: ['마케팅동아리'],
    userId: 'wangho98'
  }
];

// 모델 생성
const Friend = mongoose.model('Friend', friendSchema);

// 목업 데이터 초기화 함수
const initializeMockData = async () => {
  try {
    const count = await Friend.countDocuments();
    if (count === 0) {
      await Friend.insertMany(mockFriends);
      console.log('[DEBUG] ✅ 목업 데이터 초기화 완료');
    }
  } catch (error) {
    console.error('[ERROR] 🧨 목업 데이터 초기화 중 오류 발생:', error);
  }
};

// 서버 시작 시 목업 데이터 초기화
initializeMockData();

module.exports = Friend; 