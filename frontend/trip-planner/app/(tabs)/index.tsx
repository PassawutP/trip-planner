import { Image, StyleSheet, Platform, Button, TouchableOpacity, ListRenderItem, Text, View, ActivityIndicator } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../_layout';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getAllRecords } from '@/api/api';
import Records from '@/interface/interface';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';


type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {

  const [fontsLoaded] = useFonts({
    'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
    'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
  });

  const navigation = useNavigation<HomeScreenProp>();
  const [content, setContent] = useState<Records[]>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  
  const clearAsyncStorage = async() => {
      AsyncStorage.clear();
  }

  useEffect(() => {
    const checkContent = async () => {
      const storedContent = await AsyncStorage.getItem("storedContent");
      console.log(!storedContent);
      if (!storedContent){
        const getContent: Records[] = await getAllRecords();
        await AsyncStorage.setItem("storedContent", JSON.stringify(getContent));
        setContent(getContent);
      }
      else{
        setContent(JSON.parse(storedContent));
      }
    } 
    checkContent();
  }, [])

  const renderTrip: ListRenderItem<Records> = ({ item }) => {
    return (
    <TouchableOpacity key={item._id} style={styles.myTripContainer}>
      <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 20}}> {item.title} </Text>
      <Text style={{ fontFamily: 'Roboto-Light', fontSize: 15}}> Starting - {item.startDate.substring(0, 10)}</Text>
      <Text style={{ fontFamily: 'Roboto-Light', fontSize: 15}}> Ending - {item.endDate.substring(0, 10)}</Text>
      <Text style={{ fontFamily: 'Roboto-Light', fontSize: 15}}> Location: {item.region} </Text>
      <Text style={{ fontFamily: 'Roboto-Light', fontSize: 15}}> Preferences: {item.preference === null ? "None" : item.preference.join(" ,")} </Text>
    </TouchableOpacity>
    )
  }
  if (!fontsLoaded){
    return (<ActivityIndicator size="large" color="#0000ff" />);
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
        }>
        <ThemedView style={styles.newTripContainer}>
          <View style={styles.verticalCenter}>
            <Text style={styles.text}>
              Your own personalized Trip Planner
            </Text>
            <Text>
              Make your gateway unforgettable
            </Text>
            <Text>
              Find a place to breathe, laugh, and truly live
            </Text>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Gentrip")}>
                <Text style={styles.buttonText}>Start your journey</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.center}>
            <Image source={require('../../assets/images/travel-clip-art.jpg')} style={styles.image}>
            </Image>
          </View>
        </ThemedView>
        <View>
          <View style={styles.line} />
        </View>
        <Text style={styles.text}> My trip </Text>
        <FlatList horizontal data={content} renderItem={renderTrip}></FlatList>
        <Button title='Clear token' onPress={clearAsyncStorage}></Button>
        <Button title="Explore" onPress={() => navigation.navigate("Explore")}></Button>
      </ParallaxScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  myTripContainer: {
    width: 200,
    height: 300,
    shadowColor: "#000",
    shadowOffset: {
        width: 2,
        height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: "grey",
    borderWidth: 1
  },
  text: {
    fontFamily: 'Roboto-Medium',
    fontSize: 30
  },
  newTripContainer: {
    flex: 1,
    flexDirection: "row",
    minHeight: 250,
    marginHorizontal: 20
  },
  image: {
    width: 150,
    height: 200,
  },
  line: {
    marginHorizontal: 100,
    height: 1,
    backgroundColor: '#000'
  },
  verticalCenter: {
    flex: 1, 
    justifyContent: "center"
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    maxWidth: 200,
    paddingVertical: 10,
    backgroundColor: "#ffa500",
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Bold'
  },
  shadowBox: {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
