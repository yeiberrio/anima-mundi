import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

const SEFARIA_URL = 'https://www.sefaria.org/api';
const BOLLS_URL = 'https://bolls.life/get-chapter/RV1960';

const BOOK_MAP: Record<string, { en: string; bollsId: number; chapters: number }> = {
  bereshit: { en: 'Genesis', bollsId: 1, chapters: 50 },
  shemot: { en: 'Exodus', bollsId: 2, chapters: 40 },
  vayikra: { en: 'Leviticus', bollsId: 3, chapters: 27 },
  bamidbar: { en: 'Numbers', bollsId: 4, chapters: 36 },
  devarim: { en: 'Deuteronomy', bollsId: 5, chapters: 34 },
};

const EN_BOOK_TO_BOLLS: Record<string, number> = {
  genesis: 1, exodus: 2, leviticus: 3, numbers: 4, deuteronomy: 5,
};

@Injectable()
export class TorahService {
  constructor(private prisma: PrismaService) {}

  async getGlossary() {
    return this.prisma.torahGlossary.findMany({ orderBy: { term: 'asc' } });
  }

  getBooks() {
    return Object.entries(BOOK_MAP).map(([id, info]) => ({
      id, name: info.en, chapters: info.chapters,
    }));
  }

  async getChapter(bookId: string, chapter: number) {
    const book = BOOK_MAP[bookId];
    if (!book) return null;

    try {
      const [esRes, heRes] = await Promise.all([
        axios.get(`${BOLLS_URL}/${book.bollsId}/${chapter}/`).catch(() => null),
        axios.get(`${SEFARIA_URL}/texts/${book.en}.${chapter}?lang=he`).catch(() => null),
      ]);

      let esVerses: Array<{ verse: number; text: string }> = [];
      if (esRes?.data && Array.isArray(esRes.data)) {
        esVerses = esRes.data.map((v: any) => ({
          verse: v.verse,
          text: this.stripHtml(v.text || ''),
        }));
      }

      let heTexts: string[] = [];
      if (heRes?.data?.he && Array.isArray(heRes.data.he)) {
        heTexts = heRes.data.he.map((t: string) => this.stripHtml(t));
      }

      if (esVerses.length === 0 && heTexts.length === 0) return null;

      const maxLen = Math.max(esVerses.length, heTexts.length);
      const verses = [];
      for (let i = 0; i < maxLen; i++) {
        verses.push({
          verse: esVerses[i]?.verse || i + 1,
          textEs: esVerses[i]?.text || '',
          textHe: heTexts[i] || '',
        });
      }

      return { book: bookId, chapter, verses };
    } catch {
      return null;
    }
  }

  async getParashat() {
    try {
      const now = new Date();
      const url = `${SEFARIA_URL}/calendars?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}`;
      const res = await axios.get(url);

      const parashat = res.data.calendar_items?.find(
        (item: any) => item.title?.en === 'Parashat Hashavua',
      );
      if (!parashat) return null;

      const name = parashat.displayValue?.en || 'Parashat';
      const ref = parashat.ref || '';
      const heRef = parashat.heRef || '';
      const description = parashat.description?.en || '';

      let verses: any[] = [];
      if (ref) {
        const parsed = this.parseRef(ref);
        if (parsed) {
          const [esRes, heRes] = await Promise.all([
            axios.get(`${BOLLS_URL}/${parsed.bollsId}/${parsed.startChapter}/`).catch(() => null),
            axios.get(`${SEFARIA_URL}/texts/${parsed.bookEn}.${parsed.startChapter}?lang=he`).catch(() => null),
          ]);

          let esVerses: Array<{ verse: number; text: string }> = [];
          if (esRes?.data && Array.isArray(esRes.data)) {
            esVerses = esRes.data.map((v: any) => ({ verse: v.verse, text: this.stripHtml(v.text || '') }));
          }

          let heTexts: string[] = [];
          if (heRes?.data?.he && Array.isArray(heRes.data.he)) {
            heTexts = heRes.data.he.map((t: string) => this.stripHtml(t));
          }

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
    } catch {
      return null;
    }
  }

  private parseRef(ref: string) {
    const match = ref.match(/^(\w+)\s+(\d+):?(\d+)?/);
    if (!match) return null;
    const bookEn = match[1];
    const bollsId = EN_BOOK_TO_BOLLS[bookEn.toLowerCase()];
    if (!bollsId) return null;
    const startChapter = parseInt(match[2], 10);
    const startVerse = match[3] ? parseInt(match[3], 10) : null;
    const endMatch = ref.match(/-(\d+):?(\d+)?$/);
    const endVerse = endMatch && !endMatch[2] ? parseInt(endMatch[1], 10) : null;
    return { bookEn, bollsId, startChapter, startVerse, endVerse };
  }

  private stripHtml(text: string): string {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }
}
