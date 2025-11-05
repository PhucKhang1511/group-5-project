import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ Lưu token và role
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);

      alert("Đăng nhập thành công ✅");

      // ✅ Điều hướng theo role
      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/profile";
      }
    } catch (err) {
      alert("Sai email hoặc mật khẩu ❌");
      console.log("Login error:", err);
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h2>Đăng nhập hệ thống</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Nhập email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
