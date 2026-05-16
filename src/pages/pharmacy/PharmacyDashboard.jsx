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
import { useEffect, useMemo } from "react";
import DataTable from "../../components/General/tables/DataTable.jsx";
import { fetchTableData } from "../../api/tableApi.js";
import { useTableStore } from "../../store/tableStore.js";




const dashboardItems = [
  { name: "Dashboard", path: "/pharmacy/dashboard", icon: DashboardIcon },
  { name: "Inventory", path: "/pharmacy/inventory", icon: PillIcon },
  { name: "Sales", path: "/pharmacy/sales", icon: SalesIcon },
  { name: "Receipts", path: "/pharmacy/receipts", icon: ReceiptIcon },
  { name: "Settings", path: "/pharmacy/settings", icon: SettingsIcon },
];

export default function PharmacyDashboard() {
//table states and functions 
const { data, total, page, limit, loading, error, setData, setTotal, setPage, setLoading, setError,} = useTableStore();
const columns = useMemo(
  () => [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "pharmacyId",
      header: "Pharmacy ID",
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      accessorKey: "items",
      header: "Items",
    },
  ], [] );
const loadData = async () => {
  try {
    setLoading(true);

    const response = await fetchTableData({
      endpoint: "http://localhost:8080/pharmacy/0545a012-2c83-478e-ad2c-e1cbcda8a1ce/receipts",
      page : 10,
      limit: 25,
    });

    /*
      Expected Backend Response:
      
      {
        data: [],
        total: 100
      }
    */

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
}, [page]);
  //custom hook to check if window is mobile size or not
  const isMobile = useIsMobile();
  const [overlay, setOverlay] = useState(false);
  //set sidebar initially as closed if you open page on mobile otherwise start it as opened
  const [collapsed, setCollapsed] = useState(isMobile ? true : false);
  // const {changeAvatarName,changeAvatarImage} = useAvatarStore(); //for testing purposes for the avatar store
  return (
    <>
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
        <PDashboardMain />
      </div>
      <div className="min-h-screen bg-black p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">
            Users Table
          </h1>

          {error && (
            <div className="mb-4 text-red-500">
              {error}
            </div>
          )}

          <DataTable
            columns={columns}
            data={data}
            total={total}
            page={page}
            limit={limit}
            loading={loading}
            onPageChange={setPage}
          />
        </div>
      </div>


      {/* for testing purposes for the avatar store */}
      {/* <input type="text" onChange={(e)=>{changeAvatarName(e.target.value)}}/>
            <button onClick={()=>{changeAvatarImage(avatarImage)}}>change image</button>  */}
    </>
  );
}
