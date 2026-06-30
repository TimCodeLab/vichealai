<template>
  <ion-page>
    <ion-header class="pg-header">
      <div class="pg-bar">
        <button class="pg-back" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="pg-title">{{ t('nav.attendance') }}</span>
        <button class="pg-new" @click="openCreate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
          {{ t('actions.create') }}
        </button>
      </div>
      <!-- Date navigator -->
      <div class="att-date-bar">
        <button class="att-nav" @click="changeDate(-1)">‹</button>
        <span class="att-date-lbl">{{ formatDateHeader(selectedDate) }}</span>
        <button class="att-nav" @click="changeDate(1)">›</button>
      </div>
    </ion-header>

    <ion-content style="--background:#f5f7fa">
      <div class="pg-body">
        <!-- Stats -->
        <div class="att-stats">
          <div class="att-stat" style="background:linear-gradient(135deg,#2e7d32,#4caf50)">
            <span class="att-num">{{ countStatus('present') }}</span>
            <span class="att-lbl">Present</span>
          </div>
          <div class="att-stat" style="background:linear-gradient(135deg,#c62828,#ef5350)">
            <span class="att-num">{{ countStatus('absent') }}</span>
            <span class="att-lbl">Absent</span>
          </div>
          <div class="att-stat" style="background:linear-gradient(135deg,#e65100,#ff9800)">
            <span class="att-num">{{ countStatus('late') }}</span>
            <span class="att-lbl">Late</span>
          </div>
          <div class="att-stat" style="background:linear-gradient(135deg,#6a1b9a,#ba68c8)">
            <span class="att-num">{{ countStatus('sick') }}</span>
            <span class="att-lbl">Sick</span>
          </div>
        </div>

        <div class="pg-meta">
          <span class="pg-count">{{ todayRecords.length }} records</span>
        </div>

        <div v-if="todayRecords.length === 0" class="pg-empty">
          <div style="font-size:52px;margin-bottom:12px">📋</div>
          <div style="font-size:16px;font-weight:600;color:#374151">No records for this date</div>
          <button class="pg-empty-btn" @click="openCreate">+ Mark Attendance</button>
        </div>

        <div v-for="rec in todayRecords" :key="rec.id" class="pg-card">
          <div class="pg-avatar" :style="{ background: aColor(getStudentName(rec.studentId)) }">{{ aInitial(getStudentName(rec.studentId)) }}</div>
          <div class="pg-info">
            <div class="pg-name">{{ getStudentName(rec.studentId) }}</div>
            <div class="pg-row"><span>📅</span><span class="pg-val">{{ formatDate(rec.date) }}</span></div>
            <div class="pg-row" v-if="rec.remarks"><span>📝</span><span class="pg-val">{{ rec.remarks }}</span></div>
            <span class="pg-badge" :class="statusBadge(rec.status)">{{ rec.status }}</span>
          </div>
          <div class="pg-actions">
            <button class="pg-btn pg-btn-edit" @click="editItem(rec)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <button class="pg-btn pg-btn-del" @click="deleteItem(rec.id)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <div style="height:28px"></div>
      </div>
    </ion-content>

    <ion-modal :is-open="showModal" @did-dismiss="closeModal">
      <div class="mo-wrap">
        <div class="mo-handle"></div>
        <div class="mo-head">
          <span class="mo-title">{{ editing ? '✏️ Edit Record' : '📋 Mark Attendance' }}</span>
          <button class="mo-close" @click="closeModal">✕</button>
        </div>
        <div class="mo-body">
          <div class="mo-field">
            <label class="mo-label">{{ t('nav.students') }}</label>
            <select v-model="form.studentId" class="mo-input">
              <option value="">-- Select Student --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="mo-field"><label class="mo-label">Date</label><input v-model="form.date" type="date" class="mo-input" /></div>
          <div class="mo-field">
            <label class="mo-label">Status</label>
            <div class="att-status-btns">
              <button v-for="s in statuses" :key="s.value" class="att-status-btn" :class="{ active: form.status === s.value, [s.cls]: true }" @click="form.status = s.value">{{ s.label }}</button>
            </div>
          </div>
          <div class="mo-field"><label class="mo-label">Remarks</label><input v-model="form.remarks" class="mo-input" placeholder="Optional..." /></div>
          <div class="mo-btns">
            <button class="mo-cancel" @click="closeModal">{{ t('actions.cancel') }}</button>
            <button class="mo-save" @click="saveItem" :disabled="!form.studentId">{{ t('actions.save') }}</button>
          </div>
        </div>
      </div>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonHeader, IonContent, IonModal } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'

const router = useRouter()
const { t } = useI18n()
const showModal = ref(false)
const editing = ref<any>(null)
const items = ref<any[]>(LocalStorageService.get<any[]>('attendance', []) || [])
const students = ref<any[]>(LocalStorageService.get<any[]>('students', []) || [])
const selectedDate = ref(new Date().toISOString().split('T')[0])
const form = ref({ studentId:'', date:selectedDate.value, status:'present', remarks:'' })

const statuses = [
  { value:'present', label:'Present', cls:'btn-present' },
  { value:'absent',  label:'Absent',  cls:'btn-absent'  },
  { value:'late',    label:'Late',    cls:'btn-late'    },
  { value:'sick',    label:'Sick',    cls:'btn-sick'    },
]

const todayRecords = computed(() => items.value.filter(r => r.date?.startsWith(selectedDate.value)))
function countStatus(s: string) { return todayRecords.value.filter(r=>r.status===s).length }
function getStudentName(id: string) { return students.value.find(s=>s.id===id)?.name || 'Unknown' }
function formatDate(d: string)       { return d ? new Date(d).toLocaleDateString() : '—' }
function formatDateHeader(d: string) { return new Date(d).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}) }
function changeDate(dir: number)     { const d=new Date(selectedDate.value); d.setDate(d.getDate()+dir); selectedDate.value=d.toISOString().split('T')[0] }

