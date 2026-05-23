import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { ContentProvider } from '../../src/services/ContentProvider';
import { useNovena } from '../../src/hooks/useNovena';
import { NovenaProgressBar } from '../../src/components/NovenaProgressBar';
import { getTodayRecommendations, getUpcomingFeastNovenas, NovenaRecommendation } from '../../src/data/novena_recommendations';

interface Prayer {
  id: number;
  name: string;
  text: string;
  sort_order: number;
}

const PRAYER_CATEGORIES = [
  { category: 'sagrado_corazon', title: 'Sagrado Corazón', icon: 'heart' as const, color: colors.crimson },
  { category: 'misericordia', title: 'Divina Misericordia', icon: 'sunny' as const, color: colors.secondary },
  { category: 'misa', title: 'Oraciones de la Misa', icon: 'wine' as const, color: colors.primary },
  { category: 'san_miguel', title: 'San Miguel Arcángel', icon: 'shield' as const, color: colors.primary },
  { category: 'magnificat', title: 'Magnificat', icon: 'musical-notes' as const, color: colors.secondary },
  { category: 'proteccion', title: 'Protección y Bendición', icon: 'umbrella' as const, color: colors.greenHope },
];

export default function PrayerScreen() {
  const router = useRouter();
  const [fundamentalPrayers, setFundamentalPrayers] = useState<Prayer[]>([]);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ title: string; prayers: Prayer[] } | null>(null);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<NovenaRecommendation | null>(null);
  const { novenasList, allProgress, getActiveNovenas } = useNovena();
  const activeNovenas = getActiveNovenas();
  const todayRecommendations = getTodayRecommendations();
  const upcomingFeast = getUpcomingFeastNovenas();

  useEffect(() => {
    ContentProvider.getPrayersByCategory('fundamental').then(setFundamentalPrayers);
  }, []);

  const loadCategory = async (cat: typeof PRAYER_CATEGORIES[0]) => {
    setLoadingCategory(true);
    try {
      const prayers = await ContentProvider.getPrayersByCategory(cat.category);
      setSelectedCategory({ title: cat.title, prayers });
    } catch (e) {
      console.error('Error loading prayers:', e);
    } finally {
      setLoadingCategory(false);
    }
  };

  // Vista de recomendación detallada (historia y milagros del santo)
  if (selectedRecommendation) {
    const rec = selectedRecommendation;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
        <TouchableOpacity
          onPress={() => setSelectedRecommendation(null)}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>

        {/* Header del santo */}
        <View style={{ marginHorizontal: 16, backgroundColor: colors.primary, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFF' }}>{rec.saint}</Text>
          <Text style={{ fontSize: 14, color: colors.secondary, marginTop: 4 }}>Festividad: {rec.feastDay}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' }}>
            <Ionicons name="calendar" size={14} color={colors.secondary} />
            <Text style={{ color: colors.secondary, fontSize: 13, fontWeight: '600', marginLeft: 6 }}>
              Iniciar en {rec.dayName}
            </Text>
          </View>
        </View>

        {/* Por qué este día */}
        <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: '#FFF8E1', borderRadius: 14, padding: 18, borderLeftWidth: 4, borderLeftColor: colors.secondary }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, marginBottom: 8 }}>
            ¿Por qué iniciar en {rec.dayName}?
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 24, color: colors.textMain }}>
            {rec.reason}
          </Text>
        </View>

        {/* Historia */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: 10 }}>
            Historia
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 26, color: colors.textMain }}>
            {rec.history}
          </Text>
        </View>

        {/* Milagros */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: 10 }}>
            Milagros y hechos extraordinarios
          </Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 15, lineHeight: 26, color: colors.textMain }}>
              {rec.miracles}
            </Text>
          </View>
        </View>

        {/* Botón para iniciar novena */}
        <TouchableOpacity
          onPress={() => {
            setSelectedRecommendation(null);
            router.push(`/novenas/${rec.novenaId}`);
          }}
          style={{
            marginHorizontal: 16, marginBottom: 30, backgroundColor: colors.secondary,
            borderRadius: 14, paddingVertical: 16, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center',
          }}
        >
          <Ionicons name="play-circle" size={22} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Ir a la Novena</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Vista de una oración individual
  if (selectedPrayer) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
        <TouchableOpacity
          onPress={() => setSelectedPrayer(null)}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 20 }}>
            {selectedPrayer.name}
          </Text>
          <Text style={{ fontSize: 17, lineHeight: 28, color: colors.textMain }}>
            {selectedPrayer.text}
          </Text>
        </View>
      </ScrollView>
    );
  }

  // Vista de una categoría con lista de oraciones
  if (selectedCategory) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
        <TouchableOpacity
          onPress={() => setSelectedCategory(null)}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
          <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, paddingHorizontal: 20, marginBottom: 16 }}>
          {selectedCategory.title}
        </Text>
        {selectedCategory.prayers.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.textSoft }}>No se encontraron oraciones</Text>
          </View>
        ) : (
          selectedCategory.prayers.map((prayer) => (
            <TouchableOpacity
              key={prayer.id}
              onPress={() => setSelectedPrayer(prayer)}
              style={{
                marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF',
                borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center',
                borderWidth: 1, borderColor: colors.border,
              }}
            >
              <Ionicons name="book-outline" size={22} color={colors.secondary} />
              <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '600', color: colors.textMain, flex: 1 }}>
                {prayer.name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  }

  // Vista principal
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Rosary quick access */}
      <TouchableOpacity
        onPress={() => router.push('/rosary/guide')}
        style={{
          margin: 16, backgroundColor: colors.primary, borderRadius: 16,
          padding: 20, flexDirection: 'row', alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 36, marginRight: 16 }}>📿</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>Santo Rosario</Text>
          <Text style={{ color: '#C0B0D0', fontSize: 13 }}>Guía interactiva paso a paso</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Recomendaciones del día */}
      {(todayRecommendations.length > 0 || upcomingFeast.length > 0) && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginBottom: 10 }}>
            {todayRecommendations.length > 0 ? 'Novena recomendada para hoy' : 'Festividad próxima'}
          </Text>
          {(todayRecommendations.length > 0 ? todayRecommendations : upcomingFeast).map((rec) => (
            <TouchableOpacity
              key={rec.novenaId}
              onPress={() => setSelectedRecommendation(rec)}
              style={{
                marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF8E1',
                borderRadius: 14, padding: 16, borderLeftWidth: 4, borderLeftColor: colors.secondary,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="star" size={18} color={colors.secondary} />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '700', color: colors.primary }}>
                  {rec.saint}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: colors.textMain, lineHeight: 20, marginBottom: 8 }} numberOfLines={2}>
                {rec.reason}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="calendar-outline" size={14} color={colors.secondary} />
                  <Text style={{ marginLeft: 4, fontSize: 12, color: colors.secondary, fontWeight: '600' }}>
                    Iniciar en {rec.dayName} — Fiesta: {rec.feastDay}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '600' }}>Ver historia →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Active novenas */}
      {activeNovenas.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginBottom: 8 }}>
            Novenas activas
          </Text>
          {activeNovenas.map((progress) => {
            const novena = novenasList.find((n) => n.id === progress.novenaId);
            if (!novena) return null;
            return (
              <TouchableOpacity
                key={progress.novenaId}
                onPress={() => router.push(`/novenas/${progress.novenaId}`)}
                style={{
                  marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF',
                  borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain }}>
                  {novena.saint}
                </Text>
                <NovenaProgressBar currentDay={progress.currentDay} completedDays={progress.completedDays} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Oraciones fundamentales */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginBottom: 12 }}>
        Oraciones Fundamentales
      </Text>
      {fundamentalPrayers.map((prayer) => (
        <TouchableOpacity
          key={prayer.id}
          onPress={() => setSelectedPrayer(prayer)}
          style={{
            marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF',
            borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center',
            borderWidth: 1, borderColor: colors.border,
          }}
        >
          <Ionicons name="book-outline" size={22} color={colors.secondary} />
          <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '600', color: colors.textMain, flex: 1 }}>
            {prayer.name}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
        </TouchableOpacity>
      ))}

      {/* Categorías adicionales */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 16, marginBottom: 12 }}>
        Devociones y Oraciones Especiales
      </Text>
      {PRAYER_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.category}
          onPress={() => loadCategory(cat)}
          disabled={loadingCategory}
          style={{
            marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF',
            borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center',
            borderWidth: 1, borderColor: colors.border,
          }}
        >
          <Ionicons name={cat.icon} size={22} color={cat.color} />
          <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '600', color: colors.textMain, flex: 1 }}>
            {cat.title}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
        </TouchableOpacity>
      ))}

      {/* Novenas catalog */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 16, marginBottom: 12 }}>
        Novenas a Santos y a la Virgen
      </Text>
      {novenasList.map((novena) => (
        <TouchableOpacity
          key={novena.id}
          onPress={() => router.push(`/novenas/${novena.id}`)}
          style={{
            marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF',
            borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain }}>{novena.saint}</Text>
              <Text style={{ fontSize: 13, color: colors.textSoft, marginTop: 2 }}>{novena.intention}</Text>
              <Text style={{ fontSize: 12, color: colors.secondary, marginTop: 2 }}>
                Festividad: {novena.feast_day}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
