<template>
  <ion-page>
    <!-- Header -->
    <ion-header class="pg-header">
      <div class="pg-bar">
        <button
          class="pg-back"
          @click="router.back()"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          ><path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="white"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg>
        </button>
        <span class="pg-title">{{ t('nav.students') }}</span>
        <button
          class="pg-new"
          @click="openCreate"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
          ><path
            d="M12 5v14M5 12h14"
            stroke="white"
            stroke-width="2.5"
            stroke-linecap="round"
          /></svg>
          {{ t('actions.create') }}
        </button>
      </div>
    </ion-header>

    <ion-content style="--background:#f5f7fa">
      <div class="pg-body anim-fade-up">
        <!-- Search -->
        <div class="pg-search">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
          ><circle
            cx="11"
            cy="11"
            r="8"
            stroke="#9ca3af"
            stroke-width="2"
          /><path
            d="M21 21l-4.35-4.35"
            stroke="#9ca3af"
            stroke-width="2"
            stroke-linecap="round"
          /></svg>
          <input
            v-model="searchQuery"
            class="pg-search-input"
            :placeholder="t('actions.search') + '...'"
          >
          <span
            v-if="searchQuery"
            class="pg-search-clear"
            @click="searchQuery = ''"
          >✕</span>
        </div>

        <!-- Count + Filter -->
        <div class="pg-meta">
          <span class="pg-count">{{ filtered.length }} {{ t('nav.students') }}</span>
          <div class="pg-filters">
            <button
              v-for="f in filters"
              :key="f.val"
              :class="['pg-filter', { active: activeFilter === f.val }]"
              @click="activeFilter = f.val"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="filtered.length === 0"
          class="pg-empty"
        >
          <div style="font-size:52px;margin-bottom:12px">
            👥
          </div>
          <div style="font-size:16px;font-weight:600;color:#374151">
            {{ t('students.notFound') }}
          </div>
          <div style="font-size:13px;color:#9ca3af;margin-top:4px">
            {{ t('students.notFoundSub') }}
          </div>
          <button
            class="pg-empty-btn"
            @click="openCreate"
          >
            + {{ t('students.add') }}
          </button>
        </div>

        <!-- Cards -->
        <div
          v-for="student in filtered"
          :key="student.id"
          class="pg-card"
        >
          <div
            class="pg-avatar"
            :style="{ background: aColor(student.name) }"
          >
            {{ aInitial(student.name) }}
          </div>
          <div class="pg-info">
            <div class="pg-name">
              {{ student.name }}
            </div>
            <div class="pg-row">
              <span class="pg-lbl">✉️</span><span class="pg-val">{{ student.email }}</span>
            </div>
            <div class="pg-row">
              <span class="pg-lbl">🏫</span><span class="pg-val">{{ className(student.classId) }}</span>
            </div>
            <div
              v-if="student.dateOfBirth"
              class="pg-row"
            >
              <span class="pg-lbl">🎂</span><span class="pg-val">{{ fmtDate(student.dateOfBirth) }}</span>
            </div>
            <div class="pg-badges">
              <span class="pg-badge pg-green">● {{ t('students.active') }}</span>
              <span
                v-if="student.gender"
                class="pg-badge pg-blue"
              >{{ student.gender === 'M' || student.gender === 'male' ? '♂ ' + t('students.male') : '♀ ' + t('students.female') }}</span>
            </div>
          </div>
          <div class="pg-actions">
            <button
              class="pg-btn pg-btn-edit"
              :title="t('actions.edit')"
              @click="editItem(student)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              ><path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              /><path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              /></svg>
            </button>
            <button
              class="pg-btn pg-btn-del"
              :title="t('actions.delete')"
              @click="deleteItem(student.id)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              ><polyline
                points="3 6 5 6 21 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              /><path
                d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              /><path
                d="M10 11v6M14 11v6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              /></svg>
            </button>
          </div>
        </div>

        <div style="height:28px" />
      </div>
    </ion-content>

    <!-- Credentials popup -->
    <ion-modal :is-open="!!newCredentials" @did-dismiss="newCredentials = null">
      <div class="mo-wrap">
        <div class="mo-handle"></div>
        <div class="mo-head">
          <span class="mo-title">🔑 {{ t('credentials.title') }}</span>
          <button class="mo-close" @click="newCredentials = null">✕</button>
        </div>
        <div class="mo-body">
          <div class="cred-banner">
            <div class="cred-notice">{{ t('credentials.saveNote') }}</div>
            <div class="cred-name">{{ newCredentials?.name }}</div>
          </div>
          <div class="cred-box">
            <div class="cred-row">
              <span class="cred-lbl">{{ t('credentials.loginCode') }}</span>
              <span class="cred-val code">{{ newCredentials?.loginCode }}</span>
            </div>
            <div class="cred-divider"></div>
            <div class="cred-row">
              <span class="cred-lbl">{{ t('credentials.tempPassword') }}</span>
              <span class="cred-val">{{ newCredentials?.loginPassword }}</span>
            </div>
          </div>
          <div class="cred-hint">{{ t('credentials.changeHint') }}</div>
          <button class="mo-save" style="width:100%" @click="newCredentials = null">{{ t('actions.ok') }}</button>
        </div>
      </div>
    </ion-modal>

    <!-- Modal -->
    <ion-modal
      :is-open="showModal"
      @did-dismiss="closeModal"
    >
      <div class="mo-wrap">
        <div class="mo-handle" />
        <div class="mo-head">
          <span class="mo-title">{{ editing ? '✏️ ' + t('students.editTitle') : '➕ ' + t('students.newTitle') }}</span>
          <button
            class="mo-close"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
        <div class="mo-body">
          <div class="mo-field">
            <label class="mo-label">{{ t('students.fullName') }} *</label>
            <input
              v-model="form.name"
              class="mo-input"
              placeholder="e.g. Sokha Chan"
            >
          </div>
          <div class="mo-field">
            <label class="mo-label">{{ t('forms.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              class="mo-input"
              placeholder="student@school.edu.kh"
            >
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('students.gender') }}</label>
              <select
                v-model="form.gender"
                class="mo-input"
              >
                <option value="male">
                  ♂ {{ t('students.male') }}
                </option>
                <option value="female">
                  ♀ {{ t('students.female') }}
                </option>
              </select>
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('students.dob') }}</label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                class="mo-input"
              >
            </div>
          </div>
          <div class="mo-field">
            <label class="mo-label">{{ t('nav.classes') }}</label>
            <select
              v-model="form.classId"
              class="mo-input"
            >
              <option value="">
                -- {{ t('students.selectClass') }} --
              </option>
              <option
                v-for="c in classes"
                :key="c.id"
                :value="c.id"
              >
                {{ c.name }}
              </option>
            </select>
          </div>
          <div class="mo-field">
            <label class="mo-label">{{ t('forms.address') }}</label>
            <input
              v-model="form.address"
              class="mo-input"
              :placeholder="t('students.address')"
            >
          </div>
          <div class="mo-btns">
            <button
              class="mo-cancel"
              @click="closeModal"
            >
              {{ t('actions.cancel') }}
            </button>
            <button
              class="mo-save"
              :disabled="!form.name"
              @click="saveItem"
            >
              {{ t('actions.save') }}
            </button>
          </div>
        </div>
      </div>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {IonPage, IonHeader, IonContent, IonModal} from '@ionic/vue';
