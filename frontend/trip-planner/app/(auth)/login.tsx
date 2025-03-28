import { loginUser } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Modal, Text, TextInput, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../_layout";
import { useFonts } from "expo-font";

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
    const navigation = useNavigation<LoginScreenProp>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isAuth, setIsAuth] = useState<boolean>(); 
    const [loading, setLoading] = useState<boolean>(true);

    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
    });

    const handleLogin = async () => {
        if (email && password) {
          try {
            const jwtToken = await loginUser(email, password);
            await AsyncStorage.setItem('authToken', jwtToken.access_token);
            await AsyncStorage.setItem('userId', jwtToken.decodedToken.sub);
      
            setEmail('');
            setPassword('');
      
            navigation.navigate('Home');
          } catch (error) {
            console.error('Login error:', error); 
            Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
          }
        } else {
          Alert.alert('Missing Information', 'Please enter both email and password.');
        }
      };
      

    const navigateRegister = () => {
        navigation.navigate('Register');
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                navigation.navigate('Home');
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>Login Form</Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TouchableOpacity onPress={navigateRegister}>
                    <Text>Register new account?</Text>
                </TouchableOpacity>
                <View style={[styles.center, { paddingTop: 20 }]}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );   
}

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
    },
    input: {
      width: '100%',
      padding: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      marginVertical: 10,
      borderRadius: 5,
    },
    button: {
        width: '80%',
        maxWidth: 100,
        paddingVertical: 10,
        backgroundColor: "#ffa500",
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto-Medium'
    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontSize: 24
    },
    center: {
        alignItems: "center"
    }
});
