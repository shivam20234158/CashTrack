import API from "./api.js";

export const login = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (error) {
    console.error("Logout request error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export const getProfile = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export default {
  login,
  register,
  logout,
  getProfile,
};
