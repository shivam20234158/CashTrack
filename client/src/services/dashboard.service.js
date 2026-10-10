import API from "./api.js";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDashboardData = async () => {
  const response = await API.get("/dashboard", getAuthConfig());
  return response.data;
};

export const getCategoryAnalytics = async () => {
  const response = await API.get(
    "/dashboard/category-analytics",
    getAuthConfig()
  );
  return response.data;
};

export const getMonthlyAnalytics = async () => {
  const response = await API.get(
    "/dashboard/monthly-analytics",
    getAuthConfig()
  );
  return response.data;
};

export default {
  getDashboardData,
  getCategoryAnalytics,
  getMonthlyAnalytics,
};
