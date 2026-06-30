<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Finance</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="finance-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Finance Overview</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">
                  {{ totalCollected }}
                </div>
                <div class="stat-label">
                  Total Collected
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-value">
                  {{ pendingInvoices.length }}
                </div>
                <div class="stat-label">
                  Pending Invoices
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-segment v-model="selectedTab">
          <ion-segment-button value="invoices">
            <ion-label>Invoices</Ion-label>
          </ion-segment-button>
          <ion-segment-button value="payments">
            <ion-label>Payments</ion-label>
          </ion-segment-button>
          <ion-segment-button value="reports">
            <ion-label>Reports</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div
          v-if="selectedTab === 'invoices'"
          class="content-section"
        >
          <ion-list>
            <ion-list-header>
              <ion-label>Pending Invoices</ion-label>
            </ion-list-header>
            <ion-item
              v-for="invoice in pendingInvoices"
              :key="invoice.id"
            >
              <ion-label>
                <h2>Invoice #{{ invoice.invoiceNumber }}</h2>
                <p>Amount: {{ invoice.amount }}</p>
              </ion-label>
              <template v-slot:end>
                <ion-badge>{{ invoice.status }}</ion-badge>
              </template>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonListHeader,
  IonItem,
  IonBadge
} from '@ionic/vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useAuthStore } from '@/stores/authStore'

const financeStore = useFinanceStore()
const authStore = useAuthStore()

const selectedTab = ref('invoices')

const pendingInvoices = computed(() => financeStore.getPendingInvoices)
const totalCollected = computed(() => financeStore.getTotalCollected)

onMounted(async () => {
  const user = authStore.user
  if (user) {
    await financeStore.fetchInvoices(user.schoolId)
  }
})
</script>

<style scoped>
.finance-container {
  padding: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.content-section {
  margin-top: 20px;
}
</style>
