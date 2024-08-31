import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import SearchBar from '@/components/SearcBar'; 
import { ref, onValue, getDatabase } from "firebase/database";
import parseContentData from '@/utils/parseContentData';
import CardAppointmentSmall from '@/components/CardAppoimentSmall';
import { sortAppointmentsByDateAndTime } from '@/utils/calendarUtils';
import categories from '@/utils/categories';
import CardCarousel from '@/components/CardCarousel';
import Category from '@/components/Category';
import useAuth from '@/hooks/useAuth';
import { colors } from '@/styles/colores'; 
import { getAuth, inMemoryPersistence } from "firebase/auth";
import fetchServiceInfo from '@/utils/fetchServiceInfo';


interface UserInfo {
  id: number;
  firstname: string;
  lastname: string;
  district: string;
}

export default function Index() {
  const [appointmentList, setAppointmentList] = useState<any[]>([]);
  const [userAuth, setUserAuth] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const { getToken} = useAuth();

  useEffect(() => {
    const handleToken = async () => {
      const token = await getToken();
      console.log('Token from home', token);
    };

    handleToken();

    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      setUserAuth(!!userAuth);
    });

    return () => unsubscribe();
  }, [getToken]);

  useEffect(() => {
    if (userAuth && user) {
      const dbRef = ref(getDatabase(), "userAppointments/" + user.uid);

      const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const getList = parseContentData(snapshot.val());

          const servicePromises = getList.map((appointment) =>
            fetchServiceInfo(appointment.serviceId)
          );

          Promise.all(servicePromises)
            .then((serviceInfos) => {
              const updateAppointmentList = getList.map(
                (appointment, index) => ({
                  ...appointment,
                  serviceInfo: serviceInfos[index],
                })
              );

              setAppointmentList(
                sortAppointmentsByDateAndTime(updateAppointmentList)
              );
              setIsReady(true);
            });
        } else {
          setAppointmentList([]);
          setIsReady(true);
        }
      });

      return () => unsubscribe();
    } else {
      setAppointmentList([]);
      setTimeout(() => {
        setIsReady(true);
      }, 2000);
    }
  }, [userAuth, user]);

  // Navigation handlers
  function goToCalendar() {
    // navigation.navigate("CalendarScreen");
  }

  function goToNotifications() {
    // navigation.navigate("NotificationsScreen");
  }

  const handleSearch = () => {
    // navigation.navigate("SearchScreen");
  };

  const handleCategorySelect = (selectedCategory: any) => {
    // navigation.navigate("SearchScreen", { category: selectedCategory });
  };

  return (
    <View style={styles.container}>
      <Text>Index</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    marginBottom: 120,
  },
  top_container: {
    paddingHorizontal: 24,
  },
  card_container: {
    marginVertical: 16,
    padding: 16,
  },
  header_container: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  welcome_container: {
    marginTop: 8,
    marginBottom: 64,
    flexDirection: "row",
    alignItems: "center",
  },
  search_container: {
    flex: 1,
    paddingBottom: 8,
  },
  app_container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  list_container: {
    flex: 1,
    marginVertical: 8,
  },
  category_container: {
    marginVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  header_text: {
    fontSize: 34,
    fontFamily: "Mulish-Medium",
    color: colors.color_primary,
    flex: 1,
  },
  welcome_text: {
    paddingHorizontal: 8,
    fontSize: 24,
    color: colors.color_white,
    fontFamily: "Mulish-Medium",
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Mulish-Medium",
  },
  detail_text: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    color: colors.color_white,
    fontFamily: "Mulish-Medium",
  },
  welcome_text_bold: {
    color: colors.color_white,
    fontSize: 24,
    fontFamily: "Mulish-Bold",
  },
  icon: {
    color: colors.color_primary,
  },
  loading_container: {
    alignContent: "center",
    justifyContent: "center",
    height: "100%",
  },
});
