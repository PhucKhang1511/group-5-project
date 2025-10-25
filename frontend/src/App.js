import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./components/AddUser";

function App() {
  const [users, setUsers] = useState([]);

  // Lấy dữ liệu từ backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy users:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách người dùng</h1>

      {/* Form thêm user */}
      <AddUser fetchUsers={fetchUsers} />

      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

