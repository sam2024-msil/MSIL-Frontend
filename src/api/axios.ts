import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com', // Base URL for your API
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config (e.g., attach token)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Always return the config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
