import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme/colors';

interface QuoteDisplayProps {
  text: string;
  author: string;
  source?: string;
  theme?: string;
}

const authorNames: Record<string, string> = {
  marco_aurelio: 'Marco Aurelio',
  epicteto: 'Epicteto',
  seneca: 'Séneca',
};

export function QuoteDisplay({ text, author, source }: QuoteDisplayProps) {
  return (
    <View
      style={{
        backgroundColor: '#E8E0F0',
        borderRadius: 16,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 28, marginRight: 8 }}>🏛️</Text>
        <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
          {authorNames[author] || author}
        </Text>
      </View>
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
      {source && (
        <Text style={{ fontSize: 12, color: colors.textSoft, textAlign: 'right' }}>
          {source}
        </Text>
      )}
    </View>
  );
}
