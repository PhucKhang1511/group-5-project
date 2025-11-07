require("dotenv").config();
console.log("🔑 Server dùng JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const app = express();

// CORS
app.use(
  cors({
   origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Log Request (debug)
app.use((req, res, next) => {
  console.log("📩 Request:", req.method, req.url, req.body);
  next();
});

// ROUTES
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const uploadAvatarRoutes = require("./routes/uploadavatar");
const passwordRoutes = require("./routes/password");
console.log("🚀 Đã load route user.js, auth.js, profile.js, và uploadavatar.js");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/upload-avatar", uploadAvatarRoutes);
app.use("/api/users", require("./routes/user"));
app.use("/api/upload", require("./routes/uploadavatar"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", passwordRoutes);
app.get("/", (req, res) => {
  res.send("✅ Backend đang hoạt động!");
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "API không tồn tại!" });
});

// === TẠO ADMIN MẶC ĐỊNH ===
async function createDefaultAdmin() {
  const adminEmail = "admin@gmail.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Admin mặc định đã được tạo: admin@gmail.com / 123456");
  } else {
    console.log("ℹ️ Admin đã tồn tại ✅");
  }
}

// KẾT NỐI DATABASE
mongoose
  .connect("mongodb+srv://Nhom5pt:15112004@cluster0.o0kful3.mongodb.net/groupDB")
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công!");
    createDefaultAdmin(); // ⬅️ GỌI HÀM Ở ĐÂY
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// CHẠY SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
