const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API upload avatar
router.post("/", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Không tìm thấy file ảnh!" });

    res.json({
      message: "✅ Upload thành công!",
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi upload!" });
  }
});

module.exports = router;
