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
import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import LandingPage from "./pages/LandingPage";
import Cashier from "./pages/pharmacy/Cashier";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ApiTest from "./pages/testing/ApiTest";

const routes = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {path:"/testingApi/:pid/receipt/:rid",element:<ApiTest/>},
  {
    path: "/",
    element: <MasterGrid />,
    children: [
      //template
      // { path: '/', element: <Home /> },
      {
        path: "/pharmacy",
        element: <Navigate to="/pharmacy/dashboard" replace />,
      },
      { path: "/pharmacy/dashboard", element: <PharmacyDashboard /> },
      { path: "/pharmacy/cashier", element: <Cashier /> },
      { path: "/login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
