// app/_layout.tsx
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { Colors } from '../src/theme';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, isApproved, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const inTabs = segments[0] === '(tabs)';

    // Hide splash screen once we've determined the route
    SplashScreen.hideAsync();

    // Navigation logic
    if (!hasCompletedOnboarding && !inOnboarding) {
      // User hasn't completed onboarding
      router.replace('/(onboarding)');
    } else if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
      // User is not logged in and not in auth or onboarding
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !isApproved && !inAuthGroup) {
      // User is logged in but not approved - stay on auth screen with message
      router.replace('/(auth)/login');
    } else if (isAuthenticated && isApproved && (inAuthGroup || inOnboarding)) {
      // User is logged in and approved - redirect to main app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, isApproved, hasCompletedOnboarding, segments]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background.primary },
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />

      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}