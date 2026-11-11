import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import SelectTile from '../components/SelectTile';
import { useAuth } from '../state/AuthContext';
import { colors, fontSize, spacing } from '../theme';
import type { Role } from '../types';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    const missingName = name.trim() ? '' : 'Please fill in your name';
    const missingEmail = email.trim() ? '' : 'Please fill in your email';
    let passwordProblem = '';
    if (!password) {
      passwordProblem = 'Please fill in a password';
    } else if (password.length < 6) {
      passwordProblem = 'The password needs at least 6 characters';
    }

    setNameError(missingName);
    setEmailError(missingEmail);
    setPasswordError(passwordProblem);
    if (missingName || missingEmail || passwordProblem) {
      return;
    }

    setError('');
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Input
        label="Full name"
        value={name}
        onChangeText={setName}
        placeholder="Anna Virtanen"
        error={nameError}
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        error={emailError}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
        secure
        error={passwordError}
      />

      <Text style={styles.label}>I want to</Text>
      <View style={styles.roles}>
        <SelectTile
          label="Book a cleaner"
          icon="search"
          selected={role === 'customer'}
          onPress={() => setRole('customer')}
        />
        <View style={styles.space} />
        <SelectTile
          label="Work as a cleaner"
          icon="work-outline"
          selected={role === 'provider'}
          onPress={() => setRole('provider')}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Create account" onPress={handleRegister} busy={busy} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.screen,
  },
  label: {
    fontSize: fontSize.small,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  roles: {
    flexDirection: 'row',
    marginBottom: spacing.section,
  },
  space: {
    width: spacing.gap,
  },
  error: {
    fontSize: fontSize.small,
    color: colors.danger,
    marginBottom: spacing.gap,
  },
});
