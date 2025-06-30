import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ProgressBar } from './ProgressBar';
import { TimerColors } from '@/constants/Themes';

export function TimerAnimation({ time, totalTime, onStop, timerColors }: { time: number; totalTime: number; onStop: () => void; timerColors: TimerColors }) {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ProgressBar timeRemaining={time} totalTime={totalTime} barColor={timerColors.barColor} fillColor={timerColors.fillColor} />
      <ThemedText style={[styles.animationText, { color: timerColors.textColor }]}>{formatTime(time)}</ThemedText>
      <Pressable style={[styles.button, { borderColor: '#FFFFFF' }]} onPress={onStop}>
        <ThemedText style={{ color: '#FFFFFF' }}>Stop</ThemedText>
      </Pressable>
    </View>
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
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
});
