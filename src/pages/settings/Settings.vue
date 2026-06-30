<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('nav.settings') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <h1>{{ t('nav.settings') }}</h1>

        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ t('app.title') }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label>{{ t('app.title') }}</ion-label>
              <ion-text>v1.0.0</ion-text>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Preferences</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label>Language</ion-label>
              <ion-select :value="currentLocale" @ion-change="setLanguage">
                <ion-select-option value="km">🇰🇭 Khmer</ion-select-option>
                <ion-select-option value="en">🇬🇧 English</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Account</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-button expand="block" color="danger" @click="logout">
              {{ t('nav.logout') }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonText } from '@ionic/vue'
import { useI18n } from '@/composables/useI18n'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const authStore = useAuth()
const { t, locale, setLocale } = useI18n()

const currentLocale = computed({
  get: () => locale,
  set: (v) => setLocale(v as any)
})

function setLanguage(event: any) {
  setLocale(event.detail.value)
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.page-container { padding: 16px; }
h1 { margin: 0 0 20px 0; font-size: 28px; }
</style>
