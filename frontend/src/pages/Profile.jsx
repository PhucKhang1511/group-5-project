import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        alert("Phiên đăng nhập hết hạn!");
        window.location.href = "/login";
      });
  }, []);

  if (!user) return <p>Đang tải...</p>;

  return (
    <div style={{ margin: 20 }}>
      <h1>Thông tin người dùng</h1>
      <p><strong>Tên:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}

export default Profile;
