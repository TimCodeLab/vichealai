import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import {messages, type Language} from '@/i18n';

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref<Language>('km');

  const currentMessages = computed(() => messages[locale.value]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: unknown = currentMessages.value;

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  function setLocale(lang: Language) {
    locale.value = lang;
    localStorage.setItem('language', lang);
  }

  function initializeFromStorage() {
    const saved = localStorage.getItem('language') as Language;
    if (saved && ['en', 'km'].includes(saved)) {
      locale.value = saved;
    } else {
      // No saved preference — use KM as default and persist it
      locale.value = 'km';
      localStorage.setItem('language', 'km');
    }
  }

  return {
    locale,
    currentMessages,
    t,
    setLocale,
    initializeFromStorage
  };
});
