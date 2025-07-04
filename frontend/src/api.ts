import axios from "axios";
// Note: In React (Vite/CRA), environment variables must start with VITE_ (Vite) or REACT_APP_ (CRA) and are injected at build time.
// dotenv is not used in frontend code directly; instead, variables are accessed via import.meta.env (Vite) or process.env (CRA).
// Example for Vite:
const url =
  import.meta.env.REACT_APP_API_BASE_URL ||
  "https://twond-brain-z9qo.onrender.com/api";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: url, // Use environment variable or fallback
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
