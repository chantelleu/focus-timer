import { StyleSheet, View, Text, Button, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Define constants for time
const FOCUS_TIME_MINUTES = 25;
const BREAK_TIME_MINUTES = 5;

export default function TimerScreen() {
  // For now, we'll just display the static time.
  // Timer logic will be added in the next step.
  const displayMinutes = String(FOCUS_TIME_MINUTES).padStart(2, '0');
  const displaySeconds = String(0).padStart(2, '0');

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Focus Timer</ThemedText>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{`${displayMinutes}:${displaySeconds}`}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={() => { /* Start logic here */ }} />
          <Button title="Pause" onPress={() => { /* Pause logic here */ }} />
          <Button title="Reset" onPress={() => { /* Reset logic here */ }} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // A light, calming background color
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  timerContainer: {
    borderWidth: 5,
    borderColor: '#007AFF', // A motivating blue color
    borderRadius: 150, // Makes it a circle
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});