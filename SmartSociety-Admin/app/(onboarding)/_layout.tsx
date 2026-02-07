// app/(onboarding)/_layout.tsx
import { Stack } from 'expo-router';
import { Colors } from '../../src/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background.primary },
      }}
    />
  );
}