// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import MasterGrid from "./pages/master/MasterGrid";
// import {
//   createBrowserRouter,
//   Navigate,
//   RouterProvider,
// } from "react-router-dom";
// import "./index.css";
// import "flowbite";

// // Pages
// import LandingPage from "./pages/LandingPage";
// import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
// import CompanyDashboard from "./pages/company/CompanyDashboard";
// import UserDashboard from "./pages/user/UserDashboard";
// import Cashier from "./pages/pharmacy/Cashier";
// import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";
// import ApiTest from "./pages/testing/ApiTest";

// const routes = createBrowserRouter([
//   { path: "/", element: <LandingPage /> },
//   { path: "/testingApi/:pid/receipt/:rid", element: <ApiTest /> },
//   {
//     path: "/",
//     element: <MasterGrid />,
//     children: [
//       // ── Auth ──────────────────────────────────────────────────
//       { path: "/login", element: <Login /> },
//       { path: "/signup", element: <Signup /> },

//       // ── Pharmacy ──────────────────────────────────────────────
//       {
//         path: "/pharmacy",
//         element: <Navigate to="/pharmacy/dashboard" replace />,
//       },
//       { path: "/pharmacy/dashboard", element: <PharmacyDashboard /> },
//       { path: "/pharmacy/cashier", element: <Cashier /> },

//       // ── Company ───────────────────────────────────────────────
//       {
//         path: "/company",
//         element: <Navigate to="/company/dashboard" replace />,
//       },
//       { path: "/company/dashboard", element: <CompanyDashboard /> },

//       // ── User ──────────────────────────────────────────────────
//       { path: "/user", element: <Navigate to="/user/dashboard" replace /> },
//       { path: "/user/dashboard", element: <UserDashboard /> },
//     ],
//   },
// ]);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <RouterProvider router={routes} />
//   </StrictMode>,
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MasterGrid from "./pages/master/MasterGrid";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import "flowbite";

// Pages
import LandingPage from "./pages/LandingPage";
import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Cashier from "./pages/pharmacy/Cashier";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ApiTest from "./pages/testing/ApiTest";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const routes = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/testingApi/:pid/receipt/:rid", element: <ApiTest /> },
  {
    path: "/",
    element: <MasterGrid />,
    children: [
      // ── Auth (public) ──────────────────────────────────────────
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },

      // ── Pharmacy (protected) ──────────────────────────────────
      {
        element: <ProtectedRoute allowedRoles={["pharmacy"]} />,
        children: [
          {
            path: "/pharmacy",
            element: <Navigate to="/pharmacy/dashboard" replace />,
          },
          { path: "/pharmacy/dashboard", element: <PharmacyDashboard /> },
          { path: "/pharmacy/cashier", element: <Cashier /> },
        ],
      },

      // ── Company (protected) ───────────────────────────────────
      {
        element: <ProtectedRoute allowedRoles={["company"]} />,
        children: [
          {
            path: "/company",
            element: <Navigate to="/company/dashboard" replace />,
          },
          { path: "/company/dashboard", element: <CompanyDashboard /> },
        ],
      },

      // ── User (protected) ──────────────────────────────────────
      {
        element: <ProtectedRoute allowedRoles={["user"]} />,
        children: [
          {
            path: "/user",
            element: <Navigate to="/user/dashboard" replace />,
          },
          { path: "/user/dashboard", element: <UserDashboard /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
