import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('anima_mundi.db');
  await initializeDatabase(db);
  return db;
}

async function initializeDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS bible_verses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book TEXT NOT NULL,
      chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL,
      text TEXT NOT NULL,
      version TEXT DEFAULT 'RVR1960',
      tags TEXT,
      is_featured INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS stoic_quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      work TEXT NOT NULL,
      book_chapter TEXT,
      text TEXT NOT NULL,
      theme TEXT,
      original_greek TEXT,
      is_featured INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS prayers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      saint TEXT,
      text TEXT NOT NULL,
      day_number INTEGER,
      novena_id INTEGER,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS torah_verses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book TEXT NOT NULL,
      parasha TEXT,
      chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL,
      text_es TEXT NOT NULL,
      text_he TEXT,
      text_transliterated TEXT,
      parasha_week INTEGER
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      reference_id TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      streak_date DATE,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_type TEXT NOT NULL,
      content_id INTEGER NOT NULL,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_note TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_bible_book ON bible_verses(book, chapter);
    CREATE INDEX IF NOT EXISTS idx_stoic_author ON stoic_quotes(author);
    CREATE INDEX IF NOT EXISTS idx_prayers_category ON prayers(category);
    CREATE INDEX IF NOT EXISTS idx_torah_book ON torah_verses(book, chapter);
    CREATE INDEX IF NOT EXISTS idx_progress_type ON user_progress(type);
  `);
}
