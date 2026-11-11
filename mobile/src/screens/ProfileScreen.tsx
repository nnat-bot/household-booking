import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Screen from '../components/Screen';
import { useAuth } from '../state/AuthContext';
import { colors, fontSize, spacing } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <Screen>
      {user?.avatar_url ? (
        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar} />
      )}

      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.email}>
        {user?.role === 'provider' ? 'Cleaner account' : 'Customer account'}
      </Text>

      <View style={styles.buttons}>
        <Button title="Log out" variant="danger" onPress={logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tile,
    alignSelf: 'center',
  },
  name: {
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.gap,
  },
  email: {
    fontSize: fontSize.small,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  buttons: {
    marginTop: spacing.section * 2,
  },
});
