<template>
  <ion-page style="--background:#f5f7fa">
    <!-- ── Header ── -->
    <ion-header class="dashboard-header">
      <div class="header-bar">
        <div class="header-left">
          <ion-menu-button class="menu-btn" />
          <div class="brand anim-fade-in">
            <div class="brand-logo">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <rect
                  width="28"
                  height="28"
                  rx="8"
                  fill="rgba(255,255,255,0.22)"
                />
                <path
                  d="M7 20L14 8L21 20"
                  stroke="white"
                  stroke-width="2.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.5 16H18.5"
                  stroke="white"
                  stroke-width="2.3"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">{{ t('app.title') }}</span>
              <span class="brand-sub">School Management</span>
            </div>
          </div>
        </div>

        <div class="header-right">
          <button
            class="lang-btn ripple-wrap"
            @click="toggleLanguage"
          >
            <img
              class="lang-flag"
              :src="`https://flagcdn.com/20x15/${currentLang === 'km' ? 'kh' : 'gb'}.png`"
              :alt="currentLangCode"
              width="20"
              height="15"
            >
            <span class="lang-code">{{ currentLangCode }}</span>
          </button>

          <button
            class="icon-btn anim-bell"
            @click="router.push('/communication')"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.73 21a2 2 0 0 1-3.46 0"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <span class="notif-dot notif-pulse" />
          </button>

          <div
            class="avatar press-lift"
            @click="toggleProfileMenu"
          >
            {{ userInitial }}
          </div>
        </div>
      </div>

      <!-- Greeting -->
      <div
        class="header-greeting anim-fade-up"
        style="animation-delay:.1s"
      >
        <span class="greeting-text">{{ greetingEmoji }} {{ t('dashboard.welcome') }}, <strong>{{ userName }}</strong></span>
        <span class="greeting-role">{{ getRoleLabel(user?.role) }}</span>
      </div>
    </ion-header>

    <!-- Profile dropdown -->
    <transition name="dropdown">
      <div
        v-if="showProfileMenu"
        class="profile-dropdown"
      >
        <div class="profile-dropdown-user">
          <div class="profile-dropdown-avatar">
            {{ userInitial }}
          </div>
          <div>
            <div class="profile-dropdown-name">
              {{ userName }}
            </div>
            <div class="profile-dropdown-role">
              {{ getRoleLabel(user?.role) }}
            </div>
          </div>
        </div>
        <div class="profile-dropdown-divider" />
        <button
          class="profile-dropdown-item"
          @click="goToProfile"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          ><circle
            cx="12"
            cy="8"
            r="4"
            stroke="currentColor"
            stroke-width="2"
          /><path
            d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          /></svg>
          Profile
        </button>
        <button
          class="profile-dropdown-item profile-dropdown-logout"
          @click="handleLogout"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          ><path
            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          /><polyline
            points="16 17 21 12 16 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          /><line
            x1="21"
            y1="12"
            x2="9"
            y2="12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          /></svg>
          {{ t('nav.logout') }}
        </button>
      </div>
    </transition>
    <div
      v-if="showProfileMenu"
      class="dropdown-backdrop"
      @click="showProfileMenu = false"
    />

    <!-- ── Content ── -->
    <ion-content style="--background:#f5f7fa">
      <div class="dash-body">
        <!-- Search -->
        <div
          class="search-wrap anim-fade-up"
          style="animation-delay:.12s"
        >
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            class="search-input"
            :placeholder="t('dashboard.searchModules')"
          >
        </div>

        <!-- Categorized modules -->
        <template v-if="!searchQuery">
          <div
            v-for="cat in moduleCategories"
            :key="cat.key"
            class="anim-fade-up"
            style="animation-delay:.16s"
          >
            <div class="cat-head">
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-title">{{ cat.label }}</span>
            </div>
            <div class="module-grid">
              <button
                v-for="mod in cat.modules"
                :key="mod.id"
                class="mod-item press-lift"
                @click="navigate(mod.path)"
              >
                <div
                  class="mod-icon-wrap"
                  :style="{ background: mod.color }"
                >
                  <span class="mod-icon">{{ mod.icon }}</span>
                </div>
                <span class="mod-label">{{ mod.label }}</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Search results -->
        <template v-else>
          <div class="cat-head">
            <span class="cat-icon">🔍</span>
            <span class="cat-title">{{ searchResults.length }} {{ t('dashboard.modules').toLowerCase() }}</span>
          </div>
          <div class="module-grid">
            <button
              v-for="mod in searchResults"
              :key="mod.id"
              class="mod-item press-lift"
              @click="navigate(mod.path)"
            >
              <div
                class="mod-icon-wrap"
                :style="{ background: mod.color }"
              >
                <span class="mod-icon">{{ mod.icon }}</span>
              </div>
              <span class="mod-label">{{ mod.label }}</span>
            </button>
          </div>
        </template>

        <!-- Today card -->
        <div
          class="today-card anim-fade-up"
          style="animation-delay:.24s"
        >
          <div class="today-head">
            <span class="today-title">📅 {{ todayLabel }}</span>
            <span class="today-badge">{{ t('reports.today') }}</span>
          </div>
          <div class="today-stats">
            <div class="today-stat">
              <span class="ts-num ts-blue">{{ liveData.students }}</span>
              <span class="ts-lbl">{{ t('nav.students') }}</span>
            </div>
            <div class="ts-div" />
            <div class="today-stat">
              <span class="ts-num ts-green">{{ liveData.teachers }}</span>
              <span class="ts-lbl">{{ t('nav.teachers') }}</span>
            </div>
            <div class="ts-div" />
            <div class="today-stat">
              <span class="ts-num ts-orange">{{ liveData.classes }}</span>
              <span class="ts-lbl">{{ t('nav.classes') }}</span>
            </div>
            <div class="ts-div" />
            <div class="today-stat">
              <span class="ts-num ts-purple">{{ liveData.homework }}</span>
              <span class="ts-lbl">{{ t('nav.homework') }}</span>
            </div>
          </div>
        </div>

        <div style="height:24px" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {IonPage, IonHeader, IonContent, IonMenuButton} from '@ionic/vue';
