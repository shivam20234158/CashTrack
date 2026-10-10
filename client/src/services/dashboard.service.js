import API from "./api.js";

export const getDashboardData = async () => {
  const response = await API.get("/dashboard");
  return response.data;
};

export const getCategoryAnalytics = async () => {
  const response = await API.get("/dashboard/category-analytics");
  return response.data;
};

export const getMonthlyAnalytics = async () => {
  const response = await API.get("/dashboard/monthly-analytics");
  return response.data;
};

export default {
  getDashboardData,
  getCategoryAnalytics,
  getMonthlyAnalytics,
};
