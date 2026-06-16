import axios from 'axios';

// Api de conexão com o backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default api;