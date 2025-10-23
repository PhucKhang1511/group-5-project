import React, { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  const [refresh, setRefresh] = useState(false);
  const handleUserAdded = () => setRefresh(!refresh);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Quản lý người dùng</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList key={refresh} />
    </div>
  );
}

export default App;


