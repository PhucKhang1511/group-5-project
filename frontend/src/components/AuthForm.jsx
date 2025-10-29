import React, { useState } from "react";
import axios from "axios";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Đăng nhập
        const res = await axios.post("http://localhost:5000/api/login", {
          email: form.email,
          password: form.password,
        });
        setMessage(res.data.message);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      } else {
        // Đăng ký
        const res = await axios.post("http://localhost:5000/api/signup", form);
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi hệ thống!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMessage("Đã đăng xuất!");
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <h2>{isLogin ? "🔐 Đăng nhập" : "📝 Đăng ký tài khoản"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <br />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <br />
        <button type="submit">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </button>
      </form>

      <p style={{ color: "green" }}>{message}</p>

      {token && (
        <div>
          <p>
            <strong>JWT Token:</strong> <code>{token}</code>
          </p>
          <button onClick={handleLogout}>🚪 Đăng xuất</button>
        </div>
      )}

      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: "10px" }}>
        {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
      </button>
    </div>
  );
}
