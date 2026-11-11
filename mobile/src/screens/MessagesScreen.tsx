import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Avatar from '../components/Avatar';
import Screen from '../components/Screen';
import { getBookings } from '../api/bookings';
import { formatDate } from '../format';
import { colors, fontSize, radius, spacing } from '../theme';
import type { RootStackParams } from '../navigation/types';
import type { Booking } from '../types';

export default function MessagesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setBookings(await getBookings());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the chats');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen loading={loading} error={error} onRetry={load} onRefresh={load}>
      {bookings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>You have no chats yet.</Text>
        </View>
      ) : (
        bookings.map(booking => {
          const who = booking.provider_name ?? booking.customer_name ?? '';
          return (
            <Pressable
              key={booking.id}
              onPress={() => navigation.navigate('Chat', { bookingId: booking.id, title: who })}
              accessibilityRole="button"
              accessibilityLabel={`Open the chat with ${who}`}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <Avatar uri={booking.avatar_url} size={48} />

              <View style={styles.texts}>
                <Text style={styles.name}>{who}</Text>
                <Text style={styles.detail}>
                  {booking.service_title} · {formatDate(booking.booking_date)}
                </Text>
              </View>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
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
  empty: {
    paddingVertical: spacing.section,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.label,
    color: colors.muted,
  },
});
