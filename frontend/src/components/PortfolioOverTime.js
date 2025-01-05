import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PortfolioOverTime = ({ data }) => {
    const chartData = {
      labels: data.map((item) => item.date),
      datasets: [
        {
          label: "Portfolio Value",
          data: data.map((item) => item.value),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { borderDash: [5] } },
      },
    };
  
    return (
      <div className="bg-white p-6 shadow-lg rounded-md ">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Portfolio Over Time</h2>
        <Line data={chartData} options={options} />
      </div>
    );
  };

export default PortfolioOverTime;
