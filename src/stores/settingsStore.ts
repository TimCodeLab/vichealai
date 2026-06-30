import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SchoolSettings, UserSettings } from '@/types'
import api from '@/services/api'

export const useSettingsStore = defineStore('settings', () => {
  const schoolSettings = ref<SchoolSettings | null>(null)
  const userSettings = ref<UserSettings | null>(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchSchoolSettings(schoolId: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/schools/${schoolId}/settings`)
      schoolSettings.value = data.settings
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateSchoolSettings(schoolId: string, settings: Partial<SchoolSettings>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.put(`/schools/${schoolId}/settings`, settings)
      schoolSettings.value = data.settings
      return data.settings
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUserSettings(userId: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/users/${userId}/settings`)
      userSettings.value = data.settings
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function updateUserSettings(userId: string, settings: Partial<UserSettings>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.put(`/users/${userId}/settings`, settings)
      userSettings.value = data.settings
      return data.settings
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function backupData(schoolId: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/backup`, {})
      return data.backup
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function restoreData(schoolId: string, backupId: string) {
    loading.value = true
    error.value = ''
    try {
      await api.post(`/schools/${schoolId}/restore`, { backupId })
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    schoolSettings,
    userSettings,
    loading,
    error,
    fetchSchoolSettings,
    updateSchoolSettings,
    fetchUserSettings,
    updateUserSettings,
    backupData,
    restoreData
  }
})
