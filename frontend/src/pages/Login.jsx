import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { loginSuccess } from "../slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ Lưu vào Redux (và localStorage tự lưu bên trong slice)
      dispatch(
        loginSuccess({
          token: res.data.accessToken,
          role: res.data.role,
        })
      );

      alert("✅ Đăng nhập thành công!");

      // ✅ Điều hướng theo quyền
      navigate(res.data.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      alert("❌ Sai email hoặc mật khẩu!");
      console.log("Login error:", err?.response?.data || err);
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
          style={{ display: "block", marginBottom: 10, padding: 6, width: 240 }}
          required
        />

        <input
          type="password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 6, width: 240 }}
          required
        />

        <button
          type="submit"
          style={{
            padding: "6px 12px",
            background: "#007bff",
            border: "none",
            color: "white",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default Login;
