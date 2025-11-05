// createUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // đường dẫn đúng với file user model của bạn

const MONGO = process.env.MONGODB_URI || "mongodb+srv://Nhom5pt:15112004@cluster0.o0kful3.mongodb.net/groupDB?retryWrites=true&w=majority";

async function createOrUpdate(email, name, plainPassword, role = "user") {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const hashed = await bcrypt.hash(plainPassword, 10);

    // Nếu đã có user thì update password + role + name, nếu chưa có thì tạo mới
    const existing = await User.findOne({ email });
    if (existing) {
      existing.password = hashed;
      existing.name = name;
      existing.role = role;
      await existing.save();
      console.log("✔ Updated user:", email);
    } else {
      await User.create({ name, email, password: hashed, role });
      console.log("✔ Created user:", email);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// --- chỉnh email / name / password / role ở đây ---
createOrUpdate("user@gmail.com", "User Demo", "123456", "user");
// hoặc createOrUpdate("moderator@gmail.com", "Moderator", "123456", "moderator");
// hoặc createOrUpdate("admin@gmail.com", "Admin", "123456", "admin");
