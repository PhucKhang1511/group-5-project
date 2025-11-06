import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // Nếu chưa login → về trang login
  if (!token) return <Navigate to="/login" replace />;

  // Nếu có yêu cầu quyền mà không đúng quyền → đá về profile
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;
