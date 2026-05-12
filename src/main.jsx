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
import Login from "./components/auth/Login";

const routes = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
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
      { path: "/login", element: <Login /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
