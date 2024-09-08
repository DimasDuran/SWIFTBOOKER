import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Modal,
  Button,
  TouchableOpacity,
} from 'react-native';
import { ref, onValue, getDatabase } from 'firebase/database';
import parseContentData from '@/utils/parseContentData';
import { sortAppointmentsByDateAndTime } from '@/utils/calendarUtils';
import useAuthStore from "@/hooks/useAuth";
import fetchServiceInfo from '@/utils/fetchServiceInfo';
import { colors } from '@/styles/colores';
import { Feather } from "@expo/vector-icons";
import { useRouter,router } from 'expo-router';
import SearchBar from "@/components/SearcBar";
import CardAppointmentSmall from '@/components/CardAppoimentSmall';
import CardCarousel from '@/components/CardCarousel';
import categories from "@/utils/categories";
import Category from '@/components/Category';
import { useNotificationsStore } from '@/hooks/useNotificationsStore';

export default function Index() {
  const [appointmentList, setAppointmentList] = useState<any[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const notificationsCount = useNotificationsStore((state) => state.count);
  const { token,uid,user } = useAuthStore();
  
  const router = useRouter();
  useEffect(() => {
    if (token && uid) {
      const dbRef = ref(getDatabase(), 'userAppointments/' + uid);

      const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const getList = parseContentData(snapshot.val());

          const servicePromises = getList.map((appointment) =>
            fetchServiceInfo(appointment.serviceId)
          );

          Promise.all(servicePromises)
            .then((serviceInfos) => {
              const updateAppointmentList = getList.map((appointment, index) => ({
                ...appointment,
                serviceInfo: serviceInfos[index],
                bookedDate: appointment.bookedDate || '', 
                bookedTime: appointment.bookedTime || '', 
              }));

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
  }, [user?.email, uid]);

  useEffect(() => {
    if (!token) {
      setIsModalVisible(true);
    }
  }, [token]);

  const handleSearch = () => {
   
  };

  const goToSearch = () =>{
    if (!!token) {
      router.replace('/(tabs)/search')
      
    }else{
      return
    }
  }

  const handleCategorySelect = (selectedCategory: string) => {
    setSelectedCategory(selectedCategory);
    router.replace(`/search?category=${encodeURIComponent(selectedCategory)}`);
  };

  function goToCalendar() {
    // router.replace("CalendarScreen");
  }

  function goToNotifications() {
    router.replace("/stack/NotificationsScreen");
  }

  const closeModal = () => {
    setIsModalVisible(false);
    router.replace('/(tabs)/profile')
  };

  return (
    <ScrollView>
      {isReady ? (
        <View style={styles.container}>
          <View style={styles.top_container}>
            <View style={styles.header_container}>
              <Text style={styles.header_text}>SwiftBooker</Text>
              <Feather
                name="bell"
                size={24}
                style={styles.icon}
                onPress={goToNotifications}
              />
              {notificationsCount > 0 && (
                <View style={styles.notification_badge}>
                  <Text style={styles.notification_badge_text}>{notificationsCount}</Text>
                </View>
              )}
            </View>
            <ImageBackground
              style={styles.card_container}
              imageStyle={{ borderRadius: 20, overflow: "hidden" }}
              source={require("@/assets/backgroundsearch.png")}
            >
              <View style={styles.welcome_container}>
                <Text style={styles.welcome_text}>Welcome</Text>
                <Text style={styles.welcome_text_bold}>
                  {user?.email ? user?.email.split('@')[0] : '' || user?.displayName}
                </Text>
              </View>
              <Text style={styles.detail_text}>
                Let's plan your weekly schedule together
              </Text>
              <View style={styles.search_container}>
                <SearchBar
                  token={!token}
                  placeholder_text={"Search Service"}
                  onSearch={handleSearch}
                  onPress={goToSearch}
                />
              </View>
            </ImageBackground>
          </View>
          <View style={styles.app_container}>
            <Text style={styles.text}>For You</Text>
            <View>
              <CardCarousel
                token={!token}
                list={categories}
                onSelectCategory={handleCategorySelect}
              />
            </View>

            {appointmentList.length === 0 ? (
              ""
            ) : (
              <View>
                <Text style={styles.text}>Upcoming Appointments</Text>
                <View style={styles.list_container}>
                  {appointmentList
                    .slice(0, 2)
                    .map((appointment) => (
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
            <Text style={styles.text}>All Services</Text>
            <View style={styles.category_container}>
              {categories.map((category) => (
                <Category
                  category={category}
                  key={category.name}
                  token={!!token}
                  isSelected={selectedCategory === category.name}
                  onPress={() => handleCategorySelect(category.name)}
                />
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.loading_container}>
          <ActivityIndicator
            size="large"
            color={colors.color_primary}
          />
        </View>
      )}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              You need to log in to make an appointment.
            </Text>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
  <Text style={styles.buttonText}>Go</Text>
</TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    color: '#6A5ACD',
  },
  loading_container: {
    alignContent: "center",
    justifyContent: "center",
    height: "100%",
  },
  notification_badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification_badge_text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.color_primary,
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 10,
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4, 
  },
  buttonText: {
    color: colors.color_white,
    fontSize: 16,
    fontWeight: '600', 
  },

});
