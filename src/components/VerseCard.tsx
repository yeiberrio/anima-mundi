import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface VerseCardProps {
  text: string;
  reference: string;
  onFavorite?: () => void;
  isFavorite?: boolean;
  style?: 'bible' | 'stoic' | 'torah';
}

const styleConfig = {
  bible: { bg: '#F0E6D3', accent: colors.secondary, icon: 'book' as const },
  stoic: { bg: '#E8E0F0', accent: colors.primary, icon: 'library' as const },
  torah: { bg: '#E0F0E8', accent: colors.greenHope, icon: 'leaf' as const },
};

export function VerseCard({ text, reference, onFavorite, isFavorite, style = 'bible' }: VerseCardProps) {
  const config = styleConfig[style];

  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: 16,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderLeftWidth: 4,
        borderLeftColor: config.accent,
      }}
    >
      <Text
        style={{
          fontSize: 17,
          lineHeight: 26,
          color: colors.textMain,
          fontStyle: 'italic',
          marginBottom: 12,
        }}
      >
        "{text}"
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: colors.textSoft, fontWeight: '600' }}>
          — {reference}
        </Text>
        {onFavorite && (
          <TouchableOpacity onPress={onFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.crimson : colors.textSoft}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
