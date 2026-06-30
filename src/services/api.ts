const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

class APIClient {
  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && {Authorization: `Bearer ${token}`})
    };
  }

  private getOfflineStore() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const {useOfflineModeStore} = require('@/stores/offlineMode');
      return useOfflineModeStore();
    } catch {
      return null;
    }
  }

  async request(method: string, endpoint: string, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any) {
    // Check if user is in offline mode
    const offlineStore = this.getOfflineStore();
    if (offlineStore && !offlineStore.canUseAPI) {
      const errorMessage = offlineStore.getErrorMessage(endpoint.split('/').pop() || 'Action');
      const error = new Error(errorMessage);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).isOfflineError = true;
      throw error;
    }

    const url = `${API_URL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;

      // Add offline context to error
      if (err.name === 'AbortError') {
        err.message = 'Request timeout - check your connection';
        err.isNetworkError = true;
      } else if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION')) {
        err.isNetworkError = true;
        err.message = 'Unable to reach server - check your internet connection';
      }

      throw err;
    }
  }

  get(endpoint: string) {
    return this.request('GET', endpoint);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(endpoint: string, data: any) {
    return this.request('POST', endpoint, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put(endpoint: string, data: any) {
    return this.request('PUT', endpoint, data);
  }

  delete(endpoint: string) {
    return this.request('DELETE', endpoint);
  }
}

export default new APIClient();
