<template>
  <ion-app>
    <app-header />
    <user-greeting-card />
    <router-view />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { IonApp } from '@ionic/vue'
import AppHeader from '@/components/layouts/AppHeader.vue'
import UserGreetingCard from '@/components/layouts/UserGreetingCard.vue'
import { useI18nStore } from '@/stores/i18n'
import { useAuth } from '@/stores/auth'
import { MockDataService } from '@/services/mockDataService'

const i18nStore = useI18nStore()
const authStore = useAuth()

onMounted(() => {
  // Initialize i18n from localStorage
  i18nStore.initializeFromStorage()

  // Initialize auth from localStorage
  authStore.initializeFromStorage()

  // Initialize fake data in localStorage
  MockDataService.initializeLocalStorage()
})
</script>

<style scoped>
</style>
