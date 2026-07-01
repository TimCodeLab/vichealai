<template>
  <ion-page class="profile-page">
    <!-- Header -->
    <ion-header class="profile-header">
      <div class="profile-header-bar">
        <button
          class="back-btn"
          @click="router.back()"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="white"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <span class="header-title">{{ t('profile.title') }}</span>
        <button
          class="save-header-btn"
          :disabled="!isDirty || isSaving"
          @click="saveProfile"
        >
          {{ isSaving ? '...' : t('actions.save') }}
        </button>
      </div>

      <!-- Avatar section inside header -->
      <div class="avatar-section">
        <div class="avatar-ring">
          <div class="avatar-circle">
            {{ userInitial }}
          </div>
          <button
            class="avatar-edit-btn"
            @click="triggerAvatarChange"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div class="avatar-name">
          {{ form.name || userName }}
        </div>
        <div class="avatar-role">
          {{ getRoleLabel(user?.role) }}
        </div>
      </div>
    </ion-header>

    <ion-content class="profile-content">
      <div class="profile-body anim-fade-up">
        <!-- Toast notification -->
        <transition name="toast">
          <div
            v-if="toast.show"
            :class="['toast', `toast-${toast.type}`]"
          >
            {{ toast.message }}
          </div>
        </transition>

        <!-- Personal Info -->
        <div class="section-card">
          <div class="section-header">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            ><circle
              cx="12"
              cy="8"
              r="4"
              stroke="#1976d2"
              stroke-width="2"
            /><path
              d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
              stroke="#1976d2"
              stroke-width="2"
              stroke-linecap="round"
            /></svg>
            <span>{{ t('profile.personalInfo') }}</span>
          </div>

          <div class="field-group">
            <label class="field-label">{{ t('forms.name') }}</label>
            <input
              v-model="form.name"
              class="field-input"
              :placeholder="t('forms.name')"
              @input="isDirty = true"
            >
          </div>

          <div class="field-group">
            <label class="field-label">{{ t('forms.email') }}</label>
            <input
              v-model="form.email"
              class="field-input"
              type="email"
              :placeholder="t('forms.email')"
              @input="isDirty = true"
            >
          </div>

          <div class="field-group">
            <label class="field-label">{{ t('forms.phone') }}</label>
            <input
              v-model="form.phone"
              class="field-input"
              type="tel"
              placeholder="+855 __ ___ ___"
              @input="isDirty = true"
            >
          </div>
        </div>

        <!-- Account Info (read-only) -->
        <div class="section-card">
          <div class="section-header">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            ><rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
              stroke="#1976d2"
              stroke-width="2"
            /><path
              d="M7 11V7a5 5 0 0 1 10 0v4"
              stroke="#1976d2"
              stroke-width="2"
              stroke-linecap="round"
            /></svg>
            <span>{{ t('profile.accountInfo') }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">{{ t('profile.role') }}</span>
            <span class="info-value role-badge">{{ getRoleLabel(user?.role) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ t('profile.school') }}</span>
            <span class="info-value">{{ user?.schoolId || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ t('profile.userId') }}</span>
            <span class="info-value info-mono">{{ user?.id || '—' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ t('profile.status') }}</span>
            <span class="info-value status-active">● Active</span>
          </div>
        </div>

        <!-- Change Password -->
        <div class="section-card">
          <div
            class="section-header"
            style="cursor:pointer; user-select:none"
            @click="showPasswordSection = !showPasswordSection"
          >
            <div style="display:flex;align-items:center;gap:8px">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              ><path
                d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                stroke="#1976d2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg>
              <span>{{ t('profile.changePassword') }}</span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              :style="{ transform: showPasswordSection ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="#9ca3af"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <transition name="expand">
            <div
              v-if="showPasswordSection"
              class="password-fields"
            >
              <div class="field-group">
                <label class="field-label">{{ t('profile.currentPassword') }}</label>
                <div class="password-wrapper">
                  <input
                    v-model="passwordForm.current"
                    :type="showPw.current ? 'text' : 'password'"
                    class="field-input"
                    placeholder="••••••••"
                  >
                  <button
                    class="pw-toggle"
                    @click="showPw.current = !showPw.current"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    ><path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="#9ca3af"
                      stroke-width="2"
                    /><circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#9ca3af"
                      stroke-width="2"
                    /></svg>
                  </button>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">{{ t('profile.newPassword') }}</label>
                <div class="password-wrapper">
                  <input
                    v-model="passwordForm.new"
                    :type="showPw.new ? 'text' : 'password'"
                    class="field-input"
                    placeholder="••••••••"
                  >
                  <button
                    class="pw-toggle"
                    @click="showPw.new = !showPw.new"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    ><path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="#9ca3af"
                      stroke-width="2"
                    /><circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#9ca3af"
                      stroke-width="2"
                    /></svg>
                  </button>
                </div>
                <!-- Strength bar -->
                <div
                  v-if="passwordForm.new"
                  class="strength-bar-wrap"
                >
                  <div class="strength-bar">
                    <div
                      class="strength-fill"
                      :style="{ width: strengthPercent + '%', background: strengthColor }"
                    />
                  </div>
                  <span
                    class="strength-label"
                    :style="{ color: strengthColor }"
                  >{{ strengthLabel }}</span>
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">{{ t('profile.confirmPassword') }}</label>
                <div class="password-wrapper">
                  <input
                    v-model="passwordForm.confirm"
                    :type="showPw.confirm ? 'text' : 'password'"
                    class="field-input"
                    :class="{ 'input-error': passwordForm.confirm && passwordForm.new !== passwordForm.confirm }"
                    placeholder="••••••••"
                  >
                  <button
                    class="pw-toggle"
                    @click="showPw.confirm = !showPw.confirm"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    ><path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      stroke="#9ca3af"
                      stroke-width="2"
                    /><circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#9ca3af"
                      stroke-width="2"
                    /></svg>
                  </button>
                </div>
                <span
                  v-if="passwordForm.confirm && passwordForm.new !== passwordForm.confirm"
                  class="error-text"
                >Passwords do not match</span>
              </div>
              <button
                class="btn-change-pw"
                :disabled="!canChangePassword"
                @click="changePassword"
              >
                {{ t('profile.updatePassword') }}
              </button>
            </div>
          </transition>
        </div>

        <!-- Logout -->
        <button
          class="btn-logout"
          @click="handleLogout"
        >
          <svg
            width="18"
            height="18"
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

        <div style="height: 32px" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {ref, computed, reactive, onMounted} from 'vue';
import {IonPage, IonHeader, IonContent} from '@ionic/vue';
import {useRouter} from 'vue-router';
import {useAuth} from '@/stores/auth';
import {useI18n} from '@/composables/useI18n';

const router = useRouter();
const authStore = useAuth();
const {t} = useI18n();

const user = computed(() => authStore.user);
const userName = computed(() => user.value?.name || user.value?.email?.split('@')[0] || 'User');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

// Form state
const isDirty = ref(false);
const isSaving = ref(false);

const form = reactive({
  name: '',
  email: '',
  phone: '',
});

onMounted(() => {
  form.name = user.value?.name || '';
  form.email = user.value?.email || '';
  form.phone = '';
});

// Password
const showPasswordSection = ref(false);
const passwordForm = reactive({current: '', new: '', confirm: ''});
const showPw = reactive({current: false, new: false, confirm: false});

const passwordStrength = computed(() => {
  const pw = passwordForm.new;
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
});

const strengthPercent = computed(() => (passwordStrength.value / 4) * 100);
const strengthColor = computed(() => ['#ef4444', '#f97316', '#eab308', '#22c55e'][passwordStrength.value - 1] || '#e5e7eb');
const strengthLabel = computed(() => ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value] || '');

