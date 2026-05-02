import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MasterGrid from './pages/master/MasterGrid'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import "flowbite"
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard'
import Inventory from './pages/pharmacy/Inventory'


const routes = createBrowserRouter([
{
  path: '/', element: <MasterGrid/>, children:[
    //template
    // { path: '/', element: <Home /> },
    {path: '/pharmacy', element: <Navigate to= "/pharmacy/dashboard" replace/>},
    {path: '/pharmacy/dashboard', element: <PharmacyDashboard/>},
    {path:'/company/inventory',element: <Inventory/>}
  ]
}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes}/>
  </StrictMode>,
)
