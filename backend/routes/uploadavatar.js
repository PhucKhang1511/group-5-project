const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");

const router = express.Router();

// 🟩 Tạo thư mục 'uploads' nếu chưa tồn tại
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Tạo thư mục uploads tự động");
}

// 🟩 Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép file ảnh
    const allowed = /jpeg|jpg|png|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error("Chỉ được upload file ảnh (jpg, png, gif)!"));
  },
  limits: { fileSize: 3 * 1024 * 1024 }, // Giới hạn 3MB
});

// 🟩 API upload avatar
router.post("/", auth, upload.single("avatar"), (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Chưa chọn ảnh!" });

    res.json({
      message: "✅ Ảnh đại diện tải lên thành công!",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error("❌ Lỗi upload ảnh:", err);
    res.status(500).json({ message: "Lỗi server khi upload ảnh!" });
  }
});

module.exports = router;
