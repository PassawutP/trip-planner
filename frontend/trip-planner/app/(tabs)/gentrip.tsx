import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../_layout";
import { ActivityIndicator, StyleSheet, Text, TextInput, TextInputChangeEventData, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts } from "expo-font";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeSyntheticEvent } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { genTrip } from "@/api/api";
import { MessageDto, TripPlanDto, TripPlanDtoWithDetails } from '@/interface/interface';

type GentripScreenProp = StackNavigationProp<RootStackParamList, 'Gentrip'>;

interface Option {
    label: string;
    value: string;
}

interface OptionInt {
    label: string;
    value: number;
}

export default function Gentrip() {
    const navigation = useNavigation<GentripScreenProp>();
    // const [firstForm, setFirstForm] = useState<boolean>(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });
    
    
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [showStartTimePicker, setStartTimePicker] = useState(false);
    const [region, setRegion] = useState<string>();

    const [peopleNo, setPeopleNo] = useState<string | null>(null);
    const [budget, setBudget] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<string[] | null>(null);
    const [duration, setDuration] = useState<number| null>(null);

    const [openPeople, setOpenPeople] = useState(false);
    const [openBudget, setOpenBudget] = useState(false);
    const [openPreference, setOpenPreference] = useState(false);
    const [openDuration, setOpenDuration] = useState(false);

    const [itemPeopleNo, setItemPeopleNo] = useState<Option[]>([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
      ]);
    const [itemBudget, setItemBudget] = useState<Option[]>([
        {label: 'Low', value: '10000'},
        {label: 'Medium', value: '30000'},
        {label: 'High', value: '50000'},
      ]);
    const [itempreferences, setItemPreferences] = useState<Option[]>([
        {label: 'Beach', value: 'beach'},
        {label: 'Mountain', value: 'mountain'},
        {label: 'Photography', value: 'photography'},
      ]);
    const [itemDuration, setItemDuration] = useState<OptionInt[]>([
        {label: '1', value: 1},
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4},
        {label: '5', value: 5},
    ])

    const [loading, setLoading] = useState(true);
    
    const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            const currentDate = selectedDate || startDate;
            setStartDate(currentDate);
            // setEndDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
        }
        setShowStartPicker(false);
    };

    // const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    //     if (selectedDate) {
    //         setEndDate(selectedDate);
    //     }
    //     setShowEndPicker(false);
    // };

    const onStartTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setStartTime(selectedDate);
        }
        setStartTimePicker(false);
    };
    
    
    // const next = () => {
    //     if (region && startDate && endDate){
    //         setFirstForm(false)
    //     }
    // };

    const submit = async () => { 
        if (region && startDate && endDate && peopleNo && budget && preferences){
            setLoading(false);
            const messageDto: MessageDto = {
                region: region,
                budget: budget,
                tripStart: startDate.toISOString(),
                tripEnd: endDate.toISOString(),
                peopleNo: peopleNo,
                preferences: preferences
            }
            try{
                const generatedPrompt: TripPlanDto = await genTrip(messageDto);
                const generatedPromptWithDetails: TripPlanDtoWithDetails = { ...generatedPrompt, details: messageDto};
                // const generatedPromptWithDetails: TripPlanDtoWithDetails = {...generatedPrompt, details: messageDto};
                if (generatedPrompt){
                    navigation.navigate("GeneratedPrompt", { generatedPrompt: generatedPromptWithDetails })
                }
                else {
                    console.error("Error!")
                }
            } catch (error) {
                console.error('Error in genTrip:', error);
                throw error;
            }
        }
    }

    useEffect( () => {
        startDate.setHours(0, 0, 0, 0)
    },[startDate])


    // limit the trip days to be 7 days
    // useEffect(() => {
    //     const differenceInTime = endDate.getTime() - startDate.getTime();
    //     const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    //     if (differenceInDays > 7) {
    //         const adjustedStartDate = new Date(startDate);
    //         adjustedStartDate.setDate(endDate.getDate() - 7);
    //         setStartDate(adjustedStartDate);
    //     }
    //     else {
    //         const adjustedStartDate = new Date(startDate);
    //         adjustedStartDate.setDate(endDate.getDate() - differenceInDays);
    //         setStartDate(adjustedStartDate);
    //     }
    // },[endDate])

    useEffect(() => {
        if (startDate && duration){
            const adjustedEndDate = new Date(startDate);
            adjustedEndDate.setDate(startDate.getDate() + duration);
            setEndDate(adjustedEndDate);
        }
    }, [duration])

    return (
        loading ?
        <SafeAreaView>
            <TouchableOpacity style={styles.navigationBar}>
                <AntDesign name="back" size={24} color="black" onPress={() => navigation.goBack()} />
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 20, gap: 10 }}>
                <View>
                    <Text style={styles.text}>Region</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your region..."
                        value={region}
                        onChangeText={(text) => setRegion(text)}
                        multiline={true}
                    />
                </View>
                <View style={{ zIndex: 3 }}>
                    <Text style={styles.text}>Number of people</Text>
                    <DropDownPicker
                        open={openPeople}
                        value={peopleNo}
                        items={itemPeopleNo}
                        setOpen={setOpenPeople}
                        setValue={setPeopleNo}
                        setItems={setItemPeopleNo}
                        placeholder={'Choose number of people'}
                        multiple={false}
                    />
                </View>
                <View style={{ zIndex: 2 }}>
                    <Text style={styles.text}>Type of budget</Text>
                    <DropDownPicker
                        open={openBudget}
                        value={budget}
                        items={itemBudget}
                        setOpen={setOpenBudget}
                        setValue={setBudget}
                        setItems={setItemBudget}
                        placeholder={'Choose type of budget'}
                        multiple={false}
                    />
                </View>
                <View style={{ zIndex: 1 }}>
                    <Text style={styles.text}>Pick perference(s)</Text>
                    <DropDownPicker
                        open={openPreference}
                        value={preferences}
                        items={itempreferences}
                        setOpen={setOpenPreference}
                        setValue={setPreferences}
                        setItems={setItemPreferences}
                        placeholder={'Choose type of perference(s)'}
                        multiple={true}
                    />
                </View>
                <View>
                    <Text style={styles.text}>From Date:</Text>
                    <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                        <Text>{startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={onStartDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                </View>
                <View>
                    <Text style={styles.text}>Starting Time: </Text>
                    <TouchableOpacity onPress={() => setStartTimePicker(true)}>
                        <Text>{startTime.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {showStartTimePicker && (
                        <View style={{ borderColor: "black", borderWidth: 2}}>
                            <DateTimePicker
                                value={startTime}
                                mode="time"
                                display="default"
                                onChange={onStartTime}
                            />
                        </View>
                    )}
                </View>
                <View>
                    <Text style={styles.text}>Duration:</Text>
                    <DropDownPicker
                        open={openDuration}
                        value={duration}
                        items={itemDuration}
                        setOpen={setOpenDuration}
                        setValue={setDuration}
                        setItems={setItemDuration}
                        placeholder={'Choose duration'}
                        multiple={false}
                    />
                    {/* <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                        <Text>{endDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showEndPicker && (
                        <View style={{ borderColor: "black", borderWidth: 2}}>
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={onEndDateChange}
                                minimumDate={startDate}
                                maximumDate={new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)}
                            />
                        </View>
                    )} */}
                    {/* <Text> {endDate.toLocaleDateString()} </Text> */}
                </View>
                <View style={styles.horizontalCenter}>
                    <TouchableOpacity style={styles.button} onPress={submit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>:
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FF9800" />
            <Text style={styles.text}>Loading...</Text>
        </View>
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
    text: {
        fontFamily: 'OpenSans_Condensed-Bold',
        fontSize: 20
    },
    horizontalCenter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 100,
        gap: 20
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
        fontFamily: 'OpenSans_Condensed-Bold',
    },
    input: {
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderColor: "black",
        borderWidth: 1,
        minWidth: 200,
        height: 50,
        paddingHorizontal: 10
    },
    centerPadding: {
        justifyContent: "center",
        alignItems: "center",
        height: 100,
        marginHorizontal: 20
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF8E1", // Light orange background
    },
});
