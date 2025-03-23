import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

export function TopNavigateBar({ labels, current, onTabChange }: { labels: string[], current: number, onTabChange: (index: number) => void }) {
    const underlinePosition = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(underlinePosition, {
            toValue: current * (width / labels.length),
            useNativeDriver: false,
        }).start();
    }, [current]);

    return (
        <View style={styles.bar} pointerEvents="box-none">
            {labels.map((label, index) => (
                <TouchableOpacity key={label} style={styles.labelContainer} onPress={() => onTabChange(index)}>
                    <Text style={[styles.text, index === current ? styles.activeText : {}]}>{label}</Text>
                </TouchableOpacity>
            ))}

            {/* Animated Underline */}
            <Animated.View
                style={[
                    styles.underline,
                    { left: underlinePosition, width: width / labels.length },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        position: "relative",
    },
    labelContainer: {
        flex: 1,
        alignItems: "center",
    },
    text: {
        fontFamily: "OpenSans_Condensed-Bold",
        fontSize: 16,
        color: "#777",
    },
    activeText: {
        color: "black",
        fontWeight: "bold",
    },
    underline: {
        position: "absolute",
        bottom: 0,
        height: 3,
        backgroundColor: Colors.themedColor.orange,
        borderRadius: 2,
        zIndex: -1, 
    },
});
