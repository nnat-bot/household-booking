import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Screen from '../../components/Screen';
import { updateMyProfile } from '../../api/providers';
import { useAuth } from '../../state/AuthContext';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';

export default function ProviderProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [hourlyRate, setHourlyRate] = useState(user?.hourly_rate ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (!name) {
      setError('Please fill in your name');
      return;
    }

    setError('');
    setSaved('');
    setBusy(true);
    try {
      await updateMyProfile(name.trim(), bio.trim(), hourlyRate.trim(), user?.avatar_url ?? null);
      setSaved('Your profile is saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the profile');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Input label="Full name" value={name} onChangeText={setName} />
      <Input
        label="About me"
        value={bio}
        onChangeText={setBio}
        placeholder="Tell customers about your work"
        multiline
      />
      <Input
        label="Hourly rate in euro"
        value={hourlyRate}
        onChangeText={setHourlyRate}
        placeholder="28"
        keyboardType="numeric"
        error={error}
      />

      {saved ? <Text style={styles.saved}>{saved}</Text> : null}

      <Button title="Save changes" onPress={handleSave} busy={busy} />
      <Button
        title="My services"
        variant="secondary"
        onPress={() => navigation.navigate('MyServices')}
      />
      <Button title="Log out" variant="danger" onPress={logout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  saved: {
    fontSize: fontSize.small,
    color: colors.green,
    marginBottom: spacing.gap,
  },
});
