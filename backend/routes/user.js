const express = require("express");
const router = express.Router();
const User = require("../models/user");      // đúng tên file
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");



// ✅ Multer + Sharp + Cloudinary
const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /api/users - Admin và Moderator được xem danh sách
router.get("/", auth, checkRole("admin", "moderator"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách user" });
  }
});

// ========================= CREATE USER (ADMIN ONLY) =========================
router.post("/", auth, checkRole("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    res.json({ message: "✅ Thêm tài khoản thành công!", user: newUser });

  } catch (error) {
    console.error("Lỗi tạo user:", error);
    res.status(500).json({ message: "Lỗi server khi tạo user" });
  }
});

// ========================= UPDATE USER (ADMIN ONLY) =========================
router.put("/:id", auth, checkRole("admin"), async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    res.json({ message: "✅ Cập nhật user thành công!", user: updatedUser });

  } catch (error) {
    console.error("Lỗi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật user" });
  }
});


// DELETE /api/users/:id - chỉ Admin mới được xóa user
router.delete("/:id", auth, checkRole("admin"), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy user để xóa" });
    }
    res.json({ message: "Đã xóa user thành công!" });
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    res.status(500).json({ message: "Lỗi server khi xóa user" });
  }
});

// ========================= UPLOAD AVATAR (USER) =========================
router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "❌ Chưa chọn ảnh!" });

    const resizedImage = await sharp(req.file.buffer)
      .resize(200, 200)
      .png()
      .toBuffer();

    const stream = cloudinary.uploader.upload_stream(
      { folder: "avatars" },
      async (error, result) => {
        if (error || !result) return res.status(500).json({ message: "❌ Lỗi Cloudinary!" });

        await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url });

        res.json({
          message: "✅ Upload avatar thành công!",
          avatarUrl: result.secure_url
        });
      }
    );

    stream.end(resizedImage);

  } catch (error) {
    console.error("Lỗi upload avatar:", error);
    res.status(500).json({ message: "❌ Lỗi server khi upload avatar!" });
  }
});


module.exports = router;
