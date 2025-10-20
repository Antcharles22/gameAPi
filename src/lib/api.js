import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api; 