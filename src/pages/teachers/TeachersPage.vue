<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Teachers</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddDialog">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="teachers-container">
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Search teachers..."
          show-cancel-button="focus"
          animated
        ></ion-searchbar>

        <div v-if="loading" class="ion-text-center ion-padding">
          <ion-spinner color="primary"></ion-spinner>
        </div>

        <div v-else-if="filteredTeachers.length === 0" class="ion-text-center ion-padding">
          <p>No teachers found</p>
        </div>

        <ion-list v-else>
          <ion-list-header>
            <ion-label>{{ filteredTeachers.length }} Teachers</ion-label>
          </ion-list-header>
          <ion-item v-for="teacher in filteredTeachers" :key="teacher.id" @click="selectTeacher(teacher)">
            <ion-avatar slot="start">
              <img :src="getAvatar(teacher.firstName)" :alt="teacher.firstName" />
            </ion-avatar>
            <ion-label>
              <h2>{{ teacher.firstName }} {{ teacher.lastName }}</h2>
              <p>{{ teacher.specialization }}</p>
            </ion-label>
            <ion-badge slot="end">{{ teacher.status }}</ion-badge>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { add } from 'ionicons/icons'
import { useTeacherStore } from '@/stores/teacherStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const teacherStore = useTeacherStore()
const authStore = useAuthStore()

const searchQuery = ref('')

const filteredTeachers = computed(() => {
  return teacherStore.teachers.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    t.specialization.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loading = computed(() => teacherStore.loading)

const getAvatar = (name: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`

function selectTeacher(teacher: any) {
  teacherStore.selectTeacher(teacher)
  router.push(`/teachers/${teacher.id}`)
}

function openAddDialog() {
  // TODO: Open add teacher modal
}

onMounted(async () => {
  const user = authStore.user
  if (user) {
    await teacherStore.fetchTeachers(user.schoolId)
  }
})
</script>

<style scoped>
.teachers-container {
  padding: 16px;
}
</style>
