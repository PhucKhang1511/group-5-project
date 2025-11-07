import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      alert("✅ Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch {
      alert("❌ Link hết hạn hoặc token không hợp lệ!");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <h2>Đặt lại mật khẩu</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Xác nhận
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

export default ResetPassword;
