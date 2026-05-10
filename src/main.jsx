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

import Regions from "./pages/Regions";
import Medications from "./pages/Medications";
import Pharmacies from "./pages/Pharmacies";
import Badge from "./components/General/badge/Badge";
import LandingPage from "./pages/LandingPage";

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

      { path: "/regions", element: <Regions /> },
      { path: "/medications", element: <Medications /> },
      { path: "/pharmacies", element: <Pharmacies /> },
      { path: "/badge", element: <Badge /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
