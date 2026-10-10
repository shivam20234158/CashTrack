import API from "./api.js";

export const getExpenses = async (
  page = 1,
  search = "",
  category = "",
  sort = "newest"
) => {
  const response = await API.get(
    `/expenses?page=${page}&search=${search}&category=${category}&sort=${sort}`
  );
  return response.data;
};

export const addExpense = async (expenseData) => {
  const response = await API.post("/expenses", expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await API.put(`/expenses/${id}`, expenseData);
  return response.data;
};

export default {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
};
