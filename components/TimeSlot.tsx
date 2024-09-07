import React, { useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle, TextStyle } from "react-native";
import { colors } from "../styles/Theme";

interface TimeSlotProps {
    time: { apptime: string };
    onPress: (time: string) => void;
    isSelected: boolean;
    isBooked: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, onPress, isSelected, isBooked }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        if (!isBooked) {
            onPress(time.apptime);
        }
    };

    const handlePressIn = () => {
        if (!isBooked) {
            Animated.spring(scaleValue, {
                toValue: 1.2,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePressOut = () => {
        if (!isBooked) {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isSelected && styles.selectedButton,
                isBooked && styles.bookedButton,
                { transform: [{ scale: scaleValue }] },
            ]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isBooked}
        >
            <Animated.Text
                style={[
                    styles.timeText,
                    isSelected && styles.selectedText,
                    isBooked && styles.bookedText,
                ]}
            >
                {time.apptime}
            </Animated.Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        margin: 8,
        borderRadius: 50,
        borderColor: colors.color_primary,
        borderWidth: 1,
    } as ViewStyle,
    timeText: {
        color: colors.color_primary,
        fontSize: 14,
        fontFamily: "Mulish-Light",
    } as TextStyle,
    bookedButton: {
        borderColor: colors.color_light_gray,
        backgroundColor: colors.color_light_gray,
    } as ViewStyle,
    bookedText: {
        color: colors.color_gray,
    } as TextStyle,
    selectedText: {
        color: colors.color_white,
    } as TextStyle,
    selectedButton: {
        backgroundColor: colors.color_primary,
    } as ViewStyle,
});

export default TimeSlot;
