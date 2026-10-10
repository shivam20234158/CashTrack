import API from "./api.js";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getBudgets = async () => {
  const response = await API.get("/budget", getAuthConfig());
  return response.data;
};

export const setBudget = async (budgetData) => {
  const response = await API.post("/budget", budgetData, getAuthConfig());
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await API.delete(`/budget/${id}`, getAuthConfig());
  return response.data;
};

export default {
  getBudgets,
  setBudget,
  deleteBudget,
};
