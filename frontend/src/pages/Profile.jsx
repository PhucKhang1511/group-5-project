import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // 🟩 Lấy thông tin người dùng
  useEffect(() => {
    if (!token) {
      setMessage("⚠️ Bạn chưa đăng nhập!");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error("❌ Lỗi khi lấy profile:", err);
        setMessage("Không thể tải thông tin người dùng!");
      }
    };

    fetchProfile();
  }, [token]);

  // 🟩 Cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:5000/api/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setMessage("✅ Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      setMessage("❌ Không thể cập nhật thông tin!");
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>⚠️ Bạn chưa đăng nhập!</h2>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>👤 Thông tin cá nhân</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {user ? (
        <>
          <p><b>Họ tên:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>

          <h3>✏️ Cập nhật thông tin</h3>
          <form onSubmit={handleUpdate} style={{ display: "inline-block", textAlign: "left" }}>
            <label>Họ và tên:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ display: "block", marginBottom: "10px", width: "250px", padding: "5px" }}
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ display: "block", marginBottom: "10px", width: "250px", padding: "5px" }}
            />

            <button
              type="submit"
              style={{
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              💾 Lưu thay đổi
            </button>
          </form>
        </>
      ) : (
        <p>⏳ Đang tải thông tin...</p>
      )}
    </div>
  );
};

export default Profile;
