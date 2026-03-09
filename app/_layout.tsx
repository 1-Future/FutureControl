import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ErrorBoundary from '../src/components/ErrorBoundary';
import { colors } from '../src/theme/tokens';

function RootInner() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <RootInner />
    </ErrorBoundary>
  );
}
