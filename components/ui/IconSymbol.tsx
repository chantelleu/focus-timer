import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'star.fill': 'star',
  'gearshape.fill': 'settings',
  'heart.fill': 'favorite',
  'bolt.fill': 'bolt',
  'trophy.fill': 'emoji-events',
  'crown.fill': 'military-tech',
  'medal.fill': 'military-tech',
  'calendar.badge.plus': 'event',
  'calendar.badge.checkmark': 'event-available',
  'calendar.badge.exclamationmark': 'event-busy',
  'leaf.fill': 'eco',
  'moon.fill': 'dark-mode',
  'sun.max.fill': 'light-mode',
  'hourglass.toptimer.fill': 'hourglass-top',
  'checkmark.circle.fill': 'check-circle',
  'flame.fill': 'whatshot',
  'sparkles': 'auto-awesome',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}