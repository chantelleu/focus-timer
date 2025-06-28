import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Timer } from '@/components/Timer';

export default function TimerScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Timer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});