import {useRouter} from 'vue-router';
import {useI18n} from '@/composables/useI18n';
import {LocalStorageService} from '@/services/localStorageService';

const router = useRouter();
const {t} = useI18n();

const searchQuery = ref('');
const activeFilter = ref('all');
const showModal = ref(false);
const editing = ref<any>(null);
const students = ref<any[]>(LocalStorageService.get<any[]>('students', []) || []);
const classes = ref<any[]>(LocalStorageService.get<any[]>('classes', []) || []);
const form = ref({name:'', email:'', classId:'', dateOfBirth:'', gender:'male', address:''});

const filters = computed(() => [
  { val: 'all',    label: t('actions.all') },
  { val: 'active', label: t('students.active') },
  { val: 'male',   label: '♂ ' + t('students.male') },
  { val: 'female', label: '♀ ' + t('students.female') },
]);

const filtered = computed(() => {
  let list = students.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(s => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
  }
  if (activeFilter.value === 'male') list = list.filter(s => s.gender === 'male' || s.gender === 'M');
  if (activeFilter.value === 'female') list = list.filter(s => s.gender === 'female' || s.gender === 'F');
  return list;
});

const palette = ['#1976d2', '#2e7d32', '#e65100', '#6a1b9a', '#c62828', '#00838f', '#4527a0', '#558b2f'];
function aColor(n: string) { return palette[(n?.charCodeAt(0)||0) % palette.length]; }
function aInitial(n: string) { return (n||'?').charAt(0).toUpperCase(); }
function className(id: string) { return classes.value.find(c=>c.id===id)?.name || (id ? id : '—'); }
function fmtDate(d: string) { return d ? new Date(d).toLocaleDateString() : '—'; }

function openCreate() { form.value = {name:'', email:'', classId:'', dateOfBirth:'', gender:'male', address:''}; editing.value=null; showModal.value=true; }
function editItem(s: any) { editing.value=s; form.value={...s}; showModal.value=true; }
function closeModal() { showModal.value=false; editing.value=null; }

function deleteItem(id: string) {
  if (confirm(t('messages.confirmDelete'))) {
    students.value = students.value.filter(s=>s.id!==id);
    LocalStorageService.set('students', students.value);
  }
}
const newCredentials = ref<{loginCode:string; loginPassword:string; name:string} | null>(null)

