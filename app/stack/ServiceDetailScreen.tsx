import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Share,
  TouchableOpacity,
} from "react-native";
import Button from "@/components/Button/Button";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, sizes } from "@/styles/Theme";
import userImages from "@/utils/UserImageUtils";
import { useServiceStore } from "@/hooks/useServiceStore";
import { useRouter,useGlobalSearchParams } from "expo-router";

interface ServiceItem {
  about: string;
  date: string;
  district: string;
  experience: number;
  expert_area: string;
  id: string;
  numberOf_books: number;
  serviceName: string;
  skills: string[];
  time: string[];
}

const ServiceDetailScreen: React.FC = () => {
  const { serviceList } = useServiceStore();
  const router = useRouter();
  const { item } = useGlobalSearchParams();
  const serviceItem: ServiceItem = JSON.parse(item as string);

  

  const shareContent = async () => {
    try {
      await Share.share({
        message: "Check this out...",
        title: "App Sharing",
      });
    } catch (error) {
      console.error(error);
    }
  };

  //NAVIGATION
  const goToBookingScreen = (item: ServiceItem) => {
      router.replace({ pathname: "/stack/ServiceBookingScreen", params: { item: JSON.stringify(item) } });
  };

  const cancel = () => {
    router.replace('/(tabs)/search'); 
  };

  if (!serviceList || serviceList.length === 0) {
    return (
      <View style={styles.out_container}>
        <Text>No services available</Text>
      </View>
    );
  }
  const test = userImages[serviceItem.id]
  console.log('Esto contiene test =====')
  console.log(test)
 
  return (
    <View style={styles.out_container}>
      <ScrollView style={styles.container}>
        <View style={styles.share_container}>
          <TouchableOpacity onPress={shareContent}>
            <Feather name="share" size={24} color={colors.color_primary} />
          </TouchableOpacity>
        </View>
        {/* Header */}
        <View style={styles.header_container}>
          <Image
            style={styles.image_container}
            source={userImages[serviceItem.id]}
          />
          <View>
            <View style={styles.title_container}>
              <Text style={styles.title}>
                {serviceItem.serviceName}
              </Text>
              <Text style={styles.about}>
                {serviceItem.expert_area} Specialist
              </Text>
            </View>
            <View style={styles.location_container}>
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.color_primary}
              />
              <Text style={styles.location}>{serviceItem.district}</Text>
            </View>
          </View>
        </View>
        {/* Body */}
        <View style={styles.body_container}>
          <View style={styles.about_container}>
            <Text style={styles.about}>About</Text>

            <View style={styles.skills_container}>
              {serviceItem.skills &&
                serviceItem.skills.map((skill, index) => (
                  <View key={index} style={styles.chip_container}>
                    <Text style={styles.chips}>{skill}</Text>
                  </View>
                ))}
            </View>

            <Text style={styles.desc}>{serviceItem.about}</Text>
          </View>
        </View>

        <View style={styles.detail_container}>
          <View style={styles.detail}>
            <Text style={styles.detail_text}>
              {serviceItem.experience}+ Years Experience
            </Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detail_text}>
              {serviceItem.numberOf_books}
            </Text>
            <Text style={styles.detail_text}>
              Completed Appointments
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.button_container}>
        <Button
          text={"Cancel"}
          onPress={cancel}
          style={styles.cancel_button}
          theme="secondary"
        />
        <Button
          text={"Book Appointment"}
          onPress={() => goToBookingScreen(serviceItem)}
        />
      </View>
      
    </View>
  );
};

export default ServiceDetailScreen;

const styles = StyleSheet.create({
  out_container: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  share_container: {
    flex: 1,
    marginTop: 48,
    marginHorizontal: 4,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  header_container: {
    flexDirection: "row",
    backgroundColor: colors.color_white,
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
  },
  body_container: {
    flexDirection: "row",
    backgroundColor: colors.color_white,
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
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
  button_container: {
    flexDirection: "row",
    marginBottom: 126,
    marginHorizontal: 29,
    justifyContent: "space-between",
    gap:10
  },
  title: {
    fontSize: 24,
    fontFamily: "Mulish-Medium",
  },
  about: {
    fontSize: 20,
    fontFamily: "Mulish-Light",
  },
  desc: {
    fontSize: 14,
    fontFamily: "Mulish-Light",
  },
  detail_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "space-between",
  },
  skills_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    flexWrap: "wrap",
  },
  detail: {
    flex: 1,
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 12,
    height: sizes.width / 3,
    justifyContent: "center",
    backgroundColor: colors.color_white,
  },
  detail_text: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Mulish-SemiBold",
    color: colors.color_dark,
  },
  chips: {
    alignSelf: "flex-start",
    fontFamily: "Mulish-Light",
    color: colors.color_white,
  },
  chip_container: {
    borderRadius: 20,
    backgroundColor: colors.color_primary,
    padding: 12,
    margin: 4,
  },
  location: {
    fontSize: 16,
    fontFamily: "Mulish-Light",
    flex: 1,
    color: colors.color_primary,
    justifyContent: "center",
  },
  cancel_button: {
    backgroundColor: colors.color_gray
  },
});
