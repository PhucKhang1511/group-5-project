const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // ✅ BỔ SUNG
const User = require('../models/User');

const router = express.Router();

// 🧪 Test route
router.get('/test', (req, res) => {
  res.json({ message: '✅ Auth route hoạt động!' });
});

// 🟢 Đăng ký
router.post('/signup', async (req, res) => {
  console.log("📩 Dữ liệu nhận từ frontend:", req.body);
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email đã được sử dụng!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: '✅ Đăng ký thành công!', user: { name, email } });
  } catch (err) {
    console.error('❌ Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký!' });
  }
});

// 🟡 Đăng nhập
router.post('/login', async (req, res) => {
  console.log("📥 Thông tin đăng nhập:", req.body);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Email không tồn tại!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Sai mật khẩu!' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      'SECRET_KEY_JWT', // ✅ nên dùng cùng secret với middleware auth
      { expiresIn: '2h' }
    );

    res.json({ message: '✅ Đăng nhập thành công!', token });
  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập!' });
  }
});

// 🔴 Đăng xuất
router.post('/logout', (req, res) => {
  res.json({ message: '👋 Đăng xuất thành công (token bị xóa ở client)' });
});

// 🟣 Quên mật khẩu
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại trong hệ thống!' });

    // Tạo token đặt lại mật khẩu có hạn 10 phút
    const resetToken = jwt.sign({ id: user._id }, 'SECRET_KEY_JWT', { expiresIn: '10m' });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    console.log("📩 Link đặt lại mật khẩu:", resetLink);

    // ✅ Cấu hình Gmail
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // dùng SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


    // Gửi email
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "your_gmail@gmail.com",
      to: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${user.name || "bạn"}!</h3>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng bấm vào liên kết dưới đây để tiếp tục:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p><i>Liên kết này sẽ hết hạn sau 10 phút.</i></p>
      `,
    });

    res.json({ message: "✅ Email đặt lại mật khẩu đã được gửi!", resetLink });
  } catch (err) {
    console.error("❌ Lỗi forgot-password:", err);
    res.status(500).json({ message: "Không thể gửi email! Kiểm tra lại cấu hình Gmail." });
  }
});

// 🟡 Đặt lại mật khẩu
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Xác minh token hợp lệ
    const decoded = jwt.verify(token, 'SECRET_KEY_JWT');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "✅ Đặt lại mật khẩu thành công!" });
  } catch (err) {
    console.error("❌ Lỗi reset-password:", err);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
});

module.exports = router;
