
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BADGES_KEY = 'focus-timer-badges';

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  icon?: string; // New: Optional icon name for the badge
}

const initialBadges: Badge[] = [
  { id: 'first-session', name: 'First Focus', description: 'Complete your first focus session.', earned: false, icon: 'hourglass.toptimer.fill' },
  { id: 'five-sessions', name: 'Five Focuses', description: 'Complete five focus sessions.', earned: false, icon: 'star.fill' },
  { id: 'ten-sessions', name: 'Tenacious Ten', description: 'Complete ten focus sessions.', earned: false, icon: 'star.leading.half.filled' },
  { id: 'twenty-five-sessions', name: 'Quarter Century Focus', description: 'Complete twenty-five focus sessions.', earned: false, icon: 'trophy.fill' },
  { id: 'fifty-sessions', name: 'Half-Century Hustle', description: 'Complete fifty focus sessions.', earned: false, icon: 'crown.fill' },
  { id: 'hundred-sessions', name: 'Centurion of Focus', description: 'Complete one hundred focus sessions.', earned: false, icon: 'medal.fill' },
  { id: 'daily-master', name: 'Daily Master', description: 'Complete three focus sessions in one day.', earned: false, icon: 'calendar.badge.plus' },
  { id: 'daily-pro', name: 'Daily Pro', description: 'Complete five focus sessions in one day.', earned: false, icon: 'calendar.badge.checkmark' },
  { id: 'daily-legend', name: 'Daily Legend', description: 'Complete ten focus sessions in one day.', earned: false, icon: 'calendar.badge.exclamationmark' },
];

export function useBadges(completedSessionsToday: number, totalCompletedSessions: number) {
  const [badges, setBadges] = useState<Badge[]>(initialBadges);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const storedBadges = await AsyncStorage.getItem(BADGES_KEY);
        if (storedBadges !== null) {
          const parsedBadges = JSON.parse(storedBadges);
          // Merge stored badges with initialBadges to add new badges without losing old ones
          const mergedBadges = initialBadges.map(initialBadge => {
            const storedBadge = parsedBadges.find((b: Badge) => b.id === initialBadge.id);
            return storedBadge ? { ...initialBadge, ...storedBadge } : initialBadge;
          });
          setBadges(mergedBadges);
        } else {
          setBadges(initialBadges);
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

      const updateBadge = (id: string, condition: boolean) => {
        const badge = updatedBadges.find(b => b.id === id);
        if (badge && !badge.earned && condition) {
          badge.earned = true;
          badge.earnedDate = new Date().toISOString();
          newBadgeEarned = true;
        }
      };

      // Session Badges
      updateBadge('first-session', totalCompletedSessions >= 1);
      updateBadge('five-sessions', totalCompletedSessions >= 5);
      updateBadge('ten-sessions', totalCompletedSessions >= 10);
      updateBadge('twenty-five-sessions', totalCompletedSessions >= 25);
      updateBadge('fifty-sessions', totalCompletedSessions >= 50);
      updateBadge('hundred-sessions', totalCompletedSessions >= 100);

      // Daily Badges
      updateBadge('daily-master', completedSessionsToday >= 3);
      updateBadge('daily-pro', completedSessionsToday >= 5);
      updateBadge('daily-legend', completedSessionsToday >= 10);

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
