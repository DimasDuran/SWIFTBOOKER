import { View, Text, Alert, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useRef,useState } from 'react';
import { Calendar, DateObject } from "react-native-calendars";
import { useRouter } from 'expo-router';
import moment from 'moment';
import { getAuth } from 'firebase/auth';
import { getDatabase, push, ref, get, child } from "firebase/database";
import { showTopMessage } from '@/utils/ErrorHandler';
import { useGlobalSearchParams } from 'expo-router';
import Button from '@/components/Button/Button';
import TimeSlot from '@/components/TimeSlot';
import parseContentDta from '@/utils/parseContentData';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/Theme';
import userImages from '@/utils/UserImageUtils';
import AnimationClown from '@/utils/Animate/ClownAnimate'

import {
    configureNotifications,
    handleNotification,
} from "@/utils/NotificationService";
import { useServiceStoreBooking } from '@/hooks/ServiceStoreBooking';

interface ServiceItem {
    id: string;
    firstName: string;
    lastName: string;
    district: string;
    expert_area: string;
}

export default function ServiceBookingScreen() {
    const { item } = useGlobalSearchParams();
    const [showAnimation, setShowAnimation] = useState(false);

    const serviceItem: ServiceItem = JSON.parse(item as string);

    const serviceId = serviceItem.id;
    const scrollViewRef = useRef<ScrollView>(null);
    const router = useRouter();
    const {
        loading,
        selectedDate,
        selectedTime,
        timeList,
        serviceTimeList,
        bookedApps,
        setLoading,
        setSelectedDate,
        setSelectedTime,
        setTimeList,
        setServiceTimeList,
        setBookedApps,
    } = useServiceStoreBooking();

    const auth = getAuth();
    const user = auth.currentUser;
    const today = moment().format("YYYY-MM-DD");
    const threeMonthsLater = moment().add(3, "months").format("YYYY-MM-DD");

    useEffect(() => {
        configureNotifications();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const dbRef = ref(getDatabase());
                const snapshot = await get(child(dbRef, "times/serviceTimeList"));
                if (snapshot.exists()) {
                    const timeList = parseContentDta(snapshot.val());
                    setTimeList(timeList);
                } else {
                    console.log("Data not found");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    const getServiceAppointments = async (day: string) => {
        setLoading(true);
        setServiceTimeList([]);
        try {
            const appointmentsRef = ref(getDatabase(), "userAppointments/userAppointments");
            const snapshot = await get(appointmentsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                let serviceBookings: Appointment[] = [];

                Object.keys(data).forEach((user) => {
                    const userAppointments = data[user];
                    Object.keys(userAppointments).forEach((appointmentId) => {
                        const app = userAppointments[appointmentId];
                        if (app.serviceId === serviceId && app.bookedDate === day) {
                            serviceBookings.push(app);
                        }
                    });
                });

                setBookedApps(serviceBookings);
                const availableTimes = timeList.map((time) => {
                    const bookedHour = serviceBookings.some(
                        (app) => app.bookedTime === time.apptime
                    );
                    return {
                        ...time,
                        isBooked: bookedHour ? true : false,
                    };
                });

                setServiceTimeList(availableTimes);
            } else {
                console.log("No appointments found");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = () => {
        if (selectedDate && selectedTime && user) {
            Alert.alert(
                "Create Appointment",
                "Your appointment will be created. Do you confirm?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Confirm",
                        onPress: () => {
                            pushAppointment();
                            console.log('apomente  shedule now')

                        },
                    },
                ]
            );
        } else {
            if (!user) {
                showTopMessage("You have not logged in", "success");
                goToLoginScreen();
            } else if (!selectedDate || !selectedTime) {
                showTopMessage("Please select a day and a time.", "info");
            }
        }
    };

    const pushAppointment = () => {
        if (!user || !selectedDate || !selectedTime) return;

        const userId = user.uid;
        const appType = serviceItem.expert_area;
        const bookedDate = selectedDate;
        const bookedTime = selectedTime;

        const appointmentsRef = ref(getDatabase(), "userAppointments/" + userId);

        push(appointmentsRef, {
            userId,
            serviceId,
            appType,
            bookedDate,
            bookedTime,
        })
            .then(() => {
                showTopMessage("Your appointment has been created!", "success");
                handleNotification(
                    "Upcoming appointment",
                    `Your appointment has been scheduled for ${bookedDate}, ${bookedTime}.`
                );
                setSelectedTime(null);
                setSelectedDate(null);
              
                goToCompletedScreen();

             
            })
            
            .catch((error) => {
                showTopMessage("An error occurred.", "info");
                console.error(error);
                setSelectedTime(null);
                setSelectedDate(null);
            });
    };

    const onDateSelect = async (day: DateObject) => {
        try {
            setLoading(true);
            setSelectedDate(day.dateString);
            await getServiceAppointments(day.dateString);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const goToCompletedScreen = () => {
        setShowAnimation(true)
        setTimeout(() => {
            router.replace("/(tabs)/apoiments");
        },6000)
    };

    const goToLoginScreen = () => {
        // router.replace("LoginScreen");
    };

    return (
        <View style={styles.out_container}>

            {showAnimation ? (
            <View style={{flex:1,marginBottom:'60%'}}>
                <AnimationClown/>
                <Text style={styles.successMessage}>Successfully scheduled! 🎉</Text>
                <Text style={styles.subMessage}>Your appointment has been scheduled correctly.</Text>

              
            </View>
            ):(
             <>
               <ScrollView
                nestedScrollEnabled={true}
                ref={scrollViewRef}
                style={styles.container}
            >

                {/* Header */}
                <View style={styles.header_container}>
                    <Image
                        style={styles.image_container}
                        source={userImages[serviceItem.id]}
                    />
                    <View>
                        <View style={styles.title_container}>
                            <Text style={styles.title}>
                                {serviceItem.firstName} {serviceItem.lastName}
                            </Text>
                            <Text style={styles.about}>
                                {serviceItem.expert_area} Specialist
                            </Text>
                        </View>
                        <View style={styles.location_container}>
                            <Ionicons
                                name="location"
                                size={18}
                                color={colors.color_primary}
                            />
                            <Text style={styles.location}>{serviceItem.district}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.text_container}>
                    <Text style={styles.subTitle}>Select a Day:</Text>
                </View>

                <Calendar
                    style={styles.calendar_container}
                    onDayPress={!loading ? onDateSelect : undefined}
                    markedDates={{
                        [selectedDate]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: colors.color_primary,
                            selectedTextColor: colors.color_white,
                        },
                    }}
                    customStyle={{
                        today: {
                            todayTextColor: colors.color_primary,
                        },
                    }}
                    minDate={today}
                    maxDate={threeMonthsLater}
                />

                {selectedDate && (
                    <View style={styles.bottom_container}>
                        {loading ? (
                            <ActivityIndicator
                                style={styles.loadingIndicator}
                            />
                        ) : (
                            <>
                                <View style={styles.text_container}>
                                    <Text style={styles.subTitle}>
                                        Select a Time:
                                    </Text>
                                </View>
                                
                                <View style={styles.time_container}>
                                    {serviceTimeList.map((time) => (
                                        <TimeSlot
                                            key={time.id.toString()}
                                            time={time}
                                            onPress={onTimeSelect}
                                            isSelected={
                                                selectedTime === time.apptime
                                            }
                                            isBooked={time.isBooked}
                                        />
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                )}             

            </ScrollView>
            <View style={styles.button_container}>
                <Button text={"Schedule now"} onPress={handleBooking} />
            </View>

             </>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    out_container: { flex: 1 },
    container: {
        flexGrow: 1,
        marginTop: 48,
        paddingHorizontal: 24,
    },
    header_container: {
        flexDirection: "row",
        backgroundColor: colors.color_white,
        marginTop: 36,
        padding: 16,
        borderRadius: 20,
    },

    calendar_container: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        justifyContent: "center",
    },

    image_container: {
        marginRight: 16,
        borderRadius: 50,
        overflow: "hidden",
        width: 100,
        height: 100,
    },
    title_container: {
        flex: 1,
    },
    location_container: { flexDirection: "row", paddingVertical: 8 },
    about_container: {
        flex: 1,
        justifyContent: "space-evenly",
    },
    text_container: {
        flex: 1,
        flexDirection: "row",
    },
    time_container: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 16,
        backgroundColor: colors.color_white,
        borderRadius: 20,
        justifyContent: "space-between",
    },
    bottom_container: {
        flex: 1,
        marginBottom: 24,
    },
    button_container: {
        flexDirection: "row",
        marginBottom: 126,
        paddingHorizontal: 24,
    },
    about: {
        fontSize: 20,
        fontFamily: "Mulish-Light",
    },

    title: {
        fontSize: 24,
        fontFamily: "Mulish-Medium",
    },
    subTitle: {
        fontSize: 18,
        paddingVertical: 16,
    },
    desc: {
        fontSize: 14,
        fontFamily: "Mulish-Light",
    },
    location: {
        fontSize: 16,
        fontFamily: "Mulish-Light",
        flex: 1,
        color: colors.color_primary,
        justifyContent: "center",
    },
    messageContainer: {
        marginTop: 20, // Separación entre la animación y el texto
        alignItems: 'center', // Centrar el texto horizontalmente
      },
      successMessage: {
        fontSize: 18, // Tamaño de texto ajustado
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
      },
      subMessage: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20,
      },
      button: {
        marginTop: 20, // Separación entre el texto y el botón
      },
});

