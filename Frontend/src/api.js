import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:8000", 
  withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token"); // Adjust storage as needed
      if (token) {
        config.headers.Authorization = `Token ${token}`; // Use 'Bearer' for JWT tokens
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  export default instance;