import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MasterGrid from './pages/master/MasterGrid'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import "flowbite"
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard'
import LandingPage from "./pages/Global/LandingPage";

const routes = createBrowserRouter([
  { path: "/", element: <LandingPage /> },

  {
    path: "/",
    element: <MasterGrid />,
    children: [
      { path: "pharmacy/dashboard", element: <PharmacyDashboard /> },
      { path: "pharmacy", element: <Navigate to="/pharmacy/dashboard" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
