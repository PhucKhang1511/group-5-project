import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      alert("✅ Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      alert("❌ Email đã tồn tại hoặc lỗi server!");
      console.log("Signup error:", err?.response?.data || err);
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
      <div style={{ textAlign: "center", width: "320px" }}>
        <h2 style={{ marginBottom: "20px" }}>Đăng ký tài khoản</h2>

        <form onSubmit={handleSignup}>
          {/* Tên */}
          <input
            type="text"
            placeholder="Nhập tên..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
          />

          {/* Email */}
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

          {/* Password */}
          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            required
          />

          {/* Nút đăng ký */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "8px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Đăng ký
          </button>
        </form>

        {/* Quay lại login */}
        <p style={{ marginTop: "12px", fontSize: "14px" }}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
