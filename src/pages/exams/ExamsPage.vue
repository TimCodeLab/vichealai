<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Exams</ion-title>
        <ion-buttons slot="end" v-if="isAdmin">
          <ion-button @click="openCreateDialog">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="exams-container">
        <ion-segment v-model="selectedTab">
          <ion-segment-button value="scheduled">
            <ion-label>Scheduled</ion-label>
          </ion-segment-button>
          <ion-segment-button value="ongoing">
            <ion-label>Ongoing</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Completed</Ion-label>
          </ion-segment-button>
        </ion-segment>

        <div v-if="filteredExams.length === 0" class="ion-text-center ion-padding">
          <p>No exams found</p>
        </div>

        <ion-list v-else>
          <ion-item v-for="exam in filteredExams" :key="exam.id" @click="selectExam(exam)">
            <ion-label>
              <h2>{{ exam.name }}</h2>
              <p>{{ formatDate(exam.startDate) }} - {{ formatDate(exam.endDate) }}</p>
            </ion-label>
            <ion-badge slot="end">{{ exam.status }}</ion-badge>
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
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonBadge
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { add } from 'ionicons/icons'
import { useExamStore } from '@/stores/examStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const examStore = useExamStore()
const authStore = useAuthStore()

const selectedTab = ref('scheduled')
const isAdmin = computed(() => ['school_admin', 'super_admin'].includes(authStore.user?.role || ''))

const filteredExams = computed(() => {
  return examStore.exams.filter(e => e.status === selectedTab.value)
})

const formatDate = (date: string) => new Date(date).toLocaleDateString()

function selectExam(exam: any) {
  router.push(`/exams/${exam.id}`)
}

function openCreateDialog() {
  // TODO: Open create exam modal
}

onMounted(async () => {
  const user = authStore.user
  if (user) {
    await examStore.fetchExams(user.schoolId)
  }
})
</script>

<style scoped>
.exams-container {
  padding: 16px;
}
</style>
