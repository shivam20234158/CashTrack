import Expense from "../models/expense.model.js";
import Income from "../models/income.model.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const income = await Income.find({ user: userId });
    const expenses = await Expense.find({ user: userId });

    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;

    const highestExpense =
      expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;
    const highestIncome =
      income.length > 0 ? Math.max(...income.map((i) => i.amount)) : 0;
    const totalTransactions = income.length + expenses.length;

    const recentTransactions = [
      ...income.map((item) => ({
        ...item.toObject(),
        type: "income",
      })),
      ...expenses.map((item) => ({
        ...item.toObject(),
        type: "expense",
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      highestExpense,
      highestIncome,
      totalTransactions,
      recentTransactions,
    });
  } catch (error) {
    console.error("Get Dashboard Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getCategoryAnalytics = async (req, res) => {
  try {
    const analytics = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    return res.status(200).json(analytics);
  } catch (error) {
    console.error("Get Category Analytics Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const monthlyData = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return res.status(200).json(monthlyData);
  } catch (error) {
    console.error("Get Monthly Analytics Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getReportData = async (req, res) => {
  try {
    const userId = req.user._id;

    const incomes = await Income.find({ user: userId });
    const expenses = await Expense.find({ user: userId });

    const report = {};

    incomes.forEach((income) => {
      const date = new Date(income.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!report[key]) {
        report[key] = {
          month: key,
          income: 0,
          expense: 0,
        };
      }

      report[key].income += income.amount;
    });

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!report[key]) {
        report[key] = {
          month: key,
          income: 0,
          expense: 0,
        };
      }

      report[key].expense += expense.amount;
    });

    const finalReport = Object.values(report).map((item) => ({
      ...item,
      saving: item.income - item.expense,
    }));

    return res.status(200).json(finalReport);
  } catch (error) {
    console.error("Get Report Data Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export default {
  getDashboard,
  getCategoryAnalytics,
  getMonthlyAnalytics,
  getReportData,
};
