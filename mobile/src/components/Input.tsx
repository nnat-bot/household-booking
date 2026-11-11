import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { colors, fontSize, radius, TOUCH_SIZE } from '../theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  error?: string;
};

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  keyboardType,
  multiline,
  error,
}: Props) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        multiline={multiline}
        accessibilityLabel={label}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    minHeight: TOUCH_SIZE + 4,
    backgroundColor: colors.fill,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    fontSize: fontSize.label,
    color: colors.text,
  },
  multiline: {
    minHeight: 120,
    borderRadius: radius.card,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  error: {
    fontSize: fontSize.small,
    color: colors.danger,
    marginTop: 6,
  },
});
