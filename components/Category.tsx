import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../styles/colores";
import { Ionicons } from "@expo/vector-icons";

interface CategoryProps {
    category: {
        name: string;
        icon: string;
    };
    isSelected: boolean;
    token: string; // Token as a string
    onPress: () => void;
}

const windowWidth = Dimensions.get("window").width;

const Category: React.FC<CategoryProps> = ({ category, isSelected, onPress, token }) => {
    // Determine if the button is enabled or disabled based on token
    const isDisabled = !token; // Disabled if token is empty or not present

    return (
        <TouchableOpacity
            disabled={isDisabled}
            style={[
                styles.button,
                isSelected ? styles.selectedButton : null,
                isDisabled ? styles.disabledButton : null // Apply disabled style if needed
            ]}
            onPress={isDisabled ? undefined : onPress} // Disable onPress if button is disabled
        >
            <Ionicons
                name={category.icon}
                size={36}
                color={
                    isSelected 
                    ? colors.color_white 
                    : colors.color_primary
                }
                style={styles.icon}
            />
            <Text style={[
                styles.text, 
                isSelected ? styles.selectedText : null,
                isDisabled ? styles.disabledText : null // Apply disabled text style if needed
            ]}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        padding: 16,
        marginHorizontal: 8,
        marginVertical: 8,
        borderRadius: 10,
        borderColor: colors.color_primary,
        borderWidth: 1,
        width: windowWidth / 4,
        height: windowWidth / 4,
        justifyContent: "center"
    },
    selectedButton: {
        backgroundColor: colors.color_primary,
    },
    disabledButton: {
        backgroundColor: colors.color_light_gray, // Adjust color for disabled state
        borderColor: colors.color_gray, // Optional: Adjust border color for disabled state
        opacity: 0.5, // Optional: Adjust opacity to indicate disabled state
    },
    text: {
        color: colors.color_primary,
        fontSize: 14,
        fontFamily: "Mulish-Medium",
        textAlign: "center"
    },
    selectedText: {
        color: colors.color_white,
        fontFamily: "Mulish-Medium",
    },
    disabledText: {
        color: colors.color_gray, 
    },
    icon: {
        flex: 1,
    },
});

export default Category;
