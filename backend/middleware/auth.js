const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"]; // Lấy header Authorization
  if (!authHeader) {
    return res.status(401).json({ message: "Không có token!" });
  }

  // Tách token khỏi chuỗi "Bearer ..."
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }

  try {
    // ✅ Giải mã token với khóa giống bên auth.js
    const decoded = jwt.verify(token, "secretkey123"); // ← phải trùng key với bên auth.js
    req.user = decoded; // Gán thông tin người dùng vào request
    next(); // Cho phép đi tiếp vào route
  } catch (err) {
    console.error("❌ Lỗi xác thực token:", err);
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};
