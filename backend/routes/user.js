const express = require("express");
const router = express.Router();
const User = require("../models/user");      // đúng tên file
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

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

module.exports = router;