const palette = ['#1976d2','#2e7d32','#e65100','#6a1b9a','#c62828','#00838f']
function aColor(n: string)   { return palette[(n?.charCodeAt(0)||0) % palette.length] }
function aInitial(n: string) { return (n||'?').charAt(0).toUpperCase() }
function statusBadge(s: string) {
  return { present:'badge-green', absent:'badge-red', late:'badge-orange', sick:'badge-purple' }[s] || 'badge-gray'
}

function openCreate() { form.value={studentId:'',date:selectedDate.value,status:'present',remarks:''}; editing.value=null; showModal.value=true }
function editItem(i: any) { editing.value=i; form.value={...i}; showModal.value=true }
function closeModal()     { showModal.value=false; editing.value=null }
function deleteItem(id: string) {
  if (confirm(t('messages.confirmDelete'))) { items.value=items.value.filter(i=>i.id!==id); LocalStorageService.set('attendance',items.value) }
}
function saveItem() {
  if (!form.value.studentId) return
  if (editing.value) {
    const idx=items.value.findIndex(i=>i.id===editing.value.id)
    if (idx!==-1) items.value[idx]={...items.value[idx],...form.value}
  } else {
    items.value.push({id:`att_${Date.now()}`,schoolId:'school_1',createdAt:new Date().toISOString(),...form.value})
  }
  LocalStorageService.set('attendance',items.value); closeModal()
}
</script>

<style scoped>
.pg-header { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar    { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back   { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title  { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-new    { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }
/* Date bar */
.att-date-bar { display:flex; align-items:center; justify-content:center; gap:14px; padding:6px 14px 12px; }
.att-nav  { background:rgba(255,255,255,.2); border:none; color:white; font-size:22px; width:32px; height:32px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.att-date-lbl { font-size:13px; font-weight:600; color:white; min-width:180px; text-align:center; }
/* Stats */
.att-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:12px; }
.att-stat  { border-radius:12px; padding:10px 6px; text-align:center; display:flex; flex-direction:column; gap:2px; }
.att-num   { font-size:22px; font-weight:800; color:white; }
.att-lbl   { font-size:10px; font-weight:600; color:rgba(255,255,255,.85); }
/* Body */
.pg-body   { padding:14px; }
.pg-meta   { margin-bottom:12px; }
.pg-count  { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.pg-empty  { text-align:center; padding:60px 20px 40px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#1976d2; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }
/* Cards */
.pg-card   { display:flex; align-items:flex-start; gap:12px; background:white; border-radius:14px; padding:14px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.pg-avatar { width:46px; height:46px; border-radius:50%; color:white; font-size:19px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 3px 10px rgba(0,0,0,.15); }
.pg-info   { flex:1; min-width:0; }
.pg-name   { font-size:15px; font-weight:700; color:#1f2937; margin-bottom:5px; }
.pg-row    { display:flex; align-items:center; gap:5px; font-size:12px; margin-bottom:2px; }
.pg-val    { color:#374151; font-weight:500; }
.pg-badge  { display:inline-block; font-size:11px; font-weight:600; padding:2px 9px; border-radius:20px; margin-top:6px; text-transform:capitalize; }
.badge-green  { background:#dcfce7; color:#16a34a; }
.badge-red    { background:#fee2e2; color:#dc2626; }
.badge-orange { background:#ffedd5; color:#c2410c; }
.badge-purple { background:#f3e8ff; color:#7e22ce; }
.badge-gray   { background:#f3f4f6; color:#6b7280; }
.pg-actions { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }
.pg-btn    { width:32px; height:32px; border-radius:8px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.pg-btn-edit { background:#eff6ff; color:#1976d2; }
.pg-btn-del  { background:#fff5f5; color:#ef4444; }
/* Status buttons */
.att-status-btns { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; }
.att-status-btn  { padding:10px; border-radius:10px; border:2px solid #e5e7eb; background:#f9fafb; font-size:13px; font-weight:600; cursor:pointer; color:#6b7280; }
.btn-present.active { border-color:#22c55e; background:#dcfce7; color:#16a34a; }
.btn-absent.active  { border-color:#ef4444; background:#fee2e2; color:#dc2626; }
.btn-late.active    { border-color:#f97316; background:#ffedd5; color:#c2410c; }
.btn-sick.active    { border-color:#a855f7; background:#f3e8ff; color:#7e22ce; }
/* Modal */
ion-modal  { --border-radius:20px 20px 0 0; --max-height:88vh; align-items:flex-end; }
.mo-wrap   { background:white; border-radius:20px 20px 0 0; display:flex; flex-direction:column; max-height:88vh; }
.mo-handle { width:36px; height:4px; border-radius:2px; background:#e5e7eb; margin:12px auto 0; }
.mo-head   { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 10px; border-bottom:1px solid #f3f4f6; }
.mo-title  { font-size:16px; font-weight:700; color:#1f2937; }
.mo-close  { width:30px; height:30px; border-radius:50%; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; color:#6b7280; }
.mo-body   { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
.mo-field  { display:flex; flex-direction:column; gap:5px; }
.mo-label  { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mo-input  { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.mo-input:focus { border-color:#1976d2; background:white; }
.mo-btns   { display:flex; gap:10px; padding-top:4px; }
.mo-cancel { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save   { flex:2; padding:13px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save:disabled { opacity:.45; cursor:default; }
</style>
