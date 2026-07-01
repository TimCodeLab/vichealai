<template>
  <ion-page>
    <ion-content :fullscreen="true" style="--background:transparent">

      <!-- Background -->
      <div class="bg-wrap">
        <div class="bg-orb orb1"></div>
        <div class="bg-orb orb2"></div>
      </div>

      <div class="page-center">

        <div class="icon-wrap">🔐</div>
        <h1 class="page-title">{{ t('changePass.title') }}</h1>
        <p class="page-sub">{{ t('changePass.subtitle') }}</p>

        <div class="card">

          <!-- User info banner (if first login) -->
          <div v-if="isFirstLogin" class="first-login-banner">
            <span class="fli-icon">⚠️</span>
            <span>{{ t('changePass.firstLoginMsg') }}</span>
          </div>

          <!-- Current credentials info -->
          <div v-if="user?.loginCode" class="code-info">
            <div class="code-label">{{ t('credentials.yourCode') }}</div>
            <div class="code-val">{{ user.loginCode }}</div>
          </div>

          <!-- Form -->
          <form @submit.prevent="submit">

            <div class="field" v-if="!isFirstLogin">
              <label class="field-label">{{ t('changePass.current') }}</label>
              <div class="field-wrap">
                <input
                  v-model="currentPwd"
                  :type="showCurrent ? 'text' : 'password'"
                  class="field-input"
                  placeholder="••••••••"
                  required
                />
                <button type="button" class="eye-btn" @click="showCurrent = !showCurrent" tabindex="-1">
                  {{ showCurrent ? '🙈' : '👁' }}
                </button>
              </div>
            </div>

            <div class="field">
              <label class="field-label">{{ t('changePass.new') }}</label>
              <div class="field-wrap">
                <input
                  v-model="newPwd"
                  :type="showNew ? 'text' : 'password'"
                  class="field-input"
                  placeholder="••••••••"
                  required
                  minlength="8"
                />
                <button type="button" class="eye-btn" @click="showNew = !showNew" tabindex="-1">
                  {{ showNew ? '🙈' : '👁' }}
                </button>
              </div>
              <!-- Strength bar -->
              <div class="strength-bar">
                <div class="sb-fill" :class="strengthClass" :style="{ width: strengthPct + '%' }"></div>
              </div>
              <div class="strength-label" :class="strengthClass">{{ strengthLabel }}</div>
            </div>

            <div class="field">
              <label class="field-label">{{ t('changePass.confirm') }}</label>
              <div class="field-wrap">
                <input
                  v-model="confirmPwd"
                  :type="showConfirm ? 'text' : 'password'"
                  class="field-input"
                  :class="{ mismatch: confirmPwd && confirmPwd !== newPwd }"
                  placeholder="••••••••"
                  required
                />
                <button type="button" class="eye-btn" @click="showConfirm = !showConfirm" tabindex="-1">
                  {{ showConfirm ? '🙈' : '👁' }}
                </button>
              </div>
              <div v-if="confirmPwd && confirmPwd !== newPwd" class="mismatch-msg">{{ t('changePass.mismatch') }}</div>
            </div>

            <div v-if="error" class="error-box">⚠ {{ error }}</div>

            <button type="submit" class="btn-submit" :disabled="loading || (confirmPwd !== newPwd)">
              <span class="btn-inner">
                <span v-if="loading" class="spinner"></span>
                <span v-else>🔐 {{ t('changePass.submit') }}</span>
              </span>
            </button>

          </form>

          <!-- Cancel (only for non-first-login) -->
          <button v-if="!isFirstLogin" class="btn-cancel" @click="router.back()">
            {{ t('actions.cancel') }}
          </button>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'

const router    = useRouter()
const authStore = useAuth()
const { t }     = useI18n()

const user = computed(() => authStore.user)

// Detect first-login scenario
const isFirstLogin = computed(() => user.value?.mustChangePassword === true)

const currentPwd  = ref('')
const newPwd      = ref('')
const confirmPwd  = ref('')
const showCurrent = ref(false)
const showNew     = ref(false)
const showConfirm = ref(false)
const error       = ref('')
const loading     = ref(false)

// ── Password strength ──
const strength = computed(() => {
  const p = newPwd.value
  if (!p) return 0
  let s = 0
  if (p.length >= 8)               s++
  if (/[A-Z]/.test(p))             s++
  if (/[0-9]/.test(p))             s++
  if (/[^A-Za-z0-9]/.test(p))     s++
  return s
})
const strengthPct = computed(() => [0,25,50,75,100][strength.value])
const strengthClass = computed(() => ['','weak','fair','good','strong'][strength.value])
const strengthLabel = computed(() => {
  return ['', t('changePass.weak'), t('changePass.fair'), t('changePass.good'), t('changePass.strong')][strength.value]
})

