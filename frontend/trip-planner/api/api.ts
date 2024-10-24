import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:3000/';

// Define the axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface JwtPayload {
    sub: string;
    name: string;
    username: string;
    email: string;
    iat: number;
    exp: number;
  }

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('auth/login', { email: email, password: password });
    const decodedToken: JwtPayload = jwtDecode(response.data.access_token);
    return {access_token: response.data.access_token, decodedToken: decodedToken};
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};


