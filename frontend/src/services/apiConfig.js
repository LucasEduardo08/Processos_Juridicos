import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3003/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redireciona para a página de login
    }
    return Promise.reject(error);
  }
);

export default api;
