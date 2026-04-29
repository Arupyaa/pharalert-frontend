import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MasterGrid from "./pages/master/MasterGrid";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
// import App from "./pages/App";
import "flowbite";

import LandingPage from "./pages/Global/LandingPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MasterGrid />,
    children: [{ path: "/", element: <LandingPage /> }],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);
