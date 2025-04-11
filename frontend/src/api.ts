import axios from "axios";

// Create an axios instance with base URL
const api = axios.create({
  baseURL:  "http://localhost:4000/api", // Use environment variable or fallback
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
