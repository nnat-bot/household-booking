import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Chip from '../../components/Chip';
import Screen from '../../components/Screen';
import ServiceCard from '../../components/ServiceCard';
import { getCategories, getServices } from '../../api/services';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';
import type { Category, Service } from '../../types';

const PRICES = [
  { label: 'Any price', value: '' },
  { label: 'Under 25€', value: '25' },
  { label: 'Under 30€', value: '30' },
];

export default function BrowseScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (selected: string, price: string) => {
    setLoading(true);
    setError('');
    try {
      const [list, groups] = await Promise.all([
        getServices(selected || undefined, price || undefined),
        getCategories(),
      ]);
      setServices(list);
      setCategories(groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(category, maxPrice);
  }, [category, maxPrice, load]);

  return (
    <Screen loading={loading} error={error} onRetry={() => load(category, maxPrice)}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <Chip label="All" selected={category === ''} onPress={() => setCategory('')} />
        {categories.map(group => (
          <Chip
            key={group.category}
            label={group.category}
            selected={category === group.category}
            onPress={() => setCategory(group.category)}
          />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {PRICES.map(price => (
          <Chip
            key={price.label}
            label={price.label}
            selected={maxPrice === price.value}
            onPress={() => setMaxPrice(price.value)}
          />
        ))}
      </ScrollView>

      {services.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No services match these filters.</Text>
        </View>
      ) : (
        services.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            onPress={() =>
              navigation.navigate('CleanerList', {
                category: service.category,
                title: service.title,
              })
            }
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {
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
