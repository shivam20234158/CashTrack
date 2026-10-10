import API from "./api.js";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getReportData = async () => {
  const response = await API.get("/dashboard/report", getAuthConfig());
  return response.data;
};

export default {
  getReportData,
};
