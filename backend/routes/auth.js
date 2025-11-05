const auth = require("../middleware/auth");
require("dotenv").config();
console.log("✅ routes/auth.js loaded");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RefreshToken = require("../models/RefreshToken");

const router = express.Router();

// Tạo Access Token
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

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

// 🟡 Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.deleteMany({ userId: user._id });
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.json({
      message: "✅ Đăng nhập thành công!",
      accessToken,
      refreshToken,
      role: user.role, // ✅ Quan trọng để frontend điều hướng admin
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
});

// 🔁 Refresh token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Thiếu refresh token!" });

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored)
    return res.status(403).json({ message: "Refresh token không hợp lệ!" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = generateAccessToken(await User.findById(decoded.id));
    res.json({ accessToken: newAccessToken });

  } catch {
    return res.status(403).json({ message: "Refresh token đã hết hạn!" });
  }
});

// 🔴 Đăng xuất
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.json({ message: "👋 Đăng xuất thành công!" });
});

// 🟢 Lấy thông tin người dùng
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// 🟡 Cập nhật thông tin cá nhân
router.put("/update", auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({
      message: "✅ Cập nhật thành công!",
      user,
    });

  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi cập nhật!" });
  }
});

// ✅ Đặt dòng này CUỐI CÙNG
module.exports = router;
