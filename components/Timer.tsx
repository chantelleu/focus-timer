
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useNotifications } from '@/hooks/useNotifications';
import { usePoints } from '@/hooks/usePoints';

const FOCUS_TIME_MINUTES = 25;
const FOCUS_TIME_SECONDS = FOCUS_TIME_MINUTES * 60;

export function Timer() {
  const [time, setTime] = useState(FOCUS_TIME_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const { awardPoints } = usePoints();

  useNotifications();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

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
        schedulePushNotification();
        awardPoints(10);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused, time]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(FOCUS_TIME_SECONDS);
    setIsPaused(true);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's up!",
        body: 'Your focus session has ended. Time for a break!',
      },
      trigger: { seconds: 1 },
    });
  }

  return (
    <ThemedView style={styles.container}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
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
