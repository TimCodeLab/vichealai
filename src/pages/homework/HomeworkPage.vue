<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Homework</ion-title>
        <ion-buttons slot="end" v-if="isTeacher">
          <ion-button @click="openCreateDialog">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="homework-container">
        <ion-segment v-model="selectedTab" @ionChange="filterHomework">
          <ion-segment-button value="active">
            <ion-label>Active</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Completed</Ion-label>
          </ion-segment-button>
        </ion-segment>

        <div v-if="filteredHomework.length === 0" class="ion-text-center ion-padding">
          <p>No homework found</p>
        </div>

        <ion-list v-else>
          <ion-item-sliding v-for="hw in filteredHomework" :key="hw.id">
            <ion-item @click="selectHomework(hw)">
              <ion-label>
                <h2>{{ hw.title }}</h2>
                <p>Due: {{ formatDate(hw.dueDate) }}</p>
              </ion-label>
              <ion-badge slot="end">{{ hw.status }}</ion-badge>
            </ion-item>
          </ion-item-sliding>
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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonItemSliding,
  IonBadge
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { add } from 'ionicons/icons'
import { useHomeworkStore } from '@/stores/homeworkStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const homeworkStore = useHomeworkStore()
const authStore = useAuthStore()

const selectedTab = ref('active')

const isTeacher = computed(() => authStore.user?.role === 'teacher')

const filteredHomework = computed(() => {
  if (selectedTab.value === 'active') {
    return homeworkStore.homework.filter(hw => new Date(hw.dueDate) > new Date())
  }
  return homeworkStore.homework.filter(hw => new Date(hw.dueDate) <= new Date())
})

const formatDate = (date: string) => new Date(date).toLocaleDateString()

function selectHomework(hw: any) {
  router.push(`/homework/${hw.id}`)
}

function openCreateDialog() {
  // TODO: Open create homework modal
}

function filterHomework() {
  // Computed property handles filtering
}

onMounted(async () => {
  const user = authStore.user
  if (user) {
    await homeworkStore.fetchHomework(user.schoolId)
  }
})
</script>

<style scoped>
.homework-container {
  padding: 16px;
}
</style>