const canChangePassword = computed(() =>
  passwordForm.current.length > 0 &&
  passwordForm.new.length >= 8 &&
  passwordForm.new === passwordForm.confirm
);

// Toast
const toast = reactive({show: false, message: '', type: 'success' as 'success' | 'error'});

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => { toast.show = false; }, 2800);
}

function getRoleLabel(role?: string): string {
  if (!role) return 'User';
  return t(`roles.${role}`) || role;
}

async function saveProfile() {
  if (!isDirty.value || isSaving.value) return;
  isSaving.value = true;
  await new Promise(r => setTimeout(r, 700)); // simulate API
  authStore.setAuth(authStore.token!, {
    ...user.value!,
    name: form.name,
    email: form.email,
  });
  isDirty.value = false;
  isSaving.value = false;
  showToast(t('messages.updatedSuccessfully'));
}

function changePassword() {
  if (!canChangePassword.value) return;
  // Mock — reset form and show success
  passwordForm.current = '';
  passwordForm.new = '';
  passwordForm.confirm = '';
  showPasswordSection.value = false;
  showToast(t('profile.passwordUpdated'));
}

function triggerAvatarChange() {
  showToast('Avatar upload coming soon', 'success');
}

function handleLogout() {
  authStore.logout();
  router.replace('/login').catch(() => { window.location.replace('/login'); });
}
</script>

