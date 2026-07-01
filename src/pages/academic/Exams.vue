<template>
  <ion-page>
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
        <span class="pg-title">{{ t('nav.exams') }}</span>
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
      <!-- Filter tabs in header -->
      <div class="tabs-bar">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </ion-header>

    <ion-content style="--background:#f5f7fa">
      <div class="pg-body anim-fade-up">
        <div class="pg-meta">
          <span class="pg-count">{{ filtered.length }} {{ t('nav.exams') }}</span>
        </div>

        <div
          v-if="filtered.length === 0"
          class="pg-empty"
        >
          <div style="font-size:52px;margin-bottom:12px">
            📊
          </div>
          <div style="font-size:16px;font-weight:600;color:#374151">
            {{ t('exams.notFound') }}
          </div>
          <button
            class="pg-empty-btn"
            @click="openCreate"
          >
            + {{ t('exams.add') }}
          </button>
        </div>

        <div
          v-for="exam in filtered"
          :key="exam.id"
          class="pg-card"
        >
          <div
            class="pg-exam-icon"
            :style="{ background: statusColor(exam.status) }"
          >
            📊
          </div>
          <div class="pg-info">
            <div class="pg-name">
              {{ exam.name }}
            </div>
            <div
              v-if="exam.description"
              class="pg-row"
            >
              <span style="color:#6b7280;font-size:12px">{{ exam.description }}</span>
            </div>
            <div class="pg-row">
              <span>📅</span><span class="pg-val">{{ formatDate(exam.startDate) }} – {{ formatDate(exam.endDate) }}</span>
            </div>
            <div
              v-if="exam.totalMarks"
              class="pg-row"
            >
              <span>🎯</span><span class="pg-val">{{ t('exams.totalMarks') }}: {{ exam.totalMarks }} {{ t('exams.marks') }}</span>
            </div>
            <span
              class="pg-badge"
              :class="examBadge(exam.status)"
            >{{ t('exams.' + (exam.status || 'scheduled')) }}</span>
          </div>
          <div class="pg-actions">
            <button
              class="pg-btn pg-btn-edit"
              @click="editItem(exam)"
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
              @click="deleteItem(exam.id)"
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

    <ion-modal
      :is-open="showModal"
      @did-dismiss="closeModal"
    >
      <div class="mo-wrap">
        <div class="mo-handle" />
        <div class="mo-head">
          <span class="mo-title">{{ editing ? '✏️ ' + t('exams.editTitle') : '📊 ' + t('exams.newTitle') }}</span>
          <button
            class="mo-close"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
        <div class="mo-body">
          <div class="mo-field">
            <label class="mo-label">{{ t('exams.examName') }} *</label><input
              v-model="form.name"
              class="mo-input"
              placeholder="e.g. Mid-Term Examination"
            >
          </div>
          <div class="mo-field">
            <label class="mo-label">{{ t('forms.description') }}</label><input
              v-model="form.description"
              class="mo-input"
              placeholder="Optional"
            >
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('exams.startDate') }}</label><input
                v-model="form.startDate"
                type="date"
                class="mo-input"
              >
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('exams.endDate') }}</label><input
                v-model="form.endDate"
                type="date"
                class="mo-input"
              >
            </div>
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('exams.totalMarks') }}</label><input
                v-model="form.totalMarks"
                type="number"
                class="mo-input"
                placeholder="100"
              >
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('exams.status') }}</label>
              <select
                v-model="form.status"
                class="mo-input"
              >
                <option value="scheduled">
                  {{ t('exams.scheduled') }}
                </option>
                <option value="ongoing">
                  {{ t('exams.ongoing') }}
                </option>
                <option value="completed">
                  {{ t('exams.completed') }}
                </option>
              </select>
            </div>
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
const showModal = ref(false);
const editing = ref<any>(null);
const activeTab = ref('all');
const items = ref<any[]>(LocalStorageService.get<any[]>('exams', []) || []);
const form = ref({name: '', description: '', startDate: '', endDate: '', totalMarks: '', status: 'scheduled'});

const tabs = computed(() => [
  {value: 'all', label: t('exams.all')},
  {value: 'scheduled', label: t('exams.scheduled')},
  {value: 'ongoing', label: t('exams.ongoing')},
  {value: 'completed', label: t('exams.completed')},
]);

const filtered = computed(() => activeTab.value === 'all' ? items.value : items.value.filter(e=>e.status === activeTab.value));
function formatDate(d: string) { return d ? new Date(d).toLocaleDateString() : '—'; }
function statusColor(s: string) { return {scheduled: '#1976d2', ongoing: '#e65100', completed: '#2e7d32'}[s] || '#6a1b9a'; }
function examBadge(s: string) { return {scheduled: 'badge-blue', ongoing: 'badge-orange', completed: 'badge-green'}[s] || 'badge-gray'; }

