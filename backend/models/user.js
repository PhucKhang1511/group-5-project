const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  resetToken: { type: String },
  resetTokenExpire: { type: Date },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
    // ✅ Thêm fields reset password
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
