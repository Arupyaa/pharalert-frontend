import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  useAuthStore,
  selectIsAuthenticated,
  selectRole,
} from "../../store/useAuthStore";

// Map each role → its home dashboard
const ROLE_DASHBOARD = {
  pharmacy: "/pharmacy/dashboard",
  company: "/company/dashboard",
  user: "/user/dashboard",
  admin: "/admin/accounts",
};

export default function ProtectedRoute({ allowedRoles }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore(selectRole);
  const location = useLocation();

  // 1. Not authenticated → send to the correct login page
  if (!isAuthenticated) {
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
      <Navigate
        to={isAdminRoute ? "/admin" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  // 2. User authenticated but role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    const fallback = ROLE_DASHBOARD[role] ?? "/login";

    return <Navigate to={fallback} replace />;
  }

  // 3. Access granted
  return <Outlet />;
}
