import { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  const [user, setUser] = useState({ name: "", email: "", role: "" });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch (err) {
      alert("Vui lòng đăng nhập lại!");
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put("/auth/update", {
        name: user.name,
        email: user.email,
      });

      alert("✅ Cập nhật thành công!");
      fetchProfile(); // refresh UI
    } catch (err) {
      alert("❌ Cập nhật thất bại!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>Trang thông tin cá nhân</h2>
      <br />
      <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
      <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
      <input value={user.role} disabled />
      <button onClick={handleUpdate}>Cập nhật thông tin</button>
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}

export default Profile;
