import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const TransactionTrends = ({ data }) => {
    const chartData = {
      labels: data.map((item) => item.date),  // Use 'date' for the x-axis labels
      datasets: [
        {
          label: "Transaction Amount",
          data: data.map((item) => item.value),  // Use 'value' for the bar heights
          backgroundColor: "#3B82F6", // Blue
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
        responsive: true,
        aspectRatio: 1.5,  // This will make sure the chart has a proper aspect ratio
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { autoSkip: true, maxTicksLimit: 6 },
          },
          y: {
            grid: { borderDash: [5] },
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
      };
      

      
  
    return (
      <div className="bg-white p-6 shadow-lg rounded-md">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Transaction Trends</h2>
        <Bar data={chartData} options={options} />
      </div>
    );
  };
  

export default TransactionTrends;
