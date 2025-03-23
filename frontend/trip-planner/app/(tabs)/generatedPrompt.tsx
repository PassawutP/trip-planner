import { useEffect, useState } from "react";
import { HotelDto, LocationDto, Records, TripPlanDtoWithDetails, RecordDto } from "@/interface/interface";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, ListRenderItem, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { submitTrip } from "@/api/api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { TopNavigateBar } from "@/components/TopNavigateBar";

type GeneratedPromptScreenProp = StackNavigationProp<RootStackParamList, 'GeneratedPrompt'>;

export default function GeneratedPrompt() {
    const navigation = useNavigation<GeneratedPromptScreenProp>();
    const route = useRoute();
    const { generatedPrompt } = route.params as { generatedPrompt: TripPlanDtoWithDetails };
    const [selectedHotel, setSelectedHotel] = useState<HotelDto | null>(null);
    const [ currentTab, setCurrentTab ] = useState(0);

    const handleSelectHotel = (hotel: HotelDto | null) => {
        setSelectedHotel(hotel === selectedHotel ? null : hotel); // Toggle selection
    };

    // Grouping locations by date
    const groupByDate = (locations: LocationDto[]) => {
        const grouped: { title: string, data: LocationDto[] }[] = [];
        const dateMap: { [key: string]: LocationDto[] } = {};

        locations.forEach(item => {
            const date = new Date(item.startDateTime).toISOString().substring(0, 10); // Extract date (YYYY-MM-DD)
            if (!dateMap[date]) dateMap[date] = [];
            dateMap[date].push(item);
        });

        let dayCount = 1;
        for (const [date, items] of Object.entries(dateMap)) {
            grouped.push({ title: `Day ${dayCount} (${date})`, data: items });
            dayCount++;
        }

        return grouped;
    };

    const renderLocation: ListRenderItem<LocationDto> = ({ item }) => (
        <View style={[styles.card, lightTheme.card]}>
            <Text style={[lightTheme.locationTitle, styles.textTitle]}>{item.location}</Text>
            <Text style={[lightTheme.textDescription, styles.textDesc]}>{item.detail}</Text>
            <Text style={[lightTheme.textInfo, styles.textDesc]}>Date: {new Date(item.startDateTime).toISOString().substring(0, 10)}</Text>
            <Text style={[lightTheme.textInfo, styles.textDesc]}>Time: {new Date(item.startDateTime).toISOString().substring(11, 16)} - {new Date(item.endDateTime).toISOString().substring(11, 16)}</Text>
            <Text style={[lightTheme.textInfo, styles.textDesc]}>Entry cost: {item.entryCost}</Text>
        </View>
    );

    const renderHotel: ListRenderItem<HotelDto> = ({ item }) =>
        {   if (item.hotelName != "Not Selecting Any Hotel Currently"){
            return (<TouchableOpacity
                style={[
                    styles.horizontalContainer,
                    item === selectedHotel ? darkTheme.selectedHotelContainer : lightTheme.hotelContainer,
                    { marginVertical: 10}
                ]}
                onPress={() => handleSelectHotel(item)}
            >
                <Text style={[item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription, styles.hotelName]}>{item.hotelName}</Text>
                <Text style={item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription}>Address: {item.hotelAddress}</Text>
                <Text style={item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription}>Price: {item.price}</Text>
                <Text style={item === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription}>Rating: {item.rating}</Text>
            </TouchableOpacity>)
            }
            else {
                return (<TouchableOpacity
                    style={[
                        styles.horizontalContainer,
                        null === selectedHotel ? darkTheme.selectedHotelContainer : lightTheme.hotelContainer,
                    ]}
                    onPress={() => handleSelectHotel(null)}
                >
                    <Text style={[null === selectedHotel ? darkTheme.hotelDescription : lightTheme.hotelDescription, styles.hotelName]}>{item.hotelName}</Text>
                </TouchableOpacity>)
            }
        };

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
        await submitTrip(recordDto);

        const trip = await AsyncStorage.getItem("storedContent");
        if (trip && userId) {
            const newTrip: Records[] = JSON.parse(trip);
            newTrip.push({ ...recordDto, _id: userId });
            await AsyncStorage.setItem("storedContent", JSON.stringify(newTrip));
        } else if (!trip && userId) {
            const newTrip: Records[] = [{ ...recordDto, _id: userId }];
            await AsyncStorage.setItem("storedContent", JSON.stringify(newTrip));
        }

        navigation.navigate("Home");
    };

    // Grouped location data
    const groupedData = groupByDate(generatedPrompt.locations);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* <TouchableOpacity style={styles.navigationBar}>
                <AntDesign name="back" size={24} color="black" onPress={() => navigation.navigate("Home")} />
            </TouchableOpacity> */}
            <TouchableOpacity style={[styles.navigationBar, lightTheme.navigationBar]}>
                <Text style={[lightTheme.navTitle, styles.textTitle]}>Generated Content</Text>
            </TouchableOpacity>
            <TopNavigateBar labels={["Locations", "Hotels", "Checklist"]} current={currentTab} onTabChange={setCurrentTab}/>
            {generatedPrompt.locations && generatedPrompt.hotels ? (
                currentTab === 0 ? (
                    <>
                        <View style={[styles.listContainer, {height: "100%"}]}>
                            <SectionList
                                sections={groupedData}
                                renderItem={renderLocation}
                                renderSectionHeader={({ section }) => (
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>{section.title}</Text>
                                    </View>
                                )}
                                keyExtractor={(item, index) => item.location + index}
                                contentContainerStyle={styles.flatlist}
                            />
                        </View>
                    </>
                ) : currentTab === 1 ? (
                    <View style={[{ paddingBottom: 10, paddingHorizontal: 10, flex: 1 }]}>
                        <Text style={[styles.textTitle, { paddingVertical: 10 }]}>Recommended Hotels</Text>
                        <FlatList
                            data={[...generatedPrompt.hotels, { hotelName: "Not Selecting Any Hotel Currently" } as HotelDto]}
                            renderItem={renderHotel}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                ) : currentTab === 2 ? (
                    <View style={{ flex: 1, paddingTop: 50}}>
                        <View style={styles.center}>
                            <Text style={styles.textTitle}>Stay tuned for this function!</Text>
                        </View>
                    </View>
                ) : null
            ):
             <View style={styles.horizontalCenter}>
                <View style={styles.center}>
                    <Text style={styles.textTitle}>Error! There is a problem with prompt generation</Text>
                </View>
            </View>}
            <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                    <View style={{ flex: 1 }} >
                        <Button title="Back" color="#424242" onPress={() => navigation.navigate("Home")} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button title="Submit" color="#424242" onPress={submitPrompt} />
                    </View>
                </View>
            </View>
            
        </GestureHandlerRootView>
    );
}

