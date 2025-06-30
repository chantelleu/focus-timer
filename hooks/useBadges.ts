import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BADGES_KEY = 'focus-timer-badges';

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  icon?: string; // Optional icon name for the badge
  assignedColor?: string; // Assigned color for earned badge
  assignedIcon?: string; // Assigned icon for earned badge
  redeemed: boolean; // Tracks if the badge has been redeemed
}

const PASTEL_COLORS = [
  '#FFB6C1', // Light Pink
  '#ADD8E6', // Light Blue
  '#90EE90', // Light Green
  '#FFDAB9', // Peach Puff
  '#E6E6FA', // Lavender
  '#B0E0E6', // Powder Blue
  
  '#A2D9CE', // Mint Green
  '#F5B7B1', // Coral Pink
  '#D7BDE2', // Light Purple
  '#A9CCE3', // Sky Blue
  '#FADBD8', // Light Salmon
];

let lastColorIndex = -1; // To keep track of the last used color index

const ICON_OPTIONS = [
  'star.fill',
  'heart.fill',
  'leaf.fill',
  'bolt.fill',
  'moon.fill',
  'sun.max.fill',
  'hourglass.toptimer.fill',
  'checkmark.circle.fill',
  'flame.fill',
  'sparkles',
  'medal.fill',
  'trophy.fill',
  'crown.fill',
];

let lastIconIndex = -1; // To keep track of the last used icon index

const getUniquePastelColor = () => {
  let newIndex = Math.floor(Math.random() * PASTEL_COLORS.length);
  while (newIndex === lastColorIndex && PASTEL_COLORS.length > 1) {
    newIndex = Math.floor(Math.random() * PASTEL_COLORS.length);
  }
  lastColorIndex = newIndex;
  return PASTEL_COLORS[newIndex];
};

const getUniqueBadgeIcon = () => {
  let newIndex = Math.floor(Math.random() * ICON_OPTIONS.length);
  while (newIndex === lastIconIndex && ICON_OPTIONS.length > 1) {
    newIndex = Math.floor(Math.random() * ICON_OPTIONS.length);
  }
  lastIconIndex = newIndex;
  return ICON_OPTIONS[newIndex];
};

const initialBadges: Badge[] = [
  {
    id: 'first-session', name: 'First Focus', description: 'Complete your first focus session.', earned: false, icon: 'heart.fill', assignedColor: '#A9CCE3',
    redeemed: false
  },
  {
    id: 'five-sessions', name: 'Five Focuses', description: 'Complete five focus sessions.', earned: false, icon: 'star.fill', assignedColor: '#D7BDE2',
    redeemed: false
  },
  {
    id: 'ten-sessions', name: 'Tenacious Ten', description: 'Complete ten focus sessions.', earned: false, icon: 'bolt.fill', assignedColor: '#FFB6C1',
    redeemed: false
  },
  {
    id: 'twenty-five-sessions', name: 'Quarter Century Focus', description: 'Complete twenty-five focus sessions.', earned: false, icon: 'trophy.fill', assignedColor: '#FFECB3',
    redeemed: false
  },
  {
    id: 'fifty-sessions', name: 'Half-Century Hustle', description: 'Complete fifty focus sessions.', earned: false, icon: 'crown.fill', assignedColor: '#90EE90',
    redeemed: false
  },
  {
    id: 'hundred-sessions', name: 'Centurion of Focus', description: 'Complete one hundred focus sessions.', earned: false, icon: 'medal.fill', assignedColor: '#FFDAB9',
    redeemed: false
  },
  {
    id: 'daily-master', name: 'Daily Master', description: 'Complete three focus sessions in one day.', earned: false, icon: 'calendar.badge.plus', assignedColor: '#A9CCE3',
    redeemed: false
  },
  {
    id: 'daily-pro', name: 'Daily Pro', description: 'Complete five focus sessions in one day.', earned: false, icon: 'calendar.badge.checkmark', assignedColor: '#FFB6C1',
    redeemed: false
  },
  {
    id: 'daily-legend', name: 'Daily Legend', description: 'Complete ten focus sessions in one day.', earned: false, icon: 'calendar.badge.exclamationmark', assignedColor: '#D7BDE2',
    redeemed: false
  },
];

export function useBadges(completedSessionsToday: number, totalCompletedSessions: number) {
  console.log("useBadges hook invoked");
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
            if (storedBadge) {
              const merged = { ...initialBadge, ...storedBadge, redeemed: storedBadge.redeemed || false };
              // If badge is earned but has no assignedColor (e.g., old data), assign one
              if (merged.earned && !merged.assignedColor) {
                merged.assignedColor = initialBadge.assignedColor;
              }
              // Always ensure assignedIcon is set from initialBadge.icon
              merged.assignedIcon = initialBadge.icon;
              console.log(`loadBadges: Merged badge ${merged.id}, assignedIcon: ${merged.assignedIcon}`);
              return merged;
            } else {
              // For new badges not in storage, ensure assignedIcon is set
              console.log(`loadBadges: New badge ${initialBadge.id}, assignedIcon: ${initialBadge.icon}`);
              return { ...initialBadge, redeemed: false, assignedIcon: initialBadge.icon };
            }
          });
          setBadges(mergedBadges);
        } else {
          // If no stored badges, initialize all badges with assignedIcon
          setBadges(initialBadges.map(badge => ({ ...badge, assignedIcon: badge.icon })));
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
        const initialBadgeData = initialBadges.find(b => b.id === id); // Get initial data here
        if (badge && !badge.earned && condition && initialBadgeData) {
          badge.earned = true;
          badge.earnedDate = new Date().toISOString();
          badge.assignedColor = initialBadgeData.assignedColor; // Assign specific color from initialBadges
          badge.assignedIcon = initialBadgeData.icon; // Assign specific icon from initialBadges
          console.log(`updateBadge: Badge ${badge.id} earned, assignedIcon: ${badge.assignedIcon}`);
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

  const redeemBadge = async (badgeId: string): Promise<boolean> => {
    let updatedBadges = [...badges];
    const badgeToRedeem = updatedBadges.find(b => b.id === badgeId);

    if (badgeToRedeem && badgeToRedeem.earned && !badgeToRedeem.redeemed) {
      badgeToRedeem.redeemed = true;
      setBadges(updatedBadges);
      try {
        await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(updatedBadges));
        return true;
      } catch (error) {
        console.error("Error redeeming badge", error);
        return false;
      }
    }
    return false;
  };

  return { badges, redeemBadge };
}