import {useRouter} from 'vue-router';
import {useAuth} from '@/stores/auth';
import {useI18nStore} from '@/stores/i18n';
import {useI18n} from '@/composables/useI18n';
import {LocalStorageService} from '@/services/localStorageService';

const router = useRouter();
const authStore = useAuth();
const i18nStore = useI18nStore();
const {t} = useI18n();

const currentLang = computed(() => i18nStore.locale);
const currentLangCode = computed(() => currentLang.value === 'km' ? 'KM' : 'EN');
function toggleLanguage() { i18nStore.setLocale(currentLang.value === 'km' ? 'en' : 'km'); }

const user = computed(() => authStore.user);
const userName = computed(() => user.value?.name || user.value?.email?.split('@')[0] || 'User');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());
const userRole = computed(() => user.value?.role || '');

const showProfileMenu = ref(false);
const searchQuery = ref('');

function toggleProfileMenu() { showProfileMenu.value = !showProfileMenu.value; }
function goToProfile() { showProfileMenu.value = false; router.push('/profile'); }
function handleLogout() { showProfileMenu.value = false; authStore.logout(); router.replace('/login').catch(() => { window.location.replace('/login'); }); }
function navigate(path: string) { router.push(path); }

function getRoleLabel(role?: string) { return role ? (t(`roles.${role}`) || role) : 'User'; }

const greetingEmoji = computed(() => {
  const h = new Date().getHours();
  if (h < 12) return '🌅';
  if (h < 17) return '☀️';
  return '🌙';
});

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

const todayLabel = computed(() => {
  const now = new Date();
  const day = t(`dates.${DAY_KEYS[now.getDay()]}`);
  const mon = t(`dates.${MONTH_KEYS[now.getMonth()]}`);
  return `${day}, ${mon} ${now.getDate()}`;
});

const liveData = computed(() => ({
  students: (LocalStorageService.get<any[]>('students', []) || []).length,
  teachers: (LocalStorageService.get<any[]>('teachers', []) || []).length,
  classes: (LocalStorageService.get<any[]>('classes', []) || []).length,
  homework: (LocalStorageService.get<any[]>('homework', []) || []).length,
}));

