const PROD_API_URL = 'https://anima-mundi-production.up.railway.app/api/v1';
const LOCAL_API_URL = 'http://localhost:3000/api/v1';

// Use an explicit build-time env var if present; otherwise fall back to
// localhost only when the web app is actually served from localhost, and to the
// production backend everywhere else (deployed web, native builds). This avoids
// depending on Expo's .env loading, which throws on Node 18 (util.parseEnv).
const isLocalhost =
  typeof window !== 'undefined' &&
  !!window.location &&
  /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

const API_URL = process.env.EXPO_PUBLIC_API_URL || (isLocalhost ? LOCAL_API_URL : PROD_API_URL);

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
