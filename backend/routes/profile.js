const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth'); // ✅ middleware bảo vệ route

// 🟩 Lấy thông tin người dùng đang đăng nhập
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ Lỗi lấy profile:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// 🟩 Cập nhật thông tin người dùng đang đăng nhập
router.put('/', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('❌ Lỗi cập nhật profile:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật' });
  }
});

module.exports = router;
