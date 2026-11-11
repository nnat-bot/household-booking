import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Avatar from '../components/Avatar';
import { getBooking } from '../api/bookings';
import { getMessages, sendMessage } from '../api/messages';
import { useAuth } from '../state/AuthContext';
import { colors, fontSize, radius, spacing, TOUCH_SIZE } from '../theme';
import type { RootStackParams } from '../navigation/types';
import type { BookingDetail, Message } from '../types';

const POLL_MS = 5000;

type Props = NativeStackScreenProps<RootStackParams, 'Chat'>;

export default function ChatScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const listRef = useRef<ComponentRef<typeof ScrollView>>(null);

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      setMessages(await getMessages(bookingId));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the messages');
    }
  }, [bookingId]);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    getBooking(bookingId)
      .then(setBooking)
      .catch(() => undefined);
  }, [bookingId]);

  useEffect(() => {
    if (!booking || user?.role !== 'customer') {
      return;
    }

    navigation.setOptions({
      headerTitle: () => (
        <Pressable
          onPress={() => navigation.navigate('CleanerProfile', { cleanerId: booking.provider_id })}
          accessibilityRole="button"
          accessibilityLabel={`Open the profile of ${booking.provider_name}`}
          style={({ pressed }) => [styles.headerTitle, pressed && styles.pressed]}
        >
          <Avatar uri={booking.avatar_url} size={28} />
          <Text style={styles.headerName}>{booking.provider_name}</Text>
        </Pressable>
      ),
    });
  }, [booking, navigation, user]);

  const handleSend = async () => {
    const body = draft.trim();
    if (!body) {
      return;
    }

    setSending(true);
    try {
      await sendMessage(bookingId, body);
      setDraft('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the message');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={listRef}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map(message => {
          const mine = message.sender_id === user?.id;
          return (
            <View key={message.id} style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.body, mine && styles.onDark]}>{message.body}</Text>
            </View>
          );
        })}
      </ScrollView>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={[styles.composer, { paddingBottom: insets.bottom + spacing.screen }]}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Write a message"
          placeholderTextColor={colors.placeholder}
          accessibilityLabel="Write a message"
        />
        <Pressable
          onPress={handleSend}
          disabled={sending || draft.trim() === ''}
          accessibilityRole="button"
          accessibilityLabel="Send the message"
          style={({ pressed }) => [styles.send, pressed && styles.pressed]}
        >
          <MaterialIcons name="send" size={22} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    marginLeft: 8,
    fontSize: fontSize.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.screen,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.card,
    padding: 12,
    marginBottom: 8,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.text,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.fill,
  },
  body: {
    fontSize: fontSize.label,
    color: colors.text,
  },
  onDark: {
    color: colors.white,
  },
  error: {
    fontSize: fontSize.small,
    color: colors.danger,
    paddingHorizontal: spacing.screen,
    paddingBottom: 8,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.screen,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  input: {
    flex: 1,
    minHeight: TOUCH_SIZE,
    backgroundColor: colors.fill,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    fontSize: fontSize.label,
    color: colors.text,
  },
  send: {
    width: TOUCH_SIZE,
    height: TOUCH_SIZE,
    borderRadius: TOUCH_SIZE / 2,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
