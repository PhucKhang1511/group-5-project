import React, { useState } from "react";
import axios from "axios";

export default function LoginForm() {
  const [info, setInfo] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", info);
      localStorage.setItem("token", res.data.token);
      alert("Đăng nhập thành công!");
    } catch (err) {
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Đăng nhập</h2>
      <input placeholder="Email" onChange={e => setInfo({...info, email: e.target.value})} />
      <input type="password" placeholder="Mật khẩu" onChange={e => setInfo({...info, password: e.target.value})} />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
