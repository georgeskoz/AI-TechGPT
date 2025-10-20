import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3B82F6',
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
            title: 'TechersGPT',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="chat" 
          options={{ title: 'AI Support Chat' }} 
        />
        <Stack.Screen 
          name="services" 
          options={{ title: 'Services' }} 
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
