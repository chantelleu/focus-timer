/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemes } from '@/hooks/useThemes';
import { AppColors } from '@/constants/Themes';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof AppColors
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  const { getActiveThemeColors } = useThemes();
  const { appColors } = getActiveThemeColors();

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return appColors[colorName];
  }
}
