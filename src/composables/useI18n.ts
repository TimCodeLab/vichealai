import { useI18nStore } from '@/stores/i18n'

export function useI18n() {
  const i18nStore = useI18nStore()

  function t(key: string): string {
    const keys = key.split('.')
    let value: any = i18nStore.currentMessages

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return {
    t,
    locale: i18nStore.locale,
    setLocale: i18nStore.setLocale,
    messages: i18nStore.currentMessages
  }
}
