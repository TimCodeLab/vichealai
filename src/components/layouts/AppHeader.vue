<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="app-title">VICHEALAI</ion-title>
      <language-toggle />
    </ion-toolbar>
  </ion-header>

  <!-- No Internet Modal -->
  <ion-modal :is-open="showNoInternetModal" @did-dismiss="dismissNoInternetModal">
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>{{ t('messages.error') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="no-internet-content">
      <div class="modal-body">
        <div class="icon-placeholder">🌐</div>
        <h2>{{ t('app.title') }}</h2>
        <p class="subtitle">{{ t('app.subtitle') }}</p>
        <p class="description">
          {{ t('app.subtitle') }}
        </p>

        <div class="button-group">
          <ion-button expand="block" color="danger" @click="switchToOfflineMode" class="primary-btn">
            {{ t('actions.save') }}
          </ion-button>
          <ion-button expand="block" fill="outline" color="danger" @click="dismissNoInternetModal" class="secondary-btn">
            {{ t('actions.cancel') }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-modal>


</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonModal,
  IonContent
} from '@ionic/vue'
import { close } from 'ionicons/icons'
import { useOfflineModeStore } from '@/stores/offlineMode'
import { useAuth } from '@/stores/auth'
import { watch } from 'vue'
import LanguageToggle from './LanguageToggle.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const offlineModeStore = useOfflineModeStore()
const authStore = useAuth()

const showNoInternetModal = ref(false)

const appTitle = computed(() => {
  const user = authStore.user
  return user ? `VICHEALAI - ${user.name}` : 'VICHEALAI'
})

const isOfflineMode = computed(() => offlineModeStore.isOfflineMode)
const statusMessage = computed(() => offlineModeStore.statusMessages[offlineModeStore.status])


function switchToOfflineMode() {
  offlineModeStore.setOfflineMode(true)
  showNoInternetModal.value = false
}

function dismissNoInternetModal() {
  showNoInternetModal.value = false
}

// Show no internet modal when internet is lost and not already in offline mode
watch(
  () => offlineModeStore.hasInternet,
  (hasInternet) => {
    if (!hasInternet && !offlineModeStore.isOfflineMode) {
      showNoInternetModal.value = true
    }
  }
)
</script>

<style scoped>
:deep(ion-toolbar) {
  display: flex !important;
  align-items: center;
  justify-content: space-between;
}

.app-title {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.no-internet-content {
  --background: #1a2332;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  text-align: center;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.icon-placeholder {
  font-size: 80px;
  filter: drop-shadow(0 0 20px rgba(0, 150, 180, 0.3));
}

.modal-body h2 {
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 24px;
  color: #ffffff;
  font-weight: 500;
}

.description {
  margin: 16px 0 0 0;
  font-size: 16px;
  color: #b0b8c1;
  line-height: 1.6;
  max-width: 400px;
}

.button-group {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.primary-btn {
  --background: #ef4444;
  --background-activated: #dc2626;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 16px;
}

.secondary-btn {
  --border-color: #ef4444;
  --color: #ef4444;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 16px;
}

.mode-info {
  padding: 20px;
}

.info-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.info-section h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
}

.info-section p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.mode-toggle-section {
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #eee;
}

ion-list {
  margin-top: 20px;
}

ion-item {
  --inner-padding-end: 0;
}

ion-label {
  padding: 12px 0 !important;
}
</style>
