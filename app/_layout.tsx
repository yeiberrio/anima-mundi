import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { usePreferencesStore } from '../src/store/userPreferencesStore';
import { useProgressStore } from '../src/store/progressStore';
import { Platform } from 'react-native';
import { ContentProvider } from '../src/services/ContentProvider';
import { colors } from '../src/theme/colors';
import "../global.css";

export default function RootLayout() {
  const loadPreferences = usePreferencesStore((s) => s.loadPreferences);
  const loadProgress = useProgressStore((s) => s.loadProgress);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await ContentProvider.seedDatabase();
        await Promise.all([
          loadPreferences(),
          loadProgress(),
        ]);
        // Programar notificaciones de recomendación de novenas (solo nativo)
        if (Platform.OS !== 'web') {
          const { NotificationService } = require('../src/services/NotificationService');
          NotificationService.scheduleNovenaRecommendations().catch(() => {});
        }
      } catch (e) {
        console.error('Error initializing app:', e);
      } finally {
        setIsReady(true);
      }
    }
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.secondary, marginBottom: 16 }}>
          ✝ Anima Mundi
        </Text>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={{ color: '#C0B0D0', marginTop: 12, fontSize: 13 }}>Preparando contenido...</Text>
      </View>
    );
  }

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
