import { LocationDto, Records } from "@/interface/interface";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { RootStackParamList } from "../_layout";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";


type TripDetailsScreenProp = StackNavigationProp<RootStackParamList, 'TripDetails'>;

export default function TripDetails({}) {

    const navigation = useNavigation<TripDetailsScreenProp>();
    const route = useRoute();
    const { records } = route.params as { records: Records };
    
    const renderContent: ListRenderItem<LocationDto> = ({ item }) => (
        <View style={[styles.card, lightTheme.card]}>
            <Text style={lightTheme.locationTitle}>{item.location}</Text>
            <Text style={lightTheme.textDescription}>{item.detail}</Text>
            <Text style={lightTheme.textInfo}>Date: {new Date(item.startDateTime).toISOString().substring(0, 10)}</Text>
            <Text style={lightTheme.textInfo}>Time: {new Date(item.startDateTime).toISOString().substring(11, 16)} - {new Date(item.endDateTime).toISOString().substring(11, 16)}</Text>
            <Text style={lightTheme.textInfo}>Entry cost: {item.entryCost}</Text>
        </View>
    );
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <TouchableOpacity style={styles.navigationBar}>
                    <AntDesign name="back" size={24} color="black" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
            </View>
            <View style={styles.listContainer}>
                <FlatList
                    data={records.prompt.locations}
                    renderItem={renderContent}
                    contentContainerStyle={styles.flatlist}
                />
            </View>
            <View style={[styles.horizontalListContainer, lightTheme.background]}>
                { records.prompt.hotel &&
                    <div>
                        <Text style={[lightTheme.sectionTitle]}>Hotel</Text>
                        <View
                            style={[
                                styles.horizontalContainer,
                                lightTheme.hotelContainer,
                            ]}
                        >
                            <Text style={lightTheme.hotelDescription}>Hotel name: {records.prompt.hotel?.hotelName}</Text>
                            <Text style={lightTheme.hotelDescription}>Description: {records.prompt.hotel?.description}</Text>
                            <Text style={lightTheme.hotelDescription}>Hotel Address: {records.prompt.hotel?.hotelAddress}</Text>
                            <Text style={lightTheme.hotelDescription}>Price: {records.prompt.hotel?.price}</Text>
                            <Text style={lightTheme.hotelDescription}>Rating: {records.prompt.hotel?.rating}</Text>
                            {/* <Image source={{ uri: records.prompt.hotel.imageUrl}} style={styles.image}/> */}
                        </View>
                    </div>
                }
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    navigationBar: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
    horizontalContainer: {
        height: 150,
        width: 300,
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 10,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
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
        backgroundColor: "#FFE0B2",
    },
    hotelDescription: {
        color: "#FF9800",
    },
    sectionTitle: {
        color: "#FF9800",
    },
});