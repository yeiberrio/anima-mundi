import { Platform } from 'react-native';
import { ApiClient } from './ApiClient';

// Dynamic import: ContentService uses expo-sqlite which crashes on web
let ContentService: any = null;
if (Platform.OS !== 'web') {
  ContentService = require('./ContentService').ContentService;
}

const isWeb = Platform.OS === 'web';

export class ContentProvider {
  static async seedDatabase(): Promise<void> {
    if (isWeb || !ContentService) return;
    return ContentService.seedDatabase();
  }

  static async getDailyVerse() {
    if (isWeb) return ApiClient.getDailyVerse();
    try {
      const result = await ContentService.getDailyVerse();
      if (result) return result;
    } catch {}
    return ApiClient.getDailyVerse();
  }

  static async getDailyStoicQuote() {
    if (isWeb) {
      const q = await ApiClient.getDailyStoicQuote();
      // Normalize field name: API returns bookChapter, screens expect book_chapter
      if (q && 'bookChapter' in q) {
        return { ...q, book_chapter: (q as any).bookChapter };
      }
      return q;
    }
    try {
      const result = await ContentService.getDailyStoicQuote();
      if (result) return result;
    } catch {}
    return ApiClient.getDailyStoicQuote();
  }

  static async getVersesByBook(book: string) {
    if (isWeb) return (await ApiClient.getVersesByBook(book)) || [];
    try {
      return await ContentService.getVersesByBook(book);
    } catch {}
    return (await ApiClient.getVersesByBook(book)) || [];
  }

  static async getVersesByTag(tag: string) {
    if (isWeb) return (await ApiClient.getVersesByTag(tag)) || [];
    try {
      return await ContentService.getVersesByTag(tag);
    } catch {}
    return (await ApiClient.getVersesByTag(tag)) || [];
  }

  static async getAllBibleVerses() {
    if (isWeb) return (await ApiClient.getAllBibleVerses()) || [];
    try {
      return await ContentService.getAllBibleVerses();
    } catch {}
    return (await ApiClient.getAllBibleVerses()) || [];
  }

  static async getAllStoicQuotes() {
    if (isWeb) return (await ApiClient.getAllStoicQuotes()) || [];
    try {
      return await ContentService.getAllStoicQuotes();
    } catch {}
    return (await ApiClient.getAllStoicQuotes()) || [];
  }

  static async getQuotesByAuthor(author: string) {
    if (isWeb) return (await ApiClient.getQuotesByAuthor(author)) || [];
    try {
      return await ContentService.getQuotesByAuthor(author);
    } catch {}
    return (await ApiClient.getQuotesByAuthor(author)) || [];
  }

  static async getPrayersByCategory(category: string) {
    if (isWeb) return (await ApiClient.getPrayersByCategory(category)) || [];
    try {
      return await ContentService.getPrayersByCategory(category);
    } catch {}
    return (await ApiClient.getPrayersByCategory(category)) || [];
  }

  // Favorites stay local-only (AsyncStorage works on web too)
  static async toggleFavorite(contentType: string, contentId: number): Promise<boolean> {
    if (isWeb || !ContentService) return false;
    return ContentService.toggleFavorite(contentType, contentId);
  }

  static async getFavorites(contentType: string): Promise<number[]> {
    if (isWeb || !ContentService) return [];
    return ContentService.getFavorites(contentType);
  }
}
