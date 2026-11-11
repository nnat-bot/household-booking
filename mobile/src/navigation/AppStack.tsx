import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookingDetailScreen from '../screens/customer/BookingDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import CleanerListScreen from '../screens/customer/CleanerListScreen';
import CleanerProfileScreen from '../screens/customer/CleanerProfileScreen';
import CustomerTabs from './CustomerTabs';
import DoneScreen from '../screens/customer/DoneScreen';
import PickTimeScreen from '../screens/customer/PickTimeScreen';
import ProviderTabs from './ProviderTabs';
import RequestDetailScreen from '../screens/provider/RequestDetailScreen';
import ReviewScreen from '../screens/customer/ReviewScreen';
import SummaryScreen from '../screens/customer/SummaryScreen';
import { screenOptions } from './options';
import { useAuth } from '../state/AuthContext';
import type { RootStackParams } from './types';

const Stack = createNativeStackNavigator<RootStackParams>();

export default function AppStack() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Tabs"
        component={user?.role === 'provider' ? ProviderTabs : CustomerTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CleanerList"
        component={CleanerListScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="CleanerProfile"
        component={CleanerProfileScreen}
        options={{ title: 'Cleaner' }}
      />
      <Stack.Screen
        name="PickTime"
        component={PickTimeScreen}
        options={{ title: 'Choose a time' }}
      />
      <Stack.Screen
        name="Summary"
        component={SummaryScreen}
        options={{ title: 'Confirm booking' }}
      />
      <Stack.Screen
        name="Done"
        component={DoneScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{ title: 'Booking' }}
      />
      <Stack.Screen
        name="RequestDetail"
        component={RequestDetailScreen}
        options={{ title: 'Request' }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{ title: 'Rate your cleaner' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}
