import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Pressable, Vibration, Platform, Dimensions, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from './ThemedText';
import { TimerAnimation } from './TimerAnimation';
import { RewardAnimation } from './RewardAnimation';
import { useBadges } from '@/hooks/useBadges';
import { useTimerActive } from '@/context/TimerActiveContext';
import { useThemes } from '../hooks/useThemes';
import { SOFT_PASTEL_COLORS } from '@/constants/Themes';

const FOCUS_TIME_MINUTES = 1;
const FOCUS_TIME_SECONDS = FOCUS_TIME_MINUTES * 60;
const TOTAL_SESSIONS_KEY = 'total-completed-sessions';
const DAILY_SESSIONS_KEY = 'daily-completed-sessions';
const LAST_SESSION_DATE_KEY = 'last-session-date';
const SOUND_ENABLED_KEY = 'sound-enabled';
const VIBRATION_ENABLED_KEY = 'vibration-enabled';

export function Timer() {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const [time, setTime] = useState(FOCUS_TIME_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [totalCompletedSessions, setTotalCompletedSessions] = useState(0);
  const [completedSessionsToday, setCompletedSessionsToday] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { isTimerActive, setIsTimerActive, showRewardAnimation, setShowRewardAnimation } = useTimerActive();
  const { getActiveThemeColors, activeThemeId } = useThemes();
  const { appColors, timerColors } = getActiveThemeColors() || {};

  const defaultTimerColors = {
    primary: '#BB86FC', // Light purple for buttons on dark background
    secondary: '#03DAC6',
    barColor: '#6200EE',
    fillColor: '#333333', // Dark color for the filling bar
    textColor: '#FFFFFF',
  };

  const currentTimerColors = isLandscape ? timerColors : defaultTimerColors;

  const animatedBackgroundColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (
      activeThemeId === 'default' &&
      isLandscape &&
      isActive &&
      !isPaused
    ) {
      Animated.loop(
        Animated.sequence(
          SOFT_PASTEL_COLORS.map((_, index) =>
            Animated.timing(animatedBackgroundColor, {
              toValue: index,
              duration: 5000,
              useNativeDriver: false,
            })
          )
        )
      ).start();
    } else {
      animatedBackgroundColor.stopAnimation();
    }
  }, [activeThemeId, isLandscape, isActive, isPaused]);


  const backgroundColorInterpolate = animatedBackgroundColor.interpolate({
    inputRange: SOFT_PASTEL_COLORS.map((_, index) => index),
    outputRange: SOFT_PASTEL_COLORS,
  });

  useBadges(completedSessionsToday, totalCompletedSessions);

  const startPlayer = useAudioPlayer(require('../assets/sounds/startnotification1.mp3'));
  const endPlayer = useAudioPlayer(require('../assets/sounds/endalarm3.mp3'));
  const pausePlayer = useAudioPlayer(require('../assets/sounds/pause2.mp3'));

  const triggerForegroundNotification = useCallback(async () => {
    if (vibrationEnabled && Platform.OS !== 'web') {
      Vibration.vibrate();
    }
    if (soundEnabled) {
      try {
        endPlayer.seekTo(0);
        endPlayer.play();
      } catch (error) {
        console.error("Error playing sound", error);
      }
    }
  }, [vibrationEnabled, soundEnabled, endPlayer]);

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

    if (time === 0 && isActive) {
      setIsActive(false);
      triggerForegroundNotification();
      setIsTimerActive(false);


      setShowRewardAnimation(true);
      
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
  }, [isActive, isPaused, time, totalCompletedSessions, completedSessionsToday, triggerForegroundNotification, setIsTimerActive]);

  const handleStart = async () => {
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 1000);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (soundEnabled) {
      try {
        startPlayer.seekTo(0);
        startPlayer.play();
      } catch (error) {
        console.error("Error playing sound", error);
      }
    }
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    setIsActive(true);
    setIsPaused(false);
    setIsTimerActive(true);
  };

  const handlePauseResume = () => {
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 1000);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPaused(!isPaused);
  };

  const handleReset = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (soundEnabled) {
      try {
        pausePlayer.seekTo(0);
        pausePlayer.play();
      } catch (error) {
        console.error("Error playing sound", error);
      }
    }
    setIsActive(false);
    setTime(FOCUS_TIME_SECONDS);
    setIsPaused(true);
    setIsTimerActive(false);
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleRewardAnimationFinish = async () => {
    setShowRewardAnimation(false);
    await ScreenOrientation.unlockAsync();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        activeThemeId === 'default' &&
        isLandscape &&
        isActive &&
        !isPaused && {
          backgroundColor: backgroundColorInterpolate,
        },
      ]}
    >

      {showRewardAnimation ? (
        <RewardAnimation onFinish={handleRewardAnimationFinish} badgeIconName="star.fill" />
      ) : !isTimerActive ? (
        <>
          <ThemedText style={[styles.timerText, { color: appColors.text }]}>{formatTime(time)}</ThemedText>
          <View style={styles.controls}>
            {!isActive && isPaused ?
                <Pressable style={[styles.button, { borderColor: appColors.tint }]} onPress={handleStart} disabled={isButtonDisabled}>
                    <ThemedText style={{ color: appColors.text }}>Start</ThemedText>
                </Pressable>
            : null}
            {isActive ?
                <Pressable style={[styles.button, { borderColor: appColors.tint }]} onPress={handlePauseResume} disabled={isButtonDisabled}>
                    <ThemedText style={{ color: appColors.text }}>{isPaused ? 'Resume' : 'Pause'}</ThemedText>
                </Pressable>
            : null}
            <Pressable style={[styles.button, { borderColor: appColors.tint }]} onPress={handleReset}>
              <ThemedText style={{ color: appColors.text }}>Reset</ThemedText>
            </Pressable>
          </View>
        </>
      ) : (
        <TimerAnimation time={time} totalTime={FOCUS_TIME_SECONDS} onStop={handleReset} timerColors={currentTimerColors} />
      )}
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