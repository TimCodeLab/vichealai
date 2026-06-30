export class LocalStorageService {
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue || null;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  static push<T>(key: string, item: T): void {
    try {
      const items = this.get<T[]>(key, []) || [];
      items.push(item);
      this.set(key, items);
    } catch (error) {
      console.error(`Error pushing to localStorage array for key "${key}":`, error);
    }
  }

  static update<T>(key: string, predicate: (item: T) => boolean, updater: (item: T) => T): void {
    try {
      const items = this.get<T[]>(key, []) || [];
      const index = items.findIndex(predicate);
      if (index !== -1) {
        items[index] = updater(items[index]);
        this.set(key, items);
      }
    } catch (error) {
      console.error(`Error updating item in localStorage for key "${key}":`, error);
    }
  }

  static remove_item<T>(key: string, predicate: (item: T) => boolean): void {
    try {
      const items = this.get<T[]>(key, []) || [];
      const filtered = items.filter(item => !predicate(item));
      this.set(key, filtered);
    } catch (error) {
      console.error(`Error removing item from localStorage for key "${key}":`, error);
    }
  }
}
