import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔄 Gửi yêu cầu đăng nhập...");

    try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
    email,
    password,
});


      console.log("✅ Server trả về:", res.data);

      // Lưu token
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      alert("Đăng nhập thành công ✅");
      window.location.href = "/profile";
    } catch (err) {
      console.log("❌ Lỗi đăng nhập:", err.response?.data || err);
      alert("Sai thông tin đăng nhập!");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ margin: 20 }}>
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
  );
}

export default Login;
