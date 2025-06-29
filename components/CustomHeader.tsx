import { AppState, StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './ThemedText';

export function CustomHeader({ title }: { title: string }) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerTitle}>{title}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 12,
    paddingHorizontal: 24,
    paddingTop: Platform.select({ ios: 12, default: 24 }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});