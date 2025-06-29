import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';

interface RewardAnimationProps {
  onFinish: () => void;
}

export function RewardAnimation({ onFinish }: RewardAnimationProps) {
  return (
    <Pressable style={styles.container} onPress={onFinish}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Congratulations!</ThemedText>
        <ThemedText style={styles.message}>You focused for the duration!</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent overlay
  },
  content: {
    width: '80%',
    paddingVertical: 40,
    paddingHorizontal: 40,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50', // Green color for success
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
});