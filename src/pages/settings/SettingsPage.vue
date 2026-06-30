<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="settings-container">
        <ion-list>
          <ion-list-header>
            <ion-label>App Settings</ion-label>
          </ion-list-header>

          <ion-item>
            <ion-label>Theme</ion-label>
            <template v-slot:end>
              <ion-select v-model="theme">
                <ion-select-option value="light">
                  Light
                </ion-select-option>
                <ion-select-option value="dark">
                  Dark
                </ion-select-option>
                <ion-select-option value="system">
                  System
                </ion-select-option>
              </ion-select>
            </template>
          </ion-item>

          <ion-item>
            <ion-label>Language</ion-label>
            <template v-slot:end>
              <ion-select v-model="language">
                <ion-select-option value="en">
                  English
                </ion-select-option>
                <ion-select-option value="kh">
                  Khmer
                </ion-select-option>
              </ion-select>
            </template>
          </ion-item>

          <ion-item v-if="isSchoolAdmin">
            <ion-label>Offline Mode</ion-label>
            <template v-slot:end>
              <ion-toggle v-model="offlineMode" />
            </template>
          </ion-item>
        </ion-list>

        <ion-list v-if="isSchoolAdmin">
          <ion-list-header>
            <ion-label>School Settings</ion-label>
          </ion-list-header>

          <ion-item
            button
            @click="openBackupDialog"
          >
            <ion-label>Backup Data</ion-label>
          </ion-item>

          <ion-item
            button
            @click="openRestoreDialog"
          >
            <ion-label>Restore Data</ion-label>
          </ion-item>
        </ion-list>

        <ion-list>
          <ion-list-header>
            <ion-label>Notifications</ion-label>
          </ion-list-header>

          <ion-item>
            <ion-label>Announcements</ion-label>
            <template v-slot:end>
              <ion-toggle v-model="notifyAnnouncements" />
            </template>
          </ion-item>

          <ion-item>
            <ion-label>Homework</ion-label>
            <template v-slot:end>
              <ion-toggle v-model="notifyHomework" />
            </template>
          </ion-item>

          <ion-item>
            <ion-label>Exams</Ion-label>
            <template v-slot:end>
              <ion-toggle v-model="notifyExams" />
            </template>
          </ion-item>

          <ion-item>
            <ion-label>Fees</ion-label>
            <template v-slot:end>
              <ion-toggle v-model="notifyFees" />
            </template>
          </ion-item>
        </ion-list>

        <ion-list>
          <ion-list-header>
            <ion-label>Account</ion-label>
          </ion-list-header>

          <ion-item
            button
            @click="changePassword"
          >
            <ion-label>Change Password</ion-label>
          </ion-item>

          <ion-item
            button
            color="danger"
            @click="logout"
          >
            <ion-label color="danger">
              Logout
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
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
  useIonToast
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const toast = useIonToast() as any
const authStore = useAuthStore()

const theme = ref('system')
const language = ref('en')
const offlineMode = ref(true)
const notifyAnnouncements = ref(true)
const notifyHomework = ref(true)
const notifyExams = ref(true)
const notifyFees = ref(true)

const isSchoolAdmin = computed(() => authStore.user?.role === 'school_admin')

function openBackupDialog() {
  // TODO: Open backup dialog
  toast.present({
    message: 'Backup feature coming soon',
    duration: 2000
  })
}

function openRestoreDialog() {
  // TODO: Open restore dialog
  toast.present({
    message: 'Restore feature coming soon',
    duration: 2000
  })
}

function changePassword() {
  // TODO: Open change password modal
  toast.present({
    message: 'Change password feature coming soon',
    duration: 2000
  })
}

function logout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // TODO: Load settings
})
</script>

<style scoped>
.settings-container {
  padding: 16px;
}
</style>
