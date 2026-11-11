import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Avatar from '../../components/Avatar';
import Screen from '../../components/Screen';
import { getCleaner } from '../../api/providers';
import { formatPrice, formatRating } from '../../format';
import { colors, fontSize, radius, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';
import type { CleanerProfile } from '../../types';

type Props = NativeStackScreenProps<RootStackParams, 'CleanerProfile'>;

export default function CleanerProfileScreen({ navigation, route }: Props) {
  const { cleanerId } = route.params;
  const [cleaner, setCleaner] = useState<CleanerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCleaner(await getCleaner(cleanerId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the profile');
    } finally {
      setLoading(false);
    }
  }, [cleanerId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!cleaner) {
    return <Screen loading={loading} error={error} onRetry={load}><View /></Screen>;
  }

  return (
    <Screen loading={loading} error={error} onRetry={load}>
      <Avatar uri={cleaner.avatar_url} size={96} centered />

      <Text style={styles.name}>{cleaner.name}</Text>
      <Text style={styles.meta}>{formatRating(cleaner.rating)}</Text>
      <Text style={styles.meta}>{formatPrice(cleaner.hourly_rate)} / hour</Text>
      {cleaner.bio ? <Text style={styles.bio}>{cleaner.bio}</Text> : null}

      <Text style={styles.section}>Services</Text>
      {cleaner.services.map(service => (
        <Pressable
          key={service.id}
          accessibilityRole="button"
          accessibilityLabel={`Book ${service.title}`}
          onPress={() =>
            navigation.navigate('PickTime', {
              cleanerId: cleaner.id,
              cleanerName: cleaner.name,
              serviceId: service.id,
              serviceTitle: service.title,
              hourlyRate: cleaner.hourly_rate,
            })
          }
          style={({ pressed }) => [styles.service, pressed && styles.pressed]}
        >
          <View style={styles.serviceText}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDetail}>from {formatPrice(service.price_from)} / hour</Text>
          </View>
          <Text style={styles.book}>Book</Text>
        </Pressable>
      ))}

      <Text style={styles.section}>Reviews</Text>
      {cleaner.reviews.length === 0 ? (
        <Text style={styles.meta}>No reviews yet.</Text>
      ) : (
        cleaner.reviews.map((review, index) => (
          <View key={index} style={styles.review}>
            <Text style={styles.reviewHead}>
              {review.customer_name} · {review.rating} ★
            </Text>
            {review.comment ? <Text style={styles.reviewBody}>{review.comment}</Text> : null}
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.gap,
  },
  meta: {
    fontSize: fontSize.small,
    color: colors.text,
    textAlign: 'center',
    marginTop: 2,
  },
  bio: {
    fontSize: fontSize.label,
    color: colors.text,
    marginTop: spacing.gap,
  },
  section: {
    fontSize: fontSize.section,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.section,
    marginBottom: spacing.gap,
  },
  service: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.fill,
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  serviceText: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  serviceDetail: {
    fontSize: fontSize.small,
    color: colors.text,
    marginTop: 2,
  },
  book: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  review: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 12,
  },
  reviewHead: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
  },
  reviewBody: {
    fontSize: fontSize.small,
    color: colors.text,
    marginTop: 4,
  },
});
