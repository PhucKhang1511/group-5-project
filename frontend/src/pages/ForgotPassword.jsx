import { useState } from "react";
import api from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      alert("✅ Nếu email tồn tại, link khôi phục đã được gửi!");
    } catch (err) {
      alert("❌ Lỗi khi gửi yêu cầu khôi phục!");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <h2>Quên mật khẩu</h2>
        <p style={{ marginBottom: 15 }}>Nhập email để nhận link đặt lại mật khẩu</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Gửi yêu cầu
          </button>
        </form>

        <a href="/login" style={styles.link}>← Quay lại đăng nhập</a>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  box: { width: "300px", textAlign: "center" },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 12,
    borderRadius: 5,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  link: {
    display: "block",
    marginTop: 10,
    fontSize: "14px",
    color: "#007bff",
    textDecoration: "none",
  },
};

export default ForgotPassword;
