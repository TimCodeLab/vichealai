<template>
  <ion-page>
    <ion-header class="pg-header">
      <div class="pg-bar">
        <button class="pg-back" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="pg-title">{{ t('nav.teachers') }}</span>
        <button class="pg-new" @click="openCreate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
          {{ t('actions.create') }}
        </button>
      </div>
    </ion-header>

    <ion-content style="--background:#f5f7fa">
      <div class="pg-body anim-fade-up">
        <div class="pg-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#9ca3af" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/></svg>
          <input v-model="searchQuery" class="pg-search-input" :placeholder="t('actions.search') + '...'" />
          <span v-if="searchQuery" class="pg-search-clear" @click="searchQuery = ''">✕</span>
        </div>

        <div class="pg-meta">
          <span class="pg-count">{{ filtered.length }} {{ t('nav.teachers') }}</span>
        </div>

        <div v-if="filtered.length === 0" class="pg-empty">
          <div style="font-size:52px;margin-bottom:12px">👩‍🏫</div>
          <div style="font-size:16px;font-weight:600;color:#374151">No teachers found</div>
          <div style="font-size:13px;color:#9ca3af;margin-top:4px">Add a teacher to get started</div>
          <button class="pg-empty-btn" @click="openCreate">+ Add Teacher</button>
        </div>

        <div v-for="teacher in filtered" :key="teacher.id" class="pg-card">
          <div class="pg-avatar" :style="{ background: aColor(teacher.name) }">{{ aInitial(teacher.name) }}</div>
          <div class="pg-info">
            <div class="pg-name">{{ teacher.name }}</div>
            <div class="pg-row"><span class="pg-lbl">✉️</span><span class="pg-val">{{ teacher.email || '—' }}</span></div>
            <div class="pg-row"><span class="pg-lbl">📱</span><span class="pg-val">{{ teacher.phone || '—' }}</span></div>
            <div class="pg-row" v-if="teacher.subject"><span class="pg-lbl">📚</span><span class="pg-val">{{ teacher.subject }}</span></div>
            <div class="pg-badges">
              <span class="pg-badge pg-green">● Active</span>
              <span v-if="teacher.qualification" class="pg-badge pg-blue">{{ teacher.qualification }}</span>
            </div>
          </div>
          <div class="pg-actions">
            <button class="pg-btn pg-btn-edit" @click="editItem(teacher)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <button class="pg-btn pg-btn-del" @click="deleteItem(teacher.id)">
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
          <span class="mo-title">{{ editing ? '✏️ Edit Teacher' : '➕ New Teacher' }}</span>
          <button class="mo-close" @click="closeModal">✕</button>
        </div>
        <div class="mo-body">
          <div class="mo-field"><label class="mo-label">Full Name *</label><input v-model="form.name" class="mo-input" placeholder="e.g. Dara Sok" /></div>
          <div class="mo-field"><label class="mo-label">Email</label><input v-model="form.email" type="email" class="mo-input" placeholder="teacher@school.edu.kh" /></div>
          <div class="mo-row2">
            <div class="mo-field"><label class="mo-label">Phone</label><input v-model="form.phone" class="mo-input" placeholder="012 xxx xxx" /></div>
            <div class="mo-field"><label class="mo-label">Qualification</label><input v-model="form.qualification" class="mo-input" placeholder="B.Ed, M.Ed..." /></div>
          </div>
          <div class="mo-field"><label class="mo-label">Subject Specialization</label><input v-model="form.subject" class="mo-input" placeholder="e.g. Mathematics" /></div>
          <div class="mo-field"><label class="mo-label">Date of Birth</label><input v-model="form.dateOfBirth" type="date" class="mo-input" /></div>
          <div class="mo-btns">
            <button class="mo-cancel" @click="closeModal">{{ t('actions.cancel') }}</button>
            <button class="mo-save" @click="saveItem" :disabled="!form.name">{{ t('actions.save') }}</button>
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
const searchQuery = ref('')
const showModal = ref(false)
const editing = ref<any>(null)
const teachers = ref<any[]>(LocalStorageService.get<any[]>('teachers', []) || [])
const form = ref({ name:'', email:'', phone:'', qualification:'', subject:'', dateOfBirth:'' })

