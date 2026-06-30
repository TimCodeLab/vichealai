<template>
  <div class="empty-state">
    <ion-icon :icon="icon" class="empty-icon"></ion-icon>
    <h3>{{ title }}</h3>
    <p v-if="message">{{ message }}</p>
    <ion-button v-if="actionText && actionCallback" @click="actionCallback">
      {{ actionText }}
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue'

defineProps<{
  icon: any
  title: string
  message?: string
  actionText?: string
  actionCallback?: () => void
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 16px;
}

h3 {
  margin: 0 0 8px 0;
  color: #666;
}

p {
  margin: 0 0 16px 0;
  color: #999;
}
</style>
