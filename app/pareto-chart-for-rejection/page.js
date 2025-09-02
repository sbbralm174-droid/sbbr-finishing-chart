"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function ChartPage() {
  const [issues, setIssues] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // default today's date
  );

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    const res = await fetch(`/api/paretoChart?date=${date}`);
    const data = await res.json();
    setIssues(data);
  };

  const getChartData = () => {
    const total = issues.reduce((sum, i) => sum + i.count, 0);
    let cumulative = 0;
    return issues.map((i) => {
      cumulative += i.count / total;
      return {
        name: i.name,
        count: i.count,
        cumulative: cumulative,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <div className="text-center  mb-6">
          <h1 className="text-2xl font-bold">GMS TEXTILES LTD.</h1>
          <p className="text">TANSUTRAPUR, KALIAKOIR, GAZIPUR</p>
          <h2 className="text-lg text-bold">Top Defect Quantity Status</h2>
        </div>

        {/* Date Picker */}
        <div className="mb-6 flex justify-center">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
  data={getChartData()}
  margin={{ top: 20, right: 40, left: 30, bottom: 80 }} // Increased bottom margin
>
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
            <YAxis
              yAxisId="left"
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              label={{
                value: "Cumulative %",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 30 }} />
            <Bar
              yAxisId="left"
              dataKey="count"
              name="Count"
              fill="#3B82F6"
              barSize={40}
            >
              {/* এখানে Bar এর উপরে value দেখানো হচ্ছে */}
              <LabelList dataKey="count" position="top" />
            </Bar>
            <Line
              yAxisId="right"
              dataKey="cumulative"
              name="Cumulative %"
              stroke="#EF4444"
              strokeWidth={2}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}