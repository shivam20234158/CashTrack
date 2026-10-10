import API from "./api.js";

export const getBudgets = async () => {
  const response = await API.get("/budget");
  return response.data;
};

export const setBudget = async (budgetData) => {
  const response = await API.post("/budget", budgetData);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await API.delete(`/budget/${id}`);
  return response.data;
};

export default {
  getBudgets,
  setBudget,
  deleteBudget,
};
