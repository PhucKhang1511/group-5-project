const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const app = express();

// 🟩 1️⃣ Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🟩 2️⃣ Middleware đọc JSON
app.use(express.json());

// 🟩 (Tuỳ chọn) Log mọi request đến server
app.use((req, res, next) => {
  console.log("📩 Request:", req.method, req.url, req.body);
  next();
});

// 🟩 3️⃣ Import routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const uploadAvatarRoutes = require("./routes/uploadavatar"); // ✅ chú ý viết thường toàn bộ

console.log("🚀 Đã load route user.js, auth.js, profile.js, và uploadavatar.js");

// 🟩 4️⃣ Mount routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/upload-avatar", uploadAvatarRoutes);

// 🖼️ 5️⃣ Cho phép truy cập ảnh đã upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🟩 6️⃣ Route test
app.get("/", (req, res) => {
  res.send("✅ Backend đang hoạt động!");
});

// 🟩 7️⃣ Middleware 404 — phải đặt CUỐI CÙNG
app.use((req, res) => {
  res.status(404).json({ message: "API không tồn tại!" });
});

// 🟩 8️⃣ Kết nối MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://Nhom5pt:15112004@cluster0.o0kful3.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("✅ Kết nối MongoDB Atlas thành công");
    console.log(`📦 Đang dùng database: ${mongoose.connection.name}`);

    // 🟩 9️⃣ Tạo admin mặc định nếu chưa có
    const adminEmail = "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      const newAdmin = new User({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();
      console.log("✅ Admin mặc định đã được tạo: admin@gmail.com / 123456");
    } else {
      console.log("ℹ️ Admin mặc định đã tồn tại, bỏ qua.");
    }
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1);
  });

// 🟩 🔟 Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
