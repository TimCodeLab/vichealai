<template>
  <ion-page style="--background:#f5f7fa">

    <!-- ── Header ── -->
    <ion-header class="dashboard-header">
      <div class="header-bar">
        <div class="header-left">
          <ion-menu-button class="menu-btn"></ion-menu-button>
          <div class="brand anim-fade-in">
            <div class="brand-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="rgba(255,255,255,0.22)"/>
                <path d="M7 20L14 8L21 20" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.5 16H18.5" stroke="white" stroke-width="2.3" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">VICHEALAI</span>
              <span class="brand-sub">School Management</span>
            </div>
          </div>
        </div>

        <div class="header-right">
          <button class="lang-btn ripple-wrap" @click="toggleLanguage">
            <span class="lang-flag">{{ currentFlagIcon }}</span>
            <span class="lang-code">{{ currentLangCode }}</span>
          </button>

          <button class="icon-btn anim-bell" @click="router.push('/communication')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="notif-dot notif-pulse"></span>
          </button>

          <div class="avatar press-lift" @click="toggleProfileMenu">{{ userInitial }}</div>
        </div>
      </div>

      <!-- Greeting -->
      <div class="header-greeting anim-fade-up" style="animation-delay:.1s">
        <span class="greeting-text">{{ greetingEmoji }} {{ t('dashboard.welcome') }}, <strong>{{ userName }}</strong></span>
        <span class="greeting-role">{{ getRoleLabel(user?.role) }}</span>
      </div>
    </ion-header>

    <!-- Profile dropdown – outside ion-header so Ionic overflow:hidden doesn't block clicks -->
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
    <div v-if="showProfileMenu" class="dropdown-backdrop" @click="showProfileMenu = false"></div>

    <!-- ── Content ── -->
    <ion-content style="--background:#f5f7fa">
      <div class="dash-body">

        <!-- Quick Nav Card -->
        <div class="quick-nav-card anim-fade-up" style="animation-delay:.12s">
          <div class="quick-nav-grid stagger">
            <button
              v-for="quick in quickNav"
              :key="quick.id"
              class="quick-item press-lift ripple-wrap"
              @click="navigate(quick.path)"
            >
              <div class="quick-circle">{{ quick.icon }}</div>
              <span class="quick-label">{{ quick.label }}</span>
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="stats-row anim-fade-up stagger" style="animation-delay:.18s">
          <div v-for="stat in liveStats" :key="stat.label" class="stat-pill press-lift" :style="{ background: stat.bg }" @click="navigate(stat.path)">
            <div class="stat-pill-icon">{{ stat.icon }}</div>
            <div class="stat-pill-num">{{ stat.value }}</div>
            <div class="stat-pill-lbl">{{ stat.label }}</div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="section-head anim-fade-up" style="animation-delay:.22s">
          <span class="section-title">{{ t('dashboard.modules') || 'Modules' }}</span>
        </div>

        <div class="features-grid stagger anim-fade-up" style="animation-delay:.25s">
          <button
            v-for="feature in features"
            :key="feature.id"
            class="feature-item press-lift ripple-wrap"
            @click="navigate(feature.path)"
          >
            <div class="feature-icon-wrap" :style="{ background: feature.color }">
              <span class="feature-icon">{{ feature.icon }}</span>
            </div>
            <span class="feature-label">{{ feature.label }}</span>
          </button>
        </div>

        <!-- Today's overview card -->
        <div class="today-card anim-fade-up" style="animation-delay:.3s">
          <div class="today-head">
            <span class="today-title">📅 {{ todayLabel }}</span>
            <span class="today-badge">Today</span>
          </div>
          <div class="today-stats">
            <div class="today-stat">
              <span class="ts-num ts-blue">{{ liveData.students }}</span>
              <span class="ts-lbl">{{ t('nav.students') }}</span>
            </div>
            <div class="ts-div"></div>
            <div class="today-stat">
              <span class="ts-num ts-green">{{ liveData.teachers }}</span>
              <span class="ts-lbl">{{ t('nav.teachers') }}</span>
            </div>
            <div class="ts-div"></div>
            <div class="today-stat">
              <span class="ts-num ts-orange">{{ liveData.classes }}</span>
              <span class="ts-lbl">{{ t('nav.classes') }}</span>
            </div>
            <div class="ts-div"></div>
            <div class="today-stat">
              <span class="ts-num ts-purple">{{ liveData.homework }}</span>
              <span class="ts-lbl">{{ t('nav.homework') }}</span>
            </div>
          </div>
        </div>

        <div style="height:24px"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonPage, IonHeader, IonContent, IonMenuButton } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useI18nStore } from '@/stores/i18n'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'

