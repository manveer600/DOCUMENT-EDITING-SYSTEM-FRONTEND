import axios from "axios";

const BASE_URL = 'https://document-editing-system-backend2.onrender.com/';

const axiosInstance = axios.create(); 
axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;