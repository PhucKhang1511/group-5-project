import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "14px", borderBottom: "1px solid #ddd", fontSize: "18px" }}>
      <Link to="/profile" style={{ marginRight: "20px" }}>Trang cá nhân</Link>
      <Link to="/login">Đăng xuất</Link>
    </nav>
  );
}

export default Navbar;
