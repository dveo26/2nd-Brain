import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Use the proxy path
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;