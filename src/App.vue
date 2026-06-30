<template>
  <ion-app>
    <app-header />
    <user-greeting-card />
    <router-view />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp } from '@ionic/vue'
import AppHeader from '@/components/layouts/AppHeader.vue'
import UserGreetingCard from '@/components/layouts/UserGreetingCard.vue'
</script>

<style scoped>
</style>
