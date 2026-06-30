<template>
  <ion-page style="--background: #f5f7fa">
    <!-- Header -->
    <ion-header>
      <ion-toolbar style="--background: #0891b2; --color: white; --border-color: transparent; padding: 0 12px">
        <ion-buttons slot="start">
          <ion-menu-button color="white" style="font-size: 24px"></ion-menu-button>
        </ion-buttons>
        <ion-title style="font-size: 1.2rem; font-weight: bold; color: white; text-align: center; flex: 1">{{ t('nav.homework') }}</ion-title>
        <ion-buttons slot="end">
          <button
            @click="toggleLanguage"
            style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.2); border: none; border-radius: 6px; color: white; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.3s"
            @mouseover="$event.target.style.background = 'rgba(255,255,255,0.3)'"
            @mouseout="$event.target.style.background = 'rgba(255,255,255,0.2)'"
          >
            <span style="font-size: 18px">{{ currentFlagIcon }}</span>
            <span>{{ currentLangCode }}</span>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content style="--background: #f5f7fa">
      <div style="padding: 20px 16px; background: #f5f7fa">

        <!-- Page Title with Create Button -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
          <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 0">{{ t('nav.homework') }}</h1>
          <button
            @click="showCreateModal = true"
            style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #0891b2; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s"
            @mouseover="$event.target.style.background = '#0e7490'"
            @mouseout="$event.target.style.background = '#0891b2'"
          >
            <span>+</span>
            <span>{{ t('actions.create') }}</span>
          </button>
        </div>

        <!-- Homework Items -->
        <div v-if="homework.length === 0" style="text-align: center; padding: 40px 20px; color: #6b7280">
          <p style="font-size: 16px">{{ t('messages.noData') }}</p>
        </div>

        <div v-else style="space-y: 16px">
          <div
            v-for="hw in homework"
            :key="hw.id"
            style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; border: 1px solid #e5e7eb; transition: all 0.3s"
            @mouseover="$event.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'"
            @mouseout="$event.currentTarget.style.boxShadow = 'none'"
          >
            <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 8px 0">{{ hw.title }}</h3>
            <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px 0">{{ hw.description }}</p>
            <p style="font-size: 13px; color: #9ca3af; margin: 0 0 12px 0">
              <strong>Date:</strong> {{ formatDate(hw.dueDate) }}
            </p>
            <button
              @click="deleteHomework(hw.id)"
              style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s"
              @mouseover="$event.target.style.background = '#dc2626'"
              @mouseout="$event.target.style.background = '#ef4444'"
            >
              {{ t('actions.delete') }}
            </button>
          </div>
        </div>

        <!-- Footer space -->
        <div style="height: 20px"></div>
      </div>
    </ion-content>

    <!-- Create Modal -->
    <ion-modal :is-open="showCreateModal" @did-dismiss="showCreateModal = false">
      <ion-header>
        <ion-toolbar style="--background: #0891b2; --color: white">
          <ion-title style="color: white; font-weight: bold">{{ t('actions.create') }} {{ t('nav.homework') }}</ion-title>
          <ion-buttons slot="end">
            <button
              @click="showCreateModal = false"
              style="padding: 8px 12px; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer"
            >
              {{ t('actions.cancel') }}
            </button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content style="--background: #f5f7fa">
        <div style="padding: 20px">
          <form @submit.prevent="saveHomework" style="space-y: 16px">
            <div style="margin-bottom: 16px">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px">Title</label>
              <input
                v-model="formData.title"
                type="text"
                required
                style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px"
              />
            </div>
            <div style="margin-bottom: 16px">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px">{{ t('forms.description') }}</label>
              <textarea
                v-model="formData.description"
                style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; min-height: 100px"
              ></textarea>
            </div>
            <div style="margin-bottom: 20px">
              <label style="display: block; font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px">{{ t('forms.date') }}</label>
              <input
                v-model="formData.dueDate"
                type="date"
                required
                style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px"
              />
            </div>
            <button
              type="submit"
              style="width: 100%; padding: 12px; background: #0891b2; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.3s"
              @mouseover="$event.target.style.background = '#0e7490'"
              @mouseout="$event.target.style.background = '#0891b2'"
            >
              {{ t('actions.save') }}
            </button>
          </form>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonButtons,
  IonMenuButton,
} from '@ionic/vue'
import { useI18nStore } from '@/stores/i18n'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'
import type { Homework } from '@/types'

const { t } = useI18n()
const i18nStore = useI18nStore()
const showCreateModal = ref(false)
const homework = ref<Homework[]>(LocalStorageService.get<Homework[]>('homework', []) || [])
const formData = ref({ title: '', description: '', dueDate: '' })

const currentLang = computed(() => i18nStore.locale)

const currentFlagIcon = computed(() => {
  return currentLang.value === 'km' ? '🇰🇭' : '🇬🇧'
})

const currentLangCode = computed(() => {
  return currentLang.value === 'km' ? 'KM' : 'EN'
})

function toggleLanguage() {
  const nextLang = currentLang.value === 'km' ? 'en' : 'km'
  i18nStore.setLocale(nextLang)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

function deleteHomework(id: string) {
  if (confirm(t('messages.confirmDelete'))) {
    homework.value = homework.value.filter(h => h.id !== id)
    LocalStorageService.set('homework', homework.value)
  }
}

function saveHomework() {
  if (formData.value.title && formData.value.dueDate) {
    homework.value.push({
      id: `hw_${Date.now()}`,
      classId: 'class_1',
      subjectId: 'subj_1',
      createdBy: 'teacher_1',
      title: formData.value.title,
      description: formData.value.description,
      dueDate: formData.value.dueDate,
      createdAt: new Date().toISOString(),
    })
    LocalStorageService.set('homework', homework.value)
    showCreateModal.value = false
    formData.value = { title: '', description: '', dueDate: '' }
  }
}
</script>
