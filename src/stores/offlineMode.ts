import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export const useOfflineModeStore = defineStore('offlineMode', () => {
  const isOfflineMode = ref(false);
  const hasInternet = ref(navigator.onLine);
  const lastError = ref<{ type: string; message: string } | null>(null);

  // Listen for actual internet connectivity changes
  window.addEventListener('online', () => {
    hasInternet.value = true;
    lastError.value = null;
  });

  window.addEventListener('offline', () => {
    hasInternet.value = false;
  });

  const status = computed(() => {
    if (isOfflineMode.value) return 'offline-mode';
    if (!hasInternet.value) return 'no-internet';
    return 'online';
  });

  const canUseAPI = computed(() => {
    return !isOfflineMode.value && hasInternet.value;
  });

  function toggleOfflineMode() {
    isOfflineMode.value = !isOfflineMode.value;
    lastError.value = null;
  }

  function setOfflineMode(value: boolean) {
    isOfflineMode.value = value;
    lastError.value = null;
  }

  function setError(type: string, message: string) {
    lastError.value = {type, message};
  }

  function clearError() {
    lastError.value = null;
  }

  const offlineFeatures = [
    '📚 View Mock Classes',
    '👥 View Mock Students',
    '👨‍🏫 View Mock Teachers',
    '⚙️ Change Settings',
    '👤 View Profile',
    '🚪 Logout'
  ];

  const onlineOnlyFeatures = [
    '✏️ Create/Edit Data',
    '💾 Save to Database',
    '📊 Real-time Sync',
    '👥 Multi-user Access',
    '🔄 Live Updates'
  ];

  const statusMessages: Record<string, { title: string; message: string; icon: string; color: string }> = {
    'offline-mode': {
      title: '📵 Offline Mode',
      message: 'You are in offline mode. Switch to Online to access backend features.',
      icon: '📵',
      color: 'warning'
    },
    'no-internet': {
      title: '🌐 No Internet',
      message: 'No internet connection detected. Check your network and try again.',
      icon: '🌐',
      color: 'danger'
    },
    'online': {
      title: '✅ Online',
      message: 'Connected and ready to use all features.',
      icon: '✅',
      color: 'success'
    }
  };

  function getErrorMessage(action: string): string {
    if (isOfflineMode.value) {
      return `⚠️ "${action}" requires online mode. Please switch to online to access this feature.`;
    }
    if (!hasInternet.value) {
      return `🌐 No internet connection. Please check your network connection to use "${action}".`;
    }
    return '❌ Unable to connect to server. Please try again later.';
  }

  return {
    isOfflineMode,
    hasInternet,
    lastError,
    status,
    canUseAPI,
    offlineFeatures,
    onlineOnlyFeatures,
    statusMessages,
    toggleOfflineMode,
    setOfflineMode,
    setError,
    clearError,
    getErrorMessage
  };
});
