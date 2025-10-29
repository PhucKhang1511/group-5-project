require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "Không có token!" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Token không hợp lệ!" });

  try {
    console.log("🧩 Verify token với secret:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực token:", err.message);
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};
