import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import Button from '../../components/Button';
import Screen from '../../components/Screen';
import Stepper from '../../components/Stepper';
import { getMyWorkingHours, saveMyWorkingHours } from '../../api/providers';
import { colors, fontSize, radius, spacing } from '../../theme';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type DayRow = {
  working: boolean;
  startHour: number;
  endHour: number;
};

const emptyWeek = (): DayRow[] =>
  WEEKDAYS.map(() => ({ working: false, startHour: 8, endHour: 16 }));

export default function ScheduleScreen() {
  const [week, setWeek] = useState<DayRow[]>(emptyWeek());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const hours = await getMyWorkingHours();
      const next = emptyWeek();
      hours.forEach(row => {
        next[row.weekday] = {
          working: true,
          startHour: Number(row.start_time.slice(0, 2)),
          endHour: Number(row.end_time.slice(0, 2)),
        };
      });
      setWeek(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your working hours');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateDay = (index: number, changes: Partial<DayRow>) => {
    setWeek(current => current.map((day, i) => (i === index ? { ...day, ...changes } : day)));
    setSaved('');
  };

  const handleSave = async () => {
    setBusy(true);
    setError('');
    try {
      const hours = week
        .map((day, weekday) => ({ day, weekday }))
        .filter(item => item.day.working && item.day.endHour > item.day.startHour)
        .map(item => ({
          weekday: item.weekday,
          startTime: `${String(item.day.startHour).padStart(2, '0')}:00`,
          endTime: `${String(item.day.endHour).padStart(2, '0')}:00`,
        }));

      await saveMyWorkingHours(hours);
      setSaved('Your working hours are saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your working hours');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen loading={loading} error={error} onRetry={load}>
      {week.map((day, index) => (
        <View key={WEEKDAYS[index]} style={styles.day}>
          <View style={styles.dayHead}>
            <Text style={styles.dayName}>{WEEKDAYS[index]}</Text>
            <Switch
              value={day.working}
              onValueChange={working => updateDay(index, { working })}
              trackColor={{ false: colors.fill, true: colors.switchOn }}
              accessibilityLabel={`Work on ${WEEKDAYS[index]}`}
            />
          </View>

          {day.working ? (
            <View style={styles.hours}>
              <Stepper
                label="From"
                value={day.startHour}
                onChange={startHour => updateDay(index, { startHour })}
                min={0}
                max={22}
              />
              <Stepper
                label="To"
                value={day.endHour}
                onChange={endHour => updateDay(index, { endHour })}
                min={1}
                max={23}
              />
            </View>
          ) : null}
        </View>
      ))}

      {saved ? <Text style={styles.saved}>{saved}</Text> : null}

      <Button title="Save" onPress={handleSave} busy={busy} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  day: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.box,
    padding: 16,
    marginBottom: 12,
  },
  dayHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayName: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  hours: {
    marginTop: spacing.gap,
  },
  saved: {
    fontSize: fontSize.small,
    color: colors.green,
    marginBottom: spacing.gap,
  },
});
