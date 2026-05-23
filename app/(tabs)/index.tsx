import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { getGreeting, getTodayMysteryType, formatDate } from '../../src/utils/dateHelpers';
import { ContentProvider } from '../../src/services/ContentProvider';
import { useProgressStore } from '../../src/store/progressStore';
import { VerseCard } from '../../src/components/VerseCard';
import { QuoteDisplay } from '../../src/components/QuoteDisplay';

interface DailyVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface DailyStoic {
  author: string;
  work: string;
  book_chapter: string;
  text: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const streak = useProgressStore((s) => s.streak);
  const rosaryCount = useProgressStore((s) => s.getRosaryCount());
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [dailyStoic, setDailyStoic] = useState<DailyStoic | null>(null);

  useEffect(() => {
    async function loadDaily() {
      const [verse, stoic] = await Promise.all([
        ContentProvider.getDailyVerse(),
        ContentProvider.getDailyStoicQuote(),
      ]);
      setDailyVerse(verse);
      setDailyStoic(stoic);
    }
    loadDaily();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Header greeting */}
      <View style={{ padding: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.primary }}>
          {getGreeting()}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSoft, marginTop: 4, textTransform: 'capitalize' }}>
          {formatDate(new Date())}
        </Text>
      </View>

      {/* Streak & stats */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Ionicons name="flame" size={28} color={colors.secondary} />
          <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '700', marginTop: 4 }}>
            {streak}
          </Text>
          <Text style={{ color: '#C0B0D0', fontSize: 12 }}>Racha de días</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 28 }}>📿</Text>
          <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '700', marginTop: 4 }}>
            {rosaryCount}
          </Text>
          <Text style={{ color: '#C0B0D0', fontSize: 12 }}>Rosarios</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Ionicons name="sunny" size={28} color={colors.secondary} />
          <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600', marginTop: 8 }}>
            Misterios
          </Text>
          <Text style={{ color: '#C0B0D0', fontSize: 12 }}>{getTodayMysteryType()}</Text>
        </View>
      </View>

      {/* Quick action: Rosary */}
      <TouchableOpacity
        onPress={() => router.push('/rosary/guide')}
        style={{
          marginHorizontal: 16,
          backgroundColor: colors.secondary,
          borderRadius: 16,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 36, marginRight: 16 }}>📿</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>
            Rezar el Santo Rosario
          </Text>
          <Text style={{ color: '#FFF', fontSize: 13, opacity: 0.8 }}>
            Misterios {getTodayMysteryType()} — Guía paso a paso
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Section: Daily verse */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginBottom: 4 }}>
        Versículo del día
      </Text>
      {dailyVerse ? (
        <VerseCard
          text={dailyVerse.text}
          reference={`${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`}
          style="bible"
        />
      ) : (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.textSoft }}>Cargando...</Text>
        </View>
      )}

      {/* Section: Stoic quote */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 8, marginBottom: 4 }}>
        Reflexión estoica
      </Text>
      {dailyStoic ? (
        <QuoteDisplay
          text={dailyStoic.text}
          author={dailyStoic.author}
          source={`${dailyStoic.work}, ${dailyStoic.book_chapter}`}
        />
      ) : (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.textSoft }}>Cargando...</Text>
        </View>
      )}

      {/* Quick links */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 16, marginBottom: 12 }}>
        Acceso rápido
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 30 }}>
        {[
          { label: 'Devocionario', icon: 'book-outline' as const, route: '/prayer' as const },
          { label: 'Novenas', icon: 'calendar-outline' as const, route: '/prayer' as const },
          { label: 'Biblia', icon: 'book' as const, route: '/scripture' as const },
          { label: 'Filosofía', icon: 'library-outline' as const, route: '/philosophy' as const },
        ].map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => router.push(item.route)}
            style={{
              width: '48%',
              margin: '1%',
              backgroundColor: '#FFF',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name={item.icon} size={22} color={colors.primary} />
            <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: '600', color: colors.textMain }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
