import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import Button from './Button';
import { colors, fontSize, spacing } from '../theme';

type Props = {
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  scroll?: boolean;
  children: ReactNode;
};

export default function Screen({ loading, error, onRetry, scroll = true, children }: Props) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={styles.message}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.message}>{error}</Text>
        {onRetry ? (
          <View style={styles.retry}>
            <Button title="Try again" onPress={onRetry} variant="secondary" />
          </View>
        ) : null}
      </View>
    );
  }

  if (!scroll) {
    return <View style={styles.plain}>{children}</View>;
  }

  return (
    <ScrollView style={styles.plain} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  plain: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.screen,
    paddingBottom: spacing.section,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.section,
    backgroundColor: colors.background,
  },
  errorTitle: {
    fontSize: fontSize.section,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.gap,
  },
  message: {
    fontSize: fontSize.label,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.gap,
  },
  retry: {
    marginTop: spacing.section,
    alignSelf: 'stretch',
  },
});
