import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import "flowbite";

import MasterGrid from "./pages/master/MasterGrid";

// Public pages
import LandingPage from "./pages/LandingPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ApiTest from "./pages/testing/ApiTest";

// Dashboards
import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import Inventory from "./pages/pharmacy/Inventory";
import Sales from "./pages/pharmacy/Sales";
import Receipts from "./pages/pharmacy/Receipts";
import Settings from "./pages/pharmacy/Settings";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Cashier from "./pages/pharmacy/Cashier";

// Route protection layer
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Application routing configuration
const routes = createBrowserRouter([
  // Public landing page (no layout wrapper)
  {
    path: "/",
    element: <LandingPage />,
  },

  // API testing route (development/debugging only)
  {
    path: "/testingApi/:pid/receipt/:rid",
    element: <ApiTest />,
  },

  // Main app layout wrapper
  {
    path: "/",
    element: <MasterGrid />,

    children: [
   
      // Public authentication routes
   
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },

  
      // Pharmacy routes (protected)
    
      {
        element: <ProtectedRoute allowedRoles={["pharmacy"]} />,
        children: [
          {
            path: "/pharmacy",
            element: <Navigate to="/pharmacy/dashboard" replace />,
          },
          {
            path: "/pharmacy/dashboard",
            element: <PharmacyDashboard />,
          },
          {
            path: "/pharmacy/cashier",
            element: <Cashier />,
          },
          {
            path: "/pharmacy/inventory",
            element: <Inventory />,
          },
          {
            path: "/pharmacy/sales",
            element: <Sales />,
          },
          {
            path: "/pharmacy/receipts",
            element: <Receipts />,
          },
          {
            path: "/pharmacy/settings",
            element: <Settings />,
          },
        ],
      },

  
      // Company routes (protected)
 
      {
        element: <ProtectedRoute allowedRoles={["company"]} />,
        children: [
          {
            path: "/company",
            element: <Navigate to="/company/dashboard" replace />,
          },
          {
            path: "/company/dashboard",
            element: <CompanyDashboard />,
          },
        ],
      },

      // User routes (protected)
   
      {
        element: <ProtectedRoute allowedRoles={["user"]} />,
        children: [
          {
            path: "/user",
            element: <Navigate to="/user/dashboard" replace />,
          },
          {
            path: "/user/dashboard",
            element: <UserDashboard />,
          },
        ],
      },
    ],
  },
]);

// App bootstrap
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
