import { useEffect, useState } from "react";
import api from "../api"; // dùng api, không dùng axios

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/profile")
      .then((res) => setUser(res.data))   // vì backend trả { name, email, role }
      .catch((err) => {
        console.log("Lỗi /profile:", err);
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
