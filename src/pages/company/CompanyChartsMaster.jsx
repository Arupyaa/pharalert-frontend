import TabsLinks from "../../components/General/tabslink/Tabslink.jsx";
import { Outlet } from "react-router-dom";

const tabs = [
  { name: "Regions", path: "/company/charts/regions" },
  { name: "Medications", path: "/company/charts/medications" },
  { name: "Pharmacies", path: "/company/charts/pharmacies" },
];

export default function CompanyChartsMaster() {
  return (
    <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6">
      <div className="mb-6">
        <TabsLinks tabs={tabs} />
      </div>
      <Outlet />
    </div>
  );
}
