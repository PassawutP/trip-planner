import { LocationDto, Records } from "@/interface/interface";
import { StackNavigationProp } from "@react-navigation/stack";
import { SectionList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { RootStackParamList } from "../_layout";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";

type TripDetailsScreenProp = StackNavigationProp<RootStackParamList, 'TripDetails'>;

export default function TripDetails({}) {
    const navigation = useNavigation<TripDetailsScreenProp>();
    const route = useRoute();
    const { records } = route.params as { records: Records };

    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    // Grouping the data by date
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

    // Toggle section expansion
    const toggleSection = (title: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(title)) {
                newSet.delete(title);
            } else {
                newSet.add(title);
            }
            return newSet;
        });
    };

    // Render the section header
    const renderSectionHeader = ({ section }: { section: { title: string, data: LocationDto[] } }) => (
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(section.title)}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
        </TouchableOpacity>
    );

    // Render each location
    const renderItem: ListRenderItem<LocationDto> = ({ item }) => (
        <View style={[styles.card, lightTheme.card]}>
            <Text style={[lightTheme.locationTitle, styles.textTitle]}>{item.location}</Text>
            <Text style={[lightTheme.textDescription, styles.textDesc]}>{item.detail}</Text>
            <Text style={[lightTheme.textInfo, styles.textDesc]}>Date: {new Date(item.startDateTime).toISOString().substring(0, 10)}</Text>
            <Text style={[lightTheme.textInfo, styles.textDesc]}>Time: {new Date(item.startDateTime).toISOString().substring(11, 16)} - {new Date(item.endDateTime).toISOString().substring(11, 16)}</Text>
            <Text style={[lightTheme.textInfo, styles.textDesc]}>Entry cost: {item.entryCost}</Text>
        </View>
    );

    // Group locations by date
    const groupedData = groupByDate(records.prompt.locations);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <TouchableOpacity style={styles.navigationBar}>
                    <AntDesign name="back" size={24} color="black" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                <SectionList
                    sections={groupedData}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    keyExtractor={(item, index) => item.location + index}
                    contentContainerStyle={styles.flatlist}
                    extraData={expandedSections}
                />
            </View>
            <View style={[styles.horizontalListContainer, {backgroundColor: "#8f8f8f"}]}>
                { records.prompt.hotel &&
                    <View>
                        <Text style={[lightTheme.sectionTitle, styles.textTitle]}>Hotel</Text>
                        <View
                            style={[lightTheme.hotelContainer]}
                        >
                            <Text style={[lightTheme.hotelDescription, styles.textDesc]}>{records.prompt.hotel?.hotelName}</Text>
                            <Text style={[lightTheme.hotelDescription, styles.textDesc]}>Hotel Address: {records.prompt.hotel?.hotelAddress}</Text>
                            <Text style={[lightTheme.hotelDescription, styles.textDesc]}>Price: {records.prompt.hotel?.price}</Text>
                            <Text style={[lightTheme.hotelDescription, styles.textDesc]}>Rating: {records.prompt.hotel?.rating}</Text>
                        </View>
                    </View>
                }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    hotelName: {
        fontFamily: 'OpenSans_Condensed-Bold',
        fontSize: 16
    },
    navigationBar: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: 30,
        justifyContent: "center",
        paddingLeft: 15
    },
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
    sectionHeader: {
        padding: 15,
        backgroundColor: "#FF9800",
    },
    sectionTitle: {
        fontFamily: 'OpenSans_Condensed-Bold',
        fontSize: 20,
        color: "white",
    },
    textTitle: {
        fontFamily: 'OpenSans_Condensed-Bold',
        fontSize: 20
    },
    textDesc: {
        fontFamily: 'OpenSans_Condensed-Medium',
        fontSize: 15
    },
    boxShadow: {
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: 200,
        height: 200,
    },
});

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
        backgroundColor: "#FFF3E0",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    hotelDescription: {
        color: "#333", // Dark gray for better contrast
    },
    sectionTitle: {
        color: "white",
    },
});
