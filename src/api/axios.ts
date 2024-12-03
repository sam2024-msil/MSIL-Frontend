// axiosInstance.js  
import axios from 'axios';  
  
const axiosInstance = axios.create({  
  baseURL: import.meta.env.VITE_SKAN_APP_API_BASE_URL, 
  timeout: 10000, 
});  
  
// Request Interceptor  
axiosInstance.interceptors.request.use(  
  (config) => {  
    const token = localStorage.getItem('token'); 
    if (token) {  
      config.headers['Authorization'] = `Bearer ${token}`; 
    }  
    return config;  
  },  
  (error) => {   
    return Promise.reject(error);  
  }  
);  
  
axiosInstance.interceptors.response.use(  
  (response) => {  
    return response;  
  },  
  (error) => {   
    console.error('Response error:', error.response);  
    return Promise.reject(error);  
  }  
);  
  
export default axiosInstance;  