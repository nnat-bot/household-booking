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
import type { Booking, BookingStatus } from '../../types';

const FILTERS: { label: string; statuses: BookingStatus[] }[] = [
  { label: 'New', statuses: ['pending'] },
  { label: 'Upcoming', statuses: ['confirmed'] },
  { label: 'Past', statuses: ['completed', 'declined', 'cancelled'] },
];

export default function RequestsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setBookings(await getBookings());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const shown = bookings.filter(booking => FILTERS[filter].statuses.includes(booking.status));

  return (
    <Screen loading={loading} error={error} onRetry={load} onRefresh={load}>
      <View style={styles.tabs}>
        {FILTERS.map((item, index) => (
          <Chip
            key={item.label}
            label={item.label}
            selected={filter === index}
            onPress={() => setFilter(index)}
          />
        ))}
      </View>

      {shown.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nothing here right now.</Text>
        </View>
      ) : (
        shown.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onPress={() => navigation.navigate('RequestDetail', { bookingId: booking.id })}
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
