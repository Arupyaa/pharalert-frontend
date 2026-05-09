import DashboardCard from "./DashboardCard/DbCard";
import DbCardHeader from "./DashboardCard/DbCardHeader";
import DbCardBodySection from "./DashboardCard/DbCardBodySection";
import DbCardFooter from "./DashboardCard/DbCardFooter";
import DbCardBody from "./DashboardCard/DbCardBody";
import SalesIcon from "../svg/SalesIcon";
import LineChartExample from "../../../components/shared/Charts/LineChartExample";

import SimpleBarChart from "../../../components/shared/Charts/SimpleBarChart";

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
