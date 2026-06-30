<template>
  <ion-app>
    <router-view v-slot="{ Component, route }">
      <transition
        name="page"
        mode="out-in"
      >
        <component
          :is="Component"
          :key="route.path"
        />
      </transition>
    </router-view>
  </ion-app>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {IonApp} from '@ionic/vue';
import {useI18nStore} from '@/stores/i18n';
import {useAuth} from '@/stores/auth';
import {MockDataService} from '@/services/mockDataService';

const i18nStore = useI18nStore();
const authStore = useAuth();

onMounted(() => {
  i18nStore.initializeFromStorage();
  authStore.initializeFromStorage();
  MockDataService.initializeLocalStorage();
});
</script>

<style>
/* Page slide-up transition */
.page-enter-active {
  animation: pageEnter 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.page-leave-active {
  animation: pageLeave 0.18s ease-in both;
  pointer-events: none;
}

@keyframes pageEnter {
  from { opacity: 0; transform: translateY(16px) scale(0.99); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes pageLeave {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.98); }
}
</style>
