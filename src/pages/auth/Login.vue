<template>
  <ion-page>
    <ion-content :fullscreen="true" style="--background:transparent">

      <!-- Animated background -->
      <div class="bg-wrap">
        <div class="bg-orb orb1"></div>
        <div class="bg-orb orb2"></div>
        <div class="bg-orb orb3"></div>
      </div>

      <div class="page-center">
        <!-- Logo -->
        <div class="logo-wrap">
          <div class="logo-icon">🎓</div>
          <h1 class="logo-title">techocam</h1>
          <p class="logo-sub">School Management System</p>
        </div>

        <!-- Login Card -->
        <div class="card">

          <div class="card-head">
            <div class="card-head-icon">👋</div>
            <div>
              <div class="card-head-title">Welcome back</div>
              <div class="card-head-sub">Sign in to your account</div>
            </div>
          </div>

          <form @submit.prevent="handleLogin">

            <!-- Email / Login Code -->
            <div class="field">
              <label class="field-label">Email or Login Code</label>
              <div class="field-wrap">
                <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input
                  v-model="email"
                  class="field-input"
                  placeholder="you@school.com or TCH-2024-001"
                  autocomplete="username"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div class="field">
              <label class="field-label">Password</label>
              <div class="field-wrap">
                <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <button type="button" class="field-eye" @click="showPassword = !showPassword" tabindex="-1">
                  <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- School Code -->
            <div class="field">
              <label class="field-label">School Code</label>
              <div class="field-wrap">
                <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input
                  v-model="schoolCode"
                  class="field-input"
                  placeholder="e.g. SCHOOL001"
                  autocomplete="off"
                  required
                />
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="error-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
              {{ error }}
            </div>

            <!-- Submit -->
            <button type="submit" class="btn-login" :disabled="loading">
              <span class="btn-login-inner">
                <span v-if="loading" class="spinner"></span>
                <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="white" stroke-width="2.2" stroke-linecap="round"/><polyline points="10 17 15 12 10 7" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><line x1="15" y1="12" x2="3" y2="12" stroke="white" stroke-width="2.2" stroke-linecap="round"/></svg>
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </span>
            </button>

          </form>

          <!-- Divider -->
          <div class="divider"><span>Quick test login</span></div>

          <!-- Test account chips -->
          <div class="chips">
            <button
              v-for="acc in testAccounts"
              :key="acc.email"
              class="chip"
              :style="{ '--chip-color': acc.color }"
              type="button"
              @click="fillCredentials(acc.email)"
            >
              <span class="chip-icon">{{ acc.icon }}</span>
              <span class="chip-label">{{ acc.label }}</span>
            </button>
          </div>

          <div class="hint">Password: <strong>test123</strong> · Code: <strong>SCHOOL001</strong></div>

          <button class="register-link" type="button" @click="router.push('/school-register')">
            🏫 Register your school
          </button>
        </div>

        <div class="footer-note">© 2026 techocam · School Management System</div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent } from '@ionic/vue'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const authStore = useAuth()

const email        = ref('')
const password     = ref('')
const schoolCode   = ref('')
const loading      = ref(false)
const error        = ref('')
const showPassword = ref(false)

const testAccounts = [
  { email: 'superadmin@school.com', label: 'Super Admin', icon: '👑', color: '#7c3aed', role: 'super_admin',  name: 'Super Administrator' },
  { email: 'admin@school.com',      label: 'Admin',       icon: '🏫', color: '#1565c0', role: 'school_admin', name: 'School Administrator' },
  { email: 'teacher@school.com',    label: 'Teacher',     icon: '👩‍🏫', color: '#2e7d32', role: 'teacher',      name: 'John Teacher' },
  { email: 'student@school.com',    label: 'Student',     icon: '🎒', color: '#e65100', role: 'student',      name: 'Jane Student' },
  { email: 'parent@school.com',     label: 'Parent',      icon: '👨‍👩‍👧', color: '#c62828', role: 'parent',       name: 'Parent User' },
  { email: 'accountant@school.com', label: 'Accountant',  icon: '💰', color: '#00838f', role: 'school_admin', name: 'Finance Accountant' },
]

const roleMap: Record<string, string> = {
  superadmin:   'super_admin',
  admin:        'school_admin',
  vp:           'school_admin',
  teacher:      'teacher',
  student:      'student',
  parent:       'parent',
  accountant:   'school_admin',
  librarian:    'school_admin',
  receptionist: 'school_admin',
  security:     'school_admin',
}

