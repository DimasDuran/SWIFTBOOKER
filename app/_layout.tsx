import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { TouchableOpacity, Text } from 'react-native';
import { MenuProvider } from "react-native-popup-menu";
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IntroScreens from '@/app/stack/IntroScreens';
import useAuthStore from '@/hooks/useAuth';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadAuthData = useAuthStore((state) => state.loadAuthData);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (firstLaunch === null) {
          setIsFirstLaunch(true); 
          await AsyncStorage.setItem('isFirstLaunch', 'false'); 
        } else {
          setIsFirstLaunch(false); 
        }
      } catch (error) {
        console.error("Error checking first launch", error);
      }
    };
    loadAuthData()
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || isFirstLaunch === null) {
    return null; // Avoid rendering while fonts are loading or we are checking if it's the first launch
  }

  if (isFirstLaunch) {
    return <IntroScreens onDone={() => setIsFirstLaunch(false)} />; // Show intro screens
  }


  console.log(isFirstLaunch)

  return (
    <MenuProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="stack/LoginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="stack/SignUpScreen" options={{ headerShown: false }} />
          <Stack.Screen
            name="stack/NotificationsScreen"
            options={() => ({
              headerShown: true,
              title: '',
              headerBackTitleVisible: true, 
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.replace('/')}>
                  <Text style={{ marginLeft: 16, color: 'blue' }}>Back</Text>
                </TouchableOpacity>
              ),
            })}
          />

          <Stack.Screen
            name="stack/ServiceDetailScreen"
            options={{ headerShown: true, title: '' }}
          />
          <Stack.Screen
            name="stack/ServiceBookingScreen"
            options={{ headerShown: true, title: '' }}
          />

        </Stack>
      </ThemeProvider>
    </MenuProvider>
  );
}
