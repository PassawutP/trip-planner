import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../_layout";
import { StyleSheet, Text, TextInput, TextInputChangeEventData, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts } from "expo-font";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { NativeSyntheticEvent } from 'react-native';

type GentripScreenProp = StackNavigationProp<RootStackParamList, 'Gentrip'>;

export default function Gentrip() {
    const navigation = useNavigation<GentripScreenProp>();
    const [firstForm, setFirstForm] = useState<boolean>(true);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [text, setText] = useState<string>("Kyoto");

    const [peopleNo, setPeopleNo] = useState();
    const [budget, setBudget] = useState();
    const [preferences, setPreferences] = useState<string[]>();

    const [fontsLoaded] = useFonts({
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
    });

    const onStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            const currentDate = selectedDate || startDate;
            setStartDate(currentDate);
            setEndDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
        }
        setShowStartPicker(false);
    };

    const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setEndDate(selectedDate);
        }
        setShowEndPicker(false);
    };

    const onTextChange = (event: NativeSyntheticEvent<TextInputChangeEventData>, selectedText?: string) => {
        if (selectedText) {
            setText(selectedText);
        }
    };
    
    useEffect( () => {
        startDate.setHours(0, 0, 0, 0)
    },[startDate])


    // limit the trip days to be 7 days
    useEffect(() => {
        const differenceInTime = endDate.getTime() - startDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (differenceInDays > 7) {
            const adjustedStartDate = new Date(startDate);
            adjustedStartDate.setDate(endDate.getDate() - 7);
            setStartDate(adjustedStartDate);
        }
        else {
            const adjustedStartDate = new Date(startDate);
            adjustedStartDate.setDate(endDate.getDate() - differenceInDays);
            setStartDate(adjustedStartDate);
        }
    },[endDate])

    return (
        <SafeAreaView>
            {firstForm ? (
                <View>
                    <TouchableOpacity style={styles.navigationBar}>
                        <AntDesign name="back" size={24} color="black" onPress={() => navigation.goBack()} />
                    </TouchableOpacity>
                    <View style={styles.center}>
                        <Text style={styles.text}>Where are you heading?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your message..."
                            value={text}
                            onChange={onTextChange}
                            multiline={true}
                        />
                    </View>
                    <View style={styles.horizontalCenter}>
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
                    <View style={styles.horizontalCenter}>
                        <Text style={styles.text}>To Date:</Text>
                        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                            <Text>{endDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={onEndDateChange}
                                minimumDate={startDate}
                                maximumDate={new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)}
                            />
                        )}
                    </View>
                    <View style={styles.horizontalCenter}>
                        <TouchableOpacity style={styles.button} onPress={() => setFirstForm(false)}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View>
                    <TouchableOpacity style={styles.navigationBar}>
                        <AntDesign name="back" size={24} color="black" onPress={() => navigation.goBack()} />
                    </TouchableOpacity>
                    {/* Additional content can go here when firstForm is false */}
                </View>
            )}
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
    text: {
        fontFamily: 'Roboto-Light',
        fontSize: 24
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        height: 100
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
        fontFamily: 'Roboto-Bold'
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
    }
});
