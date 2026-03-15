import { getDatabase } from '../database/schema';
import bibleVerses from '../data/bible_verses.json';
import stoicQuotes from '../data/stoic_quotes.json';
import prayers from '../data/prayers.json';

export class ContentService {
  static async seedDatabase(): Promise<void> {
    const db = await getDatabase();

    const existingVerses = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM bible_verses'
    );
    if (existingVerses && existingVerses.count > 0) return;

    // Seed bible verses
    for (const verse of bibleVerses) {
      await db.runAsync(
        'INSERT INTO bible_verses (book, chapter, verse, text, tags, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
        [verse.book, verse.chapter, verse.verse, verse.text, JSON.stringify(verse.tags), verse.is_featured]
      );
    }

    // Seed stoic quotes
    for (const quote of stoicQuotes) {
      await db.runAsync(
        'INSERT INTO stoic_quotes (author, work, book_chapter, text, theme, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
        [quote.author, quote.work, quote.book_chapter, quote.text, quote.theme, quote.is_featured]
      );
    }

    // Seed prayers
    const allPrayers = [
      ...prayers.fundamental,
      ...(prayers.sagrado_corazon || []),
      ...prayers.misericordia,
      ...(prayers.misa || []),
      ...(prayers.san_miguel || []),
      ...prayers.oración_fatima,
      ...(prayers.magnificat || []),
      ...(prayers.proteccion || []),
    ];
    for (const prayer of allPrayers) {
      await db.runAsync(
        'INSERT INTO prayers (name, category, text, sort_order) VALUES (?, ?, ?, ?)',
        [prayer.name, prayer.category, prayer.text, prayer.sort_order]
      );
    }
  }

  static async getDailyVerse(): Promise<{
    book: string;
    chapter: number;
    verse: number;
    text: string;
  } | null> {
    const db = await getDatabase();
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const count = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM bible_verses WHERE is_featured = 1'
    );
    if (!count || count.count === 0) return null;
    const offset = dayOfYear % count.count;
    return db.getFirstAsync(
      'SELECT book, chapter, verse, text FROM bible_verses WHERE is_featured = 1 LIMIT 1 OFFSET ?',
      [offset]
    );
  }

  static async getDailyStoicQuote(): Promise<{
    author: string;
    work: string;
    book_chapter: string;
    text: string;
  } | null> {
    const db = await getDatabase();
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const count = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM stoic_quotes WHERE is_featured = 1'
    );
    if (!count || count.count === 0) return null;
    const offset = dayOfYear % count.count;
    return db.getFirstAsync(
      'SELECT author, work, book_chapter, text FROM stoic_quotes WHERE is_featured = 1 LIMIT 1 OFFSET ?',
      [offset]
    );
  }

  static async getPrayersByCategory(category: string): Promise<
    Array<{ id: number; name: string; text: string; sort_order: number }>
  > {
    const db = await getDatabase();
    return db.getAllAsync(
      'SELECT id, name, text, sort_order FROM prayers WHERE category = ? ORDER BY sort_order',
      [category]
    );
  }

  static async getAllStoicQuotes(): Promise<
    Array<{ id: number; author: string; work: string; book_chapter: string; text: string; theme: string }>
  > {
    const db = await getDatabase();
    return db.getAllAsync('SELECT * FROM stoic_quotes ORDER BY author, book_chapter');
  }

  static async getQuotesByAuthor(author: string): Promise<
    Array<{ id: number; work: string; book_chapter: string; text: string; theme: string }>
  > {
    const db = await getDatabase();
    return db.getAllAsync(
      'SELECT id, work, book_chapter, text, theme FROM stoic_quotes WHERE author = ? ORDER BY book_chapter',
      [author]
    );
  }

  static async toggleFavorite(contentType: string, contentId: number): Promise<boolean> {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<{ id: number }>(
      'SELECT id FROM favorites WHERE content_type = ? AND content_id = ?',
      [contentType, contentId]
    );
    if (existing) {
      await db.runAsync('DELETE FROM favorites WHERE id = ?', [existing.id]);
      return false;
    }
    await db.runAsync(
      'INSERT INTO favorites (content_type, content_id) VALUES (?, ?)',
      [contentType, contentId]
    );
    return true;
  }

  static async getFavorites(contentType: string): Promise<number[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ content_id: number }>(
      'SELECT content_id FROM favorites WHERE content_type = ?',
      [contentType]
    );
    return rows.map((r) => r.content_id);
  }
}
