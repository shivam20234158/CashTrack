import { useEffect, useState } from "react";
import { getReportData } from "../services/report.service.js";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function Reports() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await getReportData();
      setReport(data || []);
    } catch (error) {
      console.error("Report fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const highestIncome = report.length > 0 ? Math.max(...report.map((r) => r.income), 0) : 0;
  const highestExpense = report.length > 0 ? Math.max(...report.map((r) => r.expense), 0) : 0;
  const highestSaving = report.length > 0 ? Math.max(...report.map((r) => r.saving), 0) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-lg">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </p>
          {payload.map((entry) => (
            <p
              key={entry.dataKey}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}:{" "}
              <span className="font-bold">₹{Number(entry.value).toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Monthly financial overview and trends
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Peak Income Month
            </p>
            <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-base">
              📈
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{highestIncome.toLocaleString()}
          </p>
          <p className="text-xs text-green-500 mt-1 font-medium">
            Highest single month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Peak Expense Month
            </p>
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-base">
              📉
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{highestExpense.toLocaleString()}
          </p>
          <p className="text-xs text-red-500 mt-1 font-medium">
            Highest single month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Peak Savings Month
            </p>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-base">
              🏆
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{highestSaving.toLocaleString()}
          </p>
          <p className="text-xs text-indigo-500 mt-1 font-medium">
            Highest single month
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            Income vs Expense vs Savings
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Monthly trend over time
          </p>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Loading chart...
          </div>
        ) : report.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No report data yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Add transactions to see your monthly trends
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={420}>
            <LineChart
              data={report}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-gray-700"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#16a34a" }}
                activeDot={{ r: 7 }}
                animationDuration={1200}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#dc2626" }}
                activeDot={{ r: 7 }}
                animationDuration={1200}
              />
              <Line
                type="monotone"
                dataKey="saving"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1" }}
                activeDot={{ r: 7 }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Reports;
