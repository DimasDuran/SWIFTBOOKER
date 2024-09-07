const categories = [
    {
        name: "Personal Development", 
        icon: "person", // md-person en Ionicons se puede usar simplemente como "person"
        image: require("@/assets/illustration/growth.png"),
        count: 240,
    },
    {
        name: "Sports", 
        icon: "fitness", // md-fitness en Ionicons se puede usar como "fitness"
        image: require("@/assets/illustration/sport.png"),
        count: 200,
    },
    {
        name: "Health", 
        icon: "medkit", // md-medical en Ionicons se usa como "medkit"
        image: require("@/assets/illustration/healthcare.png"),
        count: 150,
    },
    {
        name: "Education",
        icon: "school", // md-school en Ionicons se usa como "school"
        image: require("@/assets/illustration/education.png"),
        count: 250,
    },
    {
        name: "Beauty", 
        icon: "flower", // md-flower en Ionicons se usa como "flower"
        image: require("@/assets/illustration/beauty.png"),
        count: 100,
    },
    {
        name: "Other", 
        icon: "apps", // md-apps-sharp en Ionicons se puede usar como "apps"
        image: require("@/assets/illustration/other.png"),
        count: 100,
    },
];

export default categories;
