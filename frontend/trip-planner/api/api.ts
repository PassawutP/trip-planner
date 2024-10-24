import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/';

// Define the axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('auth/login', { email: email, password: password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};


