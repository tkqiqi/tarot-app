import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import { Text } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import QuestionScreen from '../screens/reading/QuestionScreen';
import SpreadSelectScreen from '../screens/reading/SpreadSelectScreen';
import CardDrawScreen from '../screens/reading/CardDrawScreen';
import ReadingResultScreen from '../screens/reading/ReadingResultScreen';
import HistoryListScreen from '../screens/history/HistoryListScreen';
import HistoryDetailScreen from '../screens/history/HistoryDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CoinStoreScreen from '../screens/profile/CoinStoreScreen';
import CardLibraryScreen from '../screens/cards/CardLibraryScreen';
import CardDetailScreen from '../screens/cards/CardDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const ReadingStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function ReadingNavigator() {
  return (
    <ReadingStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
      }}
    >
      <ReadingStack.Screen name="Question" component={QuestionScreen} />
      <ReadingStack.Screen name="SpreadSelect" component={SpreadSelectScreen} />
      <ReadingStack.Screen name="CardDraw" component={CardDrawScreen} />
      <ReadingStack.Screen name="ReadingResult" component={ReadingResultScreen} />
    </ReadingStack.Navigator>
  );
}

function HomeTabIcon({ color, label }: { color: string; label: string }) {
  return <Text style={{ color, fontSize: 11 }}>{label}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgSecondary,
          borderTopColor: colors.borderGold,
          borderTopWidth: 0.5,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: '占卜',
          tabBarIcon: ({ color }) => <HomeTabIcon color={color} label="🔮" />,
        }}
      />
      <Tab.Screen
        name="CardLibrary"
        component={CardLibraryScreen}
        options={{
          tabBarLabel: '牌典',
          tabBarIcon: ({ color }) => <HomeTabIcon color={color} label="📿" />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryListScreen}
        options={{
          tabBarLabel: '记录',
          tabBarIcon: ({ color }) => <HomeTabIcon color={color} label="📜" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color }) => <HomeTabIcon color={color} label="👤" />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  if (isLoading) {
    return null; // Could show splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="ReadingFlow"
              component={ReadingNavigator}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} />
            <Stack.Screen name="CardDetail" component={CardDetailScreen} />
            <Stack.Screen name="CoinStore" component={CoinStoreScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
