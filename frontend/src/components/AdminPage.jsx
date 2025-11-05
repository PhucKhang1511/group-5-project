import { useEffect, useState } from "react";
import api from "../api";

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users"); // ✅ ĐÃ SỬA ĐÚNG
        setUsers(res.data);
      } catch (err) {
        console.log(err);
        alert("Bạn không có quyền hoặc token hết hạn!");
        window.location.href = "/login";
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-10">
      <h1 className="text-center text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Tên</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Vai trò</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border text-blue-700 font-semibold">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
