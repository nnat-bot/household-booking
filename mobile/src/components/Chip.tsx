import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, TOUCH_SIZE } from '../theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: TOUCH_SIZE,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.fill,
    marginRight: 8,
  },
  selected: {
    backgroundColor: colors.text,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
  },
  labelSelected: {
    color: colors.white,
  },
});
