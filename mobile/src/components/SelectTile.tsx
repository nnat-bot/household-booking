import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius } from '../theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function SelectTile({ label, selected, onPress, icon }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <View style={[styles.tile, selected && styles.tileSelected]}>
        {icon ? <MaterialIcons name={icon} size={32} color={colors.text} /> : null}
        {selected ? (
          <View style={styles.check}>
            <MaterialIcons name="check" size={14} color={colors.white} />
          </View>
        ) : null}
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  tile: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 100,
    backgroundColor: colors.fill,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileSelected: {
    borderColor: colors.text,
  },
  check: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
});
