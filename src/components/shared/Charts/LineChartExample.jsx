import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function LineChartExample({ data, xKey = "name", lines = [] }) {
  const colors = ["#8884d8", "#82ca9d", "#ff8042", "#00C49F"];

  return (
    <div className="w-full  h-[300px] bg-white rounded-xl shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey={xKey} />
          <YAxis />

          <Tooltip />
          <Legend />

          {lines.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
