import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { usePreferencesStore } from '../src/store/userPreferencesStore';
import { useProgressStore } from '../src/store/progressStore';
import { ContentService } from '../src/services/ContentService';
import { colors } from '../src/theme/colors';
import "../global.css";

export default function RootLayout() {
  const loadPreferences = usePreferencesStore((s) => s.loadPreferences);
  const loadProgress = useProgressStore((s) => s.loadProgress);

  useEffect(() => {
    async function init() {
      await Promise.all([
        loadPreferences(),
        loadProgress(),
        ContentService.seedDatabase(),
      ]);
    }
    init();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="rosary/guide"
          options={{ title: 'Santo Rosario', presentation: 'modal' }}
        />
        <Stack.Screen
          name="novenas/[id]"
          options={{ title: 'Novena' }}
        />
      </Stack>
    </>
  );
}
