require("dotenv").config();
console.log("✅ routes/auth.js loaded");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const router = express.Router();

// 🧪 Test route
router.get("/test", (req, res) => res.json({ message: "✅ Auth route hoạt động!" }));

// Tạo Access Token
const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15s" });

// Tạo Refresh Token
const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

// 🟢 Đăng ký
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ name, email, password: hashedPassword }).save();

    res.status(201).json({ message: "✅ Đăng ký thành công!" });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi đăng ký!" });
  }
});

// 🟡 Đăng nhập → trả về Access + Refresh Token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.deleteMany({ userId: user._id }); // Xóa token cũ
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.json({
      message: "✅ Đăng nhập thành công!",
      accessToken,
      refreshToken,
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
});

// 🔁 Làm mới Access Token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Thiếu refresh token!" });

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored)
    return res.status(403).json({ message: "Refresh token không hợp lệ!" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const newAccessToken = generateAccessToken({ _id: decoded.id });

    res.json({ accessToken: newAccessToken });

  } catch {
    return res.status(403).json({ message: "Refresh token đã hết hạn!" });
  }
});

// 🔴 Đăng xuất → Xóa Refresh Token
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.json({ message: "👋 Đăng xuất thành công!" });
});

module.exports = router;
