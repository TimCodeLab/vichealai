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
        <span class="pg-title">{{ t('subjects.title') }}</span>
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
            :placeholder="t('subjects.search')"
          >
          <span
            v-if="searchQuery"
            class="pg-search-clear"
            @click="searchQuery = ''"
          >✕</span>
        </div>

        <!-- Grade filter -->
        <div class="grade-filter">
          <button
            v-for="g in grades"
            :key="g"
            class="grade-btn"
            :class="{ active: selectedGrade === g }"
            @click="selectedGrade = g"
          >
            {{ g === 'all' ? t('subjects.allGrades') : g }}
          </button>
        </div>

        <div class="pg-meta">
          <span class="pg-count">{{ filtered.length }} {{ t('subjects.subjects') }}</span>
        </div>

        <!-- Empty -->
        <div
          v-if="filtered.length === 0"
          class="pg-empty"
        >
          <div style="font-size:52px;margin-bottom:12px">
            📖
          </div>
          <div class="empty-title">
            {{ t('subjects.notFound') }}
          </div>
          <div class="empty-sub">
            {{ t('subjects.notFoundSub') }}
          </div>
          <button
            class="pg-empty-btn"
            @click="openCreate"
          >
            + {{ t('subjects.add') }}
          </button>
        </div>

        <!-- Subject cards -->
        <div
          v-for="sub in filtered"
          :key="sub.id"
          class="sub-card"
        >
          <div
            class="sub-icon"
            :style="{ background: subColor(sub.name) }"
          >
            {{ sub.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="sub-info">
            <div class="sub-name">
              {{ sub.name }}
            </div>
            <div class="sub-meta-row">
              <span
                v-if="sub.code"
                class="sub-code"
              >{{ sub.code }}</span>
              <span
                v-if="sub.grade"
                class="sub-grade"
              >Grade {{ sub.grade }}</span>
              <span
                v-if="sub.credits"
                class="sub-credits"
              >{{ sub.credits }} cr</span>
            </div>
            <div
              v-if="sub.teacher"
              class="sub-teacher"
            >
              👩‍🏫 {{ sub.teacher }}
            </div>
          </div>
          <div class="pg-actions">
            <button
              class="pg-btn pg-btn-edit"
              @click="editItem(sub)"
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
              @click="deleteItem(sub.id)"
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
              /></svg>
            </button>
          </div>
        </div>

        <div style="height:28px" />
      </div>
    </ion-content>

    <!-- Modal -->
    <ion-modal
      :is-open="showModal"
      @did-dismiss="closeModal"
    >
      <div class="mo-wrap">
        <div class="mo-handle" />
        <div class="mo-head">
          <span class="mo-title">{{ editing ? '✏️ ' + t('subjects.editTitle') : '➕ ' + t('subjects.newTitle') }}</span>
          <button
            class="mo-close"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
        <div class="mo-body">
          <div class="mo-field">
            <label class="mo-label">{{ t('subjects.name') }} *</label><input
              v-model="form.name"
              class="mo-input"
              placeholder="e.g. Mathematics, គណិតវិទ្យា"
            >
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('subjects.code') }}</label><input
                v-model="form.code"
                class="mo-input"
                placeholder="e.g. MATH01"
              >
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('subjects.grade') }}</label>
              <select
                v-model="form.grade"
                class="mo-input"
              >
                <option value="">
                  --
                </option>
                <option
                  v-for="g in gradeOptions"
                  :key="g"
                  :value="g"
                >
                  {{ g }}
                </option>
              </select>
            </div>
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('subjects.credits') }}</label><input
                v-model="form.credits"
                type="number"
                class="mo-input"
                placeholder="3"
              >
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('subjects.teacher') }}</label><input
                v-model="form.teacher"
                class="mo-input"
                placeholder="Teacher name"
              >
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

const searchQuery = ref('');
const showModal = ref(false);
const editing = ref<any>(null);
const selectedGrade = ref('all');

const subjects = ref<any[]>(LocalStorageService.get<any[]>('subjects', []) || [
  {id: 'sub1', name: 'Mathematics', code: 'MATH01', grade: '7', credits: 4, teacher: 'Mr. Dara'},
  {id: 'sub2', name: 'Khmer Literature', code: 'KH01', grade: '7', credits: 4, teacher: 'Mrs. Srey'},
  {id: 'sub3', name: 'English', code: 'ENG01', grade: '8', credits: 3, teacher: 'Mr. James'},
  {id: 'sub4', name: 'Science', code: 'SCI01', grade: '8', credits: 4, teacher: 'Mrs. Bopha'},
  {id: 'sub5', name: 'History', code: 'HIS01', grade: '9', credits: 3, teacher: 'Mr. Chann'},
  {id: 'sub6', name: 'Physical Education', code: 'PE01', grade: '7', credits: 2, teacher: 'Mr. Vutha'},
]);

const form = ref({name: '', code: '', grade: '', credits: '', teacher: ''});

const gradeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'University'];
const grades = computed(() => ['all', ...new Set(subjects.value.map(s => s.grade).filter(Boolean))]);

const filtered = computed(() => {
  let list = subjects.value;
  if (selectedGrade.value !== 'all') list = list.filter(s => s.grade === selectedGrade.value);
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(s => s.name?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q) || s.teacher?.toLowerCase().includes(q));
  }
  return list;
});

