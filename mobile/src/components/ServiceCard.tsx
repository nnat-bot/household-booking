import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius } from '../theme';
import { formatPrice } from '../format';
import type { Service } from '../types';

type Props = {
  service: Service;
  onPress: () => void;
};

export default function ServiceCard({ service, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${service.title} by ${service.provider_name}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.title}>{service.title}</Text>
      {service.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.detail}>{service.provider_name}</Text>
        <Text style={styles.price}>from {formatPrice(service.price_from)} / hour</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.fill,
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: fontSize.small,
    color: colors.text,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  detail: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
  },
  price: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
  },
});
