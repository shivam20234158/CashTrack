import Income from "../models/income.model.js";

export const addIncome = async (req, res) => {
  try {
    const { title, amount, source, date } = req.body;

    if (!title || !amount || !source) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const income = await Income.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      source,
      date: date || Date.now(),
    });

    return res.status(201).json(income);
  } catch (error) {
    console.error("Add Income Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getIncome = async (req, res) => {
  try {
    const income = await Income.find({
      user: req.user._id,
    }).sort({ date: -1 });

    return res.status(200).json(income);
  } catch (error) {
    console.error("Get Income Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        message: "Income not found",
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    await income.deleteOne();

    return res.status(200).json({
      message: "Income Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Income Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { title, amount, source, date } = req.body;

    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        message: "Income not found",
      });
    }

    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    income.title = title || income.title;
    income.amount = amount !== undefined ? Number(amount) : income.amount;
    income.source = source || income.source;
    income.date = date || income.date;

    const updatedIncome = await income.save();

    return res.status(200).json(updatedIncome);
  } catch (error) {
    console.error("Update Income Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export default {
  addIncome,
  getIncome,
  deleteIncome,
  updateIncome,
};
