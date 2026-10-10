import API from "./api.js";

export const getReportData = async () => {
  const response = await API.get("/dashboard/report");
  return response.data;
};

export default {
  getReportData,
};
