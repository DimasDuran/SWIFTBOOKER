import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import CardMedium from "@/components/CardMedium";
import SearchBar from "@/components/SearcBar"; // Corregido el nombre del componente
import { getDatabase, ref, child, get } from "firebase/database";
import { colors, sizes } from "@/styles/Theme";
import categories from "@/utils/categories";
import Category from "@/components/Category";
import { showTopMessage } from "@/utils/ErrorHandler";
import parseContentData from "@/utils/parseContentData";
import userImages from "@/utils/UserImageUtils";
import { useServiceStore } from "@/hooks/useServiceStore";
import { useRouter, useGlobalSearchParams } from "expo-router";

export default function SearchScreen() {
    const {
        serviceList,
        filteredServiceList,
        selectedCategory,
        setServiceList,
        setFilteredServiceList,
        setSelectedCategory,
        filterByCategory,
        searchServices,
        resetFilters
    } = useServiceStore();
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const { category } = useGlobalSearchParams();

    useEffect(() => {
        const dbRef = ref(getDatabase());

        get(child(dbRef, "services"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const serviceList = parseContentData(snapshot.val());
                    setServiceList(serviceList);

                    if (category) {
                        filterByCategory(category);
                    } else {
                        resetFilters();
                    }
                } else {
                    showTopMessage("No hay datos para mostrar", "info");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [category, filterByCategory, resetFilters, setServiceList]);

    const handleCategoryFilter = (category) => {
        if (selectedCategory === category) {
            resetFilters();
        } else {
            filterByCategory(category);
        }
    };

    const renderService = ({ item }) => {
        console.log(item.id)
        const imageSource = userImages[item.id] ? userImages[item.id] : require("@/assets/user-profile.png");

        return(
            <CardMedium
            image_source={imageSource}
            service={item}
            key={item.id}
            onSelect={() => handleServiceSelect(item)}
            
        />
        )
    }

    const renderCategory = ({ item }) => (
        <Category
            category={item}
            isSelected={selectedCategory === item.name}
            onPress={() => handleCategoryFilter(item.name)}
            key={item.name}
        />
    );

    const handleServiceSelect = (item) => {
        router.replace({ pathname: "/stack/ServiceDetailScreen", params: { item: JSON.stringify(item) } });
    };

    const handleSearch = (text) => {
        searchServices(text);
    };
//   console.log('============>>',serviceList)
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator
                    style={styles.loadingIndicator}
                    size="large"
                    color={colors.color_primary}
                />
            ) : (
                <View style={styles.container}>
                    <View style={styles.search_container}>
                        <SearchBar
                            onSearch={handleSearch}
                            placeholder_text={"Buscar"}
                        />
                    </View>
                    <View style={styles.category_container}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={sizes.width + 24}
                            decelerationRate={"fast"}
                            data={categories}
                            keyExtractor={(category) => category.name}
                            renderItem={renderCategory}
                        />
                    </View>

                    <View style={styles.list_container}>
                        <FlatList
                            data={filteredServiceList} 
                            renderItem={renderService}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 330 }}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    search_container: {
        marginTop: 56,
        marginBottom: 12,
        marginHorizontal: 24,
    },
    category_container: {
        marginHorizontal: 24,
    },
    list_container: {
        marginBottom: 32,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
