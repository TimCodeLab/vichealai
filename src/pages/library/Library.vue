<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('nav.library') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <div class="header-section">
          <h1>{{ t('nav.library') }}</h1>
        </div>

        <div v-if="books.length === 0" class="empty-state">
          <p>{{ t('messages.noData') }}</p>
        </div>

        <ion-card v-for="book in books" :key="book.id" class="card">
          <ion-card-header>
            <ion-card-title>{{ book.title }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Author:</strong> {{ book.author }}</p>
            <p><strong>Category:</strong> {{ book.category }}</p>
            <p><strong>Available:</strong> {{ book.availableQuantity }}/{{ book.quantity }}</p>
            <ion-button size="small" :disabled="book.availableQuantity === 0">
              {{ book.availableQuantity > 0 ? t('actions.create') : 'Out of Stock' }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/vue'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'

const { t } = useI18n()
const books = ref(LocalStorageService.get('books', []) || [])
</script>

<style scoped>
.page-container { padding: 16px; }
.header-section { margin-bottom: 20px; }
.header-section h1 { margin: 0; font-size: 28px; }
.empty-state { text-align: center; padding: 40px 20px; color: #999; }
.card { margin-bottom: 16px; }
</style>
