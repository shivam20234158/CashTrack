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
    const token = localStorage.getItem("token");
    if (token) {
      await API.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Logout request error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  login,
  register,
  logout,
  getProfile,
};
