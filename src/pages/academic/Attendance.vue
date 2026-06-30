<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('nav.attendance') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <div class="header-section">
          <h1>{{ t('nav.attendance') }}</h1>
          <ion-button @click="recordAttendance">
            <ion-icon slot="start" :icon="addIcon"></ion-icon>
            {{ t('actions.create') }}
          </ion-button>
        </div>

        <div v-if="attendance.length === 0" class="empty-state">
          <p>{{ t('messages.noData') }}</p>
        </div>

        <ion-card v-for="record in attendance" :key="record.id" class="card">
          <ion-card-header>
            <ion-card-title>{{ getStudentName(record.studentId) }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p><strong>{{ t('forms.date') }}:</strong> {{ formatDate(record.date) }}</p>
            <p><strong>Status:</strong> <span :class="'status-' + record.status">{{ record.status }}</span></p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
import { add as addIcon } from 'ionicons/icons'
import { useI18n } from '@/composables/useI18n'
import { useAppToast } from '@/utils/toastUtils'
import { LocalStorageService } from '@/services/localStorageService'
import type { Attendance, Student } from '@/types'

const { t } = useI18n()
const { showSuccess } = useAppToast()

const attendance = ref<Attendance[]>(LocalStorageService.get<Attendance[]>('attendance', []) || [])
const students = ref(LocalStorageService.get('students', []) || [])

function getStudentName(studentId: string): string {
  const student = students.value.find((s: Student) => s.id === studentId)
  return student?.name || studentId
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

function recordAttendance() {
  showSuccess(t('messages.createdSuccessfully'))
}
</script>

<style scoped>
.page-container { padding: 16px; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-section h1 { margin: 0; font-size: 28px; }
.empty-state { text-align: center; padding: 40px 20px; color: #999; }
.card { margin-bottom: 16px; }
.status-present { color: green; font-weight: bold; }
.status-absent { color: red; font-weight: bold; }
.status-late { color: orange; font-weight: bold; }
</style>
