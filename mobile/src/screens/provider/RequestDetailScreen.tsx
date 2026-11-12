import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import Screen from '../../components/Screen';
import StatusChip from '../../components/StatusChip';
import SummaryBox from '../../components/SummaryBox';
import {
  acceptBooking,
  completeBooking,
  declineBooking,
  getBooking,
} from '../../api/bookings';
import { formatDate, formatPrice, formatTime } from '../../format';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';
import type { BookingDetail } from '../../types';

type Props = NativeStackScreenProps<RootStackParams, 'RequestDetail'>;

export default function RequestDetailScreen({ navigation, route }: Props) {
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
      setError(err instanceof Error ? err.message : 'Could not load the request');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (action: (id: number) => Promise<void>, failMessage: string) => {
    setBusy(true);
    setError('');
    try {
      await action(bookingId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : failMessage);
    } finally {
      setBusy(false);
    }
  };

  const confirmDecline = () => {
    Alert.alert('Decline this request?', 'The customer will see that you declined it.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: () => runAction(declineBooking, 'Could not decline the request'),
      },
    ]);
  };

  const confirmComplete = () => {
    Alert.alert('Mark this booking as completed?', 'The customer can then leave a review.', [
      { text: 'Not yet', style: 'cancel' },
      {
        text: 'Mark as completed',
        onPress: () => runAction(completeBooking, 'Could not finish the booking'),
      },
    ]);
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
      <Text style={styles.name}>{booking.customer_name}</Text>
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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {booking.status === 'pending' ? (
        <>
          <Button
            title="Accept"
            busy={busy}
            onPress={() => runAction(acceptBooking, 'Could not accept the request')}
          />
          <Button title="Decline" variant="secondary" busy={busy} onPress={confirmDecline} />
        </>
      ) : null}

      {booking.status === 'confirmed' ? (
        <Button title="Mark as completed" busy={busy} onPress={confirmComplete} />
      ) : null}

      <Button
        title="Send a message"
        variant="secondary"
        onPress={() =>
          navigation.navigate('Chat', { bookingId: booking.id, title: booking.customer_name })
        }
      />
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
  error: {
    fontSize: fontSize.small,
    color: colors.danger,
    marginBottom: spacing.gap,
  },
});
