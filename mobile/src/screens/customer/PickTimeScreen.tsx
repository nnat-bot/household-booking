import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import Screen from '../../components/Screen';
import { getSlots } from '../../api/providers';
import { toDateString } from '../../format';
import { colors, fontSize, radius, spacing, TOUCH_SIZE } from '../../theme';
import type { RootStackParams } from '../../navigation/types';
import type { Slot } from '../../types';

const DAYS_AHEAD = 14;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = NativeStackScreenProps<RootStackParams, 'PickTime'>;

function nextDays(count: number): Date[] {
  return Array.from({ length: count }, (ignored, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });
}

export default function PickTimeScreen({ navigation, route }: Props) {
  const { cleanerId, cleanerName, serviceId, serviceTitle, hourlyRate } = route.params;
  const days = nextDays(DAYS_AHEAD);

  const [date, setDate] = useState(toDateString(days[0]));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [chosen, setChosen] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setChosen(null);
    try {
      setSlots(await getSlots(cleanerId, date));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the free times');
    } finally {
      setLoading(false);
    }
  }, [cleanerId, date]);

  useEffect(() => {
    load();
  }, [load]);

  const handleContinue = () => {
    if (!chosen) {
      return;
    }
    navigation.navigate('Summary', {
      cleanerId,
      cleanerName,
      serviceId,
      serviceTitle,
      hourlyRate,
      date,
      startTime: chosen.start_time,
      endTime: chosen.end_time,
    });
  };

  return (
    <Screen error={error} onRetry={load}>
      <Text style={styles.section}>Choose a day</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.strip}>
        {days.map(day => {
          const value = toDateString(day);
          const selected = value === date;
          return (
            <Pressable
              key={value}
              onPress={() => setDate(value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${WEEKDAYS[day.getDay()]} ${day.getDate()}`}
              style={({ pressed }) => [styles.day, selected && styles.daySelected, pressed && styles.pressed]}
            >
              <Text style={[styles.dayName, selected && styles.onDark]}>{WEEKDAYS[day.getDay()]}</Text>
              <Text style={[styles.dayNumber, selected && styles.onDark]}>{day.getDate()}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.section}>Available times</Text>
      {loading ? (
        <Text style={styles.message}>Loading...</Text>
      ) : slots.length === 0 ? (
        <Text style={styles.message}>{cleanerName} does not work on this day.</Text>
      ) : (
        <View style={styles.slots}>
          {slots.map(slot => {
            const selected = chosen?.start_time === slot.start_time;
            return (
              <Pressable
                key={slot.start_time}
                onPress={() => setChosen(slot)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`From ${slot.start_time} to ${slot.end_time}`}
                style={({ pressed }) => [styles.slot, selected && styles.slotSelected, pressed && styles.pressed]}
              >
                <Text style={[styles.slotText, selected && styles.onDark]}>
                  {slot.start_time} - {slot.end_time}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} disabled={!chosen} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: fontSize.section,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.gap,
  },
  strip: {
    marginBottom: spacing.section,
  },
  day: {
    width: 52,
    height: 68,
    borderRadius: radius.card,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  daySelected: {
    backgroundColor: colors.text,
  },
  dayName: {
    fontSize: fontSize.tiny,
    fontWeight: 'bold',
    color: colors.text,
  },
  dayNumber: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  onDark: {
    color: colors.white,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
    minHeight: TOUCH_SIZE + 4,
    borderRadius: radius.pill,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  slotSelected: {
    backgroundColor: colors.text,
  },
  slotText: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
  },
  pressed: {
    opacity: 0.7,
  },
  message: {
    fontSize: fontSize.label,
    color: colors.muted,
    marginBottom: spacing.gap,
  },
  footer: {
    marginTop: spacing.gap,
  },
});
