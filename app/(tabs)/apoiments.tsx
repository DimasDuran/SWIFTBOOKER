import React, { useEffect } from "react";
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
            "Cancelación de cita",
            "Su cita será cancelada, ¿está seguro?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        removeAppointment(user!.uid, appointment.id);
                    },
                },
            ]
        );
    };

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
                        <Text style={styles.emptyViewText}>
                            ¡Dot'n have any appointment!
                        </Text>
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
    emptyViewText: {
        fontFamily: "Mulish-Medium",
        fontSize: 24,
        alignItems: "center",
        marginHorizontal: 24,
    },
    loading_container: {
        position: "absolute",
        top: sizes.height / 2,
        left: sizes.width / 2,
    },
});
