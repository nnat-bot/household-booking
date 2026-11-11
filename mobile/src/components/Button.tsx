import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, TOUCH_SIZE } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  busy?: boolean;
  disabled?: boolean;
};

export default function Button({ title, onPress, variant = 'primary', busy, disabled }: Props) {
  const off = disabled || busy;

  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.secondary,
        off && styles.off,
        pressed && styles.pressed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.text} />
      ) : (
        <Text
          style={[
            styles.title,
            variant === 'primary' && styles.titleOnDark,
            variant === 'danger' && styles.titleDanger,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: TOUCH_SIZE + 4,
    borderRadius: radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  primary: {
    backgroundColor: colors.text,
  },
  secondary: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  off: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  titleOnDark: {
    color: colors.white,
  },
  titleDanger: {
    color: colors.danger,
  },
});