// ── Submit ──
async function submit() {
  error.value = ''
  if (newPwd.value.length < 8) { error.value = t('changePass.minLength'); return }
  if (newPwd.value !== confirmPwd.value) { error.value = t('changePass.mismatch'); return }

  loading.value = true
  await new Promise(r => setTimeout(r, 700))

  try {
    const u = user.value
    if (!u) return

    if (!isFirstLogin.value) {
      // Verify current password against stored data
      const storedTeachers: any[] = JSON.parse(localStorage.getItem('teachers') || '[]')
      const storedStudents: any[] = JSON.parse(localStorage.getItem('students') || '[]')
      const all = [...storedTeachers, ...storedStudents]
      const found = all.find(x => x.id === u.id)
      if (found && found.loginPassword !== currentPwd.value && currentPwd.value !== 'test123') {
        error.value = t('changePass.wrongCurrent')
        loading.value = false
        return
      }
    }

    // Update password in stored users
    for (const key of ['teachers', 'students']) {
      const arr: any[] = JSON.parse(localStorage.getItem(key) || '[]')
      const idx = arr.findIndex((x: any) => x.id === u.id)
      if (idx !== -1) {
        arr[idx].loginPassword      = newPwd.value
        arr[idx].mustChangePassword = false
        localStorage.setItem(key, JSON.stringify(arr))
      }
    }

    // Update in-session user
    const updatedUser = { ...u, mustChangePassword: false }
    authStore.setAuth(localStorage.getItem('authToken') || '', updatedUser)

    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
ion-page { --ion-background-color:#0f172a; }

.bg-wrap {
  position:fixed; inset:0;
  background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 40%,#0f172a 100%);
  overflow:hidden; z-index:0;
}
.bg-orb { position:absolute; border-radius:50%; filter:blur(80px); opacity:.42; }
.orb1   { width:360px; height:360px; background:#3730a3; top:-80px; right:-80px; }
.orb2   { width:280px; height:280px; background:#7c3aed; bottom:-60px; left:-60px; }

.page-center {
  position:relative; z-index:1; min-height:100vh;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:28px 16px;
}

.icon-wrap   { font-size:52px; margin-bottom:12px; filter:drop-shadow(0 4px 18px rgba(99,102,241,.6)); }
.page-title  { font-size:24px; font-weight:800; color:white; margin:0 0 6px; text-align:center; }
.page-sub    { font-size:13px; color:rgba(255,255,255,.45); margin:0 0 24px; text-align:center; }

.card {
  width:100%; max-width:400px;
  background:rgba(255,255,255,.07); backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,.13); border-radius:24px;
  padding:24px 22px 20px;
}

/* First-login banner */
.first-login-banner {
  display:flex; align-items:center; gap:10px;
  background:rgba(245,158,11,.15); border:1px solid rgba(245,158,11,.3);
  border-radius:12px; padding:12px 14px; font-size:13px; color:#fbbf24;
  margin-bottom:20px; font-weight:600;
}
.fli-icon { font-size:18px; flex-shrink:0; }

/* Code info */
.code-info { background:rgba(99,102,241,.15); border:1px solid rgba(99,102,241,.3); border-radius:12px; padding:12px 14px; margin-bottom:18px; text-align:center; }
.code-label { font-size:10px; font-weight:700; color:rgba(255,255,255,.45); text-transform:uppercase; letter-spacing:.6px; margin-bottom:4px; }
.code-val   { font-size:18px; font-weight:800; color:#a5b4fc; letter-spacing:1px; font-family:monospace; }

/* Fields */
.field       { margin-bottom:16px; }
.field-label { display:block; font-size:11px; font-weight:700; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:.6px; margin-bottom:7px; }
.field-wrap  { position:relative; display:flex; align-items:center; }
.field-input { width:100%; padding:12px 44px 12px 14px; background:rgba(255,255,255,.08); border:1.5px solid rgba(255,255,255,.12); border-radius:12px; font-size:14px; color:white; outline:none; box-sizing:border-box; }
.field-input::placeholder { color:rgba(255,255,255,.28); }
.field-input:focus { border-color:#6366f1; background:rgba(99,102,241,.1); }
.field-input.mismatch { border-color:#ef4444; }
.eye-btn { position:absolute; right:12px; background:none; border:none; font-size:14px; cursor:pointer; padding:4px; color:rgba(255,255,255,.5); }

/* Strength */
.strength-bar { height:3px; background:rgba(255,255,255,.1); border-radius:2px; margin-top:6px; }
.sb-fill      { height:100%; border-radius:2px; transition:width .3s, background .3s; }
.sb-fill.weak   { background:#ef4444; }
.sb-fill.fair   { background:#f59e0b; }
.sb-fill.good   { background:#3b82f6; }
.sb-fill.strong { background:#22c55e; }
.strength-label { font-size:10px; font-weight:700; margin-top:4px; }
.strength-label.weak   { color:#ef4444; }
.strength-label.fair   { color:#f59e0b; }
.strength-label.good   { color:#3b82f6; }
.strength-label.strong { color:#22c55e; }
.mismatch-msg { font-size:11px; color:#fca5a5; margin-top:4px; }

/* Error */
.error-box { background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.4); border-radius:10px; padding:10px 14px; font-size:13px; color:#fca5a5; margin-bottom:14px; }

/* Buttons */
.btn-submit {
  width:100%; padding:14px; background:linear-gradient(135deg,#4f46e5,#6366f1);
  border:none; border-radius:14px; font-size:15px; font-weight:700; color:white;
  cursor:pointer; transition:transform .18s, opacity .18s;
  box-shadow:0 4px 24px rgba(99,102,241,.4);
}
.btn-submit:not(:disabled):hover { transform:translateY(-1px); }
.btn-submit:disabled { opacity:.5; cursor:default; }
.btn-inner { display:flex; align-items:center; justify-content:center; gap:8px; }

.btn-cancel { display:block; width:100%; margin-top:12px; padding:12px; background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.1); border-radius:12px; font-size:14px; font-weight:600; color:rgba(255,255,255,.5); cursor:pointer; text-align:center; }
.btn-cancel:hover { background:rgba(255,255,255,.1); }

/* Spinner */
.spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