const filtered = computed(() => {
  if (!searchQuery.value) return teachers.value
  const q = searchQuery.value.toLowerCase()
  return teachers.value.filter(t => t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q))
})

const palette = ['#1976d2','#2e7d32','#e65100','#6a1b9a','#c62828','#00838f','#4527a0','#558b2f']
function aColor(n: string)   { return palette[(n?.charCodeAt(0)||0) % palette.length] }
function aInitial(n: string) { return (n||'?').charAt(0).toUpperCase() }

function openCreate() { form.value={name:'',email:'',phone:'',qualification:'',subject:'',dateOfBirth:''}; editing.value=null; showModal.value=true }
function editItem(t: any)    { editing.value=t; form.value={...t}; showModal.value=true }
function closeModal()        { showModal.value=false; editing.value=null }

function deleteItem(id: string) {
  if (confirm(t('messages.confirmDelete'))) { teachers.value=teachers.value.filter(t=>t.id!==id); LocalStorageService.set('teachers',teachers.value) }
}
function saveItem() {
  if (!form.value.name) return
  if (editing.value) {
    const i = teachers.value.findIndex(t=>t.id===editing.value.id)
    if (i!==-1) teachers.value[i]={...teachers.value[i],...form.value}
  } else {
    teachers.value.push({id:`tch_${Date.now()}`,schoolId:'school_1',status:'active',...form.value})
  }
  LocalStorageService.set('teachers',teachers.value); closeModal()
}
</script>

<style scoped>
.pg-header { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar    { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back   { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title  { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-new    { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }
.pg-body   { padding:14px; }
.pg-search { display:flex; align-items:center; gap:8px; background:white; border:1.5px solid #e5e7eb; border-radius:12px; padding:10px 14px; margin-bottom:12px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
.pg-search:focus-within { border-color:#1976d2; }
.pg-search-input { flex:1; border:none; outline:none; font-size:14px; color:#1f2937; background:transparent; }
.pg-search-input::placeholder { color:#9ca3af; }
.pg-search-clear { color:#9ca3af; cursor:pointer; font-size:13px; }
.pg-meta   { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pg-count  { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.pg-empty  { text-align:center; padding:60px 20px 40px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#1976d2; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }
.pg-card   { display:flex; align-items:flex-start; gap:12px; background:white; border-radius:14px; padding:14px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); transition:transform .18s,box-shadow .18s; }
.pg-card:active { transform:scale(.98); }
.pg-avatar { width:46px; height:46px; border-radius:50%; color:white; font-size:19px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 3px 10px rgba(0,0,0,.15); }
.pg-info   { flex:1; min-width:0; }
.pg-name   { font-size:15px; font-weight:700; color:#1f2937; margin-bottom:5px; }
.pg-row    { display:flex; align-items:center; gap:5px; font-size:12px; margin-bottom:2px; }
.pg-lbl    { flex-shrink:0; }
.pg-val    { color:#374151; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pg-badges { display:flex; gap:5px; margin-top:6px; flex-wrap:wrap; }
.pg-badge  { font-size:11px; font-weight:600; padding:2px 9px; border-radius:20px; }
.pg-green  { background:#dcfce7; color:#16a34a; }
.pg-blue   { background:#dbeafe; color:#1d4ed8; }
.pg-actions { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }
.pg-btn    { width:32px; height:32px; border-radius:8px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.pg-btn-edit { background:#eff6ff; color:#1976d2; }
.pg-btn-del  { background:#fff5f5; color:#ef4444; }
ion-modal  { --border-radius:20px 20px 0 0; --max-height:88vh; align-items:flex-end; }
.mo-wrap   { background:white; border-radius:20px 20px 0 0; display:flex; flex-direction:column; max-height:88vh; }
.mo-handle { width:36px; height:4px; border-radius:2px; background:#e5e7eb; margin:12px auto 0; }
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
.pg-body.anim-fade-up { animation: fadeUp .4s ease both; }
.pg-card { animation: fadeUp .35s ease both; }
.pg-card:nth-child(1){animation-delay:.05s}.pg-card:nth-child(2){animation-delay:.10s}.pg-card:nth-child(3){animation-delay:.15s}.pg-card:nth-child(4){animation-delay:.20s}.pg-card:nth-child(5){animation-delay:.25s}.pg-card:nth-child(6){animation-delay:.30s}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