function openCreate() { form.value = {name: '', description: '', startDate: '', endDate: '', totalMarks: '', status: 'scheduled'}; editing.value = null; showModal.value = true; }
function editItem(i: any) { editing.value = i; form.value = {...i}; showModal.value = true; }
function closeModal() { showModal.value = false; editing.value = null; }
function deleteItem(id: string) {
  if (confirm(t('messages.confirmDelete'))) { items.value = items.value.filter(i=>i.id !== id); LocalStorageService.set('exams', items.value); }
}
function saveItem() {
  if (!form.value.name) return;
  if (editing.value) {
    const idx = items.value.findIndex(i=>i.id === editing.value.id);
    if (idx !== -1) items.value[idx] = {...items.value[idx], ...form.value};
  } else {
    items.value.push({id: `exam_${Date.now()}`, schoolId: 'school_1', ...form.value});
  }
  LocalStorageService.set('exams', items.value); closeModal();
}
</script>

<style scoped>
.pg-header  { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar     { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back    { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title   { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-new     { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }
/* Tabs */
.tabs-bar   { display:flex; gap:6px; padding:0 14px 12px; overflow-x:auto; }
.tab-btn    { padding:5px 14px; border-radius:20px; border:1.5px solid rgba(255,255,255,.3); background:rgba(255,255,255,.12); font-size:12px; font-weight:600; color:rgba(255,255,255,.8); cursor:pointer; white-space:nowrap; }
.tab-btn.active { background:white; color:#1976d2; border-color:white; }
/* Body */
.pg-body    { padding:14px; }
.pg-meta    { margin-bottom:12px; }
.pg-count   { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.pg-empty   { text-align:center; padding:60px 20px 40px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#1976d2; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }
/* Card */
.pg-card    { display:flex; align-items:flex-start; gap:12px; background:white; border-radius:14px; padding:14px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); transition:transform .18s,box-shadow .18s; }
.pg-card:active { transform:scale(.98); }
.pg-exam-icon { width:46px; height:46px; border-radius:12px; font-size:22px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pg-info    { flex:1; min-width:0; }
.pg-name    { font-size:15px; font-weight:700; color:#1f2937; margin-bottom:5px; }
.pg-row     { display:flex; align-items:center; gap:5px; font-size:12px; margin-bottom:2px; }
.pg-val     { color:#374151; font-weight:500; }
.pg-badge   { display:inline-block; font-size:11px; font-weight:600; padding:2px 9px; border-radius:20px; margin-top:6px; text-transform:capitalize; }
.badge-blue   { background:#dbeafe; color:#1d4ed8; }
.badge-orange { background:#ffedd5; color:#c2410c; }
.badge-green  { background:#dcfce7; color:#16a34a; }
.badge-gray   { background:#f3f4f6; color:#6b7280; }
.pg-actions { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }
.pg-btn     { width:32px; height:32px; border-radius:8px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.pg-btn-edit { background:#eff6ff; color:#1976d2; }
.pg-btn-del  { background:#fff5f5; color:#ef4444; }
/* Modal */
ion-modal   { --border-radius:20px 20px 0 0; --max-height:88vh; align-items:flex-end; }
.mo-wrap    { background:white; border-radius:20px 20px 0 0; display:flex; flex-direction:column; max-height:88vh; }
.mo-handle  { width:36px; height:4px; border-radius:2px; background:#e5e7eb; margin:12px auto 0; }
.mo-head    { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 10px; border-bottom:1px solid #f3f4f6; }
.mo-title   { font-size:16px; font-weight:700; color:#1f2937; }
.mo-close   { width:30px; height:30px; border-radius:50%; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; color:#6b7280; }
.mo-body    { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
.mo-field   { display:flex; flex-direction:column; gap:5px; }
.mo-row2    { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.mo-label   { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mo-input   { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.mo-input:focus { border-color:#1976d2; background:white; }
.mo-btns    { display:flex; gap:10px; padding-top:4px; }
.mo-cancel  { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save    { flex:2; padding:13px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save:disabled { opacity:.45; cursor:default; }
.pg-body.anim-fade-up { animation: fadeUp .4s ease both; }
.pg-card { animation: fadeUp .35s ease both; }
.pg-card:nth-child(1){animation-delay:.05s}.pg-card:nth-child(2){animation-delay:.10s}.pg-card:nth-child(3){animation-delay:.15s}.pg-card:nth-child(4){animation-delay:.20s}.pg-card:nth-child(5){animation-delay:.25s}.pg-card:nth-child(6){animation-delay:.30s}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
