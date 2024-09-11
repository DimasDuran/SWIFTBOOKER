import React from "react";
import { colors } from "../styles/Theme";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

interface CardAppointmentProps {
    appointment: {
        appType: string;
        bookedDate: string;
        bookedTime: string;
    };
    serviceInfo: {
        firstName: string;
        lastName: string;
    };
    onPressCancel: () => void;
    onPress: () => void;
}

export default function CardAppointment({
    appointment,
    serviceInfo,
    onPressCancel,
    onPress,
}: CardAppointmentProps) {
    const { appType, bookedDate, bookedTime } = appointment;
    const fullName = `${serviceInfo.firstName} ${serviceInfo.lastName}`;

    const formattedDate = new Date(bookedDate);
    const day = formattedDate.getDate();
    const month = formattedDate.toLocaleString("default", { month: "short" });

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.date_container}>
                    <View>
                        <Text style={styles.date_text}>{day}</Text>
                    </View>
                    <View>
                        <Text style={styles.month_text}>{month}</Text>
                    </View>
                </View>
                <View style={styles.info_container}>
                    <Text style={styles.appType}>
                       Service : {appType}
                    </Text>
                    <Text style={styles.time}>Hour :{bookedTime}</Text>
                </View>
                <TouchableOpacity style={styles.icon_container}>
                    <Menu>
                        <MenuTrigger>
                            <Entypo
                                name="dots-three-vertical"
                                size={20}
                                color={colors.color_light_gray}
                                onPress={onPress}
                            />
                        </MenuTrigger>
                        <MenuOptions customStyles={{ optionsContainer: styles.menuOptions }}>
                            <MenuOption
                                onSelect={onPressCancel}
                                customStyles={{ optionWrapper: styles.menuOption }}
                            >
                                <Text style={styles.menuOptionText}>Cancel</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 20,
        marginHorizontal: 24,
        marginBottom: 16,
        paddingVertical: 8,
        backgroundColor: colors.color_white,
        shadowColor: colors.color_gray,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        elevation: 6,
    },
    date_container: {
        backgroundColor: '#000',
        marginHorizontal: 8,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.color_gray,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    info_container: {
        flex: 1,
        justifyContent: "center",
    },
    icon_container: {
        margin: 16,
        justifyContent: "flex-start",
    },
    date_text: {
        fontFamily: "Mulish-Medium",
        fontSize: 34,
        color: colors.color_white,
    },
    month_text: {
        fontFamily: "Mulish-Medium",
        fontSize: 18,
        color: colors.color_white,
    },
    appType: {
        fontFamily: "Mulish-Medium",
        fontSize: 18,
        padding: 8,
    },
    time: {
        fontFamily: "Mulish-Medium",
        fontSize: 14,
        padding: 8,
        color: colors.color_gray,
    },
    menuOptions: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // For Android shadow
    },
    menuOption: {
        paddingVertical: 6,
        paddingHorizontal: 15,
    },
    menuOptionText: {
        fontSize: 16,
        color: '#333',
    },
});
