import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ProgressBarProps {
  timeRemaining: number;
  totalTime: number;
  barColor: string;
  fillColor: string;
}

export function ProgressBar({ timeRemaining, totalTime }: ProgressBarProps) {
  const progress = 1 - (timeRemaining / totalTime);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progressBar,
          { width: `${progress * 100}%`, backgroundColor: 'rgba(0,0,0,0.8)' }, // Solid dark color, less transparent
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    height: '100%',
    borderRadius: 0,
  },
});