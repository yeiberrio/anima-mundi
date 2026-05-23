const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export class ApiClient {
  // Bible
  static getDailyVerse() {
    return get<{ book: string; chapter: number; verse: number; text: string }>('/bible/daily');
  }

  static getVersesByBook(book: string) {
    return get<any[]>(`/bible?book=${encodeURIComponent(book)}`);
  }

  static getVersesByTag(tag: string) {
    return get<any[]>(`/bible?tag=${encodeURIComponent(tag)}`);
  }

  static getAllBibleVerses() {
    return get<any[]>('/bible');
  }

  // Stoic
  static getDailyStoicQuote() {
    return get<{ author: string; work: string; bookChapter: string; text: string }>('/stoic/daily');
  }

  static getAllStoicQuotes() {
    return get<any[]>('/stoic');
  }

  static getQuotesByAuthor(author: string) {
    return get<any[]>(`/stoic?author=${encodeURIComponent(author)}`);
  }

  // Prayers
  static getPrayersByCategory(category: string) {
    return get<any[]>(`/prayers?category=${encodeURIComponent(category)}`);
  }

  // Daily
  static getDailyContent() {
    return get<any>('/daily');
  }
}
