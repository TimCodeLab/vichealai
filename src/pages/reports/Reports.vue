<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Reports</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="reports-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Generate Report</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Report Type</ion-label>
              <ion-select v-model="selectedReportType" placeholder="Choose type">
                <ion-select-option value="students">Students</ion-select-option>
                <ion-select-option value="teachers">Teachers</ion-select-option>
                <ion-select-option value="attendance">Attendance</ion-select-option>
                <ion-select-option value="fees">Fees</ion-select-option>
                <ion-select-option value="exam">Exam Results</ion-select-option>
                <ion-select-option value="library">Library</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Start Date</ion-label>
              <ion-input v-model="startDate" type="date"></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">End Date</ion-label>
              <ion-input v-model="endDate" type="date"></ion-input>
            </ion-item>

            <ion-button expand="block" @click="generateReport">Generate</ion-button>
          </ion-card-content>
        </ion-card>

        <ion-list>
          <ion-list-header>
            <ion-label>Recent Reports</ion-label>
          </ion-list-header>
          <ion-item v-for="report in recentReports" :key="report.id" @click="downloadReport(report)">
            <ion-label>
              <h2>{{ report.name }}</h2>
              <p>{{ formatDate(report.generatedDate) }}</p>
            </ion-label>
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonList,
  IonListHeader,
} from '@ionic/vue'
import { useAuth } from '@/stores/auth'

const authStore = useAuth()

const selectedReportType = ref('students')
const startDate = ref('')
const endDate = ref(new Date().toISOString().split('T')[0])
const recentReports = ref<any[]>([])

const formatDate = (date: string) => new Date(date).toLocaleDateString()

function generateReport() {
  toast.present({
    message: 'Report generation in progress...',
    duration: 2000
  })
  // TODO: Generate report
}

function downloadReport(report: any) {
  // TODO: Download report
}

onMounted(() => {
  // TODO: Load recent reports
})
</script>

<style scoped>
.reports-container {
  padding: 16px;
}
</style>
