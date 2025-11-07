import { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  const [user, setUser] = useState({ name: "", email: "", role: "", avatar: "" });
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch (err) {
      alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewAvatar(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, avatar: res.data.avatarUrl }));
      alert("✅ Cập nhật avatar thành công!");
    } catch {
      alert("❌ Lỗi upload avatar!");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put("/auth/update", { name: user.name, email: user.email });
      alert("✅ Cập nhật hồ sơ thành công!");
      fetchProfile();
    } catch {
      alert("❌ Lỗi cập nhật!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
      <div
        style={{
          width: "350px",
          padding: 20,
          textAlign: "center",
          borderRadius: 10,
          boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Hồ sơ cá nhân</h2>

        <img
          src={previewAvatar || user.avatar || "https://via.placeholder.com/150"}
          alt="avatar"
          width="120"
          style={{ borderRadius: "50%", marginBottom: 10 }}
        />

        <input type="file" accept="image/*" onChange={handleAvatarUpload} />

        <div style={{ marginTop: 20 }}>
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 5,
              border: "1px solid #ccc",
              marginBottom: 10,
            }}
          />

          <input
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 5,
              border: "1px solid #ccc",
              marginBottom: 10,
            }}
          />

          <input
            value={user.role}
            disabled
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 5,
              border: "1px solid #ddd",
              background: "#eee",
              marginBottom: 15,
              fontWeight: "bold",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          />

          <button
            onClick={handleUpdate}
            style={{
              width: "100%",
              padding: 8,
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            Lưu thay đổi
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: 8,
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
