

import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  useAuthStore,
  selectIsAuthenticated,
  selectRole,
} from "../../store/useAuthStore";

export default function ProtectedRoute({ allowedRoles }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore(selectRole);
  const location = useLocation();

  // 1. Not authenticated → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role restriction applies and user's role isn't in the list
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Send them to their own dashboard instead of a blank page
    const fallback = ROLE_DASHBOARD[role] ?? "/login";
    return <Navigate to={fallback} replace />;
  }

  // 3. All good → render child routes
  return <Outlet />;
}

// Map each role → its home dashboard (keep in sync with Login.jsx)
const ROLE_DASHBOARD = {
  pharmacy: "/pharmacy/dashboard",
  company: "/company/dashboard",
  user: "/user/dashboard",
};
