import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  // 🟩 Lấy danh sách user khi mở trang
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách user:", err);
      alert("Bạn không có quyền hoặc token hết hạn!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này không?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Đã xóa user thành công!");
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err);
      alert("Không thể xóa user!");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>👑 Quản lý người dùng (Admin)</h1>
      <h3>Danh sách tài khoản</h3>

      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  onClick={() => handleDelete(u._id)}
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
