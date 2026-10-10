import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBudgets, setBudget, deleteBudget } from "../services/budget.service.js";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

const categoryIcons = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Bills: "🧾",
  Entertainment: "🎬",
  Other: "📦",
};

function Budget() {
  const [budgets, setBudgetsState] = useState([]);
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const data = await getBudgets();
      setBudgetsState(data || []);
    } catch {
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!limit) {
      toast.error("Enter a budget amount");
      return;
    }
    try {
      await setBudget({ category, limit: Number(limit) });
      toast.success("Budget saved");
      setLimit("");
      fetchBudgets();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      toast.success("Budget deleted");
      fetchBudgets();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Budget Manager
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Set limits and track spending by category
        </p>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Total Budget
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ₹{totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Total Spent
          </p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Remaining
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              totalBudget - totalSpent >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ₹{(totalBudget - totalSpent).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-5">
          Set a Budget
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              >
                Save Budget
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Budget Cards */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 dark:text-gray-500">
          Loading...
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-20 text-center shadow-sm">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No budgets set yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Set your first budget limit above
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {budgets.map((budget) => {
            const percentage = Math.min(
              (budget.spent / budget.limit) * 100,
              100
            );
            const isOver = budget.remaining < 0;
            const isWarning = percentage >= 80 && !isOver;

            return (
              <div
                key={budget._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-lg">
                      {categoryIcons[budget.category] || "📦"}
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 dark:text-white">
                        {budget.category}
                      </h2>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Monthly budget
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-xs bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      Budget
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      ₹{Number(budget.limit).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      Spent
                    </p>
                    <p className="text-sm font-bold text-red-500">
                      ₹{Number(budget.spent).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      Left
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        isOver ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      ₹{Math.abs(budget.remaining).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isOver
                        ? "bg-red-500"
                        : isWarning
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {percentage.toFixed(0)}% used
                  </p>
                  {isOver && (
                    <p className="text-xs font-semibold text-red-500">
                      ⚠️ Exceeded by ₹
                      {Math.abs(budget.remaining).toLocaleString()}
                    </p>
                  )}
                  {isWarning && (
                    <p className="text-xs font-semibold text-yellow-500">
                      ⚠️ Almost at limit
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Budget;
