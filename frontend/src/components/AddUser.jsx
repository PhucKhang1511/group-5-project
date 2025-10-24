import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/users", {
        name,
        email,
      });
      console.log("✅ Server phản hồi:", res.data); // Log để kiểm tra phản hồi
      onUserAdded(res.data);
      setName("");
      setEmail("");
    } catch (err) {
      console.error(
        "❌ Lỗi khi thêm user:",
        err.response ? err.response.data : err.message
      );
    }
  }; // <-- đây là ngoặc kết thúc handleSubmit ✅

  return (
    <div>
      <h2>Thêm người dùng mới</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên người dùng"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email người dùng"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
};

export default AddUser;
