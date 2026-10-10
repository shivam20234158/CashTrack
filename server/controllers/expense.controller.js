import Expense from "../models/expense.model.js";

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      category,
      date: date || Date.now(),
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error("Add Expense Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = {
      user: req.user._id,
    };

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    let sortOption = { date: -1 };

    if (sort === "newest") {
      sortOption = { date: -1 };
    } else if (sort === "oldest") {
      sortOption = { date: 1 };
    } else if (sort === "highest") {
      sortOption = { amount: -1 };
    } else if (sort === "lowest") {
      sortOption = { amount: 1 };
    }

    const expenses = await Expense.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalExpenses = await Expense.countDocuments(query);

    return res.status(200).json({
      page,
      limit,
      totalExpenses,
      totalPages: Math.ceil(totalExpenses / limit) || 1,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    await expense.deleteOne();

    return res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    expense.title = title || expense.title;
    expense.amount = amount !== undefined ? Number(amount) : expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();

    return res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Update Expense Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export default {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
};
