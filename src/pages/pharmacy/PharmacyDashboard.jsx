import RetractableSidebar from "../../components/General/retractablesidebar/RetractableSidebar.jsx";
import PDashboardMain from "../../components/layout/PDashboardMain/PDashboardMain.jsx";
import Overlay from "../../components/General/overLay/Overlay.jsx";

//logos and icons
import logoName from "../../assets/images/logo_name v1.1.svg";
import ReceiptIcon from "../../assets/svg/ReceiptIcon.jsx";
import DashboardIcon from "../../assets/svg/DashboardIcon.jsx";
import SettingsIcon from "../../assets/svg/SettingsIcon.jsx";
import PillIcon from "../../assets/svg/PillIcon.jsx";
import SalesIcon from "../../assets/svg/SalesIcon.jsx";
import { useAvatarStore } from "../../store/UseAvatarStore.js";
import avatarImage from "../../assets/avatar.avif";
import DashboardNavBar from "../../components/layout/dashboardnavbar/DashboardNavBar.jsx";
import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";

// table
import UsersPage from "../../routes/users.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReusableTable from "../../components/General/tables/ReusableTable.jsx";




const dashboardItems = [
  { name: "Dashboard", path: "/pharmacy/dashboard", icon: DashboardIcon },
  { name: "Inventory", path: "/pharmacy/inventory", icon: PillIcon },
  { name: "Sales", path: "/pharmacy/sales", icon: SalesIcon },
  { name: "Receipts", path: "/pharmacy/receipts", icon: ReceiptIcon },
  { name: "Settings", path: "/pharmacy/settings", icon: SettingsIcon },
];

export default function PharmacyDashboard() {
//table states and functions 
const queryClient = new QueryClient();
const columns = [
    
  ];


/* const { data, total, page, limit, loading, error, setData, setTotal, setPage, setLoading, setError,} = useTableStore();
const columns = useMemo(
  () => [
    {
      accessorKey: "orderNo",
      header: "ID",
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "itemAmount",
      header: "Item Amount",
    },
    {
      accessorKey: "subtotal",
      header: "Subtotal",
    },
    {
      accessorKey: "discount",
      header: "Discount",
    },
    {
      accessorKey: `tax`,
      header: "Tax",
    },
    {
      accessorKey: "total",
      header: "Total",
    },
    
  ], [] );
const loadData = async () => {
  try {
    setLoading(true);

   const response = await fetchTableData({
  endpoint: "http://localhost:8080/pharmacy/purchases",
  page: 10,
  limit: 25,
  headers: {
    "Authorization": `Bearer ${yourTokenVariable}`,
    "Content-Type": "application/json"
  }
});

    /*
      Expected Backend Response:
      
      {
        data: [],
        total: 100
      }
    

    setData(response.data);
    setTotal(response.recordsCount);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadData();
}, [page]);  */
  
//custom hook to check if window is mobile size or not
  const isMobile = useIsMobile();
  const [overlay, setOverlay] = useState(false);
  //set sidebar initially as closed if you open page on mobile otherwise start it as opened
  const [collapsed, setCollapsed] = useState(isMobile ? true : false);
  // const {changeAvatarName,changeAvatarImage} = useAvatarStore(); //for testing purposes for the avatar store
  return (
    <>
    <QueryClientProvider client={queryClient}>
     {/* overlay */}
      <Overlay
        isVisible={overlay}
        onClose={() => {
          setOverlay(false);
          setCollapsed(true);
        }}
      />
      {/* all of this is wrapped by master page flex layout */}
      <RetractableSidebar
        sidebarLogo={logoName}
        sidebarItems={dashboardItems}
        setOverlay={setOverlay}
        setCollapsed={setCollapsed}
        collapsed={collapsed}
      />
      <div className="flex flex-col w-full h-screen">
        <DashboardNavBar />
    

 
     <div
      className="
        min-h-screen
        bg-neutral-secondary
        p-6
      "
    >

      <ReusableTable
        endpoint="http://localhost:8080/pharmacy/inventory"
        
      />

    </div>
 


      </div>
      
      


      {/* for testing purposes for the avatar store */}
      {/* <input type="text" onChange={(e)=>{changeAvatarName(e.target.value)}}/>
            <button onClick={()=>{changeAvatarImage(avatarImage)}}>change image</button>  */}
  </QueryClientProvider>
     
    </>
  );
}
