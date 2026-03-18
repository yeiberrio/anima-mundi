import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { useNovena } from '../../src/hooks/useNovena';
import { NovenaProgressBar } from '../../src/components/NovenaProgressBar';

export default function NovenaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { novena, progress, startNovena, completeDay } = useNovena(id);
  const [viewingDay, setViewingDay] = useState<number | null>(null);

  if (!novena) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSoft }}>Novena no encontrada</Text>
      </View>
    );
  }

  const dayData = viewingDay != null ? novena.days.find((d) => d.day === viewingDay) : null;

  if (dayData && viewingDay != null) {
    const isCompleted = progress?.completedDays.includes(viewingDay) ?? false;

    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 100 }}>
          <TouchableOpacity
            onPress={() => setViewingDay(null)}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
            <Text style={{ marginLeft: 8, color: colors.primary, fontWeight: '600' }}>Volver</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.secondary, marginBottom: 4 }}>
            Día {dayData.day} de 9
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, marginBottom: 20 }}>
            {dayData.title}
          </Text>
          <Text style={{ fontSize: 17, lineHeight: 28, color: colors.textMain }}>
            {dayData.prayer}
          </Text>
        </ScrollView>

        {!isCompleted && (
          <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: Math.max(insets.bottom, 12), backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: colors.border }}>
            <TouchableOpacity
              onPress={() => {
                completeDay(viewingDay);
                if (viewingDay === 9) {
                  Alert.alert('Novena completada', `Has completado la novena a ${novena.saint}. ¡Que tu petición sea escuchada!`, [
                    { text: 'Amén', onPress: () => router.back() },
                  ]);
                } else {
                  Alert.alert('Día completado', `Has completado el día ${viewingDay} de la novena.`);
                  setViewingDay(null);
                }
              }}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>
                Completar día {viewingDay}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Header */}
      <View style={{ padding: 20, backgroundColor: colors.primary }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: '#FFF' }}>{novena.saint}</Text>
        <Text style={{ fontSize: 14, color: colors.secondary, marginTop: 4 }}>
          Festividad: {novena.feast_day}
        </Text>
        <Text style={{ fontSize: 14, color: '#C0B0D0', marginTop: 2 }}>
          Intención: {novena.intention}
        </Text>
      </View>

      {/* Description */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 15, lineHeight: 24, color: colors.textMain }}>
          {novena.description}
        </Text>
      </View>

      {/* Progress */}
      {progress && (
        <NovenaProgressBar currentDay={progress.currentDay} completedDays={progress.completedDays} />
      )}

      {/* Start button */}
      {!progress && (
        <TouchableOpacity
          onPress={() => startNovena(novena.id)}
          style={{
            marginHorizontal: 16,
            marginVertical: 16,
            backgroundColor: colors.secondary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Comenzar Novena</Text>
        </TouchableOpacity>
      )}

      {/* Days list */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 8, marginBottom: 12 }}>
        Los 9 días
      </Text>
      {novena.days.map((day) => {
        const isCompleted = progress?.completedDays.includes(day.day) ?? false;
        const isCurrent = progress?.currentDay === day.day;

        return (
          <TouchableOpacity
            key={day.day}
            onPress={() => setViewingDay(day.day)}
            style={{
              marginHorizontal: 16,
              marginBottom: 8,
              backgroundColor: isCompleted ? '#E8F5E9' : isCurrent ? '#FFF8E1' : '#FFF',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: isCurrent ? colors.secondary : colors.border,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isCompleted ? colors.greenHope : isCurrent ? colors.secondary : '#E0D8CE',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={20} color="#FFF" />
              ) : (
                <Text style={{ color: '#FFF', fontWeight: '700' }}>{day.day}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textMain }}>{day.title}</Text>
              {isCurrent && !isCompleted && (
                <Text style={{ fontSize: 12, color: colors.secondary, marginTop: 2 }}>Día actual</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
          </TouchableOpacity>
        );
      })}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}
