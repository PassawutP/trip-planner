import { useEffect, useState } from "react";
import { HotelDto, LocationDto, Records, TripPlanDto, TripPlanDtoWithDetails } from "@/interface/interface";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Button, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { submitTrip } from "@/api/api";
import { RecordDto } from "@/interface/interface";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

type GeneratedPromptScreenProp = StackNavigationProp<RootStackParamList, 'GeneratedPrompt'>;

export default function GeneratedPrompt() {
    const navigation = useNavigation<GeneratedPromptScreenProp>();
    const route = useRoute();
    const { generatedPrompt } = route.params as { generatedPrompt: TripPlanDtoWithDetails };
    const [selectedHotel, setSelectedHotel] = useState<HotelDto | null>(null);
    
    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
    });

    const handleSelectHotel = (hotel: HotelDto) => {
        setSelectedHotel(hotel === selectedHotel ? null : hotel); // Toggle selection
    };

    const renderHotel: ListRenderItem<HotelDto> = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.horizontalContainer,
                item === selectedHotel ? darkTheme.selectedHotelContainer : lightTheme.hotelContainer,
            ]}
            onPress={() => handleSelectHotel(item)}
        >
            <Text style={item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription}>Hotel name: {item.hotelName}</Text>
            {/* <Text style={item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription}>Details: {item.description}</Text> */}
            <Text style={item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription}>Address: {item.hotelAddress}</Text>
            <Text style={item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription}>Price: {item.price}</Text>
            <Text style={item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription}>Rating: {item.rating}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        console.log(generatedPrompt)
    }, [])

    const renderContent: ListRenderItem<LocationDto> = ({ item }) => (
        <View style={[styles.card, lightTheme.card]}>
            <Text style={lightTheme.locationTitle}>{item.location}</Text>
            <Text style={lightTheme.textDescription}>{item.detail}</Text>
            <Text style={lightTheme.textInfo}>Date: {new Date(item.startDateTime).toISOString().substring(0, 10)}</Text>
            <Text style={lightTheme.textInfo}>Time: {new Date(item.startDateTime).toISOString().substring(11, 16)} - {new Date(item.endDateTime).toISOString().substring(11, 16)}</Text>
            <Text style={lightTheme.textInfo}>Entry cost: {item.entryCost}</Text>
        </View>
    );

    const submitPrompt = async () => {
        const recordDto: RecordDto = {
            title: `${generatedPrompt.details.region} Trip`,

            region: generatedPrompt.details.region,
        
            budget: Number(generatedPrompt.details.budget),
        
            startDate: new Date(generatedPrompt.details.tripStart),
        
            endDate: new Date(generatedPrompt.details.tripEnd),
        
            preference: generatedPrompt.details.preferences,

            prompt: {
                locations: generatedPrompt.locations,
                hotel: selectedHotel
            }
        };
        const userId = await AsyncStorage.getItem('userId');
        await submitTrip( recordDto );
        const trip = await AsyncStorage.getItem("storedContent")
        if (trip && userId) {
            const newTrip: Records[] = JSON.parse(trip)
            newTrip.push( {...recordDto, _id: userId} )
            await AsyncStorage.setItem("storedContent", JSON.stringify(newTrip))
        }
        else if (trip && userId){
            const newTrip: Records[] = []
            newTrip.push( {...recordDto, _id: userId} )
            await AsyncStorage.setItem("storedContent", JSON.stringify(newTrip))
        }
        navigation.navigate("Home")
    }

    if (!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={[{ flex: 1 }]}>
            <TouchableOpacity style={[styles.navigationBar, lightTheme.navigationBar]}>
                <Text style={lightTheme.navTitle}>Generated Content</Text>
            </TouchableOpacity>
            {generatedPrompt.locations && generatedPrompt.hotels && (
                <div>
                    <View style={styles.listContainer}>
                        <FlatList
                            data={generatedPrompt.locations}
                            renderItem={renderContent}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.flatlist}
                        />
                    </View>
                    <View style={[styles.horizontalListContainer, lightTheme.background]}>
                        <Text style={[lightTheme.sectionTitle, { paddingVertical: 10 }]}>Recommended Hotels</Text>
                        <FlatList
                            horizontal
                            data={generatedPrompt.hotels}
                            renderItem={renderHotel}
                            keyExtractor={(item, index) => index.toString()}
                            style={lightTheme.background}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </div>
            )}
            <Button title="Submit" onPress={submitPrompt} />
        </GestureHandlerRootView>
    );
}

const lightTheme = StyleSheet.create({
    background: {
        backgroundColor: "#FFF8E1",
    },
    navigationBar: {
        backgroundColor: "#FF9800",
    },
    navTitle: {
        color: "#FFFFFF",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
    },
    locationTitle: {
        color: "#FF9800",
    },
    textDescription: {
        color: "#555",
    },
    textInfo: {
        color: "#888",
    },
    hotelContainer: {
        backgroundColor: "#FFE0B2",
    },
    hotelDescription: {
        color: "#FF9800",
    },
    sectionTitle: {
        color: "#FF9800",
    },
});

const darkTheme = StyleSheet.create({
    selectedHotelContainer: {
        backgroundColor: "#424242",
        borderColor: "#FFB74D",
        borderWidth: 2,
    },
    hotelDescription: {
        color: "#FFCC80",
    },
});

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    horizontalListContainer: {
        paddingHorizontal: 20,
    },
    flatlist: {
        gap: 5,
    },
    card: {
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
        borderWidth: 1,
    },
    horizontalContainer: {
        height: 150,
        width: 200,
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 10,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
    },
    navigationBar: {
        height: 50,
        justifyContent: "center",
        paddingLeft: 15,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 5,
    },
    textTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },
    textDesc: {
        fontFamily: 'Roboto-Light',
        fontSize: 15
    },
    boxShadow: {
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 5,
    }
});
