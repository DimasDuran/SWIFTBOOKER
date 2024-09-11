import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { colors, sizes } from "@/styles/Theme";
import CardAppointment from "@/components/CardAppointment";
import HourseAnimate from '@/utils/Animate/HourseAnimate';
import { configureNotifications } from "@/utils/NotificationService";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { getAuth } from "firebase/auth";

export default function CalendarScreen() {
    const auth = getAuth();
    const user = auth.currentUser;
    const { appointmentList, loading, fetchAppointments, removeAppointment } = useCalendarStore();

    useEffect(() => {
        configureNotifications();
    }, []);

    useEffect(() => {
        if (user) {
            fetchAppointments(user.uid);
        }
    }, [user]);

    const handleCancel = (appointment: { id: string; appType: string }) => {
        Alert.alert(
            "Cancel Appointment",
            "Your appointment will be canceled. Are you sure?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                    onPress: () => {
                        removeAppointment(user!.uid, appointment.id);
                    },
                },
            ]
        );
    };
console.log({appointmentList});

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header_text}>My Appointments</Text>
            {loading ? (
                <ActivityIndicator
                    style={styles.loading_container}
                    size="large"
                    color={colors.color_primary}
                />
            ) : (
                <View style={styles.list_container}>
                    {appointmentList.length === 0 ? (
                        <View style={styles.emptyView}>
                            <View style={styles.animationContainer}>
                                <HourseAnimate />
                                <Text style={styles.emptyViewText}>
                                    You don't have any appointments scheduled yet! 📅{"\n"}
                                </Text>

                            </View>
                        </View>
                    ) : (
                        <View>
                            {appointmentList.map((appointment) => (
                                <CardAppointment
                                    appointment={appointment}
                                    serviceInfo={appointment.serviceInfo}
                                    key={appointment.id}
                                    onPressCancel={() =>
                                        handleCancel(appointment)
                                    }
                                />
                            ))}
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 48,
    },
    header_text: {
        marginHorizontal: 24,
        marginVertical: 16,
        fontSize: 30,
        fontFamily: "Mulish-Medium",
    },
    list_container: {
        flex: 1,
        justifyContent: "center",
    },
    emptyView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    emptyViewText: {
        fontFamily: "Mulish-Medium",
        fontSize: 24,
        marginTop: 60,
        textAlign:'center'
    },
    animationContainer: {
        alignItems: 'center',
    },
    loading_container: {
        position: "absolute",
        top: sizes.height / 2,
        left: sizes.width / 2,
    },
});
