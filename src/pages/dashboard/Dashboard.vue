<template>
  <ion-page style="--background: #f5f7fa">
    <!-- Header -->
    <ion-header class="dashboard-header">
      <div class="header-bar">
        <!-- Left: Menu + Brand -->
        <div class="header-left">
          <ion-menu-button class="menu-btn"></ion-menu-button>
          <div class="brand">
            <div class="brand-logo">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <rect width="26" height="26" rx="7" fill="rgba(255,255,255,0.25)"/>
                <path d="M6 19L13 7L20 19" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.8 15H17.2" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">VICHEALAI</span>
              <span class="brand-sub">School Management</span>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="header-right">
          <!-- Language Toggle -->
          <button class="lang-btn" @click="toggleLanguage">
            <span class="lang-flag">{{ currentFlagIcon }}</span>
            <span class="lang-code">{{ currentLangCode }}</span>
          </button>

          <!-- Notification Bell -->
          <button class="icon-btn" @click="router.push('/communication')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="notif-dot"></span>
          </button>

          <!-- Avatar (clickable) -->
          <div class="avatar" @click="toggleProfileMenu">{{ userInitial }}</div>
        </div>
      </div>

      <!-- Profile Dropdown -->
      <transition name="dropdown">
        <div v-if="showProfileMenu" class="profile-dropdown">
          <div class="profile-dropdown-user">
            <div class="profile-dropdown-avatar">{{ userInitial }}</div>
            <div>
              <div class="profile-dropdown-name">{{ userName }}</div>
              <div class="profile-dropdown-role">{{ getRoleLabel(user?.role) }}</div>
            </div>
          </div>
          <div class="profile-dropdown-divider"></div>
          <button class="profile-dropdown-item" @click="goToProfile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Profile
          </button>
          <button class="profile-dropdown-item profile-dropdown-logout" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            {{ t('nav.logout') }}
          </button>
        </div>
      </transition>

      <!-- Greeting row -->
      <div class="header-greeting">
        <span class="greeting-text">👋 {{ t('dashboard.welcome') }}, <strong>{{ userName }}</strong></span>
        <span class="greeting-role">{{ getRoleLabel(user?.role) }}</span>
      </div>
    </ion-header>

    <!-- Backdrop to close dropdown -->
    <div v-if="showProfileMenu" class="dropdown-backdrop" @click="showProfileMenu = false"></div>

    <!-- Content -->
    <ion-content style="--background: #f5f7fa">
      <div style="padding: 20px 16px; background: #f5f7fa">

        <!-- Quick Navigation Icons -->
        <div style="background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); padding: 16px 8px; margin-bottom: 24px; border: 1px solid rgba(0,123,255,0.08)">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px">
            <button
              v-for="quick in quickNav"
              :key="quick.id"
              @click="navigate(quick.path)"
              style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 6px; border: none; background: transparent; cursor: pointer; border-radius: 12px; transition: all 0.2s"
              @mouseover="$event.currentTarget.style.background = '#f0f5ff'"
              @mouseout="$event.currentTarget.style.background = 'transparent'"
            >
              <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #007bff); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,123,255,0.3)">
                {{ quick.icon }}
              </div>
              <span style="font-size: 11px; font-weight: 600; color: #374151; text-align: center; line-height: 1.2; max-width: 62px">
                {{ quick.label }}
              </span>
            </button>
          </div>
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

        <!-- Quick Stats -->
        <div class="stats-section">
          <h3 class="stats-title">📊 Quick Stats</h3>
          <div class="stats-grid">
            <div class="stat-card stat-blue">
              <div class="stat-icon">👥</div>
              <div class="stat-value">248</div>
              <div class="stat-label">{{ t('nav.students') }}</div>
            </div>
            <div class="stat-card stat-green">
              <div class="stat-icon">👨‍🏫</div>
              <div class="stat-value">32</div>
              <div class="stat-label">{{ t('nav.teachers') }}</div>
            </div>
            <div class="stat-card stat-orange">
              <div class="stat-icon">🏫</div>
              <div class="stat-value">18</div>
              <div class="stat-label">{{ t('nav.classes') }}</div>
            </div>
            <div class="stat-card stat-purple">
              <div class="stat-icon">📋</div>
              <div class="stat-value">94%</div>
              <div class="stat-label">{{ t('nav.attendance') }}</div>
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
import { computed, ref } from 'vue'
import {
  IonPage,
  IonHeader,
  IonContent,
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
  return currentLang.value === 'km' ? 'KH' : 'GB'
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

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase()
})

const showProfileMenu = ref(false)

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
}

function goToProfile() {
  showProfileMenu.value = false
  router.push('/profile')
}

function handleLogout() {
  showProfileMenu.value = false
  authStore.logout()
  router.push('/login')
}

const quickNav = computed(() => [
  { id: 'attendance', icon: '📋', label: t('nav.attendance'), path: '/attendance' },
  { id: 'homework', icon: '📝', label: t('nav.homework'), path: '/homework' },
  { id: 'timetable', icon: '🕐', label: t('nav.timetable'), path: '/classes' },
  { id: 'students', icon: '👥', label: t('nav.students'), path: '/students' }
])

