
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import "flowbite";

import MasterGrid from "./pages/master/MasterGrid";

// Public pages
import LandingPage from "./pages/LandingPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ApiTest from "./pages/testing/ApiTest";
import PharmacyMaster from "./pages/pharmacy/PharmacyMaster";
import AdminMaster from "./pages/admin/AdminMaster";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminLogin from "./pages/admin/AdminLogin";

// Dashboards
import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import Inventory from "./pages/pharmacy/Inventory";
import Sales from "./pages/pharmacy/Sales";
import Receipts from "./pages/pharmacy/Receipts";
import Settings from "./pages/pharmacy/Settings";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyMaster from "./pages/company/CompanyMaster";
import MedicationTable from "./pages/company/MedicationTable";
import PharmaciesTable from "./pages/company/PharmaciesTable";
import PharmacyDetail from "./pages/company/PharmacyDetail";
import CompanyCharts from "./pages/company/CompanyCharts";
import CompanySettings from "./pages/company/CompanySettings";
import UserDashboard from "./pages/user/UserDashboard";
import Cashier from "./pages/pharmacy/Cashier";

// Route protection layer
import ProtectedRoute from "./components/auth/ProtectedRoute";

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
            element: <PharmacyMaster />,
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
        ],
      },

      // Company routes (protected)
      {
        element: <ProtectedRoute allowedRoles={["company"]} />,
        children: [
          {
            element: <CompanyMaster />,
            children: [
              {
                path: "/company",
                element: <Navigate to="/company/dashboard" replace />,
              },
              {
                path: "/company/dashboard",
                element: <CompanyDashboard />,
              },
              {
                path: "/company/tables/medications",
                element: <MedicationTable />,
              },
              {
                path: "/company/tables/pharmacies",
                element: <PharmaciesTable />,
              },
              {
                path: "/company/tables/pharmacies/:pharmacyName",
                element: <PharmacyDetail />,
              },
              {
                path: "/company/charts",
                element: <CompanyCharts />,
              },
              {
                path: "/company/settings",
                element: <CompanySettings />,
              },
            ],
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

      // Admin login (public — separate from main login)
      {
        path: "/admin",
        element: <AdminLogin />,
      },

      // Admin dashboard routes (protected)
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            element: <AdminMaster />,
            children: [
              {
                path: "/admin/accounts",
                element: <AdminAccounts />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

// App bootstrap
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  </StrictMode>,
);
