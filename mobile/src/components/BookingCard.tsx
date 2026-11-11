import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import StatusChip from './StatusChip';
import { colors, fontSize, radius } from '../theme';
import { formatDate, formatPrice, formatTime } from '../format';
import type { Booking } from '../types';

type Props = {
  booking: Booking;
  onPress: () => void;
};

export default function BookingCard({ booking, onPress }: Props) {
  const who = booking.provider_name ?? booking.customer_name ?? '';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open the booking with ${who}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        {booking.avatar_url ? (
          <Image source={{ uri: booking.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}

        <View style={styles.texts}>
          <Text style={styles.name}>{who}</Text>
          <Text style={styles.detail}>{booking.service_title}</Text>
          <Text style={styles.detail}>
            {formatDate(booking.booking_date)}, {formatTime(booking.start_time)}
          </Text>
        </View>

        <Text style={styles.price}>{formatPrice(booking.estimated_price)}</Text>
      </View>

      <View style={styles.chip}>
        <StatusChip status={booking.status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.fill,
    borderRadius: radius.card,
    padding: 12,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.tile,
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
  price: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  chip: {
    marginTop: 10,
  },
});
