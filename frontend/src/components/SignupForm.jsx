import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log("📤 Gửi dữ liệu:", form);
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      setMessage(res.data.message);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>📝 Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block" }}>
        {/* 🔹 Ô nhập tên mới thêm vào */}
        <input
          name="name"
          type="text"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Đăng ký</button>
      </form>

      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default SignUp;
