const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000

class APIClient {
  private getHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private getOfflineStore() {
    try {
      // Lazy import to avoid circular dependencies
      const { useOfflineModeStore } = require('@/stores/offlineMode')
      return useOfflineModeStore()
    } catch {
      return null
    }
  }

  async request(method: string, endpoint: string, data?: any) {
    // Check if user is in offline mode
    const offlineStore = this.getOfflineStore()
    if (offlineStore && !offlineStore.canUseAPI) {
      const errorMessage = offlineStore.getErrorMessage(endpoint.split('/').pop() || 'Action')
      const error = new Error(errorMessage)
      ;(error as any).isOfflineError = true
      throw error
    }

    const url = `${API_URL}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      clearTimeout(timeoutId)

      // Add offline context to error
      if (error.name === 'AbortError') {
        error.message = 'Request timeout - check your connection'
        error.isNetworkError = true
      } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION')) {
        error.isNetworkError = true
        error.message = 'Unable to reach server - check your internet connection'
      }

      throw error
    }
  }

  get(endpoint: string) {
    return this.request('GET', endpoint)
  }

  post(endpoint: string, data: any) {
    return this.request('POST', endpoint, data)
  }

  put(endpoint: string, data: any) {
    return this.request('PUT', endpoint, data)
  }

  delete(endpoint: string) {
    return this.request('DELETE', endpoint)
  }
}

export default new APIClient()
