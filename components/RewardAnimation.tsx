import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { SparkleEffect } from './SparkleEffect';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';

interface RewardAnimationProps {
  onFinish: () => void;
  showSparkles?: boolean;
  badgeIconName?: IconSymbolName;
}

export function RewardAnimation({ onFinish, showSparkles = true, badgeIconName }: RewardAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.back(1.7),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <Pressable style={styles.container} onPress={onFinish}>
      <Animated.View
        style={[
          styles.content,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        {showSparkles && <SparkleEffect />}
        {badgeIconName && <IconSymbol name={badgeIconName} size={60} color="#FFD700" style={{ marginBottom: 10 }} />}
        <ThemedText style={styles.title}>Congratulations!</ThemedText>
        <ThemedText style={styles.message}>You focused for the duration!</ThemedText>
      </Animated.View>
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
    flex: 1,
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#000', // Changed to black
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000', // Changed to black
  },
});
