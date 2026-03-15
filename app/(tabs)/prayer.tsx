import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { ContentService } from '../../src/services/ContentService';
import { useNovena } from '../../src/hooks/useNovena';
import { NovenaProgressBar } from '../../src/components/NovenaProgressBar';

interface Prayer {
  id: number;
  name: string;
  text: string;
  sort_order: number;
}

export default function PrayerScreen() {
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const { novenasList, allProgress, getActiveNovenas } = useNovena();
  const activeNovenas = getActiveNovenas();

  useEffect(() => {
    ContentService.getPrayersByCategory('fundamental').then(setPrayers);
  }, []);

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Rosary quick access */}
      <TouchableOpacity
        onPress={() => router.push('/rosary/guide')}
        style={{
          margin: 16,
          backgroundColor: colors.primary,
          borderRadius: 16,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 36, marginRight: 16 }}>📿</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>Santo Rosario</Text>
          <Text style={{ color: '#C0B0D0', fontSize: 13 }}>Guía interactiva paso a paso</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#FFF" />
      </TouchableOpacity>

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
                  marginHorizontal: 16,
                  marginBottom: 8,
                  backgroundColor: '#FFF',
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain }}>
                  {novena.saint}
                </Text>
                <NovenaProgressBar
                  currentDay={progress.currentDay}
                  completedDays={progress.completedDays}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Prayer list */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginBottom: 12 }}>
        Oraciones Fundamentales
      </Text>
      {prayers.map((prayer) => (
        <TouchableOpacity
          key={prayer.id}
          onPress={() => setSelectedPrayer(prayer)}
          style={{
            marginHorizontal: 16,
            marginBottom: 8,
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="book-outline" size={22} color={colors.secondary} />
          <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: '600', color: colors.textMain, flex: 1 }}>
            {prayer.name}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
        </TouchableOpacity>
      ))}

      {/* Additional prayer categories */}
      {[
        { category: 'sagrado_corazon', title: 'Sagrado Corazón', icon: 'heart' as const },
        { category: 'misa', title: 'Oraciones de la Misa', icon: 'wine' as const },
        { category: 'san_miguel', title: 'San Miguel Arcángel', icon: 'shield' as const },
        { category: 'magnificat', title: 'Magnificat', icon: 'musical-notes' as const },
        { category: 'proteccion', title: 'Oraciones de Protección', icon: 'umbrella' as const },
      ].map((cat) => (
        <TouchableOpacity
          key={cat.category}
          onPress={() => {
            ContentService.getPrayersByCategory(cat.category).then((p) => {
              if (p[0]) setSelectedPrayer(p[0]);
            });
          }}
          style={{
            marginHorizontal: 16,
            marginBottom: 8,
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name={cat.icon} size={22} color={colors.crimson} />
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
            marginHorizontal: 16,
            marginBottom: 8,
            backgroundColor: '#FFF',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain }}>
                {novena.saint}
              </Text>
              <Text style={{ fontSize: 13, color: colors.textSoft, marginTop: 2 }}>
                {novena.intention}
              </Text>
              <Text style={{ fontSize: 12, color: colors.secondary, marginTop: 2 }}>
                Festividad: {novena.feast_day}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
          </View>
        </TouchableOpacity>
      ))}

      {/* Divina Misericordia */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 16, marginBottom: 12 }}>
        Divina Misericordia
      </Text>
      <TouchableOpacity
        onPress={() => {
          ContentService.getPrayersByCategory('misericordia').then((p) => {
            if (p[0]) setSelectedPrayer(p[0]);
          });
        }}
        style={{
          marginHorizontal: 16,
          marginBottom: 30,
          backgroundColor: '#FFF',
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 28, marginRight: 12 }}>✝️</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain }}>
            Coronilla de la Divina Misericordia
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSoft }}>Guía paso a paso</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
      </TouchableOpacity>
    </ScrollView>
  );
}
