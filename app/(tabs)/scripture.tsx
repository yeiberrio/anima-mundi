import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { ContentService } from '../../src/services/ContentService';
import { SefariaService, TorahChapter, ParashatData } from '../../src/services/SefariaService';
import { VerseCard } from '../../src/components/VerseCard';
import torahGlossary from '../../src/data/torah_glossary.json';

type ActiveTab = 'bible' | 'torah';

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

const TORAH_BOOKS = [
  { id: 'bereshit', he: 'בְּרֵאשִׁית', name: 'Bereshit', es: 'Génesis', desc: 'Creación, patriarcas, José en Egipto' },
  { id: 'shemot', he: 'שְׁמוֹת', name: 'Shemot', es: 'Éxodo', desc: 'Moisés, plagas, Sinaí, los 10 mandamientos' },
  { id: 'vayikra', he: 'וַיִּקְרָא', name: 'Vayikra', es: 'Levítico', desc: 'Leyes de pureza, sacrificios, santidad' },
  { id: 'bamidbar', he: 'בְּמִדְבַּר', name: 'Bamidbar', es: 'Números', desc: 'El desierto, los censos, las tribus' },
  { id: 'devarim', he: 'דְּבָרִים', name: 'Devarim', es: 'Deuteronomio', desc: 'Discursos finales de Moisés' },
];

// Torah sub-views
type TorahView = 'menu' | 'chapters' | 'reading' | 'parashat';

