import {Capacitor} from '@capacitor/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SQLiteConnection: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let CapacitorSQLite: any = null;

// Only import SQLite for mobile platforms
if (Capacitor.isNativePlatform()) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sqlite = require('@capacitor-community/sqlite');
    CapacitorSQLite = sqlite.CapacitorSQLite;
    SQLiteConnection = sqlite.SQLiteConnection;
  } catch {
    console.warn('SQLite not available');
  }
}

class Database {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private db: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sqlite: any = null;
  private isNative = Capacitor.isNativePlatform();

  async initialize(dbName: string = 'vichealai.db') {
    try {
      // Skip SQLite for web platform, use localStorage fallback
      if (!this.isNative) {
        console.log('Web platform detected - using localStorage fallback for offline data');
        return;
      }

      // For native platforms, use SQLite
      if (!SQLiteConnection || !CapacitorSQLite) {
        console.warn('SQLite not available on this platform');
        return;
      }

      this.sqlite = new SQLiteConnection(CapacitorSQLite);
      this.db = await this.sqlite.createConnection(
        dbName,
        false,
        'no-encryption',
        1,
        false
      );
      await this.db.open();
      await this.createTables();
      console.log('SQLite database initialized');
    } catch (error) {
      console.warn('Database initialization warning:', error);
      // Don't throw - allow app to continue with localStorage fallback
    }
  }

  private async createTables() {
    if (!this.db) return;

    const tables = [
      `CREATE TABLE IF NOT EXISTS schools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        logo TEXT,
        address TEXT,
        phone TEXT,
        email TEXT,
        principal_id TEXT,
        timezone TEXT DEFAULT 'UTC',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT,
        role TEXT NOT NULL,
        photo TEXT,
        phone TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (school_id) REFERENCES schools(id)
      )`,
      `CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        user_id TEXT,
        enrollment_number TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        gender TEXT,
        date_of_birth DATE,
        blood_group TEXT,
        parent_id TEXT,
        address TEXT,
        emergency_contact TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (school_id) REFERENCES schools(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (parent_id) REFERENCES users(id)
      )`,
      `CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        class_id TEXT NOT NULL,
        date DATE NOT NULL,
        status TEXT NOT NULL,
        remarks TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (school_id) REFERENCES schools(id),
        FOREIGN KEY (student_id) REFERENCES students(id)
      )`,
      `CREATE TABLE IF NOT EXISTS homework (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        class_id TEXT NOT NULL,
        teacher_id TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        attachments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (school_id) REFERENCES schools(id),
        FOREIGN KEY (teacher_id) REFERENCES users(id)
      )`,
      `CREATE TABLE IF NOT EXISTS announcements (
        id TEXT PRIMARY KEY,
        school_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (school_id) REFERENCES schools(id),
        FOREIGN KEY (author_id) REFERENCES users(id)
      )`
    ];

    for (const sql of tables) {
      await this.db.execute(sql);
    }
  }

  async execute(sql: string, values?: unknown[]) {
    if (!this.db) {
      console.warn('Database not available - using localStorage fallback');
      return {changes: {changes: 0}};
    }
    return await this.db.run(sql, values);
  }

  async query(sql: string, values?: unknown[]) {
    if (!this.db) {
      console.warn('Database not available - using localStorage fallback');
      return {values: []};
    }
    return await this.db.query(sql, values);
  }

  async close() {
    if (this.db) {
      await this.db.close();
    }
  }
}

export default new Database();
