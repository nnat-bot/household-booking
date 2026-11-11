import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius } from '../theme';
import type { BookingStatus } from '../types';

const labels: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  declined: 'Declined',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

type Props = {
  status: BookingStatus;
};

export default function StatusChip({ status }: Props) {
  return (
    <View style={[styles.chip, styles[status]]}>
      <Text style={[styles.text, (status === 'confirmed' || status === 'completed') && styles.onDark]}>
        {labels[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  text: {
    fontSize: fontSize.tiny,
    fontWeight: 'bold',
    color: colors.text,
  },
  onDark: {
    color: colors.white,
  },
  pending: {
    backgroundColor: colors.fill,
  },
  confirmed: {
    backgroundColor: colors.green,
  },
  completed: {
    backgroundColor: colors.text,
  },
  declined: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  cancelled: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.muted,
  },
});
