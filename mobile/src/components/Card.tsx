import { StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { colors, fontSize, radius } from '../theme';

type Props = {
  title?: string;
  children: ReactNode;
};

export default function Card({ title, children }: Props) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.box,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: fontSize.section,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
});
