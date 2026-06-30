import database from './database';

class OfflineService {
  private isOnline = navigator.onLine;
  private useLocalStorage = true;

  async initialize() {
    try {
      // Initialize database (will use fallback on web)
      await database.initialize('vichealai.db');

      console.log(`Offline service initialized (Online: ${this.isOnline})`);
    } catch (error) {
      console.warn('Offline service initialization warning:', error);
      // Continue with localStorage fallback
    }

    // Listen for online/offline changes
    window.addEventListener('online', () => this.goOnline());
    window.addEventListener('offline', () => this.goOffline());
  }

  private goOnline() {
    this.isOnline = true;
    console.log('App is online');
    // Trigger sync
    this.notifyListeners('online');
  }

  private goOffline() {
    this.isOnline = false;
    console.log('App is offline - local data available');
    this.notifyListeners('offline');
  }

  isAppOnline(): boolean {
    return this.isOnline;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveToLocal(table: string, data: any) {
    try {
      const columns = Object.keys(data).join(',');
      const placeholders = Object.keys(data).map(() => '?').join(',');
      await database.execute(
        `INSERT OR REPLACE INTO ${table} (${columns}) VALUES (${placeholders})`,
        Object.values(data)
      );
      console.log(`Saved to ${table}`);
    } catch (error) {
      console.error(`Failed to save to ${table}:`, error);
      throw error;
    }
  }

  // Get data from local SQLite
  async getFromLocal(table: string, id?: string) {
    try {
      const query = id ? `SELECT * FROM ${table} WHERE id = ?` : `SELECT * FROM ${table}`;
      const result = await database.query(query, id ? [id] : undefined);
      return result.values || [];
    } catch (error) {
      console.error(`Failed to get from ${table}:`, error);
      return [];
    }
  }

  // Delete from local storage
  async deleteFromLocal(table: string, id: string) {
    try {
      await database.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
      console.log(`Deleted from ${table}`);
    } catch (error) {
      console.error(`Failed to delete from ${table}:`, error);
      throw error;
    }
  }

  // Clear all local data
  async clearAllLocal() {
    try {
      const tables = [
        'schools',
        'users',
        'students',
        'teachers',
        'attendance',
        'homework',
        'announcements'
      ];

      for (const table of tables) {
        await database.execute(`DELETE FROM ${table}`, []);
      }

      console.log('All local data cleared');
    } catch (error) {
      console.error('Failed to clear local data:', error);
      throw error;
    }
  }

  // Create backup
  async createBackup(): Promise<Blob> {
    try {
      const tables = [
        'schools',
        'users',
        'students',
        'teachers',
        'attendance',
        'homework',
        'announcements'
      ];

      const backup: Record<string, unknown[]> = {};

      for (const table of tables) {
        const data = await this.getFromLocal(table);
        backup[table] = data;
      }

      const blob = new Blob([JSON.stringify(backup)], {type: 'application/json'});
      return blob;
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw error;
    }
  }

  // Restore from backup
  async restoreBackup(blob: Blob) {
    try {
      const text = await blob.text();
      const backup = JSON.parse(text);

      await this.clearAllLocal();

      for (const [table, data] of Object.entries(backup)) {
        for (const item of (data as unknown[])) {
          await this.saveToLocal(table, item);
        }
      }

      console.log('Backup restored successfully');
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Record<string, any[]> = {};

  on(event: 'online' | 'offline', callback: () => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: 'online' | 'offline', callback: () => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private notifyListeners(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb());
    }
  }
}

export default new OfflineService();