const validEmails = [
  'superadmin@school.com', 'admin@school.com', 'vp@school.com',
  'teacher@school.com', 'student@school.com', 'parent@school.com',
  'accountant@school.com', 'librarian@school.com', 'receptionist@school.com', 'security@school.com',
]

function fillCredentials(acc: string) {
  email.value      = acc
  password.value   = 'test123'
  schoolCode.value = 'SCHOOL001'
  error.value      = ''
}

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value || !schoolCode.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  loading.value = true
  await new Promise(r => setTimeout(r, 800))

  try {
    // ── Check stored users (teachers/students with login codes) ──
    const storedTeachers: any[] = JSON.parse(localStorage.getItem('teachers') || '[]')
    const storedStudents: any[] = JSON.parse(localStorage.getItem('students') || '[]')
    const allStoredUsers = [...storedTeachers, ...storedStudents]

    const storedMatch = allStoredUsers.find(u =>
      (u.loginCode && u.loginCode === email.value) ||
      (u.email && u.email === email.value)
    )

    if (storedMatch && storedMatch.loginPassword === password.value) {
      authStore.setAuth(`token_${Date.now()}`, {
        id: storedMatch.id,
        schoolId: storedMatch.schoolId || 'school_1',
        email: storedMatch.email || storedMatch.loginCode,
        name: storedMatch.name,
        role: storedMatch.role || (storedMatch.loginCode?.startsWith('TCH') ? 'teacher' : 'student'),
        loginCode: storedMatch.loginCode,
        mustChangePassword: storedMatch.mustChangePassword ?? false,
      })
      if (storedMatch.mustChangePassword) {
        router.push('/change-password')
      } else {
        router.push('/dashboard')
      }
      return
    }

    // ── Check hardcoded test accounts ──
    if (validEmails.includes(email.value) && password.value === 'test123' && schoolCode.value === 'SCHOOL001') {
      const prefix  = email.value.split('@')[0].toLowerCase()
      const matched = testAccounts.find(a => a.email === email.value)
      const role    = matched?.role || roleMap[prefix] || 'school_admin'
      const name    = matched?.name || prefix.charAt(0).toUpperCase() + prefix.slice(1) + ' User'

      authStore.setAuth(`token_${Date.now()}`, {
        id: `user_${prefix}`,
        schoolId: 'school_1',
        email: email.value,
        name,
        role: role as any,
      })
      router.push('/dashboard')
    } else {
      error.value = 'Invalid credentials. Try a quick login below or check your details.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Background ─────────────────────────────── */
ion-page { --ion-background-color: #0f172a; }

.bg-wrap {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%);
  overflow: hidden;
  z-index: 0;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: .42;
  animation: orbDrift 12s ease-in-out infinite alternate;
}
.orb1 { width:420px; height:420px; background:#3730a3; top:-120px; left:-100px; animation-delay:0s; }
.orb2 { width:320px; height:320px; background:#1d4ed8; bottom:-80px; right:-60px; animation-delay:-4s; }
.orb3 { width:260px; height:260px; background:#7c3aed; top:45%; left:55%; animation-delay:-8s; }

@keyframes orbDrift {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(30px,20px) scale(1.08); }
}

/* ── Layout ─────────────────────────────────── */
.page-center {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 32px;
  animation: pageIn .55s ease both;
}

@keyframes pageIn {
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:none; }
}

/* ── Logo ────────────────────────────────────── */
.logo-wrap { text-align:center; margin-bottom:28px; }

.logo-icon {
  font-size: 58px;
  display: inline-block;
  filter: drop-shadow(0 4px 18px rgba(99,102,241,.65));
  animation: logoFloat 3.5s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes logoFloat {
  0%,100% { transform:translateY(0); }
  50%     { transform:translateY(-10px); }
}

.logo-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 1.5px;
  background: linear-gradient(90deg, #a78bfa, #60a5fa, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.logo-sub { font-size:13px; color:rgba(255,255,255,.45); letter-spacing:.4px; }

/* ── Card ────────────────────────────────────── */
.card {
  width: 100%;
  max-width: 400px;
  background: rgba(255,255,255,.07);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,.13);
  border-radius: 24px;
  padding: 28px 24px 22px;
  box-shadow: 0 24px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04);
  animation: cardIn .6s .1s ease both;
}

@keyframes cardIn {
  from { opacity:0; transform:translateY(28px) scale(.97); }
  to   { opacity:1; transform:none; }
}

/* ── Card header ─────────────────────────────── */
.card-head { display:flex; align-items:center; gap:12px; margin-bottom:24px; }
.card-head-icon { font-size:32px; line-height:1; }
.card-head-title { font-size:18px; font-weight:700; color:white; }
.card-head-sub { font-size:13px; color:rgba(255,255,255,.45); margin-top:1px; }

/* ── Fields ──────────────────────────────────── */
.field {
  margin-bottom: 16px;
  animation: fadeUp .4s ease both;
}
.field:nth-child(1){animation-delay:.15s}
.field:nth-child(2){animation-delay:.22s}
.field:nth-child(3){animation-delay:.29s}

@keyframes fadeUp {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:none; }
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,.55);
  text-transform: uppercase;
  letter-spacing: .6px;
  margin-bottom: 7px;
}

.field-wrap { position:relative; display:flex; align-items:center; }

.field-icon {
  position: absolute;
  left: 13px;
  color: rgba(255,255,255,.35);
  pointer-events: none;
}

.field-input {
  width: 100%;
  padding: 12px 42px 12px 40px;
  background: rgba(255,255,255,.08);
  border: 1.5px solid rgba(255,255,255,.12);
  border-radius: 12px;
  font-size: 14px;
  color: white;
  outline: none;
  transition: border-color .2s, background .2s;
  box-sizing: border-box;
}
.field-input::placeholder { color:rgba(255,255,255,.28); }
.field-input:focus {
  border-color: #6366f1;
  background: rgba(99,102,241,.1);
}

.field-eye {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: rgba(255,255,255,.38);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color .2s;
}
.field-eye:hover { color:rgba(255,255,255,.75); }

/* ── Error ───────────────────────────────────── */
.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239,68,68,.15);
  border: 1px solid rgba(239,68,68,.4);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #fca5a5;
  margin-bottom: 14px;
  animation: fadeUp .3s ease;
}

