<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      style="--background:#f0f5ff"
    >
      <!-- Header -->
      <div class="reg-header">
        <div class="reg-logo">
          🏫
        </div>
        <h1 class="reg-title">
          techocam
        </h1>
        <p class="reg-sub">
          {{ t('register.title') }}
        </p>
        <p class="reg-desc">
          {{ t('register.subtitle') }}
        </p>
      </div>

      <div
        v-if="!submitted"
        class="reg-card"
      >
        <!-- Step indicator -->
        <div class="steps">
          <div
            class="step"
            :class="{ active: step >= 1, done: step > 1 }"
          >
            <div class="step-num">
              {{ step > 1 ? '✓' : '1' }}
            </div>
            <span class="step-lbl">{{ t('register.schoolInfo') }}</span>
          </div>
          <div
            class="step-line"
            :class="{ done: step > 1 }"
          />
          <div
            class="step"
            :class="{ active: step >= 2 }"
          >
            <div class="step-num">
              2
            </div>
            <span class="step-lbl">{{ t('register.contactInfo') }}</span>
          </div>
        </div>

        <!-- ── Step 1: School Info ── -->
        <div v-if="step === 1">
          <div class="field-group">
            <label class="field-label">{{ t('register.schoolNameKh') }} *</label>
            <input
              v-model="form.schoolNameKh"
              class="field-input"
              :placeholder="t('register.namePlaceholder')"
            >
          </div>

          <div class="field-group">
            <label class="field-label">{{ t('register.schoolNameEn') }} *</label>
            <input
              v-model="form.schoolNameEn"
              class="field-input"
              :placeholder="t('register.nameEnPlaceholder')"
            >
          </div>

          <div class="row2">
            <div class="field-group">
              <label class="field-label">{{ t('register.schoolType') }} *</label>
              <div class="type-row">
                <button
                  v-for="type in schoolTypes"
                  :key="type.val"
                  class="type-btn"
                  :class="{ active: form.schoolType === type.val }"
                  @click="form.schoolType = type.val"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">{{ t('register.level') }} *</label>
              <select
                v-model="form.level"
                class="field-input"
              >
                <option value="">
                  --
                </option>
                <option value="primary">
                  {{ t('register.levelPrimary') }}
                </option>
                <option value="lower_secondary">
                  {{ t('register.levelLower') }}
                </option>
                <option value="upper_secondary">
                  {{ t('register.levelUpper') }}
                </option>
                <option value="university">
                  {{ t('register.levelUniversity') }}
                </option>
                <option value="integrated">
                  {{ t('register.levelIntegrated') }}
                </option>
              </select>
            </div>
          </div>

          <div class="row2">
            <div class="field-group">
              <label class="field-label">{{ t('register.province') }} *</label>
              <select
                v-model="form.province"
                class="field-input"
              >
                <option value="">
                  --
                </option>
                <option
                  v-for="p in provinces"
                  :key="p"
                  :value="p"
                >
                  {{ p }}
                </option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">{{ t('register.district') }}</label>
              <input
                v-model="form.district"
                class="field-input"
                placeholder="ស្រុក / ខណ្ឌ"
              >
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">{{ t('register.address') }} *</label>
            <textarea
              v-model="form.address"
              class="field-input field-textarea"
              :placeholder="t('register.addressPlaceholder')"
              rows="2"
            />
          </div>

          <div class="field-group">
            <label class="field-label">{{ t('register.totalStudents') }}</label>
            <input
              v-model="form.totalStudents"
              type="number"
              class="field-input"
              placeholder="e.g. 500"
            >
          </div>

          <div
            v-if="stepError"
            class="error-msg"
          >
            ⚠ {{ stepError }}
          </div>

          <button
            class="btn-next"
            @click="nextStep"
          >
            {{ t('register.next') }}
          </button>
        </div>

        <!-- ── Step 2: Contact Info ── -->
        <div v-if="step === 2">
          <div class="field-group">
            <label class="field-label">{{ t('register.principalName') }} *</label>
            <input
              v-model="form.principalName"
              class="field-input"
              placeholder="ឈ្មោះពេញ"
            >
          </div>

          <div class="row2">
            <div class="field-group">
              <label class="field-label">{{ t('register.principalPhone') }} *</label>
              <input
                v-model="form.principalPhone"
                class="field-input"
                placeholder="012 345 678"
              >
            </div>
            <div class="field-group">
              <label class="field-label">{{ t('register.schoolPhone') }}</label>
              <input
                v-model="form.schoolPhone"
                class="field-input"
                placeholder="023 456 789"
              >
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">{{ t('register.principalEmail') }} *</label>
            <input
              v-model="form.principalEmail"
              type="email"
              class="field-input"
              placeholder="principal@school.edu.kh"
            >
          </div>

          <div
            v-if="stepError"
            class="error-msg"
          >
            ⚠ {{ stepError }}
          </div>

          <div class="btn-row">
            <button
              class="btn-back"
              @click="step = 1"
            >
              ← {{ t('actions.back') }}
            </button>
            <button
              class="btn-submit"
              :disabled="loading"
              @click="submit"
            >
              <span
                v-if="loading"
                class="spinner"
              />
              <span v-else>📨 {{ t('register.submit') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Success screen -->
      <div
        v-else
        class="success-card"
      >
        <div class="success-icon">
          🎉
        </div>
        <h2 class="success-title">
          {{ t('messages.success') }}
        </h2>
        <p class="success-msg">
          {{ t('register.success') }}
        </p>
        <div class="success-ref">
          <span class="ref-label">Reference ID</span>
          <span class="ref-code">{{ refId }}</span>
        </div>
        <button
          class="btn-login"
          @click="router.push('/login')"
        >
          {{ t('register.backToLogin') }}
        </button>
      </div>

      <!-- Footer -->
      <p class="reg-footer">
        {{ t('register.alreadyAccount') }}
        <button
          class="footer-link"
          @click="router.push('/login')"
        >
          {{ t('auth.login') }}
        </button>
      </p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';
import {useRouter} from 'vue-router';
import {useI18n} from '@/composables/useI18n';
import {LocalStorageService} from '@/services/localStorageService';

const router = useRouter();
const {t} = useI18n();

const step = ref(1);
const loading = ref(false);
const submitted = ref(false);
const stepError = ref('');
const refId = ref('');

const form = ref({
  schoolNameKh: '',
  schoolNameEn: '',
  schoolType: 'public',
  level: '',
  province: '',
  district: '',
  address: '',
  totalStudents: '',
  principalName: '',
  principalPhone: '',
  principalEmail: '',
  schoolPhone: '',
});

const schoolTypes = computed(() => [
  {val: 'public', label: t('register.public')},
  {val: 'private', label: t('register.private')},
]);

const provinces = [
  'ភ្នំពេញ', 'កណ្ដាល', 'កំពង់ចាម', 'កំពង់ឆ្នាំង', 'កំពង់ស្ពឺ',
  'កំពង់ធំ', 'កំពត', 'កោះកុង', 'ក្រចេះ', 'មណ្ឌលគិរី',
  'ឧត្ដរមានជ័យ', 'បន្ទាយមានជ័យ', 'បាត់ដំបង', 'ពោធិ៍សាត់',
  'ព្រៃវែង', 'ព្រះវិហារ', 'ព្រះសីហនុ', 'រតនគីរី', 'សៀមរាប',
  'ស្ទឹងត្រែង', 'ស្វាយរៀង', 'តាកែវ', 'ត្បូងឃ្មុំ', 'ឯករាជ',
];

function nextStep() {
  stepError.value = '';
  if (!form.value.schoolNameKh || !form.value.schoolNameEn || !form.value.level || !form.value.province || !form.value.address) {
    stepError.value = t('register.required');
    return;
  }
  step.value = 2;
}

async function submit() {
  stepError.value = '';
  if (!form.value.principalName || !form.value.principalPhone || !form.value.principalEmail) {
    stepError.value = t('register.required');
    return;
  }
  loading.value = true;
  await new Promise(r => setTimeout(r, 900));
  const id = `REG-${Date.now()}`;
  refId.value = id;
  const registrations = LocalStorageService.get<any[]>('pending_registrations', []) || [];
  registrations.push({
    id,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    ...form.value,
  });
  LocalStorageService.set('pending_registrations', registrations);
  loading.value = false;
  submitted.value = true;
}
</script>

<style scoped>
ion-page { --ion-background-color:#f0f5ff; }

.reg-header {
  background: linear-gradient(135deg,#1565c0,#1976d2,#0288d1);
  padding:32px 20px 28px; text-align:center;
}
.reg-logo   { font-size:48px; margin-bottom:8px; }
.reg-title  { font-size:22px; font-weight:800; color:white; margin:0; }
.reg-sub    { font-size:14px; font-weight:600; color:rgba(255,255,255,.9); margin:6px 0 4px; }
.reg-desc   { font-size:12px; color:rgba(255,255,255,.7); margin:0; }

.reg-card {
  background:white; border-radius:20px 20px 0 0;
  margin:0; padding:24px 20px 28px;
  box-shadow:0 -4px 24px rgba(0,0,0,.08);
}

/* Steps */
.steps { display:flex; align-items:center; margin-bottom:24px; }
.step  { display:flex; flex-direction:column; align-items:center; gap:4px; }
.step-num {
  width:28px; height:28px; border-radius:50%; background:#e5e7eb; color:#6b7280;
  font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center;
  transition:all .2s;
}
.step.active .step-num { background:#1976d2; color:white; }
.step.done   .step-num { background:#16a34a; color:white; }
.step-lbl { font-size:10px; font-weight:600; color:#9ca3af; white-space:nowrap; }
.step.active .step-lbl { color:#1976d2; }
.step-line { flex:1; height:2px; background:#e5e7eb; margin:0 8px; margin-bottom:14px; transition:background .2s; }
.step-line.done { background:#16a34a; }

/* Fields */
.field-group   { margin-bottom:14px; }
.field-label   { display:block; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; margin-bottom:5px; }
.field-input   { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.field-input:focus { border-color:#1976d2; background:white; }
.field-textarea { resize:vertical; font-family:inherit; }
.row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

/* Type buttons */
.type-row { display:flex; gap:6px; }
.type-btn {
  flex:1; padding:9px; border:1.5px solid #e5e7eb; border-radius:10px;
  background:white; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer;
}
.type-btn.active { border-color:#1976d2; background:#eff6ff; color:#1976d2; }

/* Buttons */
.btn-next {
  width:100%; padding:14px; background:linear-gradient(135deg,#1565c0,#1976d2);
  color:white; border:none; border-radius:12px; font-size:15px; font-weight:700;
  cursor:pointer; margin-top:4px;
}
.btn-row    { display:flex; gap:10px; margin-top:4px; }
.btn-back   { flex:1; padding:14px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.btn-submit { flex:2; padding:14px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; }
.btn-submit:disabled { opacity:.5; cursor:default; }

/* Error */
.error-msg { color:#dc2626; font-size:13px; font-weight:500; margin-bottom:10px; background:#fef2f2; padding:9px 12px; border-radius:8px; border-left:3px solid #dc2626; }

/* Success */
.success-card { background:white; border-radius:20px; margin:20px 16px; padding:32px 20px; text-align:center; box-shadow:0 4px 20px rgba(0,0,0,.1); }
.success-icon  { font-size:56px; margin-bottom:12px; }
.success-title { font-size:20px; font-weight:800; color:#1f2937; margin:0 0 10px; }
.success-msg   { font-size:14px; color:#6b7280; line-height:1.6; margin:0 0 20px; }
.success-ref   { background:#f0fdf4; border-radius:12px; padding:14px; margin-bottom:20px; }
.ref-label { display:block; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; margin-bottom:4px; }
.ref-code  { display:block; font-size:16px; font-weight:800; color:#16a34a; letter-spacing:1px; }
.btn-login { width:100%; padding:14px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; }

/* Footer */
.reg-footer  { text-align:center; padding:16px; font-size:13px; color:#6b7280; }
.footer-link { background:none; border:none; color:#1976d2; font-weight:600; font-size:13px; cursor:pointer; text-decoration:underline; }

/* Spinner */
.spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:white; border-radius:50%; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