const C: Record<string, string> = {
  students: 'linear-gradient(135deg,#1565c0,#1976d2)',
  teachers: 'linear-gradient(135deg,#2e7d32,#43a047)',
  classes: 'linear-gradient(135deg,#e65100,#f57c00)',
  subjects: 'linear-gradient(135deg,#00838f,#0097a7)',
  attendance: 'linear-gradient(135deg,#1565c0,#29b6f6)',
  timetable: 'linear-gradient(135deg,#4527a0,#7e57c2)',
  homework: 'linear-gradient(135deg,#c62828,#e53935)',
  exams: 'linear-gradient(135deg,#6a1b9a,#ab47bc)',
  library: 'linear-gradient(135deg,#558b2f,#8bc34a)',
  reports: 'linear-gradient(135deg,#37474f,#78909c)',
  finance: 'linear-gradient(135deg,#2e7d32,#66bb6a)',
  communication: 'linear-gradient(135deg,#e65100,#ff7043)',
  calendar: 'linear-gradient(135deg,#0277bd,#039be5)',
  parents: 'linear-gradient(135deg,#c62828,#ef9a9a)',
  roles: 'linear-gradient(135deg,#4a148c,#7b1fa2)',
  approvals: 'linear-gradient(135deg,#e65100,#ffa726)',
  settings: 'linear-gradient(135deg,#455a64,#607d8b)',
};

const moduleCategories = computed(() => {
  const isAdmin = ['super_admin', 'school_admin'].includes(userRole.value);
  const isSuperAdmin = userRole.value === 'super_admin';
  return [
    {
      key: 'academic', icon: '📚', label: t('dashboard.catAcademic'),
      modules: [
        {id: 'students', icon: '👥', label: t('nav.students'), path: '/students', color: C.students},
        {id: 'teachers', icon: '👩‍🏫', label: t('nav.teachers'), path: '/teachers', color: C.teachers},
        {id: 'classes', icon: '🏫', label: t('nav.classes'), path: '/classes', color: C.classes},
        {id: 'subjects', icon: '📖', label: t('nav.subjects'), path: '/subjects', color: C.subjects},
        {id: 'attendance', icon: '✅', label: t('nav.attendance'), path: '/attendance', color: C.attendance},
        {id: 'timetable', icon: '🗓️', label: t('nav.timetable'), path: '/timetable', color: C.timetable},
      ]
    },
    {
      key: 'learning', icon: '🎓', label: t('dashboard.catLearning'),
      modules: [
        {id: 'homework', icon: '📝', label: t('nav.homework'), path: '/homework', color: C.homework},
        {id: 'exams', icon: '📊', label: t('nav.exams'), path: '/exams', color: C.exams},
        {id: 'library', icon: '📚', label: t('nav.library'), path: '/library', color: C.library},
        {id: 'reports', icon: '📄', label: t('nav.reports'), path: '/reports', color: C.reports},
      ]
    },
    {
      key: 'admin', icon: '🏢', label: t('dashboard.catAdmin'),
      modules: [
        {id: 'finance', icon: '💳', label: t('nav.finance'), path: '/finance', color: C.finance},
        {id: 'communication', icon: '📢', label: t('nav.announcements'), path: '/communication', color: C.communication},
        {id: 'calendar', icon: '📅', label: t('nav.calendar'), path: '/calendar', color: C.calendar},
        {id: 'parents', icon: '👨‍👩‍👧', label: t('nav.parents'), path: '/parents', color: C.parents},
      ]
    },
    ...(isAdmin ? [{
      key: 'system', icon: '⚙️', label: t('dashboard.catSystem'),
      modules: [
        {id: 'roles', icon: '🛡️', label: t('nav.roles'), path: '/roles', color: C.roles},
        ...(isSuperAdmin ? [{id: 'approvals', icon: '🏫', label: t('nav.approvals'), path: '/school-approvals', color: C.approvals}] : []),
        {id: 'settings', icon: '⚙️', label: t('nav.settings'), path: '/settings', color: C.settings},
      ]
    }] : [{
      key: 'settings-only', icon: '⚙️', label: t('dashboard.catSystem'),
      modules: [{id: 'settings', icon: '⚙️', label: t('nav.settings'), path: '/settings', color: C.settings}]
    }])
  ];
});

const allModules = computed(() => moduleCategories.value.flatMap(c => c.modules));
const searchResults = computed(() => {
  if (!searchQuery.value) return [];
  const q = searchQuery.value.toLowerCase();
  return allModules.value.filter(m => m.label.toLowerCase().includes(q));
});
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

