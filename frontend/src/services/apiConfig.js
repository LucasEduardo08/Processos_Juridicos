import axios from "axios";

const getBaseUrl = () => {
  const hostname = window.location.hostname;

  // Verifica se é localhost
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3035/api";
  }

  // Verifica se está em uma rede local (ajuste o seu IP de rede aqui)
  if (hostname.startsWith("192.168.")) {
    return `http://${hostname}:3035/api`;
  }

  // Caso contrário, use o IP fixo
  return "http://192.169.137.112:3035/api";
};

const baseURL = getBaseUrl();
const api = axios.create({
  baseURL,
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
