import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import ModeratorPage from "./pages/ModeratorPage";

function Dashboard() {
  const role = localStorage.getItem("role");

  if (!role) {
    return <p>⚠️ Bạn chưa đăng nhập. Vui lòng quay lại trang Login.</p>;
  }

  if (role === "admin") return <AdminPage />;
  if (role === "moderator") return <ModeratorPage />;
  if (role === "user") return <UserPage />;

  return <p>Không xác định role!</p>;
}

export default Dashboard;
 