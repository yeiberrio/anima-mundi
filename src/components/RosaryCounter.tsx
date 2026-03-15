import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme/colors';

interface RosaryCounterProps {
  currentStep: number;
  totalSteps: number;
  mysteryNumber?: number;
  hailMaryNumber?: number;
  progress: number;
}

export function RosaryCounter({
  currentStep,
  totalSteps,
  mysteryNumber,
  hailMaryNumber,
  progress,
}: RosaryCounterProps) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 12 }}>
      {mysteryNumber != null && (
        <Text style={{ fontSize: 13, color: colors.secondary, fontWeight: '700', marginBottom: 4 }}>
          Misterio {mysteryNumber} de 5
        </Text>
      )}
      {hailMaryNumber != null && (
        <View style={{ flexDirection: 'row', gap: 3, marginBottom: 8 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <View
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: i < hailMaryNumber! ? colors.secondary : '#D4C8B0',
              }}
            />
          ))}
        </View>
      )}
      {/* Progress bar */}
      <View
        style={{
          width: '80%',
          height: 4,
          backgroundColor: '#E0D8CE',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 2,
          }}
        />
      </View>
      <Text style={{ fontSize: 11, color: colors.textSoft, marginTop: 4 }}>
        Paso {currentStep + 1} de {totalSteps}
      </Text>
    </View>
  );
}
