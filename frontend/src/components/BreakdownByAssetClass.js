import React from "react";
import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);


const BreakdownByAssetClass = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          "#6366F1", // Indigo
          "#F59E0B", // Yellow
          "#10B981", // Green
          "#EF4444", // Red
          "#3B82F6", // Blue
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-md">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Breakdown by Asset Class</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default BreakdownByAssetClass;
