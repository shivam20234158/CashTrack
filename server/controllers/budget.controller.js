import Budget from "../models/budget.model.js";
import Expense from "../models/expense.model.js";

// Create or Update Budget
export const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category,
      },
      {
        limit: Number(limit),
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json(budget);
  } catch (error) {
    console.error("Set Budget Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Budgets with spent and remaining amounts calculated
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user._id,
    });

    const result = [];

    for (const budget of budgets) {
      const expenses = await Expense.find({
        user: req.user._id,
        category: budget.category,
      });

      const spent = expenses.reduce((sum, item) => sum + item.amount, 0);

      result.push({
        ...budget.toObject(),
        spent,
        remaining: budget.limit - spent,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Budgets Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete Budget
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    await budget.deleteOne();

    return res.status(200).json({
      message: "Budget Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Budget Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export default {
  setBudget,
  getBudgets,
  deleteBudget,
};
