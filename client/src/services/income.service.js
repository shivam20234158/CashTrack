import API from "./api.js";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getIncome = async () => {
  const response = await API.get("/income", getAuthConfig());
  return response.data;
};

export const addIncome = async (incomeData) => {
  const response = await API.post("/income", incomeData, getAuthConfig());
  return response.data;
};

export const updateIncome = async (id, incomeData) => {
  const response = await API.put(`/income/${id}`, incomeData, getAuthConfig());
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await API.delete(`/income/${id}`, getAuthConfig());
  return response.data;
};

export default {
  getIncome,
  addIncome,
  updateIncome,
  deleteIncome,
};
