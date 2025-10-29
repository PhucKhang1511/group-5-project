const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// 🟩 GET /api/users - chỉ Admin mới được xem danh sách
router.get("/", auth, role("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách user:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách user" });
  }
});

// 🟥 DELETE /api/users/:id - chỉ Admin mới được xóa
router.delete("/:id", auth, role("admin"), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy user để xóa" });
    }
    res.json({ message: "Đã xóa user thành công!" });
  } catch (error) {
    console.error("❌ Lỗi xóa user:", error);
    res.status(500).json({ message: "Lỗi server khi xóa user" });
  }
});

module.exports = router;
