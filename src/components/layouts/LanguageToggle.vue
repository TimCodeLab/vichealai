<template>
  <button
    class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-all duration-200 text-sm font-medium"
    @click="toggleLanguage"
  >
    <span class="text-lg">{{ currentFlagIcon }}</span>
    <span>{{ currentLangCode }}</span>
  </button>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useI18nStore, type Language} from '@/stores/i18n';

const i18nStore = useI18nStore();

const languages = [
  {code: 'km', flag: '🇰🇭', label: 'ខ្មែរ'},
  {code: 'en', flag: '🇬🇧', label: 'English'}
];

const currentLang = computed(() => i18nStore.locale);

const currentFlagIcon = computed(() => {
  const lang = languages.find(l => l.code === currentLang.value);
  return lang?.flag || '🇰🇭';
});

const currentLangCode = computed(() => {
  return currentLang.value === 'km' ? 'KM' : 'EN';
});

function toggleLanguage() {
  const nextLang: Language = currentLang.value === 'km' ? 'en' : 'km';
  i18nStore.setLocale(nextLang);
}
</script>
