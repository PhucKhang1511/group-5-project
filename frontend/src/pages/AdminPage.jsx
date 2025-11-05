import { useEffect, useState } from "react";
import api from "../api";

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users"); // ✅ Tự thêm token qua interceptor
        setUsers(res.data);
      } catch (err) {
        console.error("Lỗi load danh sách:", err);
        alert("❌ Bạn không có quyền hoặc token đã hết hạn!");
        window.location.href = "/login";
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-center text-2xl font-bold mb-8">Group18 Project</h1>

        <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-gray-600 mb-6">Trang dành riêng cho Admin.</p>

        <h3 className="font-semibold mb-4">Danh sách người dùng:</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Vai trò</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border text-blue-600 font-medium">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
