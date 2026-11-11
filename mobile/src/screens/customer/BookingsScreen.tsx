import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BookingCard from '../../components/BookingCard';
import Chip from '../../components/Chip';
import Screen from '../../components/Screen';
import { getBookings } from '../../api/bookings';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';
import type { Booking } from '../../types';

const UPCOMING = ['pending', 'confirmed'];

export default function BookingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [upcoming, setUpcoming] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setBookings(await getBookings());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const shown = bookings.filter(booking =>
    upcoming ? UPCOMING.includes(booking.status) : !UPCOMING.includes(booking.status),
  );

  return (
    <Screen loading={loading} error={error} onRetry={load}>
      <View style={styles.tabs}>
        <Chip label="Upcoming" selected={upcoming} onPress={() => setUpcoming(true)} />
        <Chip label="Past" selected={!upcoming} onPress={() => setUpcoming(false)} />
      </View>

      {shown.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {upcoming ? 'You have no bookings coming up.' : 'Nothing in your history yet.'}
          </Text>
        </View>
      ) : (
        shown.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginBottom: spacing.gap,
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