const lightTheme = StyleSheet.create({
    background: {
        backgroundColor: "#999799",
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
        backgroundColor: "#FFFFFF",
    },
    hotelDescription: {
        color: Colors.themedColor.black,
        fontFamily: 'OpenSans_SemiCondensed-Medium',
    },
    sectionTitle: {
        color: "#FFFFFF",
    },
});

const darkTheme = StyleSheet.create({
    selectedHotelContainer: {
        backgroundColor: "#424242",
        borderColor: "#FFB74D",
        borderWidth: 2,
    },
    hotelDescription: {
        fontFamily: 'OpenSans_Condensed-Medium',
        color: "#FFCC80",
    },
});

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    sectionHeader: {
        padding: 15,
        backgroundColor: "#FF9800",
    },
    sectionTitle: {
        fontFamily: 'OpenSans_Condensed-Bold',
        fontSize: 20,
        color: "white",
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
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        padding: 15,
        borderRadius: 10,
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
    },
    textTitle: {
        fontSize: 20,
        fontFamily: 'OpenSans_Condensed-Bold',
    },
    textDesc: {
        fontFamily: 'OpenSans_Condensed-Medium',
        fontSize: 15
    },
    flatlist: {
        gap: 5,
    },
    hotelName: {
        fontFamily: 'OpenSans_Condensed-Bold',
        fontSize: 16
    },
    horizontalCenter:{
        height: 500,
        justifyContent: "center",
        gap: 10
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    }
});
