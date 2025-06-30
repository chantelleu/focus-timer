import React, { useState, useEffect } from 'react';
import { StyleSheet, Switch, Platform, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomHeader } from '@/components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemes } from '@/hooks/useThemes';

const SOUND_ENABLED_KEY = 'sound-enabled';
const VIBRATION_ENABLED_KEY = 'vibration-enabled';
const BADGES_KEY = 'focus-timer-badges';
const TOTAL_SESSIONS_KEY = 'total-completed-sessions';
const DAILY_SESSIONS_KEY = 'daily-completed-sessions';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const { getThemes, selectActiveTheme, activeThemeId } = useThemes();
  const themes = getThemes();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSound = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
        if (storedSound !== null) {
          setSoundEnabled(JSON.parse(storedSound));
        }
        const storedVibration = await AsyncStorage.getItem(VIBRATION_ENABLED_KEY);
        if (storedVibration !== null) {
          setVibrationEnabled(JSON.parse(storedVibration));
        }
      } catch (error) {
        console.error("Error loading settings", error);
      }
    };
    loadSettings();
  }, []);

  const toggleSound = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    await AsyncStorage.setItem(SOUND_ENABLED_KEY, JSON.stringify(newValue));
  };

  const toggleVibration = async () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    await AsyncStorage.setItem(VIBRATION_ENABLED_KEY, JSON.stringify(newValue));
  };

  const clearBadgesAndSessions = async () => {
    Alert.alert(
      "Clear All Progress",
      "Are you sure you want to clear all earned badges and session progress? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(BADGES_KEY);
              await AsyncStorage.removeItem(TOTAL_SESSIONS_KEY);
              await AsyncStorage.removeItem(DAILY_SESSIONS_KEY);
              Alert.alert("Success", "Badges and session progress cleared! Please close and reopen the app to see changes.");
            } catch (error) {
              console.error("Error clearing data", error);
              Alert.alert("Error", "Failed to clear data.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ThemedView style={styles.container}>
      <CustomHeader title="Settings" />

      <ThemedView style={styles.settingItem}>
        <ThemedText style={styles.settingText}>Sound Alerts</ThemedText>
        <Switch
          onValueChange={toggleSound}
          value={soundEnabled}
        />
      </ThemedView>

      {Platform.OS !== 'web' && (
        <ThemedView style={styles.settingItem}>
          <ThemedText style={styles.settingText}>Vibration Alerts</ThemedText>
          <Switch
            onValueChange={toggleVibration}
            value={vibrationEnabled}
          />
        </ThemedView>
      )}

      <ThemedText style={styles.sectionTitle}>Themes</ThemedText>
      {themes.map((theme) => (
        <Pressable
          key={theme.id}
          onPress={() => selectActiveTheme(theme.id)}
          style={styles.settingItem}
          disabled={!theme.isUnlocked}
        >
          <ThemedText style={styles.settingText}>{theme.name}</ThemedText>
          <ThemedView style={[styles.themePreview, { backgroundColor: theme.appColors.background }]}>
            {activeThemeId === theme.id && (
              <ThemedText style={styles.activeThemeIndicator}>✓</ThemedText>
            )}
            {!theme.isUnlocked && (
              <ThemedText style={styles.lockedThemeIndicator}>🔒</ThemedText>
            )}
          </ThemedView>
        </Pressable>
      ))}

      <Pressable style={styles.settingItem} onPress={clearBadgesAndSessions}>
        <ThemedText style={styles.settingText}>Clear All Badges & Progress</ThemedText>
      </Pressable>

      {/* Future: Add session length presets or toggles */}
      {/* Future: Add light/dark mode toggle */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  themePreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeThemeIndicator: {
    fontSize: 20,
    color: 'green',
  },
  lockedThemeIndicator: {
    fontSize: 20,
    color: 'red',
  },
});