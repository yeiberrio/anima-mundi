const SEFARIA_URL = 'https://www.sefaria.org/api';
const BOLLS_URL = 'https://bolls.life/get-chapter/RV1960';

// Mapeo de libros del Torá
const BOOK_MAP: Record<string, { en: string; bollsId: number; chapters: number }> = {
  bereshit: { en: 'Genesis', bollsId: 1, chapters: 50 },
  shemot: { en: 'Exodus', bollsId: 2, chapters: 40 },
  vayikra: { en: 'Leviticus', bollsId: 3, chapters: 27 },
  bamidbar: { en: 'Numbers', bollsId: 4, chapters: 36 },
  devarim: { en: 'Deuteronomy', bollsId: 5, chapters: 34 },
};

// Mapeo inverso: nombre inglés del libro -> bollsId + capítulo inicio
// Para la Parashat necesitamos resolver "Leviticus 1" -> bollsId 3, chapter 1
const EN_BOOK_TO_BOLLS: Record<string, number> = {
  genesis: 1, exodus: 2, leviticus: 3, numbers: 4, deuteronomy: 5,
};

export interface TorahVerse {
  verse: number;
  textEs: string;
  textHe: string;
}

export interface TorahChapter {
  book: string;
  chapter: number;
  verses: TorahVerse[];
}

export interface ParashatData {
  name: string;
  heRef: string;
  ref: string;
  description: string;
  verses: TorahVerse[];
}

export class SefariaService {
  static getBookInfo(bookId: string) {
    return BOOK_MAP[bookId] || null;
  }

  static getChapterCount(bookId: string): number {
    return BOOK_MAP[bookId]?.chapters || 0;
  }

  /**
   * Obtiene un capítulo del Torá con texto en español (RV1960) + hebreo (Sefaria)
   */
  static async getChapter(bookId: string, chapter: number): Promise<TorahChapter | null> {
    const book = BOOK_MAP[bookId];
    if (!book) return null;

    try {
      // Cargar español (bolls.life RV1960) y hebreo (Sefaria) en paralelo
      const [esRes, heRes] = await Promise.all([
        fetch(`${BOLLS_URL}/${book.bollsId}/${chapter}/`).catch(() => null),
        fetch(`${SEFARIA_URL}/texts/${book.en}.${chapter}?lang=he`).catch(() => null),
      ]);

      // Texto en español desde bolls.life
      let esVerses: Array<{ verse: number; text: string }> = [];
      if (esRes && esRes.ok) {
        const esData = await esRes.json();
        if (Array.isArray(esData)) {
          esVerses = esData.map((v: any) => ({
            verse: v.verse,
            text: stripHtml(v.text || ''),
          }));
        }
      }

      // Texto en hebreo desde Sefaria
      let heTexts: string[] = [];
      if (heRes && heRes.ok) {
        const heData = await heRes.json();
        if (Array.isArray(heData.he)) {
          heTexts = heData.he.map((t: string) => stripHtml(t));
        }
      }

      // Combinar: español como base, hebreo complementario
      if (esVerses.length === 0 && heTexts.length === 0) return null;

      const maxLen = Math.max(esVerses.length, heTexts.length);
      const verses: TorahVerse[] = [];
      for (let i = 0; i < maxLen; i++) {
        verses.push({
          verse: esVerses[i]?.verse || i + 1,
          textEs: esVerses[i]?.text || '',
          textHe: heTexts[i] || '',
        });
      }

      return { book: bookId, chapter, verses };
    } catch (e) {
      console.error('[Torah] Error fetching chapter:', e);
      return null;
    }
  }

  /**
   * Obtiene la Parashat HaShavua (porción semanal) con texto en español
   */
  static async getParashat(): Promise<ParashatData | null> {
    try {
      const now = new Date();
      const url = `${SEFARIA_URL}/calendars?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();

      // Buscar la Parashat HaShavua
      const parashat = data.calendar_items?.find(
        (item: any) => item.title?.en === 'Parashat Hashavua'
      );
      if (!parashat) return null;

      const name = parashat.displayValue?.en || parashat.title?.en || 'Parashat';
      const ref = parashat.ref || '';
      const heRef = parashat.heRef || '';
      const description = parashat.description?.en || '';

      // Parsear la referencia para obtener libro y capítulo (ej: "Leviticus 1:1-5:26")
      let verses: TorahVerse[] = [];
      if (ref) {
        const parsed = parseRef(ref);
        if (parsed) {
          // Cargar el primer capítulo de la parashat en español + hebreo
          const [esRes, heRes] = await Promise.all([
            fetch(`${BOLLS_URL}/${parsed.bollsId}/${parsed.startChapter}/`).catch(() => null),
            fetch(`${SEFARIA_URL}/texts/${parsed.bookEn}.${parsed.startChapter}?lang=he`).catch(() => null),
          ]);

          let esVerses: Array<{ verse: number; text: string }> = [];
          if (esRes && esRes.ok) {
            const esData = await esRes.json();
            if (Array.isArray(esData)) {
              esVerses = esData.map((v: any) => ({ verse: v.verse, text: stripHtml(v.text || '') }));
            }
          }

          let heTexts: string[] = [];
          if (heRes && heRes.ok) {
            const heData = await heRes.json();
            if (Array.isArray(heData.he)) {
              heTexts = heData.he.map((t: string) => stripHtml(t));
            }
          }

          // Filtrar por rango de versículos si aplica
          const startVerse = parsed.startVerse || 1;
          const endVerse = parsed.endVerse || esVerses.length;
          const limit = Math.min(endVerse - startVerse + 1, 25);

          for (let i = 0; i < limit; i++) {
            const vNum = startVerse + i;
            const esV = esVerses.find((v) => v.verse === vNum);
            verses.push({
              verse: vNum,
              textEs: esV?.text || '',
              textHe: heTexts[vNum - 1] || '',
            });
          }
        }
      }

      return { name, heRef, ref, description, verses };
    } catch (e) {
      console.error('[Torah] Error fetching parashat:', e);
      return null;
    }
  }
}

/**
 * Parsea una referencia tipo "Leviticus 1:1-5:26" o "Genesis 12:1-17:27"
 */
function parseRef(ref: string): {
  bookEn: string;
  bollsId: number;
  startChapter: number;
  startVerse: number | null;
  endVerse: number | null;
} | null {
  // Formato: "BookName Chapter:Verse-Chapter:Verse" o "BookName Chapter:Verse-Verse"
  const match = ref.match(/^(\w+)\s+(\d+):?(\d+)?/);
  if (!match) return null;

  const bookEn = match[1];
  const bollsId = EN_BOOK_TO_BOLLS[bookEn.toLowerCase()];
  if (!bollsId) return null;

  const startChapter = parseInt(match[2], 10);
  const startVerse = match[3] ? parseInt(match[3], 10) : null;

  // Intentar parsear el final
  const endMatch = ref.match(/-(\d+):?(\d+)?$/);
  const endVerse = endMatch && !endMatch[2]
    ? parseInt(endMatch[1], 10) // solo versículo final
    : null;

  return { bookEn, bollsId, startChapter, startVerse, endVerse };
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}
