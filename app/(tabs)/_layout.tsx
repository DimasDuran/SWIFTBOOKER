import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import useAuth from '@/hooks/useAuth';
import { TouchableOpacity } from 'react-native';
import DisabledTabButton from '@/components/DisabledTabButton'; 

const TabLayout: React.FC = () => {
  const colorScheme = useColorScheme();
  const { token } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home-outline' : 'home-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search'} color={color} />
          ),
          tabBarButton: (props) => !token ? <DisabledTabButton colorScheme={colorScheme} /> : <TouchableOpacity {...props} />,
        }}
      />

      <Tabs.Screen
        name="apoiments"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar-outline' : 'calendar-outline'} color={color} />
          ),
          tabBarButton: (props) => !token ? <DisabledTabButton colorScheme={colorScheme} /> : <TouchableOpacity {...props} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-outline' : 'person-outline'} color={color} />
          ),
          tabBarButton: (props) => <TouchableOpacity {...props} />, // Always enabled
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
