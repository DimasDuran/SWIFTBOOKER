import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { colors } from "@/styles/colores";
import CardAppointmentSmall from "@/components/CardAppoimentSmall";
import { useCalendarStore } from "@/hooks/useCalendarStore";
import { useNotificationsStore } from "@/hooks/useNotificationsStore";
import { loadNotifications } from "@/utils/notificationsHelper"; 

const NotificationsScreen: React.FC = () => {
    const { appointmentList } = useCalendarStore();
    const [isReady, setIsReady] = useState(false);
    const setCount = useNotificationsStore((state) => state.setCount);

    useEffect(() => {
        loadNotifications(appointmentList, setIsReady, setCount);

        return() =>{
            setCount(0),
            setIsReady(false)
        }
    }, [appointmentList,setCount]); 

    function goToCalendar() {
        // Lógica de navegación aquí
    }

    console.log('list',appointmentList)

    return (
        <ScrollView>
            {isReady ? (
                <View style={styles.container}>
                    <View style={styles.app_container}>
                        {appointmentList.length === 0 ? (
                            <Text>No Appointments Found</Text>
                        ) : (
                            <View style={styles.list_container}>
                                <Text style={styles.header_text}>My Notifications</Text>
                                <View>
                                    {appointmentList.slice(0, 2).map((appointment) => (
                                        <CardAppointmentSmall
                                            appointment={appointment}
                                            serviceInfo={appointment.serviceInfo} 
                                            key={appointment.id}
                                            onPress={goToCalendar}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            ) : (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" color={colors.color_primary} />
                </View>
            )}
        </ScrollView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 48,
    },
    app_container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    list_container: {
        flex: 1,
    },
    header_text: {
        marginVertical: 16,
        fontSize: 30,
        fontFamily: "Mulish-Medium",
    },
    loading_container: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    },
});
