import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

function App() {
  const API_URL = "http://localhost:5000/api/users";
  const AUTH_URL = "http://localhost:5000/api/auth";
  const PROFILE_URL = "http://localhost:5000/api/profile";

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // ✅ Trạng thái đăng nhập
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔄 Tự động cập nhật token nếu localStorage thay đổi
useEffect(() => {
  const newToken = localStorage.getItem("token");
  if (newToken !== token) {
    console.log("🔁 Token cập nhật:", newToken);
    setToken(newToken);
  }
}, [token]);


  // 🟩 Lấy danh sách user (chỉ dành cho admin)
  const fetchUsers = useCallback(async () => {

    console.log("🔑 Token gửi đi:", token);


    if (!token) return;
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy users:", err);
    }
  }, [token]);

  // 🟩 Lấy thông tin profile (để biết user là ai và role gì)
  const fetchProfile = useCallback(async () => {

    console.log("🔑 Token gửi đi:", token);


    if (!token) return;
    try {
      const res = await axios.get(PROFILE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy profile:", err);
    }
  }, [token]);

  // 🟩 Khi token thay đổi → lấy profile
  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchUsers();
    }
  }, [token, fetchProfile, fetchUsers]);

  // 🟩 Đăng nhập / Đăng ký
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password)
      return alert("Vui lòng nhập email và mật khẩu!");

    try {
      if (isRegister) {
        await axios.post(`${AUTH_URL}/signup`, authForm);
        alert("✅ Đăng ký thành công! Hãy đăng nhập.");
        setIsRegister(false);
      } else {
        const res = await axios.post(`${AUTH_URL}/login`, authForm);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        alert("✅ Đăng nhập thành công!");
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập/đăng ký:", err);
      alert("Email hoặc mật khẩu không hợp lệ!");
    }

<p style={{ marginTop: "10px" }}>
  <a href="/forgot-password" style={{ color: "#3498db" }}>
    Quên mật khẩu?
  </a>
</p>


  };

  // 🟩 Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setProfile(null);
    setUsers([]);
    alert("👋 Đăng xuất thành công!");
  };

  // 🟩 Cập nhật thông tin cá nhân
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(PROFILE_URL, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      alert("✅ Cập nhật thông tin cá nhân thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật profile:", err);
    }
  };

  // 🟩 Xử lý CRUD user (admin)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Cập nhật user thành công!");
        setEditingUser(null);
      } else {
        await axios.post(API_URL, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Thêm user thành công!");
      }
      setForm({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi thêm/cập nhật user:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Xóa user thành công!");
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err);
    }
  };

  // 🟦 Nếu chưa đăng nhập
  if (!token) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h1>🔐 Hệ thống Người dùng</h1>
        <h2>{isRegister ? "Đăng ký" : "Đăng nhập"}</h2>
        <form onSubmit={handleAuth}>
          {isRegister && (
            <input
              type="text"
              placeholder="Họ và tên"
              value={authForm.name}
              onChange={(e) =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
              style={{ marginRight: "10px", padding: "5px" }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
            }}
          >
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>
        <p style={{ marginTop: "10px" }}>
          {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              border: "none",
              background: "none",
              color: "#2980b9",
              cursor: "pointer",
            }}
          >
            {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
          </button>
        </p>
      </div>
    );
  }

  // 🟦 Sau khi đăng nhập: Hiển thị theo vai trò
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🔐 Hệ thống Người dùng</h1>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        Đăng xuất
      </button>

      {profile && (
        <div style={{ marginBottom: "40px" }}>
          <h2>👤 Thông tin cá nhân</h2>
          <form onSubmit={handleUpdateProfile}>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              placeholder="Họ tên"
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="Email"
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              Lưu thay đổi
            </button>
          </form>
        </div>
      )}

      <form
  onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", e.target.avatar.files[0]);

    const res = await axios.post("http://localhost:5000/api/upload-avatar", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    alert(res.data.message);
  }}
>
  <input type="file" name="avatar" accept="image/*" required />
  <button type="submit">Tải lên ảnh đại diện</button>
</form>


      {/* 🟨 Nếu là admin → hiển thị bảng quản lý users */}
      {profile?.role === "admin" ? (
        <div>
          <h2>👑 Danh sách người dùng (Admin)</h2>
          <form onSubmit={handleSubmit} style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: editingUser ? "#f39c12" : "#2ecc71",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              {editingUser ? "Cập nhật" : "Thêm"}
            </button>
          </form>

          <ul>
            {users.map((u) => (
              <li key={u._id}>
                {u.name} - {u.email} ({u.role})
                <button
                  onClick={() => handleEdit(u)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  style={{
                    marginLeft: "5px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                  }}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>🌟 Bạn đang đăng nhập với vai trò: <b>{profile?.role}</b></p>
      )}
    </div>
  );
}

export default App;
