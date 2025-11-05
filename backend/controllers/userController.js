const User = require('../models/user');

// 🟩 [GET] LẤY DANH SÁCH NGƯỜI DÙNG
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().lean(); // ⚡ lean() giúp truy vấn nhanh hơn, trả về object thuần
    console.log(`📦 Đã lấy ${users.length} người dùng`);
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", err.message);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách người dùng",
      error: err.message,
    });
  }
};

// 🟩 [POST] THÊM NGƯỜI DÙNG MỚI
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log("📥 Nhận dữ liệu từ frontend:", req.body);

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Kiểm tra trùng email để tránh thêm nhiều bản ghi giống nhau
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email đã tồn tại!" });
    }

    // Tạo mới và lưu vào MongoDB
    const newUser = new User({ name, email });
    const savedUser = await newUser.save();

    console.log("✅ Đã thêm user mới:", savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("❌ Lỗi khi thêm người dùng:", err.message);
    res.status(500).json({
      message: "Lỗi khi thêm người dùng",
      error: err.message,
    });
  }
};

// 🟩 [PUT] CẬP NHẬT NGƯỜI DÙNG
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔄 Cập nhật user:", id, "Dữ liệu:", req.body);

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // ✅ kiểm tra schema khi cập nhật
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    console.log("✅ Cập nhật thành công:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật người dùng:", err.message);
    res.status(500).json({
      message: "Lỗi khi cập nhật người dùng",
      error: err.message,
    });
  }
};

// 🟩 [DELETE] XÓA NGƯỜI DÙNG
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Yêu cầu xóa user ID:", id);

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    console.log("✅ Đã xóa người dùng:", deletedUser);
    res.status(200).json({ message: "Đã xóa người dùng thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa người dùng:", err.message);
    res.status(500).json({
      message: "Lỗi khi xóa người dùng",
      error: err.message,
    });
  }
};
