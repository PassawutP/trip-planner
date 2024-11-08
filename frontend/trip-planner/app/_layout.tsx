import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './(auth)/login';
import HomeScreen from './(tabs)';
import Explore from './(tabs)/explore';
import Gentrip from './(tabs)/gentrip';
import { TripPlanDto, TripPlanDtoWithDetails } from '@/interface/interface';
import GeneratedPrompt from './(tabs)/generatedPrompt';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Explore: undefined;
  Gentrip: undefined;
  GeneratedPrompt: { generatedPrompt: TripPlanDto };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Explore" component={Explore} />
        <Stack.Screen name="Gentrip" component={Gentrip} />
        <Stack.Screen name="GeneratedPrompt" component={GeneratedPrompt} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
