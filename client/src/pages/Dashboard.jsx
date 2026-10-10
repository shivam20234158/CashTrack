import { useEffect, useState } from "react";
import {
  getDashboardData,
  getCategoryAnalytics,
} from "../services/dashboard.service.js";
import IncomeExpenseChart from "../components/Charts/IncomeExpenseChart.jsx";
import ExpensePieChart from "../components/Charts/ExpensePieChart.jsx";
import { ClipLoader } from "react-spinners";

const StatCard = ({ title, amount, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}
      >
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {typeof amount === "number" && title !== "Transactions"
        ? `₹${amount.toLocaleString()}`
        : amount}
    </p>
  </div>
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [categoryAnalytics, setCategoryAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    storedUser = null;
  }
  const userName = storedUser?.user?.name || storedUser?.name || "Friend";

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [data, analytics] = await Promise.all([
          getDashboardData(),
          getCategoryAnalytics(),
        ]);
        setDashboardData(data);
        setCategoryAnalytics(analytics || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back,{" "}
          <span className="font-semibold text-indigo-500">
            {userName}
          </span>{" "}
          👋
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-32">
          <ClipLoader size={40} color="#6366f1" />
        </div>
      ) : dashboardData ? (
        <>
          {/* Stat Cards Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              title="Balance"
              amount={dashboardData.balance}
              icon="💰"
              color="bg-indigo-100 dark:bg-indigo-900/40"
            />
            <StatCard
              title="Income"
              amount={dashboardData.totalIncome}
              icon="📈"
              color="bg-green-100 dark:bg-green-900/40"
            />
            <StatCard
              title="Expense"
              amount={dashboardData.totalExpense}
              icon="📉"
              color="bg-red-100 dark:bg-red-900/40"
            />
          </div>

          {/* Stat Cards Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              title="Highest Expense"
              amount={dashboardData.highestExpense}
              icon="⚠️"
              color="bg-orange-100 dark:bg-orange-900/40"
            />
            <StatCard
              title="Highest Income"
              amount={dashboardData.highestIncome}
              icon="🏆"
              color="bg-yellow-100 dark:bg-yellow-900/40"
            />
            <StatCard
              title="Transactions"
              amount={dashboardData.totalTransactions}
              icon="🔄"
              color="bg-purple-100 dark:bg-purple-900/40"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Income vs Expense
              </h2>
              <IncomeExpenseChart
                income={dashboardData.totalIncome}
                expense={dashboardData.totalExpense}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Spending by Category
              </h2>
              <ExpensePieChart analytics={categoryAnalytics} />
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Transactions
            </h2>

            {!dashboardData.recentTransactions ||
            dashboardData.recentTransactions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No transactions yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Add your first expense or income to get started
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {dashboardData.recentTransactions.map((transaction, index) => (
                  <div
                    key={transaction._id}
                    className={`flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                      ${
                        index !== 0
                          ? "border-t border-gray-100 dark:border-gray-700"
                          : ""
                      }`}
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg
                          ${
                            transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900/40"
                              : "bg-red-100 dark:bg-red-900/40"
                          }`}
                      >
                        {transaction.type === "income" ? "💵" : "💸"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {transaction.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {transaction.category || transaction.source} •{" "}
                          {new Date(transaction.date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right">
                      <p
                        className={`font-bold text-base ${
                          transaction.type === "income"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹
                        {Number(transaction.amount).toLocaleString()}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block
                          ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                          }`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Could not load dashboard data
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