export default function ScriptureScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bible');
  // Bible state
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryVerses, setCategoryVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  // Torah state
  const [torahView, setTorahView] = useState<TorahView>('menu');
  const [selectedBook, setSelectedBook] = useState<typeof TORAH_BOOKS[0] | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapterData, setChapterData] = useState<TorahChapter | null>(null);
  const [parashatData, setParashatData] = useState<ParashatData | null>(null);
  const [torahLoading, setTorahLoading] = useState(false);

  useEffect(() => {
    ContentService.getDailyVerse().then((v) => {
      if (v) setDailyVerse(v as BibleVerse);
    });
  }, []);

  // Bible handlers
  const loadCategory = async (cat: typeof BIBLE_CATEGORIES[0]) => {
    setLoading(true);
    setSelectedCategory(cat.name);
    try {
      let verses: BibleVerse[] = [];
      if (cat.type === 'book' && cat.book) {
        verses = await ContentService.getVersesByBook(cat.book);
      } else if (cat.type === 'books' && cat.books) {
        const results = await Promise.all(cat.books.map((b: string) => ContentService.getVersesByBook(b)));
        verses = results.flat();
      } else if (cat.type === 'tag' && cat.tag) {
        verses = await ContentService.getVersesByTag(cat.tag);
      } else if (cat.type === 'all') {
        verses = await ContentService.getAllBibleVerses();
      }
      setCategoryVerses(verses);
    } catch (e) {
      console.error('Error loading category:', e);
      setCategoryVerses([]);
    } finally {
      setLoading(false);
    }
  };

  const goBackBible = () => {
    setSelectedCategory(null);
    setCategoryVerses([]);
  };

  // Torah handlers
  const openBook = (book: typeof TORAH_BOOKS[0]) => {
    setSelectedBook(book);
    setTorahView('chapters');
  };

  const loadChapter = async (chapter: number) => {
    if (!selectedBook) return;
    setSelectedChapter(chapter);
    setTorahLoading(true);
    setTorahView('reading');
    try {
      const data = await SefariaService.getChapter(selectedBook.id, chapter);
      setChapterData(data);
    } catch (e) {
      console.error('Error loading chapter:', e);
    } finally {
      setTorahLoading(false);
    }
  };

  const loadParashat = async () => {
    setTorahLoading(true);
    setTorahView('parashat');
    try {
      const data = await SefariaService.getParashat();
      setParashatData(data);
    } catch (e) {
      console.error('Error loading parashat:', e);
    } finally {
      setTorahLoading(false);
    }
  };

  const goBackTorah = () => {
    if (torahView === 'reading') {
      setTorahView('chapters');
      setChapterData(null);
    } else if (torahView === 'chapters') {
      setTorahView('menu');
      setSelectedBook(null);
    } else if (torahView === 'parashat') {
      setTorahView('menu');
      setParashatData(null);
    }
  };

  const resetAll = () => {
    goBackBible();
    setTorahView('menu');
    setSelectedBook(null);
    setChapterData(null);
    setParashatData(null);
  };

  // =========== RENDER ===========
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Tab selector */}
      <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={() => { setActiveTab('bible'); resetAll(); }}
          style={{
            flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
            backgroundColor: activeTab === 'bible' ? colors.primary : '#FFF',
            borderWidth: 1, borderColor: activeTab === 'bible' ? colors.primary : colors.border,
          }}
        >
          <Ionicons name="book" size={20} color={activeTab === 'bible' ? '#FFF' : colors.primary} />
          <Text style={{ marginTop: 4, fontSize: 13, fontWeight: '700', color: activeTab === 'bible' ? '#FFF' : colors.textMain }}>
            Biblia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setActiveTab('torah'); resetAll(); }}
          style={{
            flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
            backgroundColor: activeTab === 'torah' ? colors.greenHope : '#FFF',
            borderWidth: 1, borderColor: activeTab === 'torah' ? colors.greenHope : colors.border,
          }}
        >
          <Ionicons name="leaf" size={20} color={activeTab === 'torah' ? '#FFF' : colors.greenHope} />
          <Text style={{ marginTop: 4, fontSize: 13, fontWeight: '700', color: activeTab === 'torah' ? '#FFF' : colors.textMain }}>
            Torá
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {activeTab === 'bible' ? (
          /* ========= BIBLE TAB ========= */
          selectedCategory ? (
            <View>
              <TouchableOpacity onPress={goBackBible} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
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
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, paddingHorizontal: 16, marginBottom: 8 }}>
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
          )
        ) : (
          /* ========= TORAH TAB ========= */
          torahView === 'reading' && chapterData ? (
            /* Chapter reading view */
            <View>
              <TouchableOpacity onPress={goBackTorah} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 }}>
                <Ionicons name="arrow-back" size={22} color={colors.greenHope} />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '700', color: colors.greenHope }}>
                  {selectedBook?.name} — Capítulo {selectedChapter}
                </Text>
              </TouchableOpacity>
              <Text style={{ paddingHorizontal: 16, marginBottom: 16, color: colors.textSoft, fontSize: 13 }}>
                {chapterData.verses.length} versículos
              </Text>
              {chapterData.verses.map((v) => (
                <View key={v.verse} style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.greenHope, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>{v.verse}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: colors.textSoft }}>
                      {selectedBook?.name} {selectedChapter}:{v.verse}
                    </Text>
                  </View>
                  {v.textHe ? (
                    <Text style={{ fontSize: 20, lineHeight: 32, color: colors.textMain, textAlign: 'right', marginBottom: 8, fontFamily: 'serif' }}>
                      {v.textHe}
                    </Text>
                  ) : null}
                  <Text style={{ fontSize: 15, lineHeight: 24, color: colors.textMain }}>
                    {v.textEs}
                  </Text>
                </View>
              ))}
              <View style={{ height: 30 }} />
            </View>
          ) : torahView === 'reading' && torahLoading ? (
            <View style={{ padding: 60, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.greenHope} />
              <Text style={{ color: colors.textSoft, marginTop: 16 }}>Cargando desde Sefaria...</Text>
            </View>
          ) : torahView === 'parashat' ? (
            /* Parashat HaShavua view */
            <View>
              <TouchableOpacity onPress={goBackTorah} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 }}>
                <Ionicons name="arrow-back" size={22} color={colors.greenHope} />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '700', color: colors.greenHope }}>Volver</Text>
              </TouchableOpacity>
              {torahLoading ? (
                <View style={{ padding: 60, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={colors.greenHope} />
                  <Text style={{ color: colors.textSoft, marginTop: 16 }}>Cargando Parashat de la semana...</Text>
                </View>
              ) : parashatData ? (
                <View>
                  <View style={{ marginHorizontal: 16, backgroundColor: colors.greenHope, borderRadius: 16, padding: 20, marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, color: '#C0E8D0', fontWeight: '600' }}>Parashat HaShavua</Text>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF', marginTop: 4 }}>{parashatData.name}</Text>
                    {parashatData.heRef ? (
                      <Text style={{ fontSize: 18, color: '#E0F0E8', marginTop: 4, fontFamily: 'serif' }}>{parashatData.heRef}</Text>
                    ) : null}
                    <Text style={{ fontSize: 13, color: '#C0E8D0', marginTop: 8 }}>{parashatData.ref}</Text>
                  </View>
                  {parashatData.verses.length > 0 ? (
                    <>
                      <Text style={{ paddingHorizontal: 16, marginBottom: 12, fontSize: 16, fontWeight: '700', color: colors.greenHope }}>
                        Primeros versículos
                      </Text>
                      {parashatData.verses.map((v) => (
                        <View key={v.verse} style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.greenHope, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>{v.verse}</Text>
                            </View>
                          </View>
                          {v.textHe ? (
                            <Text style={{ fontSize: 20, lineHeight: 32, color: colors.textMain, textAlign: 'right', marginBottom: 8, fontFamily: 'serif' }}>
                              {v.textHe}
                            </Text>
                          ) : null}
                          <Text style={{ fontSize: 15, lineHeight: 24, color: colors.textMain }}>{v.textEs}</Text>
                        </View>
                      ))}
                    </>
                  ) : (
                    <View style={{ padding: 30, alignItems: 'center' }}>
                      <Text style={{ color: colors.textSoft, textAlign: 'center' }}>
                        No se pudieron cargar los versículos. Verifica tu conexión a internet.
                      </Text>
                    </View>
                  )}
                  <View style={{ height: 30 }} />
                </View>
              ) : (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Ionicons name="cloud-offline-outline" size={48} color={colors.textSoft} />
                  <Text style={{ color: colors.textSoft, marginTop: 12, textAlign: 'center' }}>
                    No se pudo cargar la Parashat. Verifica tu conexión a internet.
                  </Text>
                </View>
              )}
            </View>
          ) : torahView === 'chapters' && selectedBook ? (
            /* Chapter list view */
            <View>
              <TouchableOpacity onPress={goBackTorah} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
                <Ionicons name="arrow-back" size={22} color={colors.greenHope} />
                <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '700', color: colors.greenHope }}>
                  {selectedBook.name} — {selectedBook.es}
                </Text>
              </TouchableOpacity>
              <Text style={{ paddingHorizontal: 16, marginBottom: 4, fontSize: 22, color: colors.greenHope, fontFamily: 'serif' }}>
                {selectedBook.he}
              </Text>
              <Text style={{ paddingHorizontal: 16, marginBottom: 16, color: colors.textSoft, fontSize: 13 }}>
                {selectedBook.desc} — {SefariaService.getChapterCount(selectedBook.id)} capítulos
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 }}>
                {Array.from({ length: SefariaService.getChapterCount(selectedBook.id) }, (_, i) => i + 1).map((ch) => (
                  <TouchableOpacity
                    key={ch}
                    onPress={() => loadChapter(ch)}
                    style={{
                      width: '18%', margin: '1%', paddingVertical: 14, borderRadius: 10,
                      backgroundColor: '#FFF', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.greenHope }}>{ch}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ height: 30 }} />
            </View>
          ) : (
            /* Torah main menu */
            <View>
              {/* Parashat HaShavua card */}
              <TouchableOpacity onPress={loadParashat}
                style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.greenHope, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                  <Text style={{ fontSize: 24 }}>📜</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>Parashat HaShavua</Text>
                  <Text style={{ color: '#C0E8D0', fontSize: 13 }}>Porción semanal de la Torá</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FFF" />
              </TouchableOpacity>

              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.greenHope, paddingHorizontal: 16, marginBottom: 8 }}>
                Los Cinco Libros de Moisés
              </Text>
              {TORAH_BOOKS.map((book) => (
                <TouchableOpacity key={book.id} onPress={() => openBook(book)}
                  style={{ marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, marginRight: 12, color: colors.greenHope }}>{book.he}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMain }}>{book.name} — {book.es}</Text>
                      <Text style={{ fontSize: 12, color: colors.textSoft }}>{book.desc}</Text>
                      <Text style={{ fontSize: 11, color: colors.greenHope, marginTop: 2 }}>
                        {SefariaService.getChapterCount(book.id)} capítulos
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSoft} />
                  </View>
                </TouchableOpacity>
              ))}

              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.greenHope, paddingHorizontal: 16, marginTop: 20, marginBottom: 12 }}>
                Glosario Hebreo
              </Text>
              {torahGlossary.map((item, idx) => (
                <View key={idx} style={{ marginHorizontal: 16, marginBottom: 8, backgroundColor: '#E0F0E8', borderRadius: 12, padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.greenHope }}>{item.term}</Text>
                    <Text style={{ marginLeft: 8, fontSize: 13, color: colors.textSoft, fontStyle: 'italic' }}>[{item.pronunciation}]</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.textMain, marginTop: 4 }}>{item.meaning}</Text>
                </View>
              ))}
              <View style={{ height: 30 }} />
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
