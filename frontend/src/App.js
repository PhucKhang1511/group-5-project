import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);

  // Lấy danh sách user khi mở trang
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy users:", err);
    }
  };

  // Thêm hoặc cập nhật user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name.trim() || !form.email.trim()) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      if (editingUser) {
        // PUT: cập nhật user
        await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, form);
        alert("Cập nhật thành công!");
        setEditingUser(null);
      } else {
        // POST: thêm user mới
        await axios.post("http://localhost:5000/api/users", form);
        alert("Thêm thành công!");
      }

      setForm({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi thêm/cập nhật user:", err);
    }
  };

  // Chọn user để sửa
  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email });
  };

  // Xóa user
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        alert("Xóa thành công!");
        fetchUsers();
      } catch (err) {
        console.error("Lỗi khi xóa user:", err);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontWeight: "bold" }}>Danh sách người dùng</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit">{editingUser ? "Cập nhật" : "Thêm"}</button>
      </form>

      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email}
            {"  "}
            <button onClick={() => handleEdit(u)}>Sửa</button>
            <button onClick={() => handleDelete(u._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


