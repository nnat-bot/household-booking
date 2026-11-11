import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Screen from '../../components/Screen';
import { addReview } from '../../api/reviews';
import { colors, fontSize, spacing } from '../../theme';
import type { RootStackParams } from '../../navigation/types';

const STARS = [1, 2, 3, 4, 5];

type Props = NativeStackScreenProps<RootStackParams, 'Review'>;

export default function ReviewScreen({ navigation, route }: Props) {
  const { bookingId, cleanerName } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSend = async () => {
    if (rating === 0) {
      setRatingError('Please choose how many stars');
      return;
    }

    setRatingError('');
    setError('');
    setBusy(true);
    try {
      await addReview(bookingId, rating, comment.trim());
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the review');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>How was the work of {cleanerName}?</Text>

      <View style={styles.stars}>
        {STARS.map(star => (
          <Pressable
            key={star}
            onPress={() => setRating(star)}
            accessibilityRole="button"
            accessibilityLabel={star === 1 ? '1 star' : `${star} stars`}
            style={styles.star}
          >
            <MaterialIcons
              name={star <= rating ? 'star' : 'star-border'}
              size={40}
              color={colors.text}
            />
          </Pressable>
        ))}
      </View>

      {ratingError ? <Text style={styles.error}>{ratingError}</Text> : null}

      <Input
        label="Your comment"
        value={comment}
        onChangeText={setComment}
        placeholder="Tell other customers about your experience"
        multiline
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Send review" onPress={handleSend} busy={busy} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.section,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.section,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.gap,
  },
  star: {
    padding: 4,
  },
  error: {
    fontSize: fontSize.small,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.gap,
  },
});
