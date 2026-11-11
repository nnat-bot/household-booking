import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CleanerCard from '../../components/CleanerCard';
import Screen from '../../components/Screen';
import { getCleaners } from '../../api/providers';
import { getServices } from '../../api/services';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';
import type { Cleaner } from '../../types';

type Props = NativeStackScreenProps<RootStackParams, 'CleanerList'>;

export default function CleanerListScreen({ navigation, route }: Props) {
  const { category } = route.params;
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [services, all] = await Promise.all([getServices(category), getCleaners()]);
      const ids = services.map(service => service.provider_id);
      setCleaners(all.filter(cleaner => ids.includes(cleaner.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the cleaners');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Screen loading={loading} error={error} onRetry={load}>
      <Text style={styles.count}>
        {cleaners.length} {cleaners.length === 1 ? 'cleaner' : 'cleaners'} available
      </Text>

      {cleaners.map(cleaner => (
        <CleanerCard
          key={cleaner.id}
          cleaner={cleaner}
          onPress={() => navigation.navigate('CleanerProfile', { cleanerId: cleaner.id })}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  count: {
    fontSize: fontSize.small,
    color: colors.muted,
    marginBottom: spacing.gap,
  },
});
