<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ t('roles.teacher') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="page-container">
        <div class="header-section">
          <h1>{{ t('roles.teacher') }}</h1>
          <ion-button @click="showCreateModal = true">
            <ion-icon slot="start" :icon="addIcon"></ion-icon>
            {{ t('actions.create') }}
          </ion-button>
        </div>

        <div class="search-section">
          <ion-searchbar v-model="searchQuery" :placeholder="t('actions.search')"></ion-searchbar>
        </div>

        <div v-if="filteredTeachers.length === 0" class="empty-state">
          <p>{{ t('messages.noData') }}</p>
        </div>

        <ion-card v-for="teacher in filteredTeachers" :key="teacher.id" class="card">
          <ion-card-header>
            <ion-card-title>{{ teacher.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="info">
              <p><strong>{{ t('forms.email') }}:</strong> {{ teacher.email }}</p>
              <p><strong>{{ t('forms.phone') }}:</strong> {{ teacher.phone }}</p>
              <p><strong>Specialization:</strong> {{ teacher.specialization }}</p>
            </div>
            <div class="action-buttons">
              <ion-button size="small" fill="outline" @click="editTeacher(teacher)">
                {{ t('actions.edit') }}
              </ion-button>
              <ion-button size="small" fill="outline" color="danger" @click="deleteTeacher(teacher.id)">
                {{ t('actions.delete') }}
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Modal -->
      <ion-modal :is-open="showCreateModal" @did-dismiss="showCreateModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingTeacher ? t('actions.edit') : t('actions.create') }} {{ t('roles.teacher') }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showCreateModal = false">{{ t('actions.cancel') }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <form @submit.prevent="saveTeacher" class="modal-form">
            <ion-item>
              <ion-label position="stacked">{{ t('forms.name') }}</ion-label>
              <ion-input v-model="formData.name" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{ t('forms.email') }}</ion-label>
              <ion-input v-model="formData.email" type="email" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">{{ t('forms.phone') }}</ion-label>
              <ion-input v-model="formData.phone"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Specialization</ion-label>
              <ion-input v-model="formData.specialization"></ion-input>
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonModal, IonItem, IonLabel, IonInput, IonSearchbar, IonButtons } from '@ionic/vue'
import { add as addIcon } from 'ionicons/icons'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'
import type { Teacher } from '@/types'

const { t } = useI18n()
const searchQuery = ref('')
const showCreateModal = ref(false)
const editingTeacher = ref<Teacher | null>(null)
const teachers = ref<Teacher[]>(LocalStorageService.get<Teacher[]>('teachers', []) || [])

const formData = ref({ name: '', email: '', phone: '', specialization: '' })

const filteredTeachers = computed(() =>
  teachers.value.filter(t => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
)

function editTeacher(teacher: Teacher) {
  editingTeacher.value = teacher
  formData.value = { ...teacher }
  showCreateModal.value = true
}

function deleteTeacher(id: string) {
  if (confirm(t('messages.confirmDelete'))) {
    teachers.value = teachers.value.filter(t => t.id !== id)
    LocalStorageService.set('teachers', teachers.value)
  }
}

function saveTeacher() {
  if (editingTeacher.value) {
    const index = teachers.value.findIndex(t => t.id === editingTeacher.value!.id)
    if (index !== -1) teachers.value[index] = { ...teachers.value[index], ...formData.value }
  } else {
    teachers.value.push({
      id: `teacher_${Date.now()}`,
      schoolId: 'school_1',
      dateOfBirth: '',
      gender: 'M',
      qualification: '',
      joinDate: new Date().toISOString(),
      status: 'active',
      ...formData.value
    })
  }
  LocalStorageService.set('teachers', teachers.value)
  showCreateModal.value = false
  editingTeacher.value = null
  formData.value = { name: '', email: '', phone: '', specialization: '' }
}
</script>

<style scoped>
.page-container { padding: 16px; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-section h1 { margin: 0; font-size: 28px; }
.search-section { margin-bottom: 20px; }
.empty-state { text-align: center; padding: 40px 20px; color: #999; }
.card { margin-bottom: 16px; }
.info { margin-bottom: 12px; }
.info p { margin: 8px 0; font-size: 14px; }
.action-buttons { display: flex; gap: 8px; margin-top: 12px; }
.modal-form { padding: 16px; }
.modal-form ion-item { margin-bottom: 16px; }
.modal-buttons { padding: 16px; }
</style>
