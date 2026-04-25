import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MasterGrid from './pages/master/MasterGrid'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import "flowbite"

const routes = createBrowserRouter([
{
  path: '/', element: <MasterGrid/>, children:[
    //template
    // { path: '/', element: <Home /> },
  ]
}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes}/>
  </StrictMode>,
)
