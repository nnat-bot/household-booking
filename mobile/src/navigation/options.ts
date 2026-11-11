import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { colors, fontSize } from '../theme';

const header = {
  headerTitleAlign: 'center' as const,
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { fontSize: fontSize.title, fontWeight: 'bold' as const },
};

export const screenOptions: NativeStackNavigationOptions = {
  ...header,
  contentStyle: { backgroundColor: colors.background },
};

export const tabOptions: BottomTabNavigationOptions = {
  ...header,
  headerShown: true,
  tabBarActiveTintColor: colors.text,
  tabBarInactiveTintColor: colors.muted,
  tabBarLabelStyle: { fontWeight: 'bold' },
};
