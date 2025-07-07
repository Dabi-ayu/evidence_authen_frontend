import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ user, redirectPath = "/login" }) {
  // Instead of reading localStorage every render, use prop 'user' from App state
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
