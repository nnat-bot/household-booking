import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, TOUCH_SIZE } from '../theme';

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
};

export default function Stepper({ label, value, onChange, step = 1, min = 0, max = 999 }: Props) {
  const change = (amount: number) => {
    const next = value + amount;
    if (next >= min && next <= max) {
      onChange(next);
    }
  };

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pill}>
        <Pressable
          onPress={() => change(-step)}
          disabled={value - step < min}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          style={({ pressed }) => [styles.round, pressed && styles.pressed]}
        >
          <MaterialIcons
            name="remove-circle-outline"
            size={28}
            color={value - step < min ? colors.muted : colors.text}
          />
        </Pressable>

        <Text style={styles.value}>{value}</Text>

        <Pressable
          onPress={() => change(step)}
          disabled={value + step > max}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
          style={({ pressed }) => [styles.round, pressed && styles.pressed]}
        >
          <MaterialIcons
            name="add-circle-outline"
            size={28}
            color={value + step > max ? colors.muted : colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  label: {
    fontSize: fontSize.section,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.fill,
    borderRadius: radius.pill,
    height: TOUCH_SIZE + 4,
    paddingHorizontal: 8,
  },
  round: {
    width: TOUCH_SIZE,
    height: TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  value: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
});
