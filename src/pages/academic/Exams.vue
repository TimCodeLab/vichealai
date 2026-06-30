<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('nav.exams') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <div class="header-section">
          <h1>{{ t('nav.exams') }}</h1>
          <ion-button @click="showCreateModal = true">
            <ion-icon slot="start" :icon="addIcon"></ion-icon>
            {{ t('actions.create') }}
          </ion-button>
        </div>

        <div v-if="exams.length === 0" class="empty-state">
          <p>{{ t('messages.noData') }}</p>
        </div>

        <ion-card v-for="exam in exams" :key="exam.id" class="card">
          <ion-card-header>
            <ion-card-title>{{ exam.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ exam.description }}</p>
            <p><strong>{{ t('forms.date') }}:</strong> {{ formatDate(exam.examDate) }} @ {{ exam.examTime }}</p>
            <p><strong>Duration:</strong> {{ exam.duration }} minutes</p>
            <p><strong>Total Marks:</strong> {{ exam.totalMarks }}</p>
            <ion-button size="small" @click="deleteExam(exam.id)" color="danger">
              {{ t('actions.delete') }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Modal -->
      <ion-modal :is-open="showCreateModal" @did-dismiss="showCreateModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ t('actions.create') }} {{ t('nav.exams') }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showCreateModal = false">{{ t('actions.cancel') }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <form @submit.prevent="saveExam" class="modal-form">
            <ion-item>
              <ion-label position="stacked">Name</ion-label>
              <ion-input v-model="formData.name" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{ t('forms.description') }}</ion-label>
              <ion-input v-model="formData.description"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{ t('forms.date') }}</ion-label>
              <ion-input v-model="formData.examDate" type="date" required></ion-input>
            </ion-item>
            <div class="modal-buttons">
              <ion-button expand="block" type="submit">{{ t('actions.save') }}</ion-button>
            </div>
          </form>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonModal, IonItem, IonLabel, IonInput, IonButtons } from '@ionic/vue'
import { add as addIcon } from 'ionicons/icons'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'
import type { Exam } from '@/types'

const { t } = useI18n()
const showCreateModal = ref(false)
const exams = ref<Exam[]>(LocalStorageService.get<Exam[]>('exams', []) || [])
const formData = ref({ name: '', description: '', examDate: '' })

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

function deleteExam(id: string) {
  if (confirm(t('messages.confirmDelete'))) {
    exams.value = exams.value.filter(e => e.id !== id)
    LocalStorageService.set('exams', exams.value)
  }
}

function saveExam() {
  exams.value.push({
    id: `exam_${Date.now()}`,
    classId: 'class_1',
    subjectId: 'subj_1',
    createdBy: 'teacher_1',
    examTime: '09:00',
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    status: 'scheduled',
    ...formData.value
  })
  LocalStorageService.set('exams', exams.value)
  showCreateModal.value = false
  formData.value = { name: '', description: '', examDate: '' }
}
</script>

<style scoped>
.page-container { padding: 16px; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-section h1 { margin: 0; font-size: 28px; }
.empty-state { text-align: center; padding: 40px 20px; color: #999; }
.card { margin-bottom: 16px; }
.modal-form { padding: 16px; }
.modal-form ion-item { margin-bottom: 16px; }
.modal-buttons { padding: 16px; }
</style>
