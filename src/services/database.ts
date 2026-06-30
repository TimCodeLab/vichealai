import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'

class Database {
  private db: SQLiteDBConnection | null = null
  private sqlite = new SQLiteConnection(CapacitorSQLite)

  async initialize(dbName: string = 'vichealai.db') {
    try {
      this.db = await this.sqlite.createConnection(
        dbName,
        false,
        'no-encryption',
        1,
        false
      )
      await this.db.open()
      await this.createTables()
    } catch (error) {
      console.error('Database initialization failed:', error)
      throw error
    }
  }

  private async createTables() {
    if (!this.db) return

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
    ]

    for (const sql of tables) {
      await this.db.execute(sql)
    }
  }

  async execute(sql: string, values?: any[]) {
    if (!this.db) throw new Error('Database not initialized')
    return await this.db.run(sql, values)
  }

  async query(sql: string, values?: any[]) {
    if (!this.db) throw new Error('Database not initialized')
    return await this.db.query(sql, values)
  }

  async close() {
    if (this.db) {
      await this.db.close()
    }
  }
}

export default new Database()
