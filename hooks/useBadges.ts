
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BADGES_KEY = 'focus-timer-badges';

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

const initialBadges: Badge[] = [
  { id: 'first-session', name: 'First Focus', description: 'Complete your first focus session.', earned: false },
  { id: 'five-sessions', name: 'Five Focuses', description: 'Complete five focus sessions.', earned: false },
  { id: 'daily-master', name: 'Daily Master', description: 'Complete three focus sessions in one day.', earned: false },
  // Add more badges as needed
];

export function useBadges(completedSessionsToday: number, totalCompletedSessions: number) {
  const [badges, setBadges] = useState<Badge[]>(initialBadges);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const storedBadges = await AsyncStorage.getItem(BADGES_KEY);
        if (storedBadges !== null) {
          setBadges(JSON.parse(storedBadges));
        }
      } catch (error) {
        console.error("Error loading badges", error);
      }
    };
    loadBadges();
  }, []);

  useEffect(() => {
    const checkAndAwardBadges = async () => {
      let updatedBadges = [...badges];
      let newBadgeEarned = false;

      // Check for 'First Focus' badge
      const firstSessionBadge = updatedBadges.find(b => b.id === 'first-session');
      if (firstSessionBadge && !firstSessionBadge.earned && totalCompletedSessions >= 1) {
        firstSessionBadge.earned = true;
        firstSessionBadge.earnedDate = new Date().toISOString();
        newBadgeEarned = true;
      }

      // Check for 'Five Focuses' badge
      const fiveSessionsBadge = updatedBadges.find(b => b.id === 'five-sessions');
      if (fiveSessionsBadge && !fiveSessionsBadge.earned && totalCompletedSessions >= 5) {
        fiveSessionsBadge.earned = true;
        fiveSessionsBadge.earnedDate = new Date().toISOString();
        newBadgeEarned = true;
      }

      // Check for 'Daily Master' badge
      const dailyMasterBadge = updatedBadges.find(b => b.id === 'daily-master');
      if (dailyMasterBadge && !dailyMasterBadge.earned && completedSessionsToday >= 3) {
        dailyMasterBadge.earned = true;
        dailyMasterBadge.earnedDate = new Date().toISOString();
        newBadgeEarned = true;
      }

      if (newBadgeEarned) {
        setBadges(updatedBadges);
        try {
          await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(updatedBadges));
        } catch (error) {
          console.error("Error saving badges", error);
        }
      }
    };

    checkAndAwardBadges();
  }, [completedSessionsToday, totalCompletedSessions, badges]);

  return { badges };
}
