import DashboardCard from "../../General/dashboardcard/dbcard/DbCard";
import DbCardHeader from "../../General/dashboardcard/dbcardheader/DbCardHeader";
import DbCardBodySection from "../../General/dashboardcard/dbCardbodysection/DbCardBodySection";
import DbCardFooter from "../../General/dashboardcard/dbcardfooter/DbCardFooter";
import DbCardBody from "../../General/dashboardcard/dbcardbody/DbCardBody";
import SalesIcon from "../../../assets/svg/SalesIcon";
import LineChartExample from "../../General/charts/LineChartExample";

import SimpleBarChart from "../../General/charts/SimpleBarChart";

export default function PDashboardMain() {
  const data = [
    { name: "Page A", uv: 4000, pv: 2400 },
    { name: "Page B", uv: 3000, pv: 1398 },
    { name: "Page C", uv: 2000, pv: 9800 },
    { name: "Page D", uv: 2780, pv: 3908 },
    { name: "Page E", uv: 1890, pv: 4800 },
    { name: "Page F", uv: 2390, pv: 3800 },
    { name: "Page G", uv: 3490, pv: 4300 },
  ];

  const dataOfBarChart = [
    { name: "Jan", sales: 400, users: 240 },
    { name: "Feb", sales: 300, users: 139 },
    { name: "Mar", sales: 500, users: 380 },
  ];

  return (
    <div className="flex-1 bg-neutral-secondary w-full min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <LineChartExample data={data} xKey="name" lines={["pv", "uv"]} />
        <SimpleBarChart
          data={dataOfBarChart}
          xKey="name"
          bars={["sales", "users"]}
        />
      </div>
    </div>
  );
}
