import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    ScrollView,
    GestureResponderEvent
} from 'react-native';
import { colors } from '@/styles/Theme';
import { Ionicons } from "@expo/vector-icons";

interface CardMediumProps {
    service: {
        firstName: string;
        lastName: string;
        expert_area: string;
        district: string;
        skills: string[];
    };
    image_source: string;
    onSelect: (event: GestureResponderEvent) => void;
}



const CardMedium: React.FC<CardMediumProps> = ({ service, image_source, onSelect }) => {
    return (
        <TouchableWithoutFeedback onPress={onSelect}>
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Image source={{ uri: image_source }} style={styles.image}
                        onError={() => console.log('Error loading image')}                    />
                    <View style={styles.textContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>
                                {service.firstName} {service.lastName}
                            </Text>
                            <Text style={styles.desc}>
                                {service.expert_area}
                            </Text>
                        </View>

                        <View style={styles.locationContainer}>
                            <Ionicons
                                name="images-outline"
                                size={18}
                                color={colors.color_primary}
                            />
                            <Text style={styles.location}>
                                {service.district}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.skillsContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {service.skills.map((skill, index) => (
                            <View key={index} style={styles.chipContainer}>
                                <Text style={styles.chipText}>{skill}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 24,
        marginVertical: 8,
        backgroundColor: colors.color_white,
        shadowColor: colors.color_light_gray,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        elevation: 4,
        justifyContent: "center",
    },
    infoContainer: {
        flexDirection: "row",
        paddingBottom: 8,
        alignItems: "center",
    },
    image: {
        marginRight: 16,
        borderRadius: 50,
        width: 72,
        height: 72,
    },
    textContainer: {
        flex: 1,
    },
    titleContainer: {
        marginBottom: 4,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    skillsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    chipContainer: {
        borderRadius: 20,
        backgroundColor:'#000',
        padding: 12,
        margin: 4,
    },
    chipText: {
        fontFamily: "Mulish-Light",
        color: colors.color_white,
    },
    title: {
        fontSize: 18,
        fontFamily: "Mulish-Medium",
    },
    desc: {
        fontSize: 16,
        fontFamily: "Mulish-Light",
        color: colors.color_gray,
    },
    location: {
        fontSize: 16,
        fontFamily: "Mulish-Light",
        color: colors.color_primary,
        marginLeft: 4,
    },
});

export default CardMedium;
