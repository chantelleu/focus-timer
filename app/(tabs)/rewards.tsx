import { StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CustomHeader } from '@/components/CustomHeader';
import { useBadges } from '@/hooks/useBadges';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RedeemBadgeModal } from '@/components/RedeemBadgeModal'; // Import the modal component

const TOTAL_SESSIONS_KEY = 'total-completed-sessions';
const DAILY_SESSIONS_KEY = 'daily-completed-sessions';
const LAST_SESSION_DATE_KEY = 'last-session-date';

export default function RewardsScreen() {
  const [totalCompletedSessions, setTotalCompletedSessions] = useState(0);
  const [completedSessionsToday, setCompletedSessionsToday] = useState(0);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null); // Store the badge to be redeemed

  useEffect(() => {
    const loadSessionData = async () => {
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
      } catch (error) {
        console.error("Error loading session data for rewards", error);
      }
    };
    loadSessionData();
  }, []);

  const { badges, redeemBadge } = useBadges(completedSessionsToday, totalCompletedSessions); // Get redeemBadge from hook

  const handleBadgePress = (badge: any) => {
    setSelectedBadge(badge);
    setIsRedeemModalVisible(true);
  };

  const handleModalClose = () => {
    setIsRedeemModalVisible(false);
    setSelectedBadge(null); // Clear selected badge when modal closes
  };

  return (
    <ThemedView style={styles.container}>
      <CustomHeader title="Rewards" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <ThemedText style={styles.subtitle}>Badges Earned:</ThemedText>
        {
          badges.filter(badge => badge.earned).length > 0 ? (
            badges.filter(badge => badge.earned).map((badge) => (
              <Pressable
                key={badge.id}
                onPress={() => handleBadgePress(badge)} // Open modal on press
                style={[
                  styles.badgeContainer,
                  { backgroundColor: badge.assignedColor || '#f0f0f0' },
                  badge.redeemed && styles.redeemedBadgeContainer,
                ]}
              >
                {badge.assignedIcon && <IconSymbol name={badge.assignedIcon} size={40} color={badge.assignedColor || "#FFD700"} style={{ marginBottom: 5 }} />}
                <ThemedText style={styles.badgeName}>{badge.name}</ThemedText>
                <ThemedText style={styles.badgeDescription}>{badge.description}</ThemedText>
                {badge.earnedDate && (
                  <ThemedText style={styles.badgeDate}>Earned: {new Date(badge.earnedDate).toLocaleDateString()}</ThemedText>
                )}
              </Pressable>
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
                {badge.assignedIcon && <IconSymbol name={badge.assignedIcon} size={40} color="#CCCCCC" style={{ marginBottom: 5 }} />}
                <ThemedText style={styles.badgeName}>{badge.name}</ThemedText>
                <ThemedText style={styles.badgeDescription}>{badge.description}</ThemedText>
              </ThemedView>
            ))
          ) : (
            <ThemedText>All badges earned!</ThemedText>
          )
        }
      </ScrollView>

      {/* Redeem Badge Modal */}
      <RedeemBadgeModal
        isVisible={isRedeemModalVisible}
        badge={selectedBadge}
        onClose={handleModalClose}
        onRedeem={redeemBadge} // Pass the redeemBadge function
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 80, // Increased padding at the bottom for better scrolling
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  badgeContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    minHeight: 100, // Added minHeight to ensure tappable area
  },
  redeemedBadgeContainer: {
    opacity: 0.6, // Make redeemed badges slightly transparent
    borderWidth: 2,
    borderColor: '#A9A9A9', // Add a border to redeemed badges
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