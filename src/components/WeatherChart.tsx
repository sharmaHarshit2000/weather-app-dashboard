import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
} from "recharts";

interface WeatherChartProps {
  title: string;
  data: any[];
  dataKey: string;
  yFormatter?: (value: number) => string;
  lineColor?: string;
}

const WeatherChart: React.FC<WeatherChartProps> = ({
  title,
  data,
  dataKey,
  yFormatter,
  lineColor = "#ff7300",
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 mb-8 text-black max-w-3xl mx-auto">
      <h3 className="text-xl font-bold mb-3 text-center text-indigo-700">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={yFormatter} />
          <Line type="monotone" dataKey={dataKey} stroke={lineColor} strokeWidth={2.2} dot={{ r: 3 }} />
          <Brush dataKey="label" height={25} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