const router    = useRouter()
const authStore = useAuth()
const i18nStore = useI18nStore()
const { t }     = useI18n()

const currentLang     = computed(() => i18nStore.locale)
const currentFlagIcon = computed(() => currentLang.value === 'km' ? 'KH' : 'GB')
const currentLangCode = computed(() => currentLang.value === 'km' ? 'KM' : 'EN')
function toggleLanguage() { i18nStore.setLocale(currentLang.value === 'km' ? 'en' : 'km') }

const user        = computed(() => authStore.user)
const userName    = computed(() => user.value?.name || user.value?.email?.split('@')[0] || 'User')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())

const showProfileMenu = ref(false)
function toggleProfileMenu() { showProfileMenu.value = !showProfileMenu.value }
function goToProfile()       { showProfileMenu.value = false; router.push('/profile') }
function handleLogout()      { showProfileMenu.value = false; authStore.logout(); router.replace('/login').catch(() => { window.location.replace('/login') }) }
function navigate(path: string) { router.push(path) }

function getRoleLabel(role?: string) { return role ? (t(`roles.${role}`) || role) : 'User' }

// Greeting based on time of day
const greetingEmoji = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return '🌅'
  if (h < 17) return '☀️'
  return '🌙'
})

const todayLabel = computed(() =>
  new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })
)

// Live counts from localStorage
const liveData = computed(() => ({
  students: (LocalStorageService.get<any[]>('students', []) || []).length,
  teachers: (LocalStorageService.get<any[]>('teachers', []) || []).length,
  classes:  (LocalStorageService.get<any[]>('classes',  []) || []).length,
  homework: (LocalStorageService.get<any[]>('homework', []) || []).length,
}))

const liveStats = computed(() => [
  { label: t('nav.students'),   value: liveData.value.students, icon:'👥', bg:'linear-gradient(135deg,#1565c0,#1976d2)', path:'/students'  },
  { label: t('nav.teachers'),   value: liveData.value.teachers, icon:'👩‍🏫', bg:'linear-gradient(135deg,#2e7d32,#43a047)', path:'/teachers'  },
  { label: t('nav.classes'),    value: liveData.value.classes,  icon:'🏫', bg:'linear-gradient(135deg,#e65100,#f57c00)', path:'/classes'   },
  { label: t('nav.homework'),   value: liveData.value.homework, icon:'📝', bg:'linear-gradient(135deg,#6a1b9a,#8e24aa)', path:'/homework'  },
])

const quickNav = computed(() => [
  { id:'attendance', icon:'📋', label: t('nav.attendance'), path:'/attendance' },
  { id:'homework',   icon:'📝', label: t('nav.homework'),   path:'/homework'   },
  { id:'students',   icon:'👥', label: t('nav.students'),   path:'/students'   },
  { id:'reports',    icon:'📄', label: t('nav.reports'),    path:'/reports'    },
])

