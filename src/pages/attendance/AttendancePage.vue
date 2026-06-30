<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Attendance</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="attendance-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Mark Attendance</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Select Class</ion-label>
              <ion-select v-model="selectedClassId" placeholder="Choose class">
                <ion-select-option v-for="cls in classes" :key="cls.id" :value="cls.id">
                  {{ cls.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Date</ion-label>
              <ion-input v-model="attendanceDate" type="date"></ion-input>
            </ion-item>

            <ion-button expand="block" @click="loadClassStudents">
              Load Students
            </ion-button>
          </ion-card-content>
        </ion-card>

        <div v-if="classStudents.length > 0" class="attendance-list">
          <ion-card v-for="student in classStudents" :key="student.id">
            <ion-card-content class="student-attendance">
              <div class="student-info">
                <img :src="getAvatar(student.firstName)" :alt="student.firstName" class="student-avatar" />
                <div>
                  <h3>{{ student.firstName }} {{ student.lastName }}</h3>
                  <p>{{ student.enrollmentNumber }}</p>
                </div>
              </div>

              <ion-segment v-model="attendanceStatus[student.id]" @ionChange="updateAttendance(student.id)">
                <ion-segment-button value="present">
                  <ion-label>Present</ion-label>
                </ion-segment-button>
                <ion-segment-button value="absent">
                  <ion-label>Absent</ion-label>
                </ion-segment-button>
                <ion-segment-button value="late">
                  <ion-label>Late</ion-label>
                </ion-segment-button>
              </ion-segment>
            </ion-card-content>
          </ion-card>

          <ion-button expand="block" color="success" @click="submitAttendance">
            Submit Attendance
          </ion-button>
        </div>
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
  IonSegment,
  IonSegmentButton,
  useIonToast
} from '@ionic/vue'
import { useAttendanceStore } from '@/stores/attendanceStore'
import { useAcademicStore } from '@/stores/academicStore'
import { useAuthStore } from '@/stores/authStore'

const toast = useIonToast() as any
const attendanceStore = useAttendanceStore()
const academicStore = useAcademicStore()
const authStore = useAuthStore()

const selectedClassId = ref('')
const attendanceDate = ref(new Date().toISOString().split('T')[0])
const classStudents = ref<any[]>([])
const attendanceStatus = ref<Record<string, string>>({})

const classes = computed(() => academicStore.classes)

const getAvatar = (name: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`

async function loadClassStudents() {
  if (!selectedClassId.value) {
    toast.present({
      message: 'Please select a class',
      duration: 2000,
      color: 'warning'
    })
    return
  }
  // TODO: Load students for selected class
}

function updateAttendance(studentId: string) {
  // Status is automatically updated by the segment binding
}

async function submitAttendance() {
  const user = authStore.user
  if (!user) return

  const records = classStudents.value.map(s => ({
    studentId: s.id,
    status: attendanceStatus.value[s.id] || 'present'
  }))

  try {
    await attendanceStore.markAttendance(user.schoolId, selectedClassId.value, records)
    toast.present({
      message: 'Attendance marked successfully',
      duration: 2000,
      color: 'success'
    })
    // Reset
    selectedClassId.value = ''
    classStudents.value = []
    attendanceStatus.value = {}
  } catch (error) {
    toast.present({
      message: 'Failed to submit attendance',
      duration: 2000,
      color: 'danger'
    })
  }
}

onMounted(async () => {
  const user = authStore.user
  if (user) {
    await academicStore.fetchClasses(user.schoolId)
  }
})
</script>

<style scoped>
.attendance-container {
  padding: 16px;
}

.attendance-list {
  margin-top: 20px;
}

.student-attendance {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.student-info h3 {
  margin: 0;
  font-size: 16px;
}

.student-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}
</style>
