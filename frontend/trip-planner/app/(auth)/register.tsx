import { loginUser, registerUser } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Modal, Text, TextInput, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../_layout";
import { useFonts } from "expo-font";

type RegisterScreenProp = StackNavigationProp<RootStackParamList, 'Register'>;

export default function Register() {
    const navigation = useNavigation<RegisterScreenProp>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
    });

    const handleRegister = async () => {
        if (email && password && username) {
          const response = await registerUser(email, password, username);
    
          navigation.navigate('Login');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('authToken')
            if (token){
                navigation.navigate('Register');
            }
            setLoading(false);
        }
        checkAuth();
    }, [])

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>Registration Form</Text>
                <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                />
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
                <Text onPress={() => {navigation.navigate("Login")}}>
                    Want to login?
                </Text>
                <View style={[styles.center, { paddingTop: 20 }]}>
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
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
    center:{
        alignItems: "center"
    }
});
