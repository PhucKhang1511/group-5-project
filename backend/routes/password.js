const express = require("express");
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();

// ✅ API yêu cầu reset mật khẩu
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 phút

  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  // ✅ gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Khôi phục mật khẩu",
    html: `<p>Bấm vào link để đặt lại mật khẩu:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  res.json({ message: "Email khôi phục đã được gửi!" });
});

// ✅ API đặt lại mật khẩu
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Token không hợp lệ!" });

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "Đặt lại mật khẩu thành công!" });
});

module.exports = router;