.brand      { display:flex; align-items:center; gap:8px; }
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
.lang-btn:active  { background:rgba(255,255,255,.3); transform:scale(.95); }
.lang-flag        { width:20px; height:15px; border-radius:3px; object-fit:cover; flex-shrink:0; }

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
.dropdown-backdrop     { position:fixed; inset:0; z-index:1999; }
.dropdown-enter-active { transition:all .18s ease-out; }
.dropdown-leave-active { transition:all .14s ease-in; }
.dropdown-enter-from,.dropdown-leave-to { opacity:0; transform:translateY(-8px) scale(.97); }

/* Greeting */
.header-greeting { display:flex; align-items:baseline; justify-content:space-between; padding:4px 16px 14px; }
.greeting-text   { font-size:13px; color:rgba(255,255,255,.9); }
.greeting-text strong { font-weight:700; color:white; }
.greeting-role   { font-size:10px; color:rgba(255,255,255,.65); background:rgba(255,255,255,.15); padding:2px 8px; border-radius:10px; }

/* ── Body ── */
.dash-body { padding:14px; background:#f5f7fa; }

/* Search */
.search-wrap {
  display:flex; align-items:center; gap:8px; background:white;
  border-radius:12px; padding:10px 14px; margin-bottom:14px;
  box-shadow:0 1px 6px rgba(0,0,0,.06); border:1.5px solid #f3f4f6;
}
.search-wrap:focus-within { border-color:#1976d2; }
.search-icon  { font-size:16px; flex-shrink:0; }
.search-input { flex:1; border:none; outline:none; font-size:14px; color:#1f2937; background:transparent; }
.search-input::placeholder { color:#9ca3af; }

/* Category header */
.cat-head  { display:flex; align-items:center; gap:6px; margin-bottom:10px; margin-top:4px; }
.cat-icon  { font-size:16px; }
.cat-title { font-size:12px; font-weight:800; color:#374151; text-transform:uppercase; letter-spacing:.7px; }

/* Module grid */
.module-grid {
  display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:18px;
}
.mod-item {
  display:flex; flex-direction:column; align-items:center; gap:7px;
  padding:12px 6px; border:none; background:white; cursor:pointer;
  border-radius:14px; box-shadow:0 2px 8px rgba(0,0,0,.06);
  border:1px solid #f3f4f6; transition:transform .15s, box-shadow .15s;
}
.mod-item:active { transform:scale(.93); box-shadow:0 1px 4px rgba(0,0,0,.06); }
.mod-icon-wrap {
  width:42px; height:42px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  font-size:21px; box-shadow:0 3px 10px rgba(0,0,0,.18);
  transition:transform .15s;
}
.mod-item:active .mod-icon-wrap { transform:scale(.9); }
.mod-icon  { font-size:21px; }
.mod-label { font-size:10px; font-weight:600; color:#374151; text-align:center; line-height:1.2; max-width:58px; }

/* Today card */
.today-card  { background:white; border-radius:18px; box-shadow:0 2px 14px rgba(0,0,0,.07); padding:16px; }
.today-head  { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.today-title { font-size:13px; font-weight:700; color:#1f2937; }
.today-badge { font-size:10px; font-weight:700; background:#dbeafe; color:#1d4ed8; padding:3px 10px; border-radius:20px; }
.today-stats { display:grid; grid-template-columns:1fr auto 1fr auto 1fr auto 1fr; align-items:center; }
.today-stat  { text-align:center; padding:4px 0; }
.ts-num  { display:block; font-size:22px; font-weight:800; line-height:1; }
.ts-lbl  { display:block; font-size:10px; font-weight:600; color:#9ca3af; margin-top:3px; }
.ts-blue   { color:#1976d2; }
.ts-green  { color:#2e7d32; }
.ts-orange { color:#e65100; }
.ts-purple { color:#6a1b9a; }
.ts-div  { width:1px; height:36px; background:#f3f4f6; }

.press-lift { transition:transform .15s cubic-bezier(.22,1,.36,1), box-shadow .15s; cursor:pointer; }
.press-lift:active { transform:scale(.94) translateY(1px); }
</style>
