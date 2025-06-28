
import React, { useState, useEffect } from 'react';
import { StyleSheet, Switch, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOUND_ENABLED_KEY = 'sound-enabled';
const VIBRATION_ENABLED_KEY = 'vibration-enabled';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

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

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Settings</ThemedText>

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
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
});
