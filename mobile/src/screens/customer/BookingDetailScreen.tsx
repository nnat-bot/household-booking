import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Avatar from '../../components/Avatar';
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
const STARS = [1, 2, 3, 4, 5];

type Props = NativeStackScreenProps<RootStackParams, 'BookingDetail'>;

export default function BookingDetailScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setBooking(await getBooking(bookingId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the booking');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

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
      <Pressable
        onPress={() => navigation.navigate('CleanerProfile', { cleanerId: booking.provider_id })}
        accessibilityRole="button"
        accessibilityLabel={`Open the profile of ${booking.provider_name}`}
        style={({ pressed }) => [styles.nameRow, pressed && styles.pressed]}
      >
        <Avatar uri={booking.avatar_url} size={40} />
        <Text style={styles.name}>{booking.provider_name}</Text>
      </Pressable>

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

      {booking.review_rating ? (
        <View style={styles.review}>
          <Text style={styles.reviewTitle}>Your review</Text>
          <View style={styles.stars}>
            {STARS.map(star => (
              <MaterialIcons
                key={star}
                name={star <= Number(booking.review_rating) ? 'star' : 'star-border'}
                size={22}
                color={colors.text}
              />
            ))}
          </View>
          {booking.review_comment ? (
            <Text style={styles.reviewComment}>{booking.review_comment}</Text>
          ) : null}
        </View>
      ) : booking.status === 'completed' ? (
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  name: {
    flex: 1,
    marginLeft: 12,
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  review: {
    marginTop: spacing.gap,
  },
  reviewTitle: {
    fontSize: fontSize.section,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: fontSize.label,
    color: colors.text,
    marginTop: 8,
  },
  chip: {
    marginTop: spacing.gap,
    marginBottom: spacing.section,
  },
});
