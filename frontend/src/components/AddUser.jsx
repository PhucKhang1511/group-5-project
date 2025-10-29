import React, { useState } from "react";
import axios from "axios";

function AddUser({ fetchUsers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔸 Validation
    if (!name.trim()) {
      setError("⚠️ Name không được để trống!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("⚠️ Email không hợp lệ!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users", { name, email });
      setName("");
      setEmail("");
      setError("");
      fetchUsers(); // cập nhật danh sách sau khi thêm
    } catch (err) {
      console.error("❌ Lỗi khi thêm user:", err);
      setError("Không thể thêm user. Kiểm tra kết nối server!");
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>

      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
    </div>
  );
}

export default AddUser;



