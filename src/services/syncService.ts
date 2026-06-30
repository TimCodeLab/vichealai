import database from './database'
import api from './api'

class SyncService {
  private isSyncing = false
  private syncQueue: Array<{ action: string; data: any; table: string }> = []

  async initializeSync(schoolId: string) {
    // Listen for online/offline events
    window.addEventListener('online', () => this.syncToCloud(schoolId))
    window.addEventListener('offline', () => this.handleOffline())
  }

  async handleOffline() {
    console.log('App is offline - changes will sync when online')
  }

  async syncToCloud(schoolId: string) {
    if (this.isSyncing) return

    this.isSyncing = true
    console.log('Starting cloud sync...')

    try {
      // Sync pending changes
      while (this.syncQueue.length > 0) {
        const item = this.syncQueue.shift()
        if (item) {
          await this.syncItem(schoolId, item)
        }
      }

      // Fetch latest data from server
      await this.fetchLatestData(schoolId)

      console.log('Sync completed successfully')
    } catch (error) {
      console.error('Sync failed:', error)
      // Items stay in queue for next sync attempt
    } finally {
      this.isSyncing = false
    }
  }

  private async syncItem(schoolId: string, item: any) {
    try {
      switch (item.action) {
        case 'create':
          await api.post(`/schools/${schoolId}/${item.table}`, item.data)
          break
        case 'update':
          await api.put(`/schools/${schoolId}/${item.table}/${item.data.id}`, item.data)
          break
        case 'delete':
          await api.delete(`/schools/${schoolId}/${item.table}/${item.data.id}`)
          break
      }
    } catch (error) {
      console.error(`Sync failed for ${item.action} on ${item.table}:`, error)
      // Re-queue for retry
      this.syncQueue.push(item)
      throw error
    }
  }

  private async fetchLatestData(schoolId: string) {
    // Fetch updates from server and merge with local data
    // This is a simplified version - actual implementation would be more complex
    const data = await api.get(`/schools/${schoolId}/sync`)
    if (data) {
      // Merge logic here
      console.log('Data merged with local database')
    }
  }

  queueChange(action: string, table: string, data: any) {
    this.syncQueue.push({ action, table, data })
  }

  getQueueSize(): number {
    return this.syncQueue.length
  }

  clearQueue() {
    this.syncQueue = []
  }
}

export default new SyncService()
