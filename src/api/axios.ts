import axios from 'axios'; 
import { getAccessToken, refreshToken } from '../utils/tokenManager'; 
import axiosRetry from 'axios-retry';
import AppStateUtil from '../utils/AppStateUtil';
import { msalInstance } from '../main';

const handleLogout = () => {
  AppStateUtil.removeAuthToken();
  msalInstance.logoutRedirect();
}

const axiosInstance = axios.create({  
  baseURL: import.meta.env.VITE_SKAN_APP_API_BASE_URL, 
  timeout: 10000, 
});  
  
// Request Interceptor  
axiosInstance.interceptors.request.use(  
  (config) => {  
    const token = getAccessToken();
    if (token) {  
      config.headers['authentication'] = `Bearer ${token}`; 
    }  
    return config;  
  },  
  (error) => {   
    return Promise.reject(error);  
  }  
);  
  
// axiosInstance.interceptors.response.use(  
//   (response) => {  
//     return response;  
//   },  
//   (error) => {   
//     console.error('Response error:', error.response);  
//     return Promise.reject(error);  
//   }  
// ); 
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
      // Refresh the token and retry the request
      const response:any = await refreshToken();
      
      axios.get(`${import.meta.env.VITE_SKAN_APP_API_BASE_URL}/authentication`, {
        headers: {
          'authentication': `${response}`
        }
      }).then((response) => {
        if (response && response?.status === 200) {
          const newAccessToken = response?.data?.accesstoken;
          
          AppStateUtil.storeAuthToken(newAccessToken);
          axios.defaults.headers.common['authentication'] = `${newAccessToken}`;
          originalRequest.headers['authentication'] = `${newAccessToken}`;
        
          
        }
        return null
      }).catch((e) => {
        handleLogout();
        console.log(e);
      })

    } catch (tokenRefreshError) {
      console.error('Token refresh failed:', tokenRefreshError);
      return Promise.reject(tokenRefreshError);
    }
    }

    return Promise.reject(error);
  }
); 
axiosRetry(axiosInstance, {
  retries: 5,
  retryDelay: (retryCount: number) => {
    return retryCount * 1000; // Time between retries (in ms)
  },
  retryCondition: (error: any) => {
    // Retry on network errors or 5xx HTTP responses
    return error.response && error.response.status === 401;  
  },
});
  
export default axiosInstance;  