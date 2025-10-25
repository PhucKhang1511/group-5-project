import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  // ✅ Hàm lấy danh sách user từ backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users");
      console.log("✅ Dữ liệu từ backend:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có người dùng nào</p>
      ) : (
        <ul>
  {users.map((user) => (
    <li key={user._id || user.id}>
      {user.name} - {user.email}
    </li>
  ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;


