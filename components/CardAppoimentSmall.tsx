import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/colores';

interface ServiceInfo {
    firstName: string;
    lastName: string;
}

interface Appointment {
    appType: string;
    bookedDate: string;
    bookedTime: string;
}

interface CardAppointmentSmallProps {
    appointment: Appointment;
    serviceInfo?: ServiceInfo; // Optional serviceInfo
    onPress: () => void; 
}

const CardAppointmentSmall: React.FC<CardAppointmentSmallProps> = (props) => {
    const { appType, bookedDate, bookedTime } = props.appointment;
    const fullName = props.serviceInfo
        ? `${props.serviceInfo.firstName}`
        : 'Service Provider'; // Fallback when serviceInfo is undefined

    const formattedDate = new Date(bookedDate);
    const day = formattedDate.getDate();
    const month = formattedDate.toLocaleString("default", { month: "short" });

    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.container}>
                <View style={styles.info_container}>
                    <Text style={styles.appType}>{appType}</Text>
                    <Text style={styles.time}>{bookedTime}, {day} {month}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default CardAppointmentSmall;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 20,
        paddingHorizontal: 24,
        marginVertical: 8,
        paddingVertical: 8,
        backgroundColor: colors.color_white,
        shadowColor: colors.color_gray,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        elevation: 6,
    },
    info_container: {
        flex: 1,
        justifyContent: "center",
    },
    appType: {
        fontFamily: "Mulish-Medium",
        fontSize: 14,
        padding: 4,
    },
    time: {
        fontFamily: "Mulish-Medium",
        fontSize: 14,
        padding: 4,
        color: colors.color_gray,
    },
});
