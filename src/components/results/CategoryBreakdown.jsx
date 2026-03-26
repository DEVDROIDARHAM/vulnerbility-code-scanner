import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CategoryBreakdown = ({ categories }) => {
  // Map categories object to array for Recharts
  const data = Object.entries(categories)
    .map(([name, count]) => ({
      name: name.split(' ')[0], // Short name for the axis
      fullName: name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const colors = [
    "#e11d48", // primary
    "#fb7185", // light
    "#be123c", // dark
    "#a1a1aa", // slate
    "#ef4444", // critical
    "#0ea5e9", // cyan 
  ];

  return (
    <div className="h-[180px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            width={70}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
            contentStyle={{
              backgroundColor: "rgba(10, 10, 15, 0.9)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              fontSize: "11px",
              color: "#ffffff",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              padding: "8px 12px",
            }}
            itemStyle={{ color: "#e11d48", fontWeight: 700 }}
            labelStyle={{ display: "none" }}
            formatter={(value, name, props) => [value, props.payload.fullName]}
          />
          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]}
            barSize={12}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBreakdown;
