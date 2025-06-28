import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Timer } from '@/components/Timer';

export default function TimerScreen() {
  return (
    <ThemedView style={styles.container}>
      <Timer />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});