const featureColors: Record<string, string> = {
  students:      'linear-gradient(135deg,#1565c0,#1976d2)',
  teachers:      'linear-gradient(135deg,#2e7d32,#43a047)',
  classes:       'linear-gradient(135deg,#e65100,#f57c00)',
  attendance:    'linear-gradient(135deg,#00838f,#0097a7)',
  timetable:     'linear-gradient(135deg,#4527a0,#5e35b1)',
  homework:      'linear-gradient(135deg,#c62828,#e53935)',
  exams:         'linear-gradient(135deg,#6a1b9a,#8e24aa)',
  marks:         'linear-gradient(135deg,#0277bd,#039be5)',
  finance:       'linear-gradient(135deg,#2e7d32,#66bb6a)',
  announcements: 'linear-gradient(135deg,#e65100,#ff7043)',
  reports:       'linear-gradient(135deg,#37474f,#546e7a)',
  settings:      'linear-gradient(135deg,#455a64,#607d8b)',
}

const features = computed(() => [
  { id:'students',      icon:'👥',  label: t('nav.students'),      path:'/students',      color: featureColors.students      },
  { id:'teachers',      icon:'👩‍🏫', label: t('nav.teachers'),      path:'/teachers',      color: featureColors.teachers      },
  { id:'classes',       icon:'🏫',  label: t('nav.classes'),       path:'/classes',       color: featureColors.classes       },
  { id:'attendance',    icon:'✅',  label: t('nav.attendance'),    path:'/attendance',    color: featureColors.attendance    },
  { id:'timetable',     icon:'📚',  label: t('nav.timetable'),     path:'/classes',       color: featureColors.timetable     },
  { id:'homework',      icon:'📝',  label: t('nav.homework'),      path:'/homework',      color: featureColors.homework      },
  { id:'exams',         icon:'📊',  label: t('nav.exams'),         path:'/exams',         color: featureColors.exams         },
  { id:'marks',         icon:'📈',  label: t('nav.marks'),         path:'/exams',         color: featureColors.marks         },
  { id:'finance',       icon:'💳',  label: t('nav.finance'),       path:'/finance',       color: featureColors.finance       },
  { id:'announcements', icon:'📢',  label: t('nav.announcements'), path:'/communication', color: featureColors.announcements },
  { id:'reports',       icon:'📄',  label: t('nav.reports'),       path:'/reports',       color: featureColors.reports       },
  { id:'settings',      icon:'⚙️',  label: t('nav.settings'),      path:'/settings',      color: featureColors.settings      },
])
</script>

