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
import { getMessages, sendMessage } from '../api/messages';
import { useAuth } from '../state/AuthContext';
import { colors, fontSize, radius, spacing, TOUCH_SIZE } from '../theme';
import type { Message } from '../types';

const POLL_MS = 5000;

type Props = {
  route: { params: { bookingId: number; title: string } };
};

export default function ChatScreen({ route }: Props) {
  const { bookingId } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const listRef = useRef<ComponentRef<typeof ScrollView>>(null);

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
          placeholderTextColor={colors.muted}
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
