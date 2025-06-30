import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Themes, AppTheme, AppColors, TimerColors, getThemeColors } from '@/constants/Themes';

const UNLOCKED_THEMES_KEY = 'unlocked-themes';
const ACTIVE_THEME_KEY = 'active-theme';
const ALL_THEMES_UNLOCKED_BETA_KEY = 'all-themes-unlocked-beta';

export function useThemes() {
  const [unlockedThemeIds, setUnlockedThemeIds] = useState<string[]>(['default']); // Default theme is always unlocked
  const [activeThemeId, setActiveThemeId] = useState<string>('default');
  const [allThemesUnlockedBeta, setAllThemesUnlockedBeta] = useState<boolean>(false);

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const storedUnlockedThemes = await AsyncStorage.getItem(UNLOCKED_THEMES_KEY);
        if (storedUnlockedThemes !== null) {
          setUnlockedThemeIds(JSON.parse(storedUnlockedThemes));
        }

        const storedActiveTheme = await AsyncStorage.getItem(ACTIVE_THEME_KEY);
        if (storedActiveTheme !== null) {
          setActiveThemeId(storedActiveTheme);
        }

        const storedAllThemesUnlockedBeta = await AsyncStorage.getItem(ALL_THEMES_UNLOCKED_BETA_KEY);
        if (storedAllThemesUnlockedBeta !== null) {
          setAllThemesUnlockedBeta(JSON.parse(storedAllThemesUnlockedBeta));
        }
      } catch (error) {
        console.error("Error loading themes", error);
      }
    };
    loadThemes();
  }, []);

  const getThemes = useCallback((): (AppTheme & { isUnlocked: boolean })[] => {
    return Themes.map(theme => ({
      ...theme,
      isUnlocked: unlockedThemeIds.includes(theme.id),
    }));
  }, [unlockedThemeIds]);

  const unlockTheme = useCallback(async (themeId: string): Promise<boolean> => {
    if (!unlockedThemeIds.includes(themeId)) {
      const newUnlockedThemes = [...unlockedThemeIds, themeId];
      setUnlockedThemeIds(newUnlockedThemes);
      try {
        await AsyncStorage.setItem(UNLOCKED_THEMES_KEY, JSON.stringify(newUnlockedThemes));
        return true;
      } catch (error) {
        console.error("Error unlocking theme", error);
        return false;
      }
    }
    return false;
  }, [unlockedThemeIds]);

  const selectActiveTheme = useCallback(async (themeId: string) => {
    if (unlockedThemeIds.includes(themeId) || allThemesUnlockedBeta) {
      setActiveThemeId(themeId); // Update state immediately
      try {
        await AsyncStorage.setItem(ACTIVE_THEME_KEY, themeId);
      } catch (error) {
        console.error("Error setting active theme", error);
      }
    } else {
      console.warn(`Theme ${themeId} is locked and cannot be set as active.`);
    }
  }, [unlockedThemeIds, allThemesUnlockedBeta]);

  const getActiveThemeColors = useCallback((): { appColors: AppColors, timerColors: TimerColors } => {
    return getThemeColors(activeThemeId);
  }, [activeThemeId]);

  const setAllThemesUnlockedBetaState = useCallback(async (value: boolean) => {
    setAllThemesUnlockedBeta(value);
    try {
      await AsyncStorage.setItem(ALL_THEMES_UNLOCKED_BETA_KEY, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting all themes unlocked beta state", error);
    }
  }, []);

  return {
    getThemes,
    unlockTheme,
    selectActiveTheme,
    getActiveThemeColors,
    activeThemeId,
    setAllThemesUnlockedBeta: setAllThemesUnlockedBetaState, // Expose setter for settings screen
  };
}