const palette = ['#1565c0', '#2e7d32', '#e65100', '#6a1b9a', '#c62828', '#00838f', '#4527a0', '#558b2f', '#1976d2', '#f57f17'];
function subColor(n: string) { return palette[(n?.charCodeAt(0) || 0) % palette.length]; }

function openCreate() { form.value = {name: '', code: '', grade: '', credits: '', teacher: ''}; editing.value = null; showModal.value = true; }
function editItem(s: any) { editing.value = s; form.value = {...s}; showModal.value = true; }
function closeModal() { showModal.value = false; editing.value = null; }

function deleteItem(id: string) {
  if (confirm(t('messages.confirmDelete'))) {
    subjects.value = subjects.value.filter(s => s.id !== id);
    LocalStorageService.set('subjects', subjects.value);
  }
}

function saveItem() {
  if (!form.value.name) return;
  if (editing.value) {
    const i = subjects.value.findIndex(s => s.id === editing.value.id);
    if (i !== -1) subjects.value[i] = {...subjects.value[i], ...form.value};
  } else {
    subjects.value.push({id: `sub_${Date.now()}`, ...form.value});
  }
  LocalStorageService.set('subjects', subjects.value);
  closeModal();
}
</script>

<style scoped>
.pg-header { background:linear-gradient(135deg,#7c3aed 0%,#8b5cf6 45%,#a78bfa 100%); box-shadow:0 4px 20px rgba(124,58,237,.4); }
.pg-bar    { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back   { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title  { font-size:17px; font-weight:700; color:white; }
.pg-new    { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }
.pg-body   { padding:14px; }
.pg-search { display:flex; align-items:center; gap:8px; background:white; border:1.5px solid #e5e7eb; border-radius:12px; padding:10px 14px; margin-bottom:10px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
.pg-search:focus-within { border-color:#7c3aed; }
.pg-search-input { flex:1; border:none; outline:none; font-size:14px; color:#1f2937; background:transparent; }
.pg-search-input::placeholder { color:#9ca3af; }
.pg-search-clear { color:#9ca3af; cursor:pointer; font-size:13px; }

/* Grade filter */
.grade-filter { display:flex; gap:6px; overflow-x:auto; margin-bottom:10px; padding-bottom:2px; }
.grade-btn    { padding:5px 12px; border-radius:20px; border:1.5px solid #e5e7eb; background:white; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer; white-space:nowrap; }
.grade-btn.active { background:#7c3aed; border-color:#7c3aed; color:white; }

.pg-meta  { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pg-count { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.pg-empty { text-align:center; padding:60px 20px 40px; }
.empty-title { font-size:16px; font-weight:600; color:#374151; }
.empty-sub   { font-size:13px; color:#9ca3af; margin-top:4px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#7c3aed; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }

/* Subject card */
.sub-card    { display:flex; align-items:center; gap:12px; background:white; border-radius:14px; padding:14px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.sub-icon    { width:46px; height:46px; border-radius:14px; color:white; font-size:20px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.sub-info    { flex:1; min-width:0; }
.sub-name    { font-size:15px; font-weight:700; color:#1f2937; margin-bottom:4px; }
.sub-meta-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:4px; }
.sub-code    { font-size:11px; font-weight:700; background:#ede9fe; color:#7c3aed; padding:2px 8px; border-radius:8px; font-family:monospace; }
.sub-grade   { font-size:11px; font-weight:700; background:#dbeafe; color:#1d4ed8; padding:2px 8px; border-radius:8px; }
.sub-credits { font-size:11px; font-weight:700; background:#dcfce7; color:#16a34a; padding:2px 8px; border-radius:8px; }
.sub-teacher { font-size:12px; color:#6b7280; }
.pg-actions  { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }
.pg-btn      { width:32px; height:32px; border-radius:8px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.pg-btn-edit { background:#eff6ff; color:#1976d2; }
.pg-btn-del  { background:#fff5f5; color:#ef4444; }

/* Modal */
ion-modal  { --border-radius:20px 20px 0 0; --max-height:85vh; align-items:flex-end; }
.mo-wrap   { background:white; border-radius:20px 20px 0 0; display:flex; flex-direction:column; max-height:85vh; }
.mo-handle { width:36px; height:4px; border-radius:2px; background:#e5e7eb; margin:12px auto 0; }
.mo-head   { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 10px; border-bottom:1px solid #f3f4f6; }
.mo-title  { font-size:16px; font-weight:700; color:#1f2937; }
.mo-close  { width:30px; height:30px; border-radius:50%; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; color:#6b7280; }
.mo-body   { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
.mo-field  { display:flex; flex-direction:column; gap:5px; }
.mo-row2   { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.mo-label  { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mo-input  { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.mo-input:focus { border-color:#7c3aed; background:white; }
.mo-btns   { display:flex; gap:10px; padding-top:4px; }
.mo-cancel { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save   { flex:2; padding:13px; background:linear-gradient(135deg,#7c3aed,#8b5cf6); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save:disabled { opacity:.45; cursor:default; }

.pg-body.anim-fade-up { animation:fadeUp .4s ease both; }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
</style>
