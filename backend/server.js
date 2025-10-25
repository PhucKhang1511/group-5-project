const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// 🟩 Cấu hình CORS cho phép frontend (React) truy cập
app.use(cors({
  origin: 'http://localhost:3000', // ✅ Cổng React
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // ✅ Thêm đầy đủ CRUD
  allowedHeaders: ['Content-Type']
}));

// 🟩 Cho phép Express đọc dữ liệu JSON từ frontend
app.use(express.json());

// 🟩 Import routes
const userRoutes = require('./routes/user');
app.use('/api', userRoutes); // /api + /users → /api/users

// 🟩 Kết nối MongoDB Atlas
mongoose.connect('mongodb+srv://Nhom5pt:15112004@cluster0.o0kful3.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Kết nối MongoDB Atlas thành công'))
  .catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
    process.exit(1); // Thoát nếu MongoDB không kết nối được
  });


// 🟩 Cổng server chạy
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// 🟩 Bắt lỗi không tìm thấy route (tránh lỗi 404 không rõ ràng)
app.use((req, res) => {
  res.status(404).json({ message: 'API không tồn tại!' });
});