const features = computed(() => [
  { id: 'students', icon: '👥', label: t('nav.students'), path: '/students' },
  { id: 'teachers', icon: '👨‍🏫', label: t('nav.teachers'), path: '/teachers' },
  { id: 'classes', icon: '🏫', label: t('nav.classes'), path: '/classes' },
  { id: 'attendance', icon: '✅', label: t('nav.attendance'), path: '/attendance' },
  { id: 'timetable', icon: '📚', label: t('nav.timetable'), path: '/classes' },
  { id: 'homework', icon: '📝', label: t('nav.homework'), path: '/homework' },
  { id: 'exams', icon: '📊', label: t('nav.exams'), path: '/exams' },
  { id: 'marks', icon: '📈', label: t('nav.marks'), path: '/exams' },
  { id: 'finance', icon: '💳', label: t('nav.finance'), path: '/finance' },
  { id: 'announcements', icon: '📢', label: t('nav.announcements'), path: '/communication' },
  { id: 'reports', icon: '📄', label: t('nav.reports'), path: '/reports' },
  { id: 'settings', icon: '⚙️', label: t('nav.settings'), path: '/settings' },
])


function getRoleLabel(role?: string): string {
  if (!role) return 'User'
  return t(`roles.${role}`) || role
}

function navigate(path: string) {
  router.push(path)
}
</script>

<style scoped>
/* ── Header shell ─────────────────────────────────── */
.dashboard-header {
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 40%, #0288d1 100%);
  box-shadow: 0 4px 20px rgba(21, 101, 192, 0.45);
  padding-bottom: 12px;
  border-bottom: none;
}

/* Top bar: menu + brand | actions */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 4px;
  height: 56px;
}

/* Left */
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-btn {
  --color: white;
  --padding-start: 0;
  --padding-end: 0;
  font-size: 22px;
  margin: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  display: flex;
  align-items: center;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-name {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.8px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.brand-sub {
  font-size: 10px;
  color: rgba(255,255,255,0.65);
  font-weight: 400;
  letter-spacing: 0.2px;
}

/* Right */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Language pill */
.lang-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  color: white;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.2s;
}
.lang-btn:active { background: rgba(255,255,255,0.28); }

.lang-flag {
  font-size: 12px;
  font-weight: 800;
  color: rgba(255,255,255,0.85);
}
.lang-code {
  font-size: 11px;
}

/* Notification bell button */
.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
}
.icon-btn:active { background: rgba(255,255,255,0.28); }

.notif-dot {
  position: absolute;
  top: 6px;
  right: 7px;
  width: 7px;
  height: 7px;
  background: #ff5252;
  border-radius: 50%;
  border: 1.5px solid #1976d2;
}

/* Avatar circle */
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
  color: #1565c0;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255,255,255,0.5);
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.15s;
}
.avatar:active { transform: scale(0.93); }

/* Profile dropdown */
.profile-dropdown {
  position: absolute;
  top: 70px;
  right: 12px;
  z-index: 1000;
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  min-width: 200px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
}

.profile-dropdown-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f0f5ff;
}

.profile-dropdown-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1565c0, #1976d2);
  color: white;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-dropdown-name {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.profile-dropdown-role {
  font-size: 11px;
  color: #6b7280;
  margin-top: 1px;
}

.profile-dropdown-divider {
  height: 1px;
  background: #f3f4f6;
}

.profile-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 13px 16px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}
.profile-dropdown-item:hover { background: #f9fafb; }
.profile-dropdown-item:active { background: #f3f4f6; }

.profile-dropdown-logout {
  color: #ef4444;
}
.profile-dropdown-logout:hover { background: #fff5f5; }

/* Backdrop */
.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
}

/* Dropdown animation */
.dropdown-enter-active { transition: all 0.18s ease-out; }
.dropdown-leave-active { transition: all 0.14s ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(-8px) scale(0.97); }
.dropdown-leave-to   { opacity: 0; transform: translateY(-4px) scale(0.97); }

/* Greeting row */
.header-greeting {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 2px 16px 0;
}

.greeting-text {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  font-weight: 400;
}

.greeting-text strong {
  font-weight: 700;
  color: #ffffff;
}

.greeting-role {
  font-size: 10px;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
  background: rgba(255,255,255,0.15);
  padding: 2px 8px;
  border-radius: 10px;
}

/* Quick Stats */
.stats-section { margin-bottom: 8px; }

.stats-title {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 12px 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-icon { font-size: 22px; }

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

.stat-blue   { background: linear-gradient(135deg, #1976d2, #42a5f5); }
.stat-green  { background: linear-gradient(135deg, #2e7d32, #66bb6a); }
.stat-orange { background: linear-gradient(135deg, #e65100, #ffa726); }
.stat-purple { background: linear-gradient(135deg, #6a1b9a, #ab47bc); }
</style>
