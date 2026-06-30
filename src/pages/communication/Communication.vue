<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('nav.communication') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <div class="header-section">
          <h1>{{ t('nav.communication') }}</h1>
        </div>

        <div v-if="announcements.length === 0" class="empty-state">
          <p>{{ t('messages.noData') }}</p>
        </div>

        <ion-card v-for="announce in announcements" :key="announce.id" class="card">
          <ion-card-header>
            <ion-card-title>{{ announce.title }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ announce.content }}</p>
            <p style="font-size: 12px; color: #999;">{{ formatDate(announce.publishedAt) }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'

const { t } = useI18n()
const announcements = ref(LocalStorageService.get('announcements', []) || [])

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.page-container { padding: 16px; }
.header-section { margin-bottom: 20px; }
.header-section h1 { margin: 0; font-size: 28px; }
.empty-state { text-align: center; padding: 40px 20px; color: #999; }
.card { margin-bottom: 16px; }
</style>
