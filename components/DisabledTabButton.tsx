import React from 'react';
import { View, ViewStyle } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { ColorSchemeName } from 'react-native';

interface DisabledTabButtonProps {
  colorScheme: ColorSchemeName;
}

const DisabledTabButton: React.FC<DisabledTabButtonProps> = ({ colorScheme }) => (
  <View style={{ opacity: 0.5, justifyContent: 'center', alignItems: 'center', flex: 1 } as ViewStyle}>
    <TabBarIcon name="lock-closed-outline" color={Colors[colorScheme ?? 'light'].tint} />
  </View>
);

export default DisabledTabButton;
