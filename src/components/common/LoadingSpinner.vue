<template>
  <div
    v-if="visible"
    class="loading-container"
  >
    <ion-spinner color="primary" />
    <p
      v-if="message"
      class="loading-message"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {IonSpinner} from '@ionic/vue';

defineProps<{
  visible: boolean
  message?: string
}>();
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 12px;
}

.loading-message {
  color: #666;
  font-size: 14px;
  margin: 0;
}
</style>
