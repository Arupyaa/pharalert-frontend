

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";

// import {
//   createBrowserRouter,
//   Navigate,
//   RouterProvider,
// } from "react-router-dom";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import "./index.css";
// import "flowbite";

// import MasterGrid from "./pages/master/MasterGrid";

// // Public pages
// import LandingPage from "./pages/LandingPage";
// import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";
// import AboutPage from "./pages/puplic/AboutPage";
// import HelpCenterPage from "./pages/puplic/HelpCenterPage";
// import FAQPage from "./pages/puplic/FAQPage";
// import ContactPage from "./pages/puplic/ContactPage";
// import SupportPage from "./pages/puplic/SupportPage";
// import PortalPage from "./pages/puplic/PortalPage";
// import ApiTest from "./pages/testing/ApiTest";
// import PharmacyMaster from "./pages/pharmacy/PharmacyMaster";
// import AdminMaster from "./pages/admin/AdminMaster";
// import AdminAccounts from "./pages/admin/AdminAccounts";
// import AdminReservations from "./pages/admin/AdminReservations";
// import AdminMedications from "./pages/admin/AdminMedications";
// import AdminLogin from "./pages/admin/AdminLogin";

// // Dashboards
// import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
// import Inventory from "./pages/pharmacy/Inventory";
// import Sales from "./pages/pharmacy/Sales";
// import Receipts from "./pages/pharmacy/Receipts";
// import Settings from "./pages/pharmacy/Settings";
// import CompanyDashboard from "./pages/company/CompanyDashboard";
// import CompanyMaster from "./pages/company/CompanyMaster";
// import MedicationTable from "./pages/company/MedicationTable";
// import PharmaciesTable from "./pages/company/PharmaciesTable";
// import PharmacyDetail from "./pages/company/PharmacyDetail";
// import CompanyChartsMaster from "./pages/company/CompanyChartsMaster";
// import RegionsCharts from "./pages/company/RegionsCharts";
// import MedicationsCharts from "./pages/company/MedicationsCharts";
// import PharmaciesCharts from "./pages/company/PharmaciesCharts";
// import CompanySettings from "./pages/company/CompanySettings";
// import UserMaster from "./pages/user/UserMaster";
// import Cashier from "./pages/pharmacy/Cashier";

// // Route protection layer
// import ProtectedRoute from "./components/auth/ProtectedRoute";

// // React Query client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// // Application routing configuration
// const routes = createBrowserRouter([
//   // Public landing page (no layout wrapper)
//   {
//     path: "/",
//     element: <LandingPage />,
//   },

//   // Public info pages
//   {
//     path: "/about",
//     element: <AboutPage />,
//   },
//   {
//     path: "/help",
//     element: <HelpCenterPage />,
//   },
//   {
//     path: "/help/faq",
//     element: <FAQPage />,
//   },
//   {
//     path: "/help/contact-us",
//     element: <ContactPage />,
//   },
//   {
//     path: "/help/support",
//     element: <SupportPage />,
//   },
//   {
//     path: "/portal/:type",
//     element: <PortalPage />,
//   },

//   // API testing route (development/debugging only)
//   {
//     path: "/testingApi/:pid/receipt/:rid",
//     element: <ApiTest />,
//   },

//   // Main app layout wrapper
//   {
//     path: "/",
//     element: <MasterGrid />,

//     children: [
//       // Public authentication routes
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/signup",
//         element: <Signup />,
//       },

//       // Pharmacy routes (protected)
//       {
//         element: <ProtectedRoute allowedRoles={["pharmacy"]} />,
//         children: [
//           {
//             element: <PharmacyMaster />,
//             children: [
//               {
//                 path: "/pharmacy",
//                 element: <Navigate to="/pharmacy/dashboard" replace />,
//               },
//               {
//                 path: "/pharmacy/dashboard",
//                 element: <PharmacyDashboard />,
//               },
//               {
//                 path: "/pharmacy/cashier",
//                 element: <Cashier />,
//               },
//               {
//                 path: "/pharmacy/inventory",
//                 element: <Inventory />,
//               },
//               {
//                 path: "/pharmacy/sales",
//                 element: <Sales />,
//               },
//               {
//                 path: "/pharmacy/receipts",
//                 element: <Receipts />,
//               },
//               {
//                 path: "/pharmacy/settings",
//                 element: <Settings />,
//               },
//             ],
//           },
//         ],
//       },

//       // Company routes (protected)
//       {
//         element: <ProtectedRoute allowedRoles={["company"]} />,
//         children: [
//           {
//             element: <CompanyMaster />,
//             children: [
//               {
//                 path: "/company",
//                 element: <Navigate to="/company/dashboard" replace />,
//               },
//               {
//                 path: "/company/dashboard",
//                 element: <CompanyDashboard />,
//               },
//               {
//                 path: "/company/tables/medications",
//                 element: <MedicationTable />,
//               },
//               {
//                 path: "/company/tables/pharmacies",
//                 element: <PharmaciesTable />,
//               },
//               {
//                 path: "/company/tables/pharmacies/:pharmacyName",
//                 element: <PharmacyDetail />,
//               },
//               {
//                 path: "/company/charts",
//                 element: <CompanyChartsMaster />,
//                 children: [
//                   {
//                     path: "/company/charts",
//                     element: <Navigate to="/company/charts/regions" replace />,
//                   },
//                   {
//                     path: "/company/charts/regions",
//                     element: <RegionsCharts />,
//                   },
//                   {
//                     path: "/company/charts/medications",
//                     element: <MedicationsCharts />,
//                   },
//                   {
//                     path: "/company/charts/pharmacies",
//                     element: <PharmaciesCharts />,
//                   },
//                 ],
//               },
//               {
//                 path: "/company/settings",
//                 element: <CompanySettings />,
//               },
//             ],
//           },
//         ],
//       },

