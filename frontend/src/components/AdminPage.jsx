import { useEffect, useState } from "react";
import api from "../api";

function AdminPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      alert("❌ Token hết hạn hoặc bạn không có quyền!");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này không?")) return;
    try {
      await api.delete(`/users/${id}`);
      alert("🗑️ Xóa thành công!");
      fetchUsers();
    } catch (err) {
      alert("❌ Lỗi khi xóa user!");
    }
  };

  const handleEdit = async (user) => {
    const newName = prompt("Nhập tên mới:", user.name);
    const newEmail = prompt("Nhập email mới:", user.email);
    const newRole = prompt("Vai trò (admin/user/moderator):", user.role);

    if (!newName || !newEmail) return alert("❌ Không được để trống!");

    try {
      await api.put(`/users/${user._id}`, {
        name: newName,
        email: newEmail,
        role: newRole,
      });
      alert("✅ Cập nhật thành công!");
      fetchUsers();
    } catch {
      alert("❌ Lỗi cập nhật!");
    }
  };

  const handleAdd = async () => {
    const name = prompt("Tên user:");
    const email = prompt("Email:");
    const password = prompt("Mật khẩu:");
    const role = prompt("Vai trò (admin/user/moderator):", "user");

    if (!name || !email || !password) return alert("❌ Thiếu thông tin!");

    try {
      await api.post("/users", { name, email, password, role });
      alert("✅ Thêm user thành công!");
      fetchUsers();
    } catch {
      alert("❌ Lỗi thêm user!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "10px" }}>📌 Admin Dashboard</h2>

      {/* ✅ Nút Thêm */}
      <button
        onClick={handleAdd}
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "8px 14px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginBottom: "12px",
        }}
      >
        + Thêm User
      </button>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td style={{ color: "blue", fontWeight: "bold" }}>{user.role}</td>

              <td>

                {/* ✅ Nút Sửa = Màu ĐỎ */}
                <button
                  onClick={() => handleEdit(user)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  ✏ Sửa
                </button>

                {/* ✅ Nút Xóa = Màu XANH DƯƠNG */}
                <button
                  onClick={() => handleDelete(user._id)}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  🗑 Xóa
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
