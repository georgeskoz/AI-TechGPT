import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#10B981',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'TechersGPT Pro',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="jobs" 
          options={{ title: 'My Jobs' }} 
        />
        <Stack.Screen 
          name="earnings" 
          options={{ title: 'Earnings' }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ title: 'Profile' }} 
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
