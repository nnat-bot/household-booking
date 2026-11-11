import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius } from '../theme';

type Props = {
  rows: { label: string; value: string }[];
  totalLabel: string;
  totalValue: string;
};

export default function SummaryBox({ rows, totalLabel, totalValue }: Props) {
  return (
    <View style={styles.box}>
      {rows.map(row => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}

      <View style={styles.total}>
        <Text style={styles.totalLabel}>{totalLabel}</Text>
        <Text style={styles.totalLabel}>{totalValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: radius.box,
    overflow: 'hidden',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.fill,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  value: {
    fontSize: fontSize.label,
    fontWeight: 'bold',
    color: colors.text,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.green,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  totalLabel: {
    fontSize: fontSize.section,
    fontWeight: 'bold',
    color: colors.white,
  },
});
