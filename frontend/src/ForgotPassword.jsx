import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message || "✅ Email đặt lại mật khẩu đã được gửi!");
    } catch (err) {
      console.error("❌ Lỗi gửi email:", err);
      setMessage("❌ Không thể gửi email! Kiểm tra lại địa chỉ email.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🔑 Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email đăng ký của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Gửi liên kết đặt lại mật khẩu
        </button>
      </form>
      {message && <p style={{ marginTop: "20px", color: "green" }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
