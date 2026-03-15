import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { ContentService } from '../../src/services/ContentService';
import { VerseCard } from '../../src/components/VerseCard';
import torahGlossary from '../../src/data/torah_glossary.json';

type ActiveTab = 'bible' | 'torah';

interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export default function ScriptureScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bible');
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    ContentService.getDailyVerse().then(setDailyVerse);
    ContentService.getFavorites('bible').then(setFavorites);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Tab selector */}
      <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={() => setActiveTab('bible')}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: activeTab === 'bible' ? colors.primary : '#FFF',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: activeTab === 'bible' ? colors.primary : colors.border,
          }}
        >
          <Ionicons name="book" size={20} color={activeTab === 'bible' ? '#FFF' : colors.primary} />
          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: '700',
              color: activeTab === 'bible' ? '#FFF' : colors.textMain,
            }}
          >
            Biblia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('torah')}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: activeTab === 'torah' ? colors.greenHope : '#FFF',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: activeTab === 'torah' ? colors.greenHope : colors.border,
          }}
        >
          <Ionicons name="leaf" size={20} color={activeTab === 'torah' ? '#FFF' : colors.greenHope} />
          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: '700',
              color: activeTab === 'torah' ? '#FFF' : colors.textMain,
            }}
          >
            Torá
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {activeTab === 'bible' ? (
          <View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginBottom: 8 }}>
              Versículo del día
            </Text>
            {dailyVerse && (
              <VerseCard
                text={dailyVerse.text}
                reference={`${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`}
                style="bible"
              />
            )}

            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 20, marginBottom: 12 }}>
              Categorías de lectura
            </Text>
            {[
              { name: 'Salmos', icon: 'musical-notes' as const, desc: 'Oraciones, alabanza y confianza' },
              { name: 'Proverbios', icon: 'bulb' as const, desc: 'Sabiduría práctica' },
              { name: 'Evangelios', icon: 'sunny' as const, desc: 'Palabras de Jesús' },
              { name: 'Cartas Paulinas', icon: 'mail' as const, desc: 'Fe, amor, gracia' },
              { name: 'Fortaleza', icon: 'shield' as const, desc: 'Para momentos difíciles' },
              { name: 'Amor', icon: 'heart' as const, desc: 'El amor de Dios' },
            ].map((cat, idx) => (
              <TouchableOpacity
                key={idx}
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
                <Ionicons name={cat.icon} size={22} color={colors.secondary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMain }}>{cat.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.textSoft }}>{cat.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.greenHope, paddingHorizontal: 16, marginBottom: 8 }}>
              Los Cinco Libros de Moisés
            </Text>
            {[
              { he: 'בְּרֵאשִׁית', name: 'Bereshit', es: 'Génesis', desc: 'Creación, patriarcas' },
              { he: 'שְׁמוֹת', name: 'Shemot', es: 'Éxodo', desc: 'Moisés, Sinaí' },
              { he: 'וַיִּקְרָא', name: 'Vayikra', es: 'Levítico', desc: 'Leyes, santidad' },
              { he: 'בְּמִדְבַּר', name: 'Bamidbar', es: 'Números', desc: 'El desierto' },
              { he: 'דְּבָרִים', name: 'Devarim', es: 'Deuteronomio', desc: 'Discursos de Moisés' },
            ].map((book, idx) => (
              <TouchableOpacity
                key={idx}
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginRight: 12, color: colors.greenHope }}>{book.he}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMain }}>
                      {book.name} — {book.es}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSoft }}>{book.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
                </View>
              </TouchableOpacity>
            ))}

            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.greenHope, paddingHorizontal: 16, marginTop: 20, marginBottom: 12 }}>
              Glosario Hebreo
            </Text>
            {torahGlossary.map((item, idx) => (
              <View
                key={idx}
                style={{
                  marginHorizontal: 16,
                  marginBottom: 8,
                  backgroundColor: '#E0F0E8',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.greenHope }}>
                    {item.term}
                  </Text>
                  <Text style={{ marginLeft: 8, fontSize: 13, color: colors.textSoft, fontStyle: 'italic' }}>
                    [{item.pronunciation}]
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: colors.textMain, marginTop: 4 }}>
                  {item.meaning}
                </Text>
              </View>
            ))}
            <View style={{ height: 30 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
