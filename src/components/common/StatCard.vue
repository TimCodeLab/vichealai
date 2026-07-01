<template>
  <div
    class="stat-card"
    :style="{ background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)` }"
  >
    <div class="stat-value">
      {{ value }}
    </div>
    <div class="stat-label">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  value: string | number
  label: string
  color1?: string
  color2?: string
}>(), {
  color1: '#667eea',
  color2: '#764ba2'
});
</script>

<style scoped>
.stat-card {
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}
</style>
