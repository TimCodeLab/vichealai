<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="dashboard">
        <h2>Welcome, {{ user?.name }}!</h2>
        <p>Dashboard for {{ user?.role }}</p>

        <!-- Placeholder content -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Quick Stats</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Dashboard content coming soon...</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

h2 {
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}
</style>
