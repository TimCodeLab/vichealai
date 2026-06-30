<template>
  <ion-page class="s-page">

    <!-- Header -->
    <ion-header class="s-header">
      <div class="s-header-bar">
        <button class="s-back-btn" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="s-header-title">{{ t('nav.settings') }}</span>
        <div style="width:36px"></div>
      </div>
    </ion-header>

    <ion-content class="s-content">
      <div class="s-body anim-fade-up">

        <!-- Profile Card -->
        <div class="s-profile-card" @click="router.push('/profile')">
          <div class="s-profile-avatar">{{ userInitial }}</div>
          <div class="s-profile-info">
            <div class="s-profile-name">{{ userName }}</div>
            <div class="s-profile-role">{{ getRoleLabel(user?.role) }}</div>
            <div class="s-profile-email">{{ user?.email }}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>

        <!-- Appearance -->
        <div class="s-section">
          <div class="s-section-title">🎨 Appearance</div>
          <div class="s-group">
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#eff6ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="#1976d2" stroke-width="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#1976d2" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span class="s-row-label">Theme</span>
              </div>
              <div class="s-theme-tabs">
                <button :class="['s-theme-btn', { active: theme === 'light' }]" @click="theme = 'light'">☀️ Light</button>
                <button :class="['s-theme-btn', { active: theme === 'dark' }]" @click="theme = 'dark'">🌙 Dark</button>
              </div>
            </div>

            <div class="s-divider"></div>

            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#f0fdf4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#16a34a" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span class="s-row-label">Language</span>
              </div>
              <div class="s-lang-toggle">
                <button :class="['s-lang-btn', { active: currentLang === 'km' }]" @click="setLanguage('km')"><img src="https://flagcdn.com/20x15/kh.png" width="20" height="15" style="border-radius:2px;vertical-align:middle;margin-right:5px" /> KM</button>
                <button :class="['s-lang-btn', { active: currentLang === 'en' }]" @click="setLanguage('en')"><img src="https://flagcdn.com/20x15/gb.png" width="20" height="15" style="border-radius:2px;vertical-align:middle;margin-right:5px" /> EN</button>
              </div>
            </div>

            <div class="s-divider"></div>

            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#fdf4ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="#9333ea" stroke-width="2"/><path d="M8 21h8M12 17v4" stroke="#9333ea" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span class="s-row-label">Font Size</span>
              </div>
              <div class="s-font-tabs">
                <button v-for="sz in fontSizes" :key="sz.value" :class="['s-font-btn', { active: fontSize === sz.value }]" @click="fontSize = sz.value">{{ sz.label }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="s-section">
          <div class="s-section-title">🔔 Notifications</div>
          <div class="s-group">
            <div v-for="(item, idx) in notifItems" :key="item.key">
              <div class="s-row">
                <div class="s-row-left">
                  <div class="s-icon-wrap" :style="{ background: item.bg }">
                    <span style="font-size:14px">{{ item.icon }}</span>
                  </div>
                  <div>
                    <div class="s-row-label">{{ item.label }}</div>
                    <div class="s-row-sub">{{ item.sub }}</div>
                  </div>
                </div>
                <div class="s-toggle" :class="{ on: notifs[item.key] }" @click="notifs[item.key] = !notifs[item.key]">
                  <div class="s-toggle-knob"></div>
                </div>
              </div>
              <div v-if="idx < notifItems.length - 1" class="s-divider s-divider-indent"></div>
            </div>
          </div>
        </div>

        <!-- Academic Info -->
        <div class="s-section">
          <div class="s-section-title">🏫 Academic</div>
          <div class="s-group">
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#eff6ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#1976d2" stroke-width="2"/></svg>
                </div>
                <span class="s-row-label">School</span>
              </div>
              <span class="s-row-value">Royal Academy</span>
            </div>
            <div class="s-divider s-divider-indent"></div>
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#f0fdf4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#16a34a" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span class="s-row-label">Academic Year</span>
              </div>
              <span class="s-row-value">2024–2025</span>
            </div>
            <div class="s-divider s-divider-indent"></div>
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#fef9c3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#ca8a04" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="s-row-label">Semester</span>
              </div>
              <span class="s-row-value">Semester 1</span>
            </div>
            <div class="s-divider s-divider-indent"></div>
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#fdf4ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9333ea" stroke-width="2"/><path d="M12 8v4l3 3" stroke="#9333ea" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span class="s-row-label">Timezone</span>
              </div>
              <span class="s-row-value">Asia/Phnom_Penh</span>
            </div>
          </div>
        </div>

        <!-- Privacy & Security -->
        <div class="s-section">
          <div class="s-section-title">🔐 Privacy & Security</div>
          <div class="s-group">
            <div class="s-row s-row-tap" @click="router.push('/profile')">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#fff7ed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#ea580c" stroke-width="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#ea580c" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span class="s-row-label">Change Password</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="s-divider s-divider-indent"></div>
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#f0fdf4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="s-row-label">Two-Factor Auth</span>
              </div>
              <div class="s-toggle" :class="{ on: twoFactor }" @click="twoFactor = !twoFactor">
                <div class="s-toggle-knob"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="s-section">
          <div class="s-section-title">ℹ️ About</div>
          <div class="s-group">
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#eff6ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15h-1v-6h1v6zm0-8h-1V7h1v2z" fill="#1976d2"/></svg>
                </div>
                <span class="s-row-label">App Version</span>
              </div>
              <span class="s-row-value">v1.0.0</span>
            </div>
            <div class="s-divider s-divider-indent"></div>
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#fdf4ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l5 5v11a2 2 0 0 1-2 2z" stroke="#9333ea" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span class="s-row-label">Build</span>
              </div>
              <span class="s-row-value">2025.06</span>
            </div>
            <div class="s-divider s-divider-indent"></div>
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#fff7ed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#ea580c" stroke-width="2"/><circle cx="12" cy="10" r="3" stroke="#ea580c" stroke-width="2"/></svg>
                </div>
                <span class="s-row-label">School Code</span>
              </div>
              <span class="s-row-value">SCHOOL001</span>
            </div>
          </div>
        </div>

        <!-- Data -->
        <div class="s-section">
          <div class="s-section-title">💾 Data & Storage</div>
          <div class="s-group">
            <div class="s-row">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#eff6ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7" stroke="#1976d2" stroke-width="2"/><path d="M20 7c0 2.21-3.582 4-8 4S4 9.21 4 7s3.582-4 8-4 8 1.79 8 4z" stroke="#1976d2" stroke-width="2"/></svg>
                </div>
                <span class="s-row-label">Offline Mode</span>
              </div>
              <div class="s-toggle" :class="{ on: offlineMode }" @click="offlineMode = !offlineMode">
                <div class="s-toggle-knob"></div>
              </div>
            </div>
            <div class="s-divider s-divider-indent"></div>
            <div class="s-row s-row-tap" @click="clearCache">
              <div class="s-row-left">
                <div class="s-icon-wrap" style="background:#fff5f5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span class="s-row-label" style="color:#ef4444">Clear Cache</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </div>

        <!-- Logout -->
        <button class="s-logout-btn" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          {{ t('nav.logout') }}
        </button>

        <div class="s-app-footer">
          <div class="s-app-logo">🎓</div>
          <div class="s-app-name">VICHEALAI</div>
          <div class="s-app-tagline">School Management System</div>
          <div class="s-app-copy">© 2025 VICHEALAI. All rights reserved.</div>
        </div>

        <div style="height:24px"></div>
      </div>
    </ion-content>

    <!-- Clear cache toast -->
    <transition name="toast">
      <div v-if="showToast" class="s-toast">✅ Cache cleared successfully</div>
    </transition>

  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { IonPage, IonHeader, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useI18nStore } from '@/stores/i18n'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const authStore = useAuth()
const i18nStore = useI18nStore()
const { t } = useI18n()

const user = computed(() => authStore.user)
const userName = computed(() => user.value?.name || user.value?.email?.split('@')[0] || 'User')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
const currentLang = computed(() => i18nStore.locale)

// Settings state
const theme = ref('light')
const fontSize = ref('md')
const twoFactor = ref(false)
const offlineMode = ref(false)
const showToast = ref(false)

const fontSizes = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
]