<style scoped>
/* ── Header ── */
.dashboard-header {
  background: linear-gradient(135deg,#1565c0 0%,#1976d2 40%,#0288d1 100%);
  background-size: 300% 300%;
  animation: gradientShift 8s ease infinite;
  box-shadow: 0 4px 24px rgba(21,101,192,.45);
}
@keyframes gradientShift {
  0%,100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

.header-bar {
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 14px 4px; height:56px;
}

.header-left  { display:flex; align-items:center; gap:10px; }
.header-right { display:flex; align-items:center; gap:8px; }

.menu-btn { --color:white; --padding-start:0; --padding-end:0; margin:0; }

.brand { display:flex; align-items:center; gap:8px; }
.brand-logo { display:flex; align-items:center; animation: float 4s ease-in-out infinite; }
.brand-text { display:flex; flex-direction:column; line-height:1.15; }
.brand-name { font-size:17px; font-weight:800; color:white; letter-spacing:.8px; text-shadow:0 1px 4px rgba(0,0,0,.2); }
.brand-sub  { font-size:10px; color:rgba(255,255,255,.65); font-weight:400; }

@keyframes float {
  0%,100% { transform:translateY(0); }
  50%      { transform:translateY(-3px); }
}

/* Lang */
.lang-btn {
  display:flex; align-items:center; gap:4px; padding:5px 9px;
  background:rgba(255,255,255,.18); border:1px solid rgba(255,255,255,.3);
  border-radius:20px; color:white; font-size:11px; font-weight:700;
  cursor:pointer; transition:background .2s;
}
.lang-btn:active { background:rgba(255,255,255,.3); transform:scale(.95); }
.lang-flag { font-size:12px; font-weight:800; color:rgba(255,255,255,.85); }

/* Bell */
.icon-btn {
  position:relative; display:flex; align-items:center; justify-content:center;
  width:36px; height:36px; background:rgba(255,255,255,.18);
  border:1px solid rgba(255,255,255,.25); border-radius:50%;
  cursor:pointer; padding:0; transition:all .2s;
}
.icon-btn:active { background:rgba(255,255,255,.3); transform:scale(.92); }

.notif-dot {
  position:absolute; top:6px; right:7px; width:8px; height:8px;
  background:#ff5252; border-radius:50%; border:1.5px solid #1976d2;
}
@keyframes notifPulse {
  0%,100% { box-shadow:0 0 0 0 rgba(255,82,82,.6); }
  50%      { box-shadow:0 0 0 5px rgba(255,82,82,0); }
}
.notif-pulse { animation: notifPulse 2s ease-in-out infinite; }

/* Avatar */
.avatar {
  width:36px; height:36px; border-radius:50%;
  background:linear-gradient(135deg,#ffffff,#e3f2fd);
  color:#1565c0; font-size:15px; font-weight:800;
  display:flex; align-items:center; justify-content:center;
  border:2px solid rgba(255,255,255,.5); cursor:pointer;
  transition:transform .15s, box-shadow .15s;
}
.avatar:active { transform:scale(.9); }

/* Dropdown */
.profile-dropdown {
  position:fixed; top:70px; right:12px; z-index:2000;
  background:white; border-radius:14px;
  box-shadow:0 8px 32px rgba(0,0,0,.18); min-width:200px;
  overflow:hidden; border:1px solid rgba(0,0,0,.06);
}
.profile-dropdown-user   { display:flex; align-items:center; gap:10px; padding:14px 16px; background:#f0f5ff; }
.profile-dropdown-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; font-size:16px; font-weight:800; display:flex; align-items:center; justify-content:center; }
.profile-dropdown-name   { font-size:13px; font-weight:700; color:#1f2937; }
.profile-dropdown-role   { font-size:11px; color:#6b7280; margin-top:1px; }
.profile-dropdown-divider { height:1px; background:#f3f4f6; }
.profile-dropdown-item   { display:flex; align-items:center; gap:10px; width:100%; padding:13px 16px; background:none; border:none; font-size:13px; font-weight:500; color:#374151; cursor:pointer; transition:background .15s; text-align:left; }
.profile-dropdown-item:active { background:#f3f4f6; }
.profile-dropdown-logout { color:#ef4444; }
.profile-dropdown-logout:active { background:#fff5f5; }
.dropdown-backdrop       { position:fixed; inset:0; z-index:1999; }
.dropdown-enter-active   { transition:all .18s ease-out; }
.dropdown-leave-active   { transition:all .14s ease-in; }
.dropdown-enter-from,.dropdown-leave-to { opacity:0; transform:translateY(-8px) scale(.97); }

/* Greeting */
.header-greeting { display:flex; align-items:baseline; justify-content:space-between; padding:4px 16px 14px; }
.greeting-text   { font-size:13px; color:rgba(255,255,255,.9); }
.greeting-text strong { font-weight:700; color:white; }
.greeting-role   { font-size:10px; color:rgba(255,255,255,.65); background:rgba(255,255,255,.15); padding:2px 8px; border-radius:10px; }

/* ── Body ── */
.dash-body { padding:16px; background:#f5f7fa; }

/* Quick Nav */
.quick-nav-card {
  background:white; border-radius:18px;
  box-shadow:0 2px 16px rgba(0,0,0,.07); padding:14px 8px;
  margin-bottom:16px; border:1px solid rgba(0,123,255,.06);
}
.quick-nav-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:4px; }

.quick-item {
  display:flex; flex-direction:column; align-items:center; gap:7px;
  padding:10px 6px; border:none; background:transparent; cursor:pointer;
  border-radius:14px; transition:all .2s;
}
.quick-item:active { background:#f0f5ff; }

.quick-circle {
  width:52px; height:52px; border-radius:50%;
  background:linear-gradient(135deg,#3b82f6,#1976d2);
  display:flex; align-items:center; justify-content:center;
  font-size:24px; box-shadow:0 4px 14px rgba(25,118,210,.35);
  transition:transform .2s, box-shadow .2s;
}
.quick-item:active .quick-circle {
  transform:scale(.92);
  box-shadow:0 2px 8px rgba(25,118,210,.2);
}

.quick-label { font-size:10px; font-weight:700; color:#374151; text-align:center; line-height:1.2; max-width:58px; }

/* Stats row */
.stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:16px; }

.stat-pill {
  border-radius:14px; padding:12px 6px; text-align:center;
  cursor:pointer; transition:transform .18s, box-shadow .18s;
  box-shadow:0 3px 12px rgba(0,0,0,.12);
}
.stat-pill:active { transform:scale(.93); }

.stat-pill-icon { font-size:18px; margin-bottom:3px; }
.stat-pill-num  { font-size:20px; font-weight:800; color:white; line-height:1; animation:countUp .6s cubic-bezier(.22,1,.36,1) both; }
.stat-pill-lbl  { font-size:9px; font-weight:600; color:rgba(255,255,255,.8); margin-top:2px; text-transform:uppercase; letter-spacing:.3px; }

@keyframes countUp {
  from { opacity:0; transform:translateY(6px); }
  to   { opacity:1; transform:translateY(0); }
}

/* Section head */
.section-head  { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.section-title { font-size:12px; font-weight:800; color:#6b7280; text-transform:uppercase; letter-spacing:.6px; }

/* Features grid */
.features-grid {
  display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:16px;
}

.feature-item {
  display:flex; flex-direction:column; align-items:center; gap:7px;
  padding:12px 6px; border:none; background:white; cursor:pointer;
  border-radius:14px; transition:all .2s;
  box-shadow:0 2px 8px rgba(0,0,0,.06);
}
.feature-item:active { transform:scale(.94); box-shadow:0 1px 4px rgba(0,0,0,.08); }

.feature-icon-wrap {
  width:42px; height:42px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  transition:transform .2s;
  box-shadow:0 3px 10px rgba(0,0,0,.15);
}
.feature-item:active .feature-icon-wrap { transform:scale(.9); }

.feature-icon  { font-size:21px; }
.feature-label { font-size:10px; font-weight:600; color:#374151; text-align:center; line-height:1.2; max-width:56px; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }

/* Today card */
.today-card {
  background:white; border-radius:18px;
  box-shadow:0 2px 14px rgba(0,0,0,.07); padding:16px;
}
.today-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.today-title { font-size:13px; font-weight:700; color:#1f2937; }
.today-badge { font-size:10px; font-weight:700; background:#dbeafe; color:#1d4ed8; padding:3px 10px; border-radius:20px; }

.today-stats { display:grid; grid-template-columns:1fr auto 1fr auto 1fr auto 1fr; align-items:center; }
.today-stat  { text-align:center; padding:4px 0; }
.ts-num      { display:block; font-size:22px; font-weight:800; line-height:1; }
.ts-lbl      { display:block; font-size:10px; font-weight:600; color:#9ca3af; margin-top:3px; }
.ts-blue     { color:#1976d2; }
.ts-green    { color:#2e7d32; }
.ts-orange   { color:#e65100; }
.ts-purple   { color:#6a1b9a; }
.ts-div      { width:1px; height:36px; background:#f3f4f6; }

/* Press-lift (global util in animations.css, re-declared for buttons) */
.press-lift { transition:transform .15s cubic-bezier(.22,1,.36,1), box-shadow .15s ease; cursor:pointer; }
.press-lift:active { transform:scale(.94) translateY(1px); }

/* Ripple */
.ripple-wrap { position:relative; overflow:hidden; }
.ripple-wrap::after {
  content:''; position:absolute; inset:0;
  background:radial-gradient(circle, rgba(255,255,255,.35) 0%, transparent 70%);
  transform:scale(0); opacity:0; transition:transform .4s, opacity .4s;
}
.ripple-wrap:active::after { transform:scale(3); opacity:1; transition:0s; }
</style>
