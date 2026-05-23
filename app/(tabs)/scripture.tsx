import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { ContentProvider } from '../../src/services/ContentProvider';
import { VerseCard } from '../../src/components/VerseCard';

interface BibleVerse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  tags: string;
}

const BIBLE_CATEGORIES = [
  { name: 'Salmos', book: 'Salmos', icon: 'musical-notes' as const, desc: 'Oraciones, alabanza y confianza', type: 'book' },
  { name: 'Proverbios', book: 'Proverbios', icon: 'bulb' as const, desc: 'Sabiduría práctica', type: 'book' },
  { name: 'Evangelios', book: null, icon: 'sunny' as const, desc: 'Palabras de Jesús', type: 'books', books: ['Mateo', 'Marcos', 'Lucas', 'Juan'] },
  { name: 'Cartas Paulinas', book: null, icon: 'mail' as const, desc: 'Fe, amor, gracia', type: 'books', books: ['Romanos', 'Corintios', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos'] },
  { name: 'Fortaleza', book: null, icon: 'shield' as const, desc: 'Para momentos difíciles', type: 'tag', tag: 'fortaleza' },
  { name: 'Amor', book: null, icon: 'heart' as const, desc: 'El amor de Dios', type: 'tag', tag: 'amor' },
  { name: 'Todos los versículos', book: null, icon: 'library' as const, desc: 'Ver toda la biblioteca bíblica', type: 'all' },
];

export default function ScriptureScreen() {
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryVerses, setCategoryVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ContentProvider.getDailyVerse().then((v) => {
      if (v) setDailyVerse(v as BibleVerse);
    });
  }, []);

  const loadCategory = async (cat: typeof BIBLE_CATEGORIES[0]) => {
    setLoading(true);
    setSelectedCategory(cat.name);
    try {
      let verses: BibleVerse[] = [];
      if (cat.type === 'book' && cat.book) {
        verses = await ContentProvider.getVersesByBook(cat.book);
      } else if (cat.type === 'books' && cat.books) {
        const results = await Promise.all(cat.books.map((b: string) => ContentProvider.getVersesByBook(b)));
        verses = results.flat();
      } else if (cat.type === 'tag' && cat.tag) {
        verses = await ContentProvider.getVersesByTag(cat.tag);
      } else if (cat.type === 'all') {
        verses = await ContentProvider.getAllBibleVerses();
      }
      setCategoryVerses(verses);
    } catch (e) {
      console.error('Error loading category:', e);
      setCategoryVerses([]);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setSelectedCategory(null);
    setCategoryVerses([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView>
        {selectedCategory ? (
          <View>
            <TouchableOpacity onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, marginBottom: 12 }}>
              <Ionicons name="arrow-back" size={22} color={colors.primary} />
              <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '700', color: colors.primary }}>{selectedCategory}</Text>
            </TouchableOpacity>
            {loading ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.textSoft, marginTop: 12 }}>Cargando versículos...</Text>
              </View>
            ) : categoryVerses.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Ionicons name="book-outline" size={48} color={colors.textSoft} />
                <Text style={{ color: colors.textSoft, marginTop: 12, textAlign: 'center' }}>
                  No se encontraron versículos en esta categoría
                </Text>
              </View>
            ) : (
              <>
                <Text style={{ paddingHorizontal: 16, marginBottom: 12, color: colors.textSoft, fontSize: 13 }}>
                  {categoryVerses.length} versículo{categoryVerses.length !== 1 ? 's' : ''}
                </Text>
                {categoryVerses.map((verse, idx) => (
                  <VerseCard key={verse.id || idx} text={verse.text} reference={`${verse.book} ${verse.chapter}:${verse.verse}`} style="bible" />
                ))}
                <View style={{ height: 30 }} />
              </>
            )}
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, paddingTop: 16, marginBottom: 8 }}>
              Versículo del día
            </Text>
            {dailyVerse ? (
              <VerseCard text={dailyVerse.text} reference={`${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`} style="bible" />
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}><ActivityIndicator color={colors.primary} /></View>
            )}
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginTop: 20, marginBottom: 12 }}>
              Categorías de lectura
            </Text>
            {BIBLE_CATEGORIES.map((cat, idx) => (
              <TouchableOpacity key={idx} onPress={() => loadCategory(cat)}
                style={{ marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
                <Ionicons name={cat.icon} size={22} color={colors.secondary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMain }}>{cat.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.textSoft }}>{cat.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
              </TouchableOpacity>
            ))}
            <View style={{ height: 20 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