const notifs = reactive({
  announcements: true,
  homework: true,
  exams: true,
  fees: false,
})

const notifItems = [
  { key: 'announcements', icon: '📢', label: 'Announcements', sub: 'School-wide notices', bg: '#eff6ff' },
  { key: 'homework',      icon: '📝', label: 'Homework',      sub: 'Assignment reminders', bg: '#f0fdf4' },
  { key: 'exams',         icon: '📊', label: 'Exams',         sub: 'Exam schedules & results', bg: '#fef9c3' },
  { key: 'fees',          icon: '💳', label: 'Fees',          sub: 'Payment due dates', bg: '#fff7ed' },
]

function getRoleLabel(role?: string): string {
  if (!role) return 'User'
  return t(`roles.${role}`) || role
}

function setLanguage(lang: string) {
  i18nStore.setLocale(lang as any)
}

function clearCache() {
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2500)
}

function handleLogout() {
  authStore.logout()
  router.replace('/login').catch(() => { window.location.replace('/login') })
}
</script>

<style scoped>
.s-page { --background: #f5f7fa; }

/* ── Header ── */
.s-header {
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 45%, #0288d1 100%);
  box-shadow: 0 4px 20px rgba(21,101,192,0.4);
}
.s-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  height: 56px;
}
.s-back-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.s-header-title {
  font-size: 17px; font-weight: 700; color: white; letter-spacing: 0.3px;
}

