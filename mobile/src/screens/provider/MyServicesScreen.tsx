import { useCallback, useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import Input from '../../components/Input';
import Screen from '../../components/Screen';
import {
  addMyService,
  deleteMyService,
  getMyServices,
  updateMyService,
} from '../../api/providers';
import { formatCategory, formatPrice } from '../../format';
import { colors, fontSize, radius, spacing, TOUCH_SIZE } from '../../theme';
import type { ProviderService } from '../../types';

const CATEGORIES = [
  { value: 'standard', label: 'Standard' },
  { value: 'deep', label: 'Deep' },
  { value: 'window', label: 'Windows' },
  { value: 'moveout', label: 'Move-out' },
];

export default function MyServicesScreen() {
  const [services, setServices] = useState<ProviderService[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [category, setCategory] = useState('standard');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setServices(await getMyServices());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clearForm = () => {
    setEditing(null);
    setCategory('standard');
    setTitle('');
    setDescription('');
    setPriceFrom('');
    setTitleError('');
    setPriceError('');
    setFormError('');
  };

  const startEdit = (service: ProviderService) => {
    setEditing(service.id);
    setCategory(service.category);
    setTitle(service.title);
    setDescription(service.description ?? '');
    setPriceFrom(service.price_from);
    setTitleError('');
    setPriceError('');
    setFormError('');
  };

  const handleSave = async () => {
    const missingTitle = title.trim() ? '' : 'Please fill in the title';
    const missingPrice = priceFrom.trim() ? '' : 'Please fill in the price';
    setTitleError(missingTitle);
    setPriceError(missingPrice);
    if (missingTitle || missingPrice) {
      return;
    }

    setFormError('');
    setBusy(true);
    try {
      const values = {
        category,
        title: title.trim(),
        description: description.trim(),
        priceFrom: priceFrom.trim(),
      };

      if (editing) {
        await updateMyService(editing, values);
      } else {
        await addMyService(values);
      }

      clearForm();
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save the service');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = (service: ProviderService) => {
    Alert.alert('Delete this service?', service.title, [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMyService(service.id);
            if (editing === service.id) {
              clearForm();
            }
            await load();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not delete the service');
          }
        },
      },
    ]);
  };

  return (
    <Screen loading={loading} error={error} onRetry={load}>
      {services.map(service => (
        <View key={service.id} style={styles.row}>
          <Pressable
            onPress={() => startEdit(service)}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${service.title}`}
            style={styles.rowText}
          >
            <Text style={styles.rowTitle}>{service.title}</Text>
            <Text style={styles.rowDetail}>
              {formatCategory(service.category)} · from {formatPrice(service.price_from)} / hour
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleDelete(service)}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${service.title}`}
            style={styles.delete}
          >
            <MaterialIcons name="close" size={22} color={colors.text} />
          </Pressable>
        </View>
      ))}

      <Card title={editing ? 'Edit service' : 'Add a service'}>
        <Text style={styles.label}>Type of cleaning</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {CATEGORIES.map(item => (
            <Chip
              key={item.value}
              label={item.label}
              selected={category === item.value}
              onPress={() => setCategory(item.value)}
            />
          ))}
        </ScrollView>

        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Deep cleaning"
          error={titleError}
        />
        <Input
          label="Short description"
          value={description}
          onChangeText={setDescription}
          placeholder="What is included in this service"
          multiline
        />
        <Input
          label="Price from, euro per hour"
          value={priceFrom}
          onChangeText={setPriceFrom}
          placeholder="28"
          keyboardType="numeric"
          error={priceError}
        />

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <Button title={editing ? 'Save service' : 'Add service'} onPress={handleSave} busy={busy} />
        {editing ? <Button title="Cancel" variant="secondary" onPress={clearForm} /> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.fill,
    borderRadius: radius.card,
    padding: 12,
    marginBottom: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  rowDetail: {
    fontSize: fontSize.small,
    color: colors.text,
    marginTop: 2,
  },
  delete: {
    width: TOUCH_SIZE,
    height: TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formError: {
    fontSize: fontSize.small,
    color: colors.danger,
    marginBottom: spacing.gap,
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  chips: {
    marginBottom: spacing.gap,
  },
});
