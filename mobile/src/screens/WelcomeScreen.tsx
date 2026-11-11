import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../components/Button';
import { colors, fontSize, radius, spacing } from '../theme';
import type { AuthStackParams } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParams, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.logo}>
        <MaterialIcons name="cleaning-services" size={48} color={colors.text} />
      </View>

      <Text style={styles.title}>Find a cleaner near you</Text>
      <Text style={styles.subtitle}>
        Book a trusted cleaner in the Helsinki area and keep everything in one place.
      </Text>

      <View style={styles.buttons}>
        <Button title="Create account" onPress={() => navigation.navigate('Register')} />
        <Button
          title="I already have an account"
          variant="secondary"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.screen,
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius.tile,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.section,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.label,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.gap,
  },
  buttons: {
    marginTop: spacing.section * 2,
  },
});
