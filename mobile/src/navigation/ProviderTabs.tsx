import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessagesScreen from '../screens/MessagesScreen';
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen';
import RequestsScreen from '../screens/provider/RequestsScreen';
import ScheduleScreen from '../screens/provider/ScheduleScreen';
import { tabOptions } from './options';

const Tabs = createBottomTabNavigator();

export default function ProviderTabs() {
  return (
    <Tabs.Navigator screenOptions={tabOptions}>
      <Tabs.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'My working hours',
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event-available" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat-bubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        component={ProviderProfileScreen}
        options={{
          title: 'Edit profile',
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
