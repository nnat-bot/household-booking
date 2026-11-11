import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import Screen from '../../components/Screen';
import StatusChip from '../../components/StatusChip';
import SummaryBox from '../../components/SummaryBox';
import { cancelBooking, getBooking } from '../../api/bookings';
import { formatDate, formatPrice, formatTime } from '../../format';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';
import type { BookingDetail } from '../../types';

const CAN_CANCEL = ['pending', 'confirmed'];

type Props = NativeStackScreenProps<RootStackParams, 'BookingDetail'>;

export default function BookingDetailScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBooking(await getBooking(bookingId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the booking');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = () => {
    Alert.alert(
      'Cancel this booking?',
      'The cleaner will be notified. This cannot be undone.',
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Yes, cancel',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              await cancelBooking(bookingId);
              await load();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not cancel the booking');
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  };

  if (!booking) {
    return (
      <Screen loading={loading} error={error} onRetry={load}>
        <View />
      </Screen>
    );
  }

  return (
    <Screen loading={loading} error={error} onRetry={load}>
      <Text style={styles.name}>{booking.provider_name}</Text>
      <View style={styles.chip}>
        <StatusChip status={booking.status} />
      </View>

      <SummaryBox
        rows={[
          { label: 'Service', value: booking.service_title },
          { label: 'Date', value: formatDate(booking.booking_date) },
          {
            label: 'Time',
            value: `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`,
          },
        ]}
        totalLabel="Total"
        totalValue={formatPrice(booking.estimated_price)}
      />

      <Button
        title="Send a message"
        variant="secondary"
        onPress={() =>
          navigation.navigate('Chat', { bookingId: booking.id, title: booking.provider_name })
        }
      />

      {CAN_CANCEL.includes(booking.status) ? (
        <Button title="Cancel booking" variant="danger" onPress={handleCancel} busy={busy} />
      ) : null}

      {booking.status === 'completed' ? (
        <Button
          title="Write a review"
          variant="secondary"
          onPress={() =>
            navigation.navigate('Review', {
              bookingId: booking.id,
              cleanerName: booking.provider_name,
            })
          }
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  chip: {
    marginTop: spacing.gap,
    marginBottom: spacing.section,
  },
});
