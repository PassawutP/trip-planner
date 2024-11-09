import { Records, MessageDto, JwtPayload, ConfirmTripPlanDto, RecordDto } from '@/interface/interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Header } from 'react-native/Libraries/NewAppScreen';

const API_BASE_URL = 'http://10.0.2.2:3000/';

// Define the axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


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
  console.log("Try")
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
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await api.post(`prompt/generate`, messageDto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error in genTrip:', error);
    throw error;
  }
}

export const submitTrip = async (recordDto: RecordDto) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const userId = await AsyncStorage.getItem('userId');
    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await api.post(`record/post/${userId}`, recordDto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error in genTrip:', error);
    throw error;
  }
}