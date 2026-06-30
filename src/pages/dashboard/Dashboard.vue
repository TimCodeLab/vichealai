<template>
  <ion-page style="--background: #f5f7fa">
    <!-- Header -->
    <ion-header>
      <ion-toolbar style="--background: #0891b2; --color: white; --border-color: transparent; padding: 0 12px">
        <!-- Menu Button -->
        <ion-buttons slot="start">
          <ion-menu-button color="white" style="font-size: 24px"></ion-menu-button>
        </ion-buttons>

        <!-- Title -->
        <ion-title style="font-size: 1.2rem; font-weight: bold; color: white; text-align: center; flex: 1">VICHEALAI</ion-title>

        <!-- Language Toggle -->
        <ion-buttons slot="end">
          <button
            @click="toggleLanguage"
            style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.2); border: none; border-radius: 6px; color: white; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.3s"
            @mouseover="$event.target.style.background = 'rgba(255,255,255,0.3)'"
            @mouseout="$event.target.style.background = 'rgba(255,255,255,0.2)'"
          >
            <span style="font-size: 18px">{{ currentFlagIcon }}</span>
            <span>{{ currentLangCode }}</span>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content style="--background: #f5f7fa">
      <div style="padding: 20px 16px; background: #f5f7fa">

        <!-- Quick Navigation Icons -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px">
          <button
            v-for="quick in quickNav"
            :key="quick.id"
            @click="navigate(quick.path)"
            style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 8px; border: none; background: transparent; cursor: pointer; border-radius: 8px; transition: all 0.3s"
            @mouseover="$event.target.parentElement.style.background = '#f0f0f0'"
            @mouseout="$event.target.parentElement.style.background = 'transparent'"
          >
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #ec4899; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; flex-shrink: 0">
              {{ quick.icon }}
            </div>
            <span style="font-size: 11px; font-weight: 500; color: #4b5563; text-align: center; line-height: 1.2; max-width: 60px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
              {{ quick.label }}
            </span>
          </button>
        </div>

        <!-- Notification Banner -->
        <div style="background: #cffafe; border-left: 4px solid #0891b2; border-radius: 8px; padding: 16px; margin-bottom: 24px">
          <p style="font-size: 14px; font-weight: 600; color: #0e7490; margin: 0">No new notification available</p>
          <p style="font-size: 12px; color: #0e7490; margin: 8px 0 0 0">Latest notification will be shown here</p>
        </div>

        <!-- Features Grid -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px">
          <button
            v-for="feature in features"
            :key="feature.id"
            @click="navigate(feature.path)"
            style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; border: none; background: transparent; cursor: pointer; border-radius: 8px; transition: all 0.3s"
            @mouseover="$event.target.style.background = '#f0f0f0'"
            @mouseout="$event.target.style.background = 'transparent'"
          >
            <div style="font-size: 32px">{{ feature.icon }}</div>
            <span style="font-size: 11px; font-weight: 500; color: #4b5563; text-align: center; line-height: 1.2; max-width: 55px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
              {{ feature.label }}
            </span>
          </button>
        </div>

        <!-- User Info Card -->
        <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb">
          <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 12px">
            <div style="font-size: 28px">👤</div>
            <div style="flex: 1">
              <h3 style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0">{{ userName }}</h3>
              <p style="font-size: 12px; color: #6b7280; margin: 4px 0 0 0">{{ getRoleLabel(user?.role) }}</p>
            </div>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; display: grid; gap: 8px">
            <div
              v-for="info in userInfo"
              :key="info.label"
              style="display: flex; justify-content: space-between; font-size: 12px"
            >
              <span style="color: #6b7280">{{ info.label }}</span>
              <span style="font-weight: 500; color: #1f2937">{{ info.value }}</span>
            </div>
          </div>
        </div>

        <!-- Footer space -->
        <div style="height: 20px"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useI18nStore } from '@/stores/i18n'
import { useI18n } from '@/composables/useI18n'

const router = useRouter()
const authStore = useAuth()
const i18nStore = useI18nStore()
const { t } = useI18n()

const currentLang = computed(() => i18nStore.locale)

const currentFlagIcon = computed(() => {
  return currentLang.value === 'km' ? '🇰🇭' : '🇬🇧'
})

const currentLangCode = computed(() => {
  return currentLang.value === 'km' ? 'KM' : 'EN'
})

function toggleLanguage() {
  const nextLang = currentLang.value === 'km' ? 'en' : 'km'
  i18nStore.setLocale(nextLang)
}

const user = computed(() => authStore.user)

const userName = computed(() => {
  if (!user.value) return 'User'
  return user.value.name || user.value.email?.split('@')[0] || 'User'
})

const quickNav = computed(() => [
  { id: 'attendance', icon: '📋', label: 'Attendance', path: '/attendance' },
  { id: 'homework', icon: '📝', label: 'Homework', path: '/homework' },
  { id: 'timetable', icon: '🕐', label: 'Timetable', path: '/classes' },
  { id: 'students', icon: '👥', label: 'Students', path: '/students' }
])

const features = computed(() => [
  { id: 'students', icon: '👥', label: 'Students', path: '/students' },
  { id: 'teachers', icon: '👨‍🏫', label: 'Teachers', path: '/teachers' },
  { id: 'classes', icon: '🏫', label: 'Classes', path: '/classes' },
  { id: 'attendance', icon: '✅', label: 'Attendance', path: '/attendance' },
  { id: 'timetable', icon: '📚', label: 'Timetable', path: '/classes' },
  { id: 'homework', icon: '📝', label: 'Homework', path: '/homework' },
  { id: 'exams', icon: '📊', label: 'Exams', path: '/exams' },
  { id: 'marks', icon: '📈', label: 'Marks', path: '/exams' },
  { id: 'finance', icon: '💳', label: 'Finance', path: '/finance' },
  { id: 'announcements', icon: '📢', label: 'Announcements', path: '/communication' },
  { id: 'reports', icon: '📄', label: 'Reports', path: '/dashboard' },
  { id: 'logout', icon: '🚪', label: 'Logout', path: '/login' }
])

const userInfo = computed(() => [
  { label: 'Email', value: user.value?.email || '—' },
  { label: 'Role', value: user.value?.role || '—' },
  { label: 'School', value: user.value?.schoolId || '—' },
  { label: 'Status', value: user.value?.isActive ? '🟢 Active' : '🔴 Inactive' }
])

function getRoleLabel(role?: string): string {
  const roleLabels: Record<string, string> = {
    super_admin: 'Super Administrator',
    school_admin: 'School Admin',
    vice_principal: 'Vice Principal',
    teacher: 'Teacher',
    student: 'Student',
    parent: 'Parent',
    accountant: 'Accountant',
    librarian: 'Librarian',
    receptionist: 'Receptionist',
    security: 'Security'
  }
  return roleLabels[role || ''] || 'User'
}

function navigate(path: string) {
  router.push(path)
}
</script>
