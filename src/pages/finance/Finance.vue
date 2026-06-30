<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('nav.finance') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <div class="header-section">
          <h1>{{ t('nav.finance') }}</h1>
        </div>

        <ion-card class="summary-card">
          <ion-card-header>
            <ion-card-title>Summary</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="summary-item">
              <span>Total Fees:</span>
              <strong>${{ totalFees.toFixed(2) }}</strong>
            </div>
            <div class="summary-item">
              <span>Total Collected:</span>
              <strong>${{ totalCollected.toFixed(2) }}</strong>
            </div>
            <div class="summary-item">
              <span>Outstanding:</span>
              <strong>${{ (totalFees - totalCollected).toFixed(2) }}</strong>
            </div>
          </ion-card-content>
        </ion-card>

        <div v-if="fees.length === 0" class="empty-state">
          <p>{{ t('messages.noData') }}</p>
        </div>

        <ion-card v-for="fee in fees" :key="fee.id" class="card">
          <ion-card-header>
            <ion-card-title>{{ fee.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p><strong>{{ t('forms.description') }}:</strong> {{ fee.description }}</p>
            <p><strong>Amount:</strong> {{ fee.currency }} {{ fee.amount }}</p>
            <p><strong>{{ t('forms.date') }}:</strong> {{ fee.dueDate }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'
import type { FinanceFee } from '@/types'

const { t } = useI18n()
const fees = ref<FinanceFee[]>(LocalStorageService.get<FinanceFee[]>('fees', []) || [])

const totalFees = computed(() => fees.value.reduce((sum, f) => sum + f.amount, 0))
const totalCollected = computed(() => totalFees.value * 0.7)
</script>

<style scoped>
.page-container { padding: 16px; }
.header-section { margin-bottom: 20px; }
.header-section h1 { margin: 0; font-size: 28px; }
.summary-card { margin-bottom: 20px; }
.summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
.summary-item:last-child { border-bottom: none; }
.empty-state { text-align: center; padding: 40px 20px; color: #999; }
.card { margin-bottom: 16px; }
</style>
