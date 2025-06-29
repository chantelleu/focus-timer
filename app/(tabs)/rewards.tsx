
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomHeader } from '@/components/CustomHeader';
import { usePoints } from '@/hooks/usePoints';
import { useBadges } from '@/hooks/useBadges';

export default function RewardsScreen() {
  const { points } = usePoints();
  // We need to pass dummy values for now, as useBadges expects them.
  // In a real app, these would come from a global state or context.
  const { badges } = useBadges(0, 0);

  return (
    <ThemedView style={styles.container}>
      <CustomHeader title="Rewards" />
      <ThemedText style={styles.pointsText}>Points: {points}</ThemedText>

      <ThemedText style={styles.subtitle}>Badges Earned:</ThemedText>
      {
        badges.filter(badge => badge.earned).length > 0 ? (
          badges.filter(badge => badge.earned).map((badge) => (
            <ThemedView key={badge.id} style={styles.badgeContainer}>
              <ThemedText style={styles.badgeName}>{badge.name}</ThemedText>
              <ThemedText style={styles.badgeDescription}>{badge.description}</ThemedText>
              {badge.earnedDate && (
                <ThemedText style={styles.badgeDate}>Earned: {new Date(badge.earnedDate).toLocaleDateString()}</ThemedText>
              )}
            </ThemedView>
          ))
        ) : (
          <ThemedText>No badges earned yet. Keep focusing!</ThemedText>
        )
      }

      <ThemedText style={styles.subtitle}>Available Badges:</ThemedText>
      {
        badges.filter(badge => !badge.earned).length > 0 ? (
          badges.filter(badge => !badge.earned).map((badge) => (
            <ThemedView key={badge.id} style={styles.badgeContainer}>
              <ThemedText style={styles.badgeName}>{badge.name}</ThemedText>
              <ThemedText style={styles.badgeDescription}>{badge.description}</ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedText>All badges earned!</ThemedText>
        )
      }
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  pointsText: {
    fontSize: 24,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  badgeContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badgeDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
  },
  badgeDate: {
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
    color: '#333',
  },
});
