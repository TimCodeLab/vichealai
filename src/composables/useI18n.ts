import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'

export function useI18n() {
  const i18nStore = useI18nStore()

  // t() reads the reactive computed — Vue tracks this dependency in templates and computed()
  function t(key: string): string {
    const keys = key.split('.')
    let value: any = i18nStore.currentMessages
    for (const k of keys) {
      value = value?.[k]
    }
    return typeof value === 'string' ? value : key
  }

  // Return locale as a computed so it stays reactive when destructured
  const locale = computed(() => i18nStore.locale)

  return {
    t,
    locale,
    setLocale: i18nStore.setLocale,
  }
}
