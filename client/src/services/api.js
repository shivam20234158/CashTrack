import axios from "axios";

const API = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050/api",
  baseURL: "/api",
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && currentPath !== "/register") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default API;

