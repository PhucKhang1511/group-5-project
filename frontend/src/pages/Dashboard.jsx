import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/profile")
      .then((res) => setUser(res.data))
      .catch(() => window.location.href = "/login");
  }, []);

  if (!user) return <p>Đang tải...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Xin chào, {user.name} 👋</h1>
      <p>Email: {user.email}</p>
      <p>Quyền: {user.role}</p>

      {user.role === "admin" && (
        <div style={{ marginTop: 30 }}>
          <h2>🔧 Khu vực quản trị (Admin)</h2>
          <a href="/users">Quản lý người dùng</a>
        </div>
      )}

      {user.role === "moderator" && (
        <div style={{ marginTop: 30 }}>
          <h2>🛠 Khu vực kiểm duyệt (Moderator)</h2>
          <p>Bạn có thể duyệt nội dung.</p>
        </div>
      )}

      {user.role === "user" && (
        <div style={{ marginTop: 30 }}>
          <h2>📄 Trang người dùng</h2>
          <p>Bạn chỉ có quyền xem thông tin.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
