import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SPARKLE_COLORS = ['#FFD700', '#FFC0CB', '#ADD8E6', '#90EE90', '#FFFFFF']; // Gold, Pink, Light Blue, Light Green, White

interface SparkleProps {
  size: number;
  color: string;
  duration: number;
  delay: number;
  initialOffsetX: number;
  initialOffsetY: number;
  verticalMovementRange: number;
}

const Sparkle: React.FC<SparkleProps> = ({ size, color, duration, delay, initialOffsetX, initialOffsetY, verticalMovementRange }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: duration / 2,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 } // Loop indefinitely
    );

    const timer = setTimeout(() => {
      animation.start();
    }, delay);

    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [animValue, duration, delay]);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [initialOffsetY, initialOffsetY - verticalMovementRange], // Move up by random range
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0], // Fade in and out
  });

  const scale = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 0.5], // Scale up and down
  });

  return (
    <Animated.View
      style={[
        styles.sparkle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        { transform: [{ translateX: initialOffsetX }, { translateY }, { scale }], opacity },
      ]}
    />
  );
};

interface SparkleEffectProps {
  count?: number;
  sparkleSize?: number;
  animationDuration?: number;
  spreadRange?: number; // Max offset from center for initial position
  verticalMovementRange?: number; // Max vertical movement for each sparkle
}

export const SparkleEffect: React.FC<SparkleEffectProps> = ({
  count = 30, // Increased count
  sparkleSize = 8,
  animationDuration = 2000,
  spreadRange = 300, // Spread sparkles within 300px from center
  verticalMovementRange = 300, // Sparkles move up to 300px
}) => {
  const sparkles = Array.from({ length: count }).map((_, i) => {
    const randomColor = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    const initialOffsetX = (Math.random() - 0.5) * 2 * spreadRange; // -spreadRange to +spreadRange
    const initialOffsetY = (Math.random() - 0.5) * 2 * spreadRange; // -spreadRange to +spreadRange
    const randomVerticalMovement = Math.random() * verticalMovementRange; // 0 to verticalMovementRange

    return (
      <Sparkle
        key={i}
        size={sparkleSize}
        color={randomColor}
        duration={animationDuration}
        delay={Math.random() * animationDuration} // Random delay for each sparkle
        initialOffsetX={initialOffsetX}
        initialOffsetY={initialOffsetY}
        verticalMovementRange={randomVerticalMovement}
      />
    );
  });

  return <View style={styles.container}>{sparkles}</View>;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Clip sparkles that go outside
  },
  sparkle: {
    position: 'absolute',
  },
});