import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />; // chưa đăng nhập
  if (roleRequired && role !== roleRequired) return <Navigate to="/profile" />; // sai quyền

  return children;
}

export default ProtectedRoute;
 