/* ── Content ── */
.s-content { --background: #f5f7fa; }
.s-body { padding: 14px; display: flex; flex-direction: column; gap: 14px; }

/* ── Profile card ── */
.s-profile-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #1565c0, #1976d2);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(21,101,192,0.3);
}
.s-profile-avatar {
  width: 54px; height: 54px; border-radius: 50%;
  background: rgba(255,255,255,0.25);
  color: white; font-size: 22px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid rgba(255,255,255,0.4);
  flex-shrink: 0;
}
.s-profile-info { flex: 1; }
.s-profile-name  { font-size: 16px; font-weight: 700; color: white; }
.s-profile-role  { font-size: 12px; color: rgba(255,255,255,0.75); margin-top: 2px; }
.s-profile-email { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 1px; }

/* ── Section ── */
.s-section { display: flex; flex-direction: column; gap: 6px; }
.s-section-title { font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; padding-left: 4px; }
.s-group { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.04); }

/* ── Row ── */
.s-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 14px;
}
.s-row-tap { cursor: pointer; }
.s-row-tap:active { background: #f9fafb; }

.s-row-left { display: flex; align-items: center; gap: 10px; }
.s-icon-wrap {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.s-row-label { font-size: 14px; font-weight: 500; color: #1f2937; }
.s-row-sub   { font-size: 11px; color: #9ca3af; margin-top: 1px; }
.s-row-value { font-size: 13px; color: #6b7280; font-weight: 500; }

/* ── Dividers ── */
.s-divider { height: 1px; background: #f3f4f6; }
.s-divider-indent { margin-left: 56px; }

/* ── Toggle switch ── */
.s-toggle {
  width: 44px; height: 26px;
  border-radius: 13px;
  background: #e5e7eb;
  cursor: pointer;
  position: relative;
  transition: background 0.25s;
  flex-shrink: 0;
}
.s-toggle.on { background: #1976d2; }
.s-toggle-knob {
  position: absolute;
  top: 3px; left: 3px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.25s;
}
.s-toggle.on .s-toggle-knob { transform: translateX(18px); }

/* ── Theme tabs ── */
.s-theme-tabs, .s-lang-toggle, .s-font-tabs {
  display: flex;
  gap: 4px;
}
.s-theme-btn, .s-lang-btn, .s-font-btn {
  padding: 5px 10px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  font-size: 12px; font-weight: 600; color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}
.s-theme-btn.active, .s-lang-btn.active, .s-font-btn.active {
  background: #1976d2; border-color: #1976d2; color: white;
}

/* ── Logout ── */
.s-logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: white;
  color: #ef4444;
  border: 1.5px solid #fecaca;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: background 0.15s;
}
.s-logout-btn:active { background: #fff5f5; }

/* ── Footer ── */
.s-app-footer {
  text-align: center;
  padding: 10px 0 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.s-app-logo    { font-size: 32px; }
.s-app-name    { font-size: 15px; font-weight: 800; color: #1f2937; letter-spacing: 1px; }
.s-app-tagline { font-size: 12px; color: #6b7280; }
.s-app-copy    { font-size: 11px; color: #9ca3af; }

/* ── Toast ── */
.s-toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  white-space: nowrap;
}
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }
.s-section { animation: fadeUp .35s ease both; }
.s-section:nth-child(1){animation-delay:.08s}.s-section:nth-child(2){animation-delay:.16s}.s-section:nth-child(3){animation-delay:.24s}.s-section:nth-child(4){animation-delay:.32s}
.s-profile-card { animation: fadeUp .35s .02s ease both; transition:transform .18s,box-shadow .18s; }
.s-profile-card:active { transform:scale(.98); }
.s-toggle { transition:background .25s; }
.s-toggle-knob { transition:transform .25s; }
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
