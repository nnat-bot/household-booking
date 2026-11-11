import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import { colors, fontSize, radius } from '../theme';
import { formatPrice, formatRating } from '../format';
import type { Cleaner } from '../types';

type Props = {
  cleaner: Cleaner;
  onPress: () => void;
};

export default function CleanerCard({ cleaner, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open the profile of ${cleaner.name}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Avatar uri={cleaner.avatar_url} size={56} />

      <View style={styles.texts}>
        <Text style={styles.name}>{cleaner.name}</Text>
        <Text style={styles.detail}>{formatRating(cleaner.rating, cleaner.review_count)}</Text>
        <Text style={styles.detail}>{formatPrice(cleaner.hourly_rate)} / hour</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.fill,
    borderRadius: radius.card,
    padding: 12,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  texts: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  detail: {
    fontSize: fontSize.small,
    color: colors.text,
    marginTop: 2,
  },
});
