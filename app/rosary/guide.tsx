import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import { useRosary, MysteryType } from '../../src/hooks/useRosary';
import { RosaryCounter } from '../../src/components/RosaryCounter';
import { useProgressStore } from '../../src/store/progressStore';

const mysteryLabels: Record<MysteryType, string> = {
  gozosos: 'Gozosos',
  luminosos: 'Luminosos',
  dolorosos: 'Dolorosos',
  gloriosos: 'Gloriosos',
};

export default function RosaryGuideScreen() {
  const router = useRouter();
  const addEntry = useProgressStore((s) => s.addEntry);
  const {
    step,
    currentStep,
    totalSteps,
    progress,
    isComplete,
    mysteryType,
    mysteryName,
    currentMysteryInfo,
    next,
    prev,
    reset,
    changeMystery,
  } = useRosary();

  const insets = useSafeAreaInsets();
  const [showMysteryPicker, setShowMysteryPicker] = useState(false);

  const handleComplete = () => {
    addEntry({ type: 'rosary', referenceId: mysteryType });
    Alert.alert(
      'Rosario completado',
      `Has completado el Santo Rosario — ${mysteryName}. ¡Que Dios te bendiga!`,
      [{ text: 'Amén', onPress: () => router.back() }]
    );
  };

  if (showMysteryPicker) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: 24 }}>
          Seleccionar Misterios
        </Text>
        {(Object.entries(mysteryLabels) as [MysteryType, string][]).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            onPress={() => {
              changeMystery(key);
              setShowMysteryPicker(false);
            }}
            style={{
              backgroundColor: key === mysteryType ? colors.primary : '#FFF',
              borderRadius: 12,
              padding: 18,
              marginBottom: 10,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: key === mysteryType ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: key === mysteryType ? '#FFF' : colors.textMain }}>
              Misterios {label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setShowMysteryPicker(false)}
          style={{ marginTop: 12, alignItems: 'center' }}
        >
          <Text style={{ color: colors.textSoft, fontSize: 15 }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Header with mystery type */}
      <TouchableOpacity
        onPress={() => setShowMysteryPicker(true)}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.secondary, fontSize: 15, fontWeight: '700' }}>
          {mysteryName}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.secondary} style={{ marginLeft: 6 }} />
      </TouchableOpacity>

      {/* Counter */}
      <RosaryCounter
        currentStep={currentStep}
        totalSteps={totalSteps}
        mysteryNumber={step?.mysteryNumber}
        hailMaryNumber={step?.hailMaryNumber}
        progress={progress}
      />

      {/* Main content */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Mystery info card */}
        {currentMysteryInfo && step?.type === 'mystery_announcement' && (
          <View
            style={{
              backgroundColor: '#F0E6D3',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: colors.secondary,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.secondary, textTransform: 'uppercase', letterSpacing: 1 }}>
              {currentMysteryInfo.number}° Misterio
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSoft, marginTop: 4 }}>
              Fruto: {currentMysteryInfo.fruit}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSoft, marginTop: 2 }}>
              {currentMysteryInfo.reference}
            </Text>
          </View>
        )}

        {/* Step title */}
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.primary, marginBottom: 16, textAlign: 'center' }}>
          {step?.title}
        </Text>

        {/* Prayer text */}
        <Text style={{ fontSize: 18, lineHeight: 30, color: colors.textMain, textAlign: 'center' }}>
          {step?.text}
        </Text>
      </ScrollView>

      {/* Navigation buttons */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={prev}
          disabled={currentStep === 0}
          style={{
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: currentStep === 0 ? '#E0D8CE' : '#FFF',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: currentStep === 0 ? '#E0D8CE' : colors.primary,
          }}
        >
          <Ionicons name="arrow-back" size={22} color={currentStep === 0 ? '#A0A0A0' : colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={isComplete ? handleComplete : next}
          style={{
            flex: 3,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: isComplete ? colors.secondary : colors.primary,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>
            {isComplete ? 'Finalizar Rosario' : 'Siguiente'}
          </Text>
          {!isComplete && <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
