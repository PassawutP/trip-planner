import Records from '@/interface/interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Header } from 'react-native/Libraries/NewAppScreen';
import MessageDto from '@/interface/interface'

const API_BASE_URL = 'http://10.0.2.2:3000/';

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

export const getAllRecords = async () => {
  try {
    const id = await AsyncStorage.getItem('userId');
    if (!id){
      console.error('No ID');
      return;
    }
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {  
      console.error('No token found');
      return;
    }
    const response = await api.get(`record/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Invalid token: ', error);
    throw error;
  }
}

export const genTrip = async (messageDto: MessageDto) => {
  try {
    if (!messageDto){
      console.error('MessageDto is null');
      return;
    }
    const token = await AsyncStorage.getItem('authToken');
    const response = await api.post(`prompt/generate/`, messageDto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  catch (error){
    console.error('Invalid token: ', error);
    throw error;
  }
}
