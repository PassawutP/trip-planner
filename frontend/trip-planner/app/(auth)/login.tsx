import { loginUser } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet } from "react-native";
import { Modal, Text, TextInput, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../_layout";

type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
    const navigation = useNavigation<LoginScreenProp>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isAuth, setIsAuth] = useState<boolean>(); 
    const [loading, setLoading] = useState<boolean>(true);

    const handleLogin = async () => {
        if (email && password) {
          const jwtToken = await loginUser(email, password);
          await AsyncStorage.setItem('authToken', jwtToken.access_token);
          await AsyncStorage.setItem('userId', jwtToken.decodedToken.sub);
    
          setEmail('');
          setPassword('');

          navigation.navigate('Home');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('authToken')
            if (token){
                navigation.navigate('Home');
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
                <Text>Login</Text>
                <TextInput
                placeholder="Username"
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
                <Button title="Login" onPress={handleLogin} />
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
      alignItems: 'center',
    },
    input: {
      width: '100%',
      padding: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      marginVertical: 10,
      borderRadius: 5,
    },
});
