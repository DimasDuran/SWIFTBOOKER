import React from "react";
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
} from "react-native";
import { colors, sizes } from "../styles/colores";
import { Animated } from "react-native";

const CARD_WIDTH = sizes.width - 100;
const CARD_HEIGHT = 180;

interface CardCarouselProps {
    list: Array<{
        name: string;
        image: any;
        count: number;
    }>;
    onSelectCategory: (item: any) => void;
    token:boolean
}

const CardCarousel: React.FC<CardCarouselProps> = ({ list, onSelectCategory,token }) => {
    const av = new Animated.Value(0);
    av.addListener(() => {
        return;
    });
    return (
        <FlatList
            data={list}
            horizontal
            snapToInterval={CARD_WIDTH + 24}
            decelerationRate={"fast"}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={3}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index }) => {
                return (
                    <TouchableOpacity
                       disabled={token}

                        style={{
                            marginLeft: index === 0 ? 0 : 24,
                            marginRight: index === list.length - 1 ? 24 : 0,
                            marginVertical: 16,
                        }}
                        onPress={() => onSelectCategory(item)}
                    >
                        <View style={styles.card}>
                            <View style={styles.button_box}>
                                <TouchableOpacity
                                disabled={token}

                                    style={styles.button}
                                    onPress={() => onSelectCategory(item)}
                                >
                                    <Text style={styles.button_text}>
                                        Review
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.image_box}>
                                <Image
                                    source={item.image}
                                    style={styles.category_image}
                                />
                            </View>
                            <View style={styles.title_box}>
                                <Text style={styles.category}>
                                    {item.name},
                                </Text>
                                <View style={styles.countDetail_container}>
                                    <Text style={styles.detail}>
                                        {item.count} Consultant
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: "row",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 20,
        backgroundColor: colors.color_white,
        shadowColor: colors.color_gray,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        elevation: 4,
        alignSelf: "flex-end",
    },
    image_box: {
        flex: 1,
        paddingVertical: 24,
    },
    category_image: {
        flex: 1,
        resizeMode: "contain",
    },
    title_box: {
        left: 24,
        top: 16,
        position: "absolute",
    },
    category: {
        fontSize: 20,
        fontFamily: "Mulish-Medium",
        color: colors.color_primary,
    },
    countDetail_container: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    detail: {
        fontSize: 14,
        fontFamily: "Mulish-Light",
        color: colors.color_primary,
    },
    button_box: {
        position: "absolute",
        justifyContent: "flex-end",
        bottom: 0,
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    button: {
        backgroundColor: colors.color_primary,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignSelf: "flex-start",
    },
    button_text: {
        fontSize: 16,
        fontFamily: "Mulish-Bold",
        color: colors.color_white,
    },
});

export default CardCarousel;
