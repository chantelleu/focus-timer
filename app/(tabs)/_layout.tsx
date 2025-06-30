import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTimerActive } from '@/context/TimerActiveContext';
import { useThemes } from '@/hooks/useThemes';

function TabContent() {
  const { isTimerActive, showRewardAnimation } = useTimerActive();
  const { getActiveThemeColors } = useThemes();
  const { appColors } = getActiveThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appColors.tint,
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        tabBarButton: HapticTab,
        tabBarStyle: {
          ...(Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          })),
          display: (isTimerActive || showRewardAnimation) ? 'none' : 'flex', // Hide tabs when timer is active OR reward animation is showing
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="star.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
      <TabContent />
  );
}