<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('nav.academics') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <div class="header-section">
          <h1>{{ t('nav.academics') }}</h1>
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

        <div v-if="filteredClasses.length === 0" class="empty-state">
          <p>{{ t('messages.noData') }}</p>
        </div>

        <ion-card v-for="cls in filteredClasses" :key="cls.id" class="class-card">
          <ion-card-header>
            <ion-card-title>{{ cls.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="class-info">
              <p><strong>Grade:</strong> {{ getGradeName(cls.gradeId) }}</p>
              <p><strong>Teacher:</strong> {{ getTeacherName(cls.classTeacherId) }}</p>
            </div>
            <div class="action-buttons">
              <ion-button size="small" fill="outline" @click="editClass(cls)">
                {{ t('actions.edit') }}
              </ion-button>
              <ion-button size="small" fill="outline" color="danger" @click="deleteClass(cls.id)">
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
            <ion-title>{{ editingClass ? t('actions.edit') : t('actions.create') }} {{ t('nav.academics') }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showCreateModal = false">{{ t('actions.cancel') }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <form @submit.prevent="saveClass" class="modal-form">
            <ion-item>
              <ion-label position="stacked">{{ t('forms.name') }}</ion-label>
              <ion-input v-model="formData.name" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Grade</ion-label>
              <ion-select v-model="formData.gradeId" required>
                <ion-select-option v-for="grade in grades" :key="grade.id" :value="grade.id">
                  {{ grade.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">{{ t('roles.teacher') }}</ion-label>
              <ion-select v-model="formData.classTeacherId" required>
                <ion-select-option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }}
                </ion-select-option>
              </ion-select>
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
import type { Class, Grade, Teacher } from '@/types'

const { t } = useI18n()

const searchQuery = ref('')
const showCreateModal = ref(false)
const editingClass = ref<Class | null>(null)

const classes = ref<Class[]>(LocalStorageService.get<Class[]>('classes', []) || [])
const grades = ref<Grade[]>(LocalStorageService.get<Grade[]>('grades', []) || [])
const teachers = ref<Teacher[]>(LocalStorageService.get<Teacher[]>('teachers', []) || [])

const formData = ref({
  name: '',
  gradeId: '',
  classTeacherId: ''
})

const filteredClasses = computed(() => {
  return classes.value.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function getGradeName(gradeId: string): string {
  const grade = grades.value.find(g => g.id === gradeId)
  return grade?.name || gradeId
}

function getTeacherName(teacherId: string): string {
  const teacher = teachers.value.find(t => t.id === teacherId)
  return teacher?.name || teacherId
}

function editClass(cls: Class) {
  editingClass.value = cls
  formData.value = { ...cls }
  showCreateModal.value = true
}

function deleteClass(id: string) {
  if (confirm(t('messages.confirmDelete'))) {
    classes.value = classes.value.filter(c => c.id !== id)
    LocalStorageService.set('classes', classes.value)
  }
}

function saveClass() {
  if (editingClass.value) {
    const index = classes.value.findIndex(c => c.id === editingClass.value!.id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...formData.value }
    }
  } else {
    const newClass: Class = {
      id: `class_${Date.now()}`,
      schoolId: 'school_1',
      ...formData.value
    }
    classes.value.push(newClass)
  }
  LocalStorageService.set('classes', classes.value)
  showCreateModal.value = false
  editingClass.value = null
  formData.value = { name: '', gradeId: '', classTeacherId: '' }
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

.class-card {
  margin-bottom: 16px;
}

.class-info {
  margin-bottom: 12px;
}

.class-info p {
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
