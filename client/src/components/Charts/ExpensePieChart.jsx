import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpensePieChart({ analytics = [] }) {
  if (!analytics || analytics.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
        No expense data for chart
      </div>
    );
  }

  const data = {
    labels: analytics.map((item) => item._id || "Unknown"),
    datasets: [
      {
        data: analytics.map((item) => item.total),
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#ef4444",
          "#eab308",
          "#8b5cf6",
          "#06b6d4",
          "#f97316",
          "#ec4899",
        ],
      },
    ],
  };

  return <Pie data={data} />;
}

export default ExpensePieChart;