/* ── Submit ──────────────────────────────────── */
.btn-login {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: transform .18s, box-shadow .18s, opacity .18s;
  box-shadow: 0 4px 24px rgba(99,102,241,.5);
  animation: fadeUp .4s .36s ease both;
}
.btn-login:not(:disabled):hover { transform:translateY(-1px); box-shadow:0 8px 32px rgba(99,102,241,.65); }
.btn-login:not(:disabled):active { transform:scale(.97); }
.btn-login:disabled { opacity:.5; cursor:not-allowed; }

.btn-login-inner { display:flex; align-items:center; justify-content:center; gap:8px; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform:rotate(360deg); } }

/* ── Divider ─────────────────────────────────── */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 14px;
  animation: fadeUp .4s .45s ease both;
}
.divider::before, .divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.1); }
.divider span { font-size:11px; color:rgba(255,255,255,.35); white-space:nowrap; font-weight:600; letter-spacing:.4px; }

/* ── Chips ───────────────────────────────────── */
.chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  animation: fadeUp .4s .5s ease both;
}

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  border-radius: 12px;
  border: 1.5px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  cursor: pointer;
  transition: background .2s, border-color .2s, transform .15s;
}
.chip:hover {
  background: color-mix(in srgb, var(--chip-color) 22%, transparent);
  border-color: var(--chip-color);
  transform: translateY(-2px);
}
.chip:active { transform:scale(.95); }

.chip-icon { font-size:20px; line-height:1; }
.chip-label { font-size:10px; font-weight:700; color:rgba(255,255,255,.65); letter-spacing:.2px; }

/* ── Hint & footer ───────────────────────────── */
.hint {
  text-align: center;
  font-size: 11px;
  color: rgba(255,255,255,.32);
  margin-top: 14px;
  animation: fadeUp .4s .55s ease both;
}
.hint strong { color:rgba(255,255,255,.58); }

.register-link {
  display: block;
  width: 100%;
  margin-top: 14px;
  padding: 10px;
  background: rgba(255,255,255,.06);
  border: 1.5px solid rgba(255,255,255,.12);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,.6);
  cursor: pointer;
  text-align: center;
  transition: background .2s, color .2s;
  animation: fadeUp .4s .6s ease both;
}
.register-link:hover { background:rgba(255,255,255,.1); color:rgba(255,255,255,.85); }

.footer-note {
  margin-top: 20px;
  font-size: 11px;
  color: rgba(255,255,255,.22);
  text-align: center;
  animation: fadeUp .4s .6s ease both;
}
</style>
