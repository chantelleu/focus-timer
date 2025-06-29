
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Vibration, Platform, Alert } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TimerAnimation } from './TimerAnimation';
import { usePoints } from '@/hooks/usePoints';
import { useBadges } from '@/hooks/useBadges';
import { useTimerActive } from '@/context/TimerActiveContext';

const FOCUS_TIME_MINUTES = 25;
const FOCUS_TIME_SECONDS = FOCUS_TIME_MINUTES * 60;
const TOTAL_SESSIONS_KEY = 'total-completed-sessions';
const DAILY_SESSIONS_KEY = 'daily-completed-sessions';
const LAST_SESSION_DATE_KEY = 'last-session-date';
const SOUND_ENABLED_KEY = 'sound-enabled';
const VIBRATION_ENABLED_KEY = 'vibration-enabled';

export function Timer() {
  const [time, setTime] = useState(FOCUS_TIME_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const { isTimerActive, setIsTimerActive } = useTimerActive();
  const [totalCompletedSessions, setTotalCompletedSessions] = useState(0);
  const [completedSessionsToday, setCompletedSessionsToday] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const { awardPoints } = usePoints();
  useBadges(completedSessionsToday, totalCompletedSessions);

  const player = useAudioPlayer(require('../assets/sounds/alarm.mp3'));

  const triggerForegroundNotification = useCallback(async () => {
    if (vibrationEnabled && Platform.OS !== 'web') {
      Vibration.vibrate();
    }
    if (soundEnabled) {
      try {
        player.seekTo(0);
        player.play();
      } catch (error) {
        console.error("Error playing sound", error);
      }
    }
  }, [vibrationEnabled, soundEnabled, player]);

  useEffect(() => {
    const loadSessionDataAndSettings = async () => {
      try {
        const storedTotal = await AsyncStorage.getItem(TOTAL_SESSIONS_KEY);
        if (storedTotal !== null) {
          setTotalCompletedSessions(JSON.parse(storedTotal));
        }

        const storedDaily = await AsyncStorage.getItem(DAILY_SESSIONS_KEY);
        const lastSessionDate = await AsyncStorage.getItem(LAST_SESSION_DATE_KEY);
        const today = new Date().toDateString();

        if (lastSessionDate === today && storedDaily !== null) {
          setCompletedSessionsToday(JSON.parse(storedDaily));
        } else {
          // Reset daily count if it's a new day
          setCompletedSessionsToday(0);
          await AsyncStorage.setItem(DAILY_SESSIONS_KEY, JSON.stringify(0));
        }

        const storedSound = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
        if (storedSound !== null) {
          setSoundEnabled(JSON.parse(storedSound));
        }
        const storedVibration = await AsyncStorage.getItem(VIBRATION_ENABLED_KEY);
        if (storedVibration !== null) {
          setVibrationEnabled(JSON.parse(storedVibration));
        }

      } catch (error) {
        console.error("Error loading data or settings", error);
      }
    };
    loadSessionDataAndSettings();
  }, []);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    if (time === 0) {
        setIsActive(false);
        triggerForegroundNotification();
        awardPoints(10);
        
        // Update session counts and persist
        const newTotal = totalCompletedSessions + 1;
        setTotalCompletedSessions(newTotal);
        AsyncStorage.setItem(TOTAL_SESSIONS_KEY, JSON.stringify(newTotal));

        const newDaily = completedSessionsToday + 1;
        setCompletedSessionsToday(newDaily);
        AsyncStorage.setItem(DAILY_SESSIONS_KEY, JSON.stringify(newDaily));
        AsyncStorage.setItem(LAST_SESSION_DATE_KEY, new Date().toDateString());
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused, time, totalCompletedSessions, completedSessionsToday, awardPoints, triggerForegroundNotification]);

  const handleStart = () => {
    Alert.alert(
      "Rotate Device",
      "Please rotate your device horizontally for the best experience.",
      [
        {
          text: "OK",
          onPress: async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            setIsActive(true);
            setIsPaused(false);
            setIsTimerActive(true);
          },
        },
      ]
    );
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = async () => {
    setIsActive(false);
    setTime(FOCUS_TIME_SECONDS);
    setIsPaused(true);
    setIsTimerActive(false);
    await ScreenOrientation.unlockAsync();
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <ThemedView style={styles.container}>
      {!isTimerActive ? (
        <>
          <ThemedText style={styles.timerText}>{formatTime(time)}</ThemedText>
          <View style={styles.controls}>
            {!isActive && isPaused && 
                <Pressable style={styles.button} onPress={handleStart}>
                    <ThemedText>Start</ThemedText>
                </Pressable>
            }
            {isActive && (
                <Pressable style={styles.button} onPress={handlePauseResume}>
                    <ThemedText>{isPaused ? 'Resume' : 'Pause'}</ThemedText>
                </Pressable>
            )}
            <Pressable style={styles.button} onPress={handleReset}>
              <ThemedText>Reset</ThemedText>
            </Pressable>
          </View>
        </>
      ) : (
        <TimerAnimation time={time} onStop={handleReset} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    lineHeight: 80,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
});
