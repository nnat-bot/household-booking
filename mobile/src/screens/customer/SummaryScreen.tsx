import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import Screen from '../../components/Screen';
import SummaryBox from '../../components/SummaryBox';
import { createBooking } from '../../api/bookings';
import { formatDate, formatTime } from '../../format';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParams, 'Summary'>;

export default function SummaryScreen({ navigation, route }: Props) {
  const { cleanerId, cleanerName, serviceId, serviceTitle, hourlyRate, date, startTime, endTime } =
    route.params;

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const hours = Number(endTime.slice(0, 2)) - Number(startTime.slice(0, 2));
  const total = Math.round(Number(hourlyRate) * hours);

  const handleConfirm = async () => {
    setError('');
    setBusy(true);
    try {
      await createBooking({ providerId: cleanerId, serviceId, date, startTime, endTime });
      navigation.replace('Done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the booking');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <SummaryBox
        rows={[
          { label: 'Cleaner', value: cleanerName },
          { label: 'Service', value: serviceTitle },
          { label: 'Date', value: formatDate(date) },
          { label: 'Time', value: `${formatTime(startTime)} - ${formatTime(endTime)}` },
          { label: 'Estimated time', value: `${hours}hrs` },
        ]}
        totalLabel="Total"
        totalValue={`${total}€`}
      />

      <Text style={styles.note}>
        You pay the cleaner directly. Payment is not part of this app.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Confirm booking" onPress={handleConfirm} busy={busy} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    fontSize: fontSize.small,
    color: colors.muted,
    marginBottom: spacing.section,
  },
  error: {
    fontSize: fontSize.small,
    color: colors.danger,
    marginBottom: spacing.gap,
  },
});