<style scoped>
.profile-page { --background: #f5f7fa; }

/* ── Header ─────────────────────────────────── */
.profile-header {
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 45%, #0288d1 100%);
  box-shadow: 0 4px 20px rgba(21,101,192,0.4);
  padding-bottom: 24px;
}

.profile-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 8px;
  height: 52px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  border: none;
  cursor: pointer;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.3px;
}

.save-header-btn {
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: rgba(255,255,255,0.22);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 20px;
  padding: 5px 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.save-header-btn:disabled { opacity: 0.45; cursor: default; }
.save-header-btn:not(:disabled):active { background: rgba(255,255,255,0.32); }

/* Avatar */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-bottom: 4px;
}

.avatar-ring {
  position: relative;
  width: 84px;
  height: 84px;
}

.avatar-circle {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: white;
  color: #1565c0;
  font-size: 34px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255,255,255,0.6);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1565c0;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.avatar-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin-top: 2px;
}

.avatar-role {
  font-size: 12px;
  color: rgba(255,255,255,0.72);
  background: rgba(255,255,255,0.15);
  padding: 2px 12px;
  border-radius: 10px;
}

/* ── Content ─────────────────────────────────── */
.profile-content { --background: #f5f7fa; }

.profile-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Toast */
.toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.toast-success { background: #22c55e; color: white; }
.toast-error   { background: #ef4444; color: white; }

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }

/* Section cards */
.section-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.04);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 14px;
}

.section-header > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Fields */
.field-group {
  margin-bottom: 12px;
}
.field-group:last-child { margin-bottom: 0; }

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.field-input {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #1f2937;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.field-input:focus { border-color: #1976d2; background: white; }
.field-input.input-error { border-color: #ef4444; }

/* Password wrapper */
.password-wrapper {
  position: relative;
}
.password-wrapper .field-input { padding-right: 40px; }

.pw-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
}

/* Strength */
.strength-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s, background 0.3s;
}
.strength-label {
  font-size: 11px;
  font-weight: 600;
  min-width: 36px;
}

.error-text {
  font-size: 11px;
  color: #ef4444;
  margin-top: 4px;
  display: block;
}

/* Password expand transition */
.expand-enter-active, .expand-leave-active { transition: all 0.25s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { max-height: 400px; opacity: 1; }

.password-fields { padding-top: 4px; }

.btn-change-pw {
  width: 100%;
  padding: 11px;
  background: linear-gradient(135deg, #1565c0, #1976d2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s;
}
.btn-change-pw:disabled { opacity: 0.45; cursor: default; }

/* Info rows (read-only) */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}
.info-row:last-child { border-bottom: none; }

.info-label { color: #6b7280; font-weight: 500; }

.info-value { font-weight: 600; color: #1f2937; }

.info-mono { font-family: monospace; font-size: 12px; color: #6b7280; }

.role-badge {
  background: #eff6ff;
  color: #1976d2;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.status-active { color: #22c55e; }

/* Logout button */
.btn-logout {
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
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.btn-logout:active { background: #fff5f5; }
.section-card { animation: fadeUp .35s ease both; }
.section-card:nth-child(1){animation-delay:.05s}.section-card:nth-child(2){animation-delay:.12s}.section-card:nth-child(3){animation-delay:.19s}
.btn-logout { animation: fadeUp .35s .26s ease both; }
.btn-change-pw,.save-header-btn,.back-btn { transition:opacity .15s,transform .15s; }
.btn-change-pw:not(:disabled):active,.btn-logout:active { transform:scale(.97); }
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
