import { Image, StyleSheet, Platform, Button, TouchableOpacity, ListRenderItem, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../_layout';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { getAllRecords } from '@/api/api';
import { Records } from '@/interface/interface';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Colors } from '@/constants/Colors';

type HomeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProp>();
  const [content, setContent] = useState<Records[]>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  
  const clearAsyncStorage = async () => {
      await AsyncStorage.clear();
      navigation.navigate("Login")
  }

  const getTripDetails = async (item: Records) => {
    navigation.navigate("TripDetails", { records: item, edit: false});
  }

  const editTripDetails = async (item: Records) => {
    navigation.navigate("TripDetails", { records: item, edit: true})
  }

  useFocusEffect(
    useCallback(() => {
      const checkContent = async () => {
        const storedContent = await AsyncStorage.getItem("storedContent");
        if (!storedContent) {
          const getContent: Records[] = await getAllRecords();
          await AsyncStorage.setItem("storedContent", JSON.stringify(getContent));
          setContent(getContent);
        } else {
          setContent(JSON.parse(storedContent));
        }
      };
      checkContent();
    }, [])
  );

  const renderTrip: ListRenderItem<Records> = ({ item }) => {
    return (
    <TouchableOpacity key={item._id} style={styles.myTripContainer} onPress={() => {getTripDetails(item)}}>
      <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={[styles.text, {fontSize: 20}]}> {item.title} </Text>
        <View style={{ flexDirection: "row", gap: 5}}>
          <TouchableOpacity>
            <Ionicons name="location" size={25} color="black"/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="pencil" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.description}> Starting: {new Date(item.startDate).toISOString().substring(0, 10)}</Text>
      <Text style={styles.description}> Ending: {new Date(item.endDate).toISOString().substring(0, 10)}</Text>
      <Text style={styles.description}> Location: {item.region} </Text>
      <Text style={styles.description}> Preferences: {item.preference === null ? "None" : item.preference.join(", ")} </Text>
    </TouchableOpacity>
    )
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#e69e47', dark: '#1D3D47' }}
        headerImage={
        <View style={styles.headerContainer}>
          <Ionicons name="airplane" size={50} color="white" />
          <TouchableOpacity style={styles.logoutButton} onPress={() => clearAsyncStorage()}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
        }>
        <ThemedView style={styles.newTripContainer}>
          <View style={styles.verticalCenter}>
            <Text style={styles.text}>
              Your own personal trip planner
            </Text>
            <Text style={styles.description}>
              Make your gateway unforgettable. 
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
        {/* <Button title='Log out' onPress={clearAsyncStorage}></Button> */}
      </ParallaxScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    alignItems: 'center',
    alignContent: 'center'
  },
  logoutButton: {
    backgroundColor: 'white', // White background for the logout button
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  logoutText: {
    color: 'orange', // Orange text color
    fontFamily: 'OpenSans_Condensed-Bold',
    fontSize: 16, // Slightly smaller font size
  },
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
    width: 250,
    minHeight: 200,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 5
  },
  text: {
    fontFamily: 'OpenSans_Condensed-Bold',
    fontSize: 30
  },
  description: {
    fontFamily: 'OpenSans_SemiCondensed-Regular',
    fontSize: 16
  },
  newTripContainer: {
    flex: 1,
    flexDirection: "row",
    minHeight: 300
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
    fontFamily: 'OpenSans_Condensed-Bold'
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
