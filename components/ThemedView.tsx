import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { AppColors } from '@/constants/Themes';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: keyof AppColors; // New prop to specify color name
};

export function ThemedView({ style, lightColor, darkColor, colorName = 'background', ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorName);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
