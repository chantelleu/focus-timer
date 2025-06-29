import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { ProgressBar } from './ProgressBar';

export function TimerAnimation({ time, totalTime, onStop }: { time: number; totalTime: number; onStop: () => void }) {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF6347', '#4682B4'], // Tomato to SteelBlue
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <ProgressBar timeRemaining={time} totalTime={totalTime} />
      <ThemedText style={styles.animationText}>{formatTime(time)}</ThemedText>
      <Pressable style={styles.button} onPress={onStop}>
        <ThemedText>Stop</ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  animationText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
});