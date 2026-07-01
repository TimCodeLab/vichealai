<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <template #start>
          <ion-buttons>
            <ion-button @click="router.back()">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              ><path
                d="M19 12H5M5 12l7 7M5 12l7-7"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg>
            </ion-button>
          </ion-buttons>
        </template>
        <ion-title>{{ t('approvals.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content
      :fullscreen="true"
      style="--background:#f0f4ff"
    >
      <!-- Summary bar -->
      <div class="summary-bar">
        <div
          v-for="s in summary"
          :key="s.key"
          class="summ-item"
        >
          <div
            class="summ-num"
            :style="{ color: s.color }"
          >
            {{ s.count }}
          </div>
          <div class="summ-lbl">
            {{ s.label }}
          </div>
        </div>
      </div>

      <!-- Filter tabs -->
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.val"
          class="filter-tab"
          :class="{ active: activeFilter === tab.val }"
          @click="activeFilter = tab.val"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-if="filtered.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">
          📭
        </div>
        <div class="empty-title">
          {{ t('approvals.noRequests') }}
        </div>
      </div>

      <!-- Registration cards -->
      <div
        v-else
        class="reg-list"
      >
        <div
          v-for="reg in filtered"
          :key="reg.id"
          class="reg-card"
        >
          <div class="reg-card-top">
            <div
              class="school-badge"
              :style="{ background: typeColor(reg.schoolType) }"
            >
              {{ reg.schoolType === 'public' ? '🏛' : '🏫' }}
            </div>
            <div class="school-info">
              <div class="school-name">
                {{ reg.schoolNameKh || reg.schoolNameEn }}
              </div>
              <div class="school-name-en">
                {{ reg.schoolNameEn }}
              </div>
              <div class="school-meta">
                <span class="meta-chip">{{ levelLabel(reg.level) }}</span>
                <span class="meta-chip">{{ reg.province }}</span>
              </div>
            </div>
            <div
              class="status-badge"
              :class="reg.status"
            >
              {{ t('approvals.' + reg.status) }}
            </div>
          </div>

          <div class="divider-line" />

          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-icon">👤</span>
              <span class="detail-text">{{ reg.principalName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📱</span>
              <span class="detail-text">{{ reg.principalPhone }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📧</span>
              <span class="detail-text">{{ reg.principalEmail }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📍</span>
              <span class="detail-text">{{ reg.address }}</span>
            </div>
            <div
              v-if="reg.totalStudents"
              class="detail-item"
            >
              <span class="detail-icon">🎒</span>
              <span class="detail-text">{{ reg.totalStudents }} {{ t('approvals.students') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🕐</span>
              <span class="detail-text">{{ formatDate(reg.submittedAt) }}</span>
            </div>
          </div>

          <div class="ref-row">
            <span class="ref-id">{{ reg.id }}</span>
          </div>

          <!-- Action buttons for pending -->
          <div
            v-if="reg.status === 'pending'"
            class="action-row"
          >
            <button
              class="btn-reject"
              @click="openReject(reg)"
            >
              ✕ {{ t('approvals.reject') }}
            </button>
            <button
              class="btn-approve"
              @click="approve(reg)"
            >
              ✓ {{ t('approvals.approve') }}
            </button>
          </div>

          <!-- Approved credentials display -->
          <div
            v-if="reg.status === 'approved' && reg.adminCredentials"
            class="cred-box"
          >
            <div class="cred-title">
              🔑 {{ t('approvals.adminCredentials') }}
            </div>
            <div class="cred-row">
              <span class="cred-lbl">Email:</span>
              <span class="cred-val">{{ reg.adminCredentials.email }}</span>
            </div>
            <div class="cred-row">
              <span class="cred-lbl">Password:</span>
              <span class="cred-val">{{ reg.adminCredentials.password }}</span>
            </div>
            <div class="cred-row">
              <span class="cred-lbl">School Code:</span>
              <span class="cred-val">{{ reg.adminCredentials.schoolCode }}</span>
            </div>
          </div>

          <!-- Rejection reason display -->
          <div
            v-if="reg.status === 'rejected' && reg.rejectReason"
            class="reject-box"
          >
            <span class="reject-reason-lbl">{{ t('approvals.reason') }}:</span> {{ reg.rejectReason }}
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div
        v-if="toast"
        class="toast"
      >
        {{ toast }}
      </div>
    </ion-content>

    <!-- Reject modal -->
    <ion-modal
      :is-open="showRejectModal"
      :breakpoints="[0,1]"
      :initial-breakpoint="1"
      @did-dismiss="showRejectModal = false"
    >
      <ion-content style="--background:white">
        <div class="modal-inner">
          <div class="modal-title">
            ✕ {{ t('approvals.rejectTitle') }}
          </div>
          <div class="modal-school">
            {{ rejectTarget?.schoolNameKh }}
          </div>
          <label class="field-label">{{ t('approvals.rejectReason') }} *</label>
          <textarea
            v-model="rejectReason"
            class="field-input"
            rows="4"
            :placeholder="t('approvals.rejectPlaceholder')"
          />
          <div class="modal-btns">
            <button
              class="mbtn-cancel"
              @click="showRejectModal = false"
            >
              {{ t('actions.cancel') }}
            </button>
            <button
              class="mbtn-reject"
              @click="confirmReject"
            >
              {{ t('approvals.confirm') }}
            </button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonModal} from '@ionic/vue';
import {useI18n} from '@/composables/useI18n';
import {LocalStorageService} from '@/services/localStorageService';

const {t} = useI18n();
const router = useRouter();

// ── Data ──
const registrations = ref<any[]>(LocalStorageService.get<any[]>('pending_registrations', []) || []);
const activeFilter = ref('all');
const toast = ref('');
const showRejectModal = ref(false);
const rejectTarget = ref<any>(null);
const rejectReason = ref('');

// ── Filter tabs ──
const filterTabs = computed(() => [
  {val: 'all', label: t('approvals.all')},
  {val: 'pending', label: t('approvals.pending')},
  {val: 'approved', label: t('approvals.approved')},
  {val: 'rejected', label: t('approvals.rejected')},
]);

const filtered = computed(() =>
  activeFilter.value === 'all'
    ? registrations.value
    : registrations.value.filter(r => r.status === activeFilter.value)
);

// ── Summary bar ──
const summary = computed(() => [
  {key: 'total', count: registrations.value.length, label: t('approvals.total'), color: '#1976d2'},
  {key: 'pending', count: registrations.value.filter(r => r.status === 'pending').length, label: t('approvals.pending'), color: '#f59e0b'},
  {key: 'approved', count: registrations.value.filter(r => r.status === 'approved').length, label: t('approvals.approved'), color: '#16a34a'},
  {key: 'rejected', count: registrations.value.filter(r => r.status === 'rejected').length, label: t('approvals.rejected'), color: '#dc2626'},
]);

// ── Helpers ──
function typeColor(type: string) {
  return type === 'public' ? '#1976d220' : '#7c3aed20';
}

function levelLabel(level: string) {
  const map: Record<string, string> = {
    primary: 'Primary', lower_secondary: 'Lower Sec.', upper_secondary: 'Upper Sec.',
    university: 'University', integrated: 'Integrated'
  };
  return map[level] || level;
}

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('km-KH', {year: 'numeric', month: 'short', day: 'numeric'});
}

function save() {
  LocalStorageService.set('pending_registrations', registrations.value);
}

function showToast(msg: string) {
  toast.value = msg;
  setTimeout(() => toast.value = '', 2500);
}

// ── Approve ──
function approve(reg: any) {
  const schoolCode = 'SCH-' + Date.now().toString().slice(-6);
  const email = 'admin@' + reg.schoolNameEn.toLowerCase().replace(/\s+/g, '') + '.edu.kh';
  const password = 'Admin@' + Math.random().toString(36).slice(2, 8).toUpperCase();

  reg.status = 'approved';
  reg.approvedAt = new Date().toISOString();
  reg.adminCredentials = {email, password, schoolCode};

  // Register school in schools list
  const schools: any[] = JSON.parse(localStorage.getItem('schools') || '[]');
  schools.push({
    id: 'school_' + Date.now(),
    name: reg.schoolNameKh || reg.schoolNameEn,
    nameEn: reg.schoolNameEn,
    code: schoolCode,
    type: reg.schoolType,
    level: reg.level,
    province: reg.province,
    address: reg.address,
    principalName: reg.principalName,
    principalEmail: reg.principalEmail,
    principalPhone: reg.principalPhone,
    adminEmail: email,
    adminPassword: password,
    isActive: true,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('schools', JSON.stringify(schools));

  save();
  showToast('✅ ' + t('approvals.approvedMsg'));
}

// ── Reject ──
function openReject(reg: any) {
  rejectTarget.value = reg;
  rejectReason.value = '';
  showRejectModal.value = true;
}

function confirmReject() {
  if (!rejectReason.value.trim()) return;
  rejectTarget.value.status = 'rejected';
  rejectTarget.value.rejectReason = rejectReason.value;
  rejectTarget.value.rejectedAt = new Date().toISOString();
  save();
  showRejectModal.value = false;
  showToast('✕ ' + t('approvals.rejectedMsg'));
}
</script>

<style scoped>
ion-toolbar { --background:white; }

/* Summary */
.summary-bar { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#e5e7eb; border-bottom:1px solid #e5e7eb; }
.summ-item   { background:white; padding:12px 8px; text-align:center; }
.summ-num    { font-size:20px; font-weight:800; }
.summ-lbl    { font-size:10px; font-weight:600; color:#9ca3af; margin-top:2px; }

/* Filters */
.filter-tabs { display:flex; gap:6px; padding:12px 16px; background:white; border-bottom:1px solid #f3f4f6; overflow-x:auto; }
.filter-tab  { padding:6px 14px; border-radius:20px; border:1.5px solid #e5e7eb; background:white; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer; white-space:nowrap; }
.filter-tab.active { background:#1976d2; border-color:#1976d2; color:white; }

/* Empty */
.empty-state { text-align:center; padding:60px 20px; }
.empty-icon  { font-size:48px; margin-bottom:12px; }
.empty-title { font-size:16px; font-weight:600; color:#9ca3af; }

/* List */
.reg-list { padding:12px 16px 80px; display:flex; flex-direction:column; gap:14px; }

.reg-card {
  background:white; border-radius:16px; padding:16px;
  box-shadow:0 2px 12px rgba(0,0,0,.07);
}

.reg-card-top { display:flex; align-items:flex-start; gap:12px; }
.school-badge  { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.school-info   { flex:1; min-width:0; }
.school-name   { font-size:15px; font-weight:700; color:#1f2937; }
.school-name-en{ font-size:12px; color:#6b7280; margin-top:1px; }
.school-meta   { display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; }
.meta-chip     { font-size:10px; font-weight:600; background:#eff6ff; color:#1976d2; padding:2px 8px; border-radius:10px; }

/* Status badges */
.status-badge  { font-size:10px; font-weight:700; padding:4px 10px; border-radius:10px; white-space:nowrap; flex-shrink:0; }
.status-badge.pending  { background:#fef3c7; color:#d97706; }
.status-badge.approved { background:#dcfce7; color:#16a34a; }
.status-badge.rejected { background:#fee2e2; color:#dc2626; }

.divider-line { height:1px; background:#f3f4f6; margin:12px 0; }

/* Detail grid */
.detail-grid { display:flex; flex-direction:column; gap:6px; }
.detail-item { display:flex; align-items:flex-start; gap:8px; font-size:13px; color:#374151; }
.detail-icon { font-size:13px; flex-shrink:0; margin-top:1px; }
.detail-text { line-height:1.4; }

.ref-row { margin-top:8px; }
.ref-id  { font-size:10px; font-weight:600; color:#9ca3af; font-family:monospace; }

/* Actions */
.action-row { display:flex; gap:8px; margin-top:12px; }
.btn-reject  { flex:1; padding:11px; border:1.5px solid #dc2626; background:white; color:#dc2626; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; }
.btn-approve { flex:2; padding:11px; border:none; background:linear-gradient(135deg,#16a34a,#22c55e); color:white; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; }

/* Credentials */
.cred-box   { background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:12px; margin-top:10px; }
.cred-title { font-size:12px; font-weight:700; color:#16a34a; margin-bottom:8px; }
.cred-row   { display:flex; gap:8px; font-size:12px; margin-bottom:4px; }
.cred-lbl   { font-weight:600; color:#6b7280; min-width:80px; }
.cred-val   { font-family:monospace; color:#1f2937; font-weight:700; }

/* Rejection */
.reject-box        { background:#fef2f2; border:1px solid #fca5a5; border-radius:10px; padding:10px; margin-top:10px; font-size:12px; color:#dc2626; }
.reject-reason-lbl { font-weight:700; }

/* Toast */
.toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#1f2937; color:white; padding:10px 20px; border-radius:20px; font-size:13px; font-weight:600; z-index:999; animation:fadeIn .25s ease; white-space:nowrap; }
@keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

/* Modal */
.modal-inner    { padding:24px 20px; }
.modal-title    { font-size:18px; font-weight:800; color:#dc2626; margin-bottom:6px; }
.modal-school   { font-size:14px; color:#6b7280; margin-bottom:16px; }
.field-label    { display:block; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; margin-bottom:5px; }
.field-input    { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; resize:vertical; font-family:inherit; }
.field-input:focus { border-color:#dc2626; }
.modal-btns   { display:flex; gap:10px; margin-top:16px; }
.mbtn-cancel  { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mbtn-reject  { flex:2; padding:13px; background:linear-gradient(135deg,#dc2626,#ef4444); color:white; border:none; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; }
</style>
