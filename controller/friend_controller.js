const Friend = require('../models/Friend');

// 친구 목록 조회
exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('[DEBUG] 🔍 요청된 userId:', userId);
    
    if (!userId) {
      console.log('[DEBUG] ❌ userId 누락');
      return res.status(400).json({ message: 'userId가 필요합니다.' });
    }

    const friends = await Friend.find({ userId });
    console.log('[DEBUG] ✅ 조회된 친구 목록:', friends);
    
    res.status(200).json(friends);
  } catch (error) {
    console.error('[ERROR] 💥 친구 목록 조회 실패:', error);
    res.status(500).json({ 
      message: '친구 목록을 불러오는데 실패했습니다.',
      error: error.message 
    });
  }
};

// 친구 추가
exports.addFriend = async (req, res) => {
  try {
    const { userId, name, mbti, birthday, interests, tags } = req.body;
    console.log('[DEBUG] 🔍 요청 데이터:', { userId, name, mbti, birthday, interests, tags });

    if (!userId || !name || !mbti || !birthday) {
      console.log('[DEBUG] ❌ 필수 정보 누락');
      return res.status(400).json({ message: '필수 정보가 누락되었습니다.' });
    }

    const friend = new Friend({
      userId,
      name,
      mbti,
      birthday,
      interests: interests || [],
      tags: tags || []
    });

    await friend.save();
    console.log('[DEBUG] ✅ 새로운 친구 추가:', friend);
    
    res.status(201).json(friend);
  } catch (error) {
    console.error('[ERROR] 💥 친구 추가 실패:', error);
    res.status(500).json({ 
      message: '친구 추가에 실패했습니다.',
      error: error.message 
    });
  }
};

// 친구 정보 수정
exports.updateFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mbti, birthday, interests, tags } = req.body;
    console.log('[DEBUG] 🔍 수정 요청 데이터:', { id, name, mbti, birthday, interests, tags });

    const friend = await Friend.findByIdAndUpdate(
      id,
      { name, mbti, birthday, interests, tags },
      { new: true }
    );

    if (!friend) {
      console.log('[DEBUG] ❌ 친구를 찾을 수 없음:', id);
      return res.status(404).json({ message: '친구를 찾을 수 없습니다.' });
    }

    console.log('[DEBUG] ✅ 친구 정보 수정:', friend);
    res.status(200).json(friend);
  } catch (error) {
    console.error('[ERROR] 💥 친구 정보 수정 실패:', error);
    res.status(500).json({ 
      message: '친구 정보 수정에 실패했습니다.',
      error: error.message 
    });
  }
};

// 친구 삭제
exports.deleteFriend = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[DEBUG] 🔍 삭제 요청 ID:', id);

    const friend = await Friend.findByIdAndDelete(id);

    if (!friend) {
      console.log('[DEBUG] ❌ 친구를 찾을 수 없음:', id);
      return res.status(404).json({ message: '친구를 찾을 수 없습니다.' });
    }

    console.log('[DEBUG] ✅ 친구 삭제 완료:', friend);
    res.status(200).json({ message: '친구가 삭제되었습니다.' });
  } catch (error) {
    console.error('[ERROR] 💥 친구 삭제 실패:', error);
    res.status(500).json({ 
      message: '친구 삭제에 실패했습니다.',
      error: error.message 
    });
  }
}; 