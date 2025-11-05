const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user"
  }
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
