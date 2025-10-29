// middleware/role.js
module.exports = function (roles = []) {
  // roles có thể là 1 hoặc nhiều quyền: ["admin", "user"]
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa xác thực!" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập!" });
    }

    next();
  };
};
