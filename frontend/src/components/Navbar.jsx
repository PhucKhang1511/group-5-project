import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#007bff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        padding: "10px 0",
      }}
    >
      {/* ✅ Giới hạn độ rộng + căn giữa */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          Group 5 Project
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {token && (
            <>
              <Link to="/profile" style={navLinkStyle}>
                Trang cá nhân
              </Link>

              <button
                onClick={handleLogout}
                style={logoutBtnStyle}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
};

const logoutBtnStyle = {
  background: "white",
  color: "#007bff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "500",
};

export default Navbar;
