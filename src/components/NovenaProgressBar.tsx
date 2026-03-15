import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme/colors';

interface NovenaProgressBarProps {
  currentDay: number;
  completedDays: number[];
  totalDays?: number;
}

export function NovenaProgressBar({ currentDay, completedDays, totalDays = 9 }: NovenaProgressBarProps) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
      <Text style={{ fontSize: 13, color: colors.textSoft, marginBottom: 8, fontWeight: '600' }}>
        Día {currentDay} de {totalDays}
      </Text>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const isCompleted = completedDays.includes(day);
          const isCurrent = day === currentDay;
          return (
            <View
              key={day}
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: isCompleted
                  ? colors.secondary
                  : isCurrent
                    ? colors.primaryLight
                    : '#E0D8CE',
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
