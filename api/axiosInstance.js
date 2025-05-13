import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://earthbeat-194219186281.asia-northeast1.run.app",
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptors for tokens, errors
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: Add auth token here
    // config.headers.Authorization = `Bearer ${yourToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
