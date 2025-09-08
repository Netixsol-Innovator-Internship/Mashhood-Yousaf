import React, { useState } from "react";
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

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SaleGraph = () => {
  const [timePeriod, setTimePeriod] = useState("monthly"); // Default to Monthly

  // Sample data for each time period
  const data = {
    weekly: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      data: [20, 50, 80, 100, 120, 150, 200],
    },
    monthly: {
      labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [50, 60, 80, 90, 150, 400],
    },
    yearly: {
      labels: ["2021", "2022", "2023"],
      data: [100, 200, 500],
    },
  };

  // Dynamic chart data based on selected time period
  const chartData = {
    labels: data[timePeriod].labels,
    datasets: [
      {
        label: "Sales",
        data: data[timePeriod].data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `₹${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="max-w-9xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className=" mx-auto p-4  ">
        <div className="flex items-center justify-between mb-4">
          {/* Sale Graph Title with smaller text */}
          <h2 className="text-[10px] font-semibold">Sale Graph</h2>

          {/* Buttons to toggle between time periods */}
          <div className="flex space-x-2">
            <button
              onClick={() => setTimePeriod("weekly")}
              className={`px-2 py-1 text-[10px] ${
                timePeriod === "weekly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded-md`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimePeriod("monthly")}
              className={`px-2 py-1 text-[10px] ${
                timePeriod === "monthly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded-md`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimePeriod("yearly")}
              className={`px-2 py-1 text-[10px] ${
                timePeriod === "yearly"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded-md`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Line chart displaying the sales data */}
        <div>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default SaleGraph;
