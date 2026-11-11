import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParams, 'Done'>;

export default function DoneScreen({ navigation }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.circle}>
        <MaterialIcons name="check" size={44} color={colors.white} />
      </View>

      <Text style={styles.title}>Request sent</Text>
      <Text style={styles.message}>
        The cleaner will answer your request soon. You can follow the status in My bookings.
      </Text>

      <View style={styles.buttons}>
        <Button
          title="Back to services"
          onPress={() => navigation.popToTop()}
          variant="secondary"
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.section,
  },
  message: {
    fontSize: fontSize.label,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.gap,
  },
  buttons: {
    alignSelf: 'stretch',
    marginTop: spacing.section * 2,
  },
});
