import React from "react";
import { Pie } from "react-chartjs-2";

const BreakdownByCountry = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          "#3B82F6", // Blue
          "#10B981", // Green
          "#F59E0B", // Yellow
          "#EF4444", // Red
          "#6366F1", // Indigo
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-md">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Breakdown by Country</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default BreakdownByCountry;
