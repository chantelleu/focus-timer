export interface AppColors {
  background: string;
  text: string;
  tint: string; // For tab bar active color
  icon: string; // For general icon color
}

export interface TimerColors {
  primary: string; // Main color for timer elements (e.g., text, progress bar)
  secondary: string; // Accent color for timer elements (e.g., background of progress bar)
  barColor: string; // Color of the progress bar itself
  fillColor: string; // Color of the filled portion of the progress bar
  textColor: string; // Color of the timer text
}

export interface AppTheme {
  id: string;
  name: string;
  appColors: AppColors;
  timerColors: TimerColors;
  isUnlockable: boolean;
  unlockedByBadgeId?: string; // The ID of the badge that unlocks this theme
}

export const SOFT_PASTEL_COLORS = [
  '#FFD1DC', // Pastel Pink
  '#B0E0E6', // Powder Blue
  '#CCEEFF', // Light Sky Blue
  '#D8BFD8', // Thistle
  '#FFECB3', // Light Yellow
  '#E0FFFF', // Light Cyan
  '#DDA0DD', // Plum
  '#BFEFFF', // Light Blue
];

export const Themes: AppTheme[] = [
  {
    id: 'default',
    name: 'Default',
    appColors: {
      background: '#121212',
      text: '#FFFFFF',
      tint: '#2f95dc',
      icon: '#FFFFFF',
    },
    timerColors: {
      primary: '#6200EE',
      secondary: '#03DAC6',
      barColor: '#6200EE',
      fillColor: '#03DAC6',
      textColor: '#000000',
    },
    isUnlockable: false,
  },
  {
    id: 'starlight-serenity',
    name: 'Starlight Serenity',
    appColors: {
      background: '#1A1A1A',
      text: '#FFFFFF',
      tint: '#2f95dc',
      icon: '#FFFFFF',
    },
    timerColors: {
      primary: '#6200EE',
      secondary: '#03DAC6',
      barColor: '#6200EE',
      fillColor: '#03DAC6',
      textColor: '#FFFFFF',
    },
    isUnlockable: true,
    unlockedByBadgeId: 'two-hundred-sessions',
  },
  {
    id: 'deep-sea-dive',
    name: 'Deep Sea Dive',
    appColors: {
      background: '#FFFFFF',
      text: '#000000',
      tint: '#2f95dc',
      icon: '#808080',
    },
    timerColors: {
      primary: '#0D47A1', // Dark Blue
      secondary: '#7FFFD4', // Aquamarine
      barColor: '#004D40', // Deep Teal
      fillColor: '#B0BEC5', // Shimmering Silver
      textColor: '#FFFFFF',
    },
    isUnlockable: true,
    unlockedByBadgeId: 'three-hundred-sessions',
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    appColors: {
      background: '#FFFFFF',
      text: '#000000',
      tint: '#2f95dc',
      icon: '#808080',
    },
    timerColors: {
      primary: '#FF0000', // Bright Red
      secondary: '#0000FF', // Bright Blue
      barColor: '#000000', // Black
      fillColor: '#FFFF00', // Bright Yellow
      textColor: '#FFFFFF',
    },
    isUnlockable: true,
    unlockedByBadgeId: 'four-hundred-sessions',
  },
];

// Helper to get theme colors by ID
export const getThemeColors = (themeId: string): { appColors: AppColors, timerColors: TimerColors } => {
  const theme = Themes.find(t => t.id === themeId);
  return theme ? { appColors: theme.appColors, timerColors: theme.timerColors } : { appColors: Themes[0].appColors, timerColors: Themes[0].timerColors };
};