//       // User routes (protected)
//       {
//         element: <ProtectedRoute allowedRoles={["user"]} />,
//         children: [
//           {
//             path: "/user",
//             element: <Navigate to="/user/dashboard" replace />,
//           },
//           {
//             path: "/user/dashboard",
//             element: <UserMaster />,
//           },
//         ],
//       },

//       // Admin login (public — separate from main login)
//       {
//         path: "/admin",
//         element: <AdminLogin />,
//       },

//       // Admin dashboard routes (protected)
//       {
//         element: <ProtectedRoute allowedRoles={["admin"]} />,
//         children: [
//           {
//             element: <AdminMaster />,
//             children: [
//               {
//                 path: "/admin/accounts",
//                 element: <AdminAccounts />,
//               },
//               {
//                 path: "/admin/reservations",
//                 element: <AdminReservations />,
//               },
//               {
//                 path: "/admin/medications",
//                 element: <AdminMedications />,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ]);

// // App bootstrap
// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <RouterProvider router={routes} />
//     </QueryClientProvider>
//   </StrictMode>,
// );






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
import ForgotPassword from "./components/auth/ForgotPassword";
import AboutPage from "./pages/puplic/AboutPage";
import PricingPage from "./pages/PricingPage";
import HelpCenterPage from "./pages/puplic/HelpCenterPage";
import FAQPage from "./pages/puplic/FAQPage";
import ContactPage from "./pages/puplic/ContactPage";
import SupportPage from "./pages/puplic/SupportPage";
import PortalPage from "./pages/puplic/PortalPage";
import ApiTest from "./pages/testing/ApiTest";
import PharmacyMaster from "./pages/pharmacy/PharmacyMaster";
import AdminMaster from "./pages/admin/AdminMaster";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminMedications from "./pages/admin/AdminMedications";
import AdminSettings from "./pages/admin/AdminSettings";
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
import CompanyChartsMaster from "./pages/company/CompanyChartsMaster";
import RegionsCharts from "./pages/company/RegionsCharts";
import MedicationsCharts from "./pages/company/MedicationsCharts";
import PharmaciesCharts from "./pages/company/PharmaciesCharts";
import CompanySettings from "./pages/company/CompanySettings";
import UserMaster from "./pages/user/UserMaster";
import UserDashboard from "./pages/user/UserDashboard";
import UserSearchMedicine from "./pages/user/UserSearchMedicine";
import UserReservations from "./pages/user/UserReservations";
import UserPharmacyDetails from "./pages/user/UserPharmacyDetails";
import CompanySuggestions from "./pages/company/CompanySuggestions";
import CompanySubscriptions from "./pages/company/CompanySubscriptions";

import UserSubscriptions from "./pages/user/UserSubscriptions";
import UserStockAlerts from "./pages/user/UserStockAlerts";
import UserSettings from "./pages/user/UserSettings";
import PharmacySubscriptions from "./pages/pharmacy/PharmacySubscriptions";
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

  // Public info pages
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/help",
    element: <HelpCenterPage />,
  },
  {
    path: "/help/faq",
    element: <FAQPage />,
  },
  {
    path: "/help/contact-us",
    element: <ContactPage />,
  },
  {
    path: "/help/support",
    element: <SupportPage />,
  },
  {
    path: "/portal/:type",
    element: <PortalPage />,
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
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
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
              {
                path: "/pharmacy/subscriptions",
                element: <PharmacySubscriptions />,
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
                element: <CompanyChartsMaster />,
                children: [
                  {
                    path: "/company/charts",
                    element: <Navigate to="/company/charts/regions" replace />,
                  },
                  {
                    path: "/company/charts/regions",
                    element: <RegionsCharts />,
                  },
                  {
                    path: "/company/charts/medications",
                    element: <MedicationsCharts />,
                  },
                  {
                    path: "/company/charts/pharmacies",
                    element: <PharmaciesCharts />,
                  },
                ],
              },
              {
                path: "/company/settings",
                element: <CompanySettings />,
              },
              {
                path: "/company/suggestions",
                element: <CompanySuggestions />,
              },
              {
                path: "/company/subscriptions",
                element: <CompanySubscriptions />,
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
            element: <UserMaster />,
            children: [
              {
                path: "/user",
                element: <Navigate to="/user/dashboard" replace />,
              },
              {
                path: "/user/dashboard",
                element: <UserDashboard />,
              },
              {
                path: "/user/search-medicine",
                element: <UserSearchMedicine />,
              },
              {
                path: "/user/reservations",
                element: <UserReservations />,
              },
              {
                path: "/user/pharmacy/:id",
                element: <UserPharmacyDetails />,
              },
              {
                path: "/user/subscriptions",
                element: <UserSubscriptions />,
              },
              {
                path: "/user/alerts",
                element: <UserStockAlerts />,
              },
              {
                path: "/user/settings",
                element: <UserSettings />,
              },
            ],
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
              {
                path: "/admin/reservations",
                element: <AdminReservations />,
              },
              {
                path: "/admin/medications",
                element: <AdminMedications />,
              },
              {
                path: "/admin/settings",
                element: <AdminSettings />,
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
