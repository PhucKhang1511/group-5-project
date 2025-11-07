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

      dispatch(
        loginSuccess({
          token: res.data.accessToken,
          role: res.data.role,
        })
      );

      alert("✅ Đăng nhập thành công!");
      navigate(res.data.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      alert("❌ Sai email hoặc mật khẩu!");
      console.log("Login error:", err?.response?.data || err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <div style={{ textAlign: "center", width: "300px" }}>
        <h2 style={{ marginBottom: "20px" }}>Đăng nhập hệ thống</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
          />

          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
          />

          {/* ✅ Nút Quên mật khẩu */}
          <div style={{ textAlign: "right", marginBottom: "12px" }}>
            <a
              href="/forgot-password"
              style={{
                fontSize: "14px",
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "8px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
