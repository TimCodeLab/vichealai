<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Classes</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddDialog">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="classes-container">
        <ion-list>
          <ion-list-header>
            <ion-label>Classes & Sections</ion-label>
          </ion-list-header>
          <ion-item-group v-for="grade in grades" :key="grade.id">
            <ion-item-divider :sticky="true">
              <ion-label><strong>{{ grade.name }}</strong></ion-label>
            </ion-item-divider>
            <ion-item v-for="cls in getClassesByGrade(grade.id)" :key="cls.id" @click="selectClass(cls)">
              <ion-label>
                <h2>{{ cls.name }}</h2>
              </ion-label>
            </ion-item>
          </ion-item-group>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonItemGroup,
  IonItemDivider,
  IonItem,
  IonLabel
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { add } from 'ionicons/icons'
import { useAcademicStore } from '@/stores/academicStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const academicStore = useAcademicStore()
const authStore = useAuthStore()

const grades = computed(() => academicStore.grades)

const getClassesByGrade = (gradeId: string) => academicStore.getClassesByGrade(gradeId)

function selectClass(cls: any) {
  router.push(`/classes/${cls.id}`)
}

function openAddDialog() {
  // TODO: Open add class modal
}

onMounted(async () => {
  const user = authStore.user
  if (user) {
    // Load data with automatic fallback to mock data if backend unavailable
    await Promise.all([
      academicStore.fetchGrades(user.schoolId),
      academicStore.fetchClasses(user.schoolId)
    ])
  }
})
</script>

<style scoped>
.classes-container {
  padding: 16px;
}
</style>
