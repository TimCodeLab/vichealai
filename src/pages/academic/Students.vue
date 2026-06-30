<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('roles.student') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <div class="header-section">
          <h1>{{ t('roles.student') }}</h1>
          <ion-button @click="showCreateModal = true">
            <ion-icon slot="start" :icon="addIcon"></ion-icon>
            {{ t('actions.create') }}
          </ion-button>
        </div>

        <div class="search-section">
          <ion-searchbar
            v-model="searchQuery"
            :placeholder="t('actions.search')"
          ></ion-searchbar>
        </div>

        <div v-if="filteredStudents.length === 0" class="empty-state">
          <p>{{ t('messages.noData') }}</p>
        </div>

        <ion-card v-for="student in filteredStudents" :key="student.id" class="student-card">
          <ion-card-header>
            <ion-card-title>{{ student.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="student-info">
              <p><strong>{{ t('forms.email') }}:</strong> {{ student.email }}</p>
              <p><strong>Class:</strong> {{ getClassName(student.classId) }}</p>
              <p><strong>{{ t('forms.date') }}:</strong> {{ formatDate(student.dateOfBirth) }}</p>
            </div>
            <div class="action-buttons">
              <ion-button size="small" fill="outline" @click="editStudent(student)">
                {{ t('actions.edit') }}
              </ion-button>
              <ion-button size="small" fill="outline" color="danger" @click="deleteStudent(student.id)">
                {{ t('actions.delete') }}
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Create/Edit Modal -->
      <ion-modal :is-open="showCreateModal" @did-dismiss="showCreateModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingStudent ? t('actions.edit') : t('actions.create') }} {{ t('roles.student') }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showCreateModal = false">{{ t('actions.cancel') }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <form @submit.prevent="saveStudent" class="modal-form">
            <ion-item>
              <ion-label position="stacked">{{ t('forms.name') }}</ion-label>
              <ion-input v-model="formData.name" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">{{ t('forms.email') }}</ion-label>
              <ion-input v-model="formData.email" type="email" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Class</ion-label>
              <ion-select v-model="formData.classId" required>
                <ion-select-option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">{{ t('forms.date') }}</ion-label>
              <ion-input v-model="formData.dateOfBirth" type="date" required></ion-input>
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
import { ref, computed } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonModal, IonItem,
  IonLabel, IonInput, IonSelect, IonSelectOption, IonSearchbar, IonButtons
} from '@ionic/vue'
import { add as addIcon } from 'ionicons/icons'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'
import type { Student, Class } from '@/types'

const { t } = useI18n()

const searchQuery = ref('')
const showCreateModal = ref(false)
const editingStudent = ref<Student | null>(null)

const students = ref<Student[]>(LocalStorageService.get<Student[]>('students', []) || [])
const classes = ref<Class[]>(LocalStorageService.get<Class[]>('classes', []) || [])

const formData = ref({
  name: '',
  email: '',
  classId: '',
  dateOfBirth: ''
})

const filteredStudents = computed(() => {
  return students.value.filter(s =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function getClassName(classId: string): string {
  const cls = classes.value.find(c => c.id === classId)
  return cls?.name || classId
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

function editStudent(student: Student) {
  editingStudent.value = student
  formData.value = { ...student }
  showCreateModal.value = true
}

function deleteStudent(id: string) {
  if (confirm(t('messages.confirmDelete'))) {
    students.value = students.value.filter(s => s.id !== id)
    LocalStorageService.set('students', students.value)
  }
}

function saveStudent() {
  if (editingStudent.value) {
    const index = students.value.findIndex(s => s.id === editingStudent.value!.id)
    if (index !== -1) {
      students.value[index] = { ...students.value[index], ...formData.value }
    }
  } else {
    const newStudent: Student = {
      id: `student_${Date.now()}`,
      schoolId: 'school_1',
      parentId: '',
      gender: 'M',
      address: '',
      enrollmentDate: new Date().toISOString(),
      status: 'active',
      ...formData.value
    }
    students.value.push(newStudent)
  }
  LocalStorageService.set('students', students.value)
  showCreateModal.value = false
  editingStudent.value = null
  formData.value = { name: '', email: '', classId: '', dateOfBirth: '' }
}
</script>

<style scoped>
.page-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-section h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.search-section {
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.student-card {
  margin-bottom: 16px;
}

.student-info {
  margin-bottom: 12px;
}

.student-info p {
  margin: 8px 0;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.modal-form {
  padding: 16px;
}

.modal-form ion-item {
  margin-bottom: 16px;
}

.modal-buttons {
  padding: 16px;
  display: flex;
  gap: 8px;
}
</style>