function genStudentCode() {
  const year = new Date().getFullYear()
  const existing = students.value.filter((s: any) => s.loginCode?.startsWith(`STD-${year}-`))
  const num = String(existing.length + 1).padStart(3, '0')
  return `STD-${year}-${num}`
}
function genPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!'
  return Array.from({length:8}, () => chars[Math.floor(Math.random()*chars.length)]).join('')
}

function saveItem() {
  if (!form.value.name) return;
  if (editing.value) {
    const i = students.value.findIndex((s: any) => s.id === editing.value.id);
    if (i !== -1) students.value[i] = {...students.value[i], ...form.value};
    newCredentials.value = null;
  } else {
    const loginCode     = genStudentCode()
    const loginPassword = genPassword()
    students.value.push({
      id:`stu_${Date.now()}`, schoolId:'school_1', status:'active',
      loginCode, loginPassword, mustChangePassword: true, role: 'student',
      ...form.value
    });
    newCredentials.value = { loginCode, loginPassword, name: form.value.name }
  }
  LocalStorageService.set('students', students.value); closeModal();
}
</script>

<style scoped>
/* Header */
.pg-header { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar    { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back   { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title  { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-new    { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }
.pg-new:active { background:rgba(255,255,255,.32); }

/* Body */
.pg-body { padding:14px; }

/* Search */
.pg-search { display:flex; align-items:center; gap:8px; background:white; border:1.5px solid #e5e7eb; border-radius:12px; padding:10px 14px; margin-bottom:12px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
.pg-search:focus-within { border-color:#1976d2; }
.pg-search-input { flex:1; border:none; outline:none; font-size:14px; color:#1f2937; background:transparent; }
.pg-search-input::placeholder { color:#9ca3af; }
.pg-search-clear { color:#9ca3af; cursor:pointer; font-size:13px; }

/* Meta row */
.pg-meta    { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pg-count   { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.pg-filters { display:flex; gap:4px; }
.pg-filter  { padding:4px 10px; border-radius:20px; border:1.5px solid #e5e7eb; background:white; font-size:11px; font-weight:600; color:#6b7280; cursor:pointer; white-space:nowrap; }
.pg-filter.active { background:#1976d2; border-color:#1976d2; color:white; }

/* Empty */
.pg-empty     { text-align:center; padding:60px 20px 40px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#1976d2; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }

/* Card */
.pg-card    { display:flex; align-items:flex-start; gap:12px; background:white; border-radius:14px; padding:14px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); border:1px solid rgba(0,0,0,.04); }
.pg-avatar  { width:46px; height:46px; border-radius:50%; color:white; font-size:19px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 3px 10px rgba(0,0,0,.15); }
.pg-info    { flex:1; min-width:0; }
.pg-name    { font-size:15px; font-weight:700; color:#1f2937; margin-bottom:5px; }
.pg-row     { display:flex; align-items:center; gap:5px; font-size:12px; margin-bottom:2px; }
.pg-lbl     { flex-shrink:0; }
.pg-val     { color:#374151; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pg-badges  { display:flex; gap:5px; margin-top:6px; flex-wrap:wrap; }
.pg-badge   { font-size:11px; font-weight:600; padding:2px 9px; border-radius:20px; }
.pg-green   { background:#dcfce7; color:#16a34a; }
.pg-blue    { background:#dbeafe; color:#1d
/* Credentials modal */
.cred-banner { background:#f0fdf4; border-radius:12px; padding:14px; text-align:center; }
.cred-notice { font-size:12px; color:#16a34a; font-weight:600; margin-bottom:4px; }
.cred-name   { font-size:16px; font-weight:800; color:#1f2937; }
.cred-box    { background:#f8faff; border:1.5px solid #dbeafe; border-radius:12px; padding:16px; }
.cred-row    { display:flex; align-items:center; justify-content:space-between; }
.cred-lbl    { font-size:12px; font-weight:600; color:#6b7280; }
.cred-val    { font-size:14px; font-weight:700; color:#1f2937; font-family:monospace; }
.cred-val.code { font-size:18px; color:#1565c0; letter-spacing:1px; }
.cred-divider{ height:1px; background:#e5e7eb; margin:10px 0; }
.cred-hint   { font-size:12px; color:#9ca3af; text-align:center; }
:#e5e7eb; margin:12px auto 0; }
.mo-head   { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 10px; border-bottom:1px solid #f3f4f6; }
.mo-title  { font-size:16px; font-weight:700; color:#1f2937; }
.mo-close  { width:30px; height:30px; border-radius:50%; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; color:#6b7280; }
.mo-body   { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
.mo-field  { display:flex; flex-direction:column; gap:5px; }
.mo-row2   { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.mo-label  { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mo-input  { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.mo-input:focus { border-color:#1976d2; background:white; }
.mo-btns   { display:flex; gap:10px; padding-top:4px; }
.mo-cancel { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save   { flex:2; padding:13px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save:disabled { opacity:.45; cursor:default; }
</style>
