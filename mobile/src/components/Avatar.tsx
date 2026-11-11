import { MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  uri?: string | null;
  size: number;
  centered?: boolean;
};

export default function Avatar({ uri, size, centered }: Props) {
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[shape, centered && styles.centered]} />;
  }

  return (
    <View style={[shape, styles.empty, centered && styles.centered]}>
      <MaterialIcons name="person" size={Math.round(size * 0.6)} color={colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignSelf: 'center',
  },
  empty: {
    backgroundColor: colors.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
