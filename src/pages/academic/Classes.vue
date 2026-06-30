<template>
  <ion-page>
    <ion-header class="pg-header">
      <div class="pg-bar">
        <button class="pg-back" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="pg-title">{{ t('nav.classes') }}</span>
        <button class="pg-new" @click="openCreate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
          {{ t('actions.create') }}
        </button>
      </div>
    </ion-header>

    <ion-content style="--background:#f5f7fa">
      <div class="pg-body">
        <div class="pg-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#9ca3af" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/></svg>
          <input v-model="searchQuery" class="pg-search-input" :placeholder="t('actions.search') + '...'" />
          <span v-if="searchQuery" class="pg-search-clear" @click="searchQuery = ''">✕</span>
        </div>

        <div class="pg-meta">
          <span class="pg-count">{{ filtered.length }} {{ t('nav.classes') }}</span>
        </div>

        <div v-if="filtered.length === 0" class="pg-empty">
          <div style="font-size:52px;margin-bottom:12px">🏫</div>
          <div style="font-size:16px;font-weight:600;color:#374151">No classes found</div>
          <div style="font-size:13px;color:#9ca3af;margin-top:4px">Create your first class</div>
          <button class="pg-empty-btn" @click="openCreate">+ Add Class</button>
        </div>

        <!-- Class cards as grid for compact look -->
        <div class="pg-grid">
          <div v-for="cls in filtered" :key="cls.id" class="pg-cls-card">
            <div class="pg-cls-top" :style="{ background: aColor(cls.name) }">
              <span class="pg-cls-icon">🏫</span>
              <div class="pg-cls-actions">
                <button class="pg-btn-sm pg-btn-edit" @click="editItem(cls)">✏️</button>
                <button class="pg-btn-sm pg-btn-del" @click="deleteItem(cls.id)">🗑️</button>
              </div>
            </div>
            <div class="pg-cls-body">
              <div class="pg-cls-name">{{ cls.name }}</div>
              <div class="pg-cls-row" v-if="cls.grade">Grade: {{ cls.grade }}</div>
              <div class="pg-cls-row">{{ studentCount(cls.id) }} students</div>
              <div class="pg-cls-row" v-if="cls.room">Room: {{ cls.room }}</div>
            </div>
          </div>
        </div>

        <div style="height:28px"></div>
      </div>
    </ion-content>

    <ion-modal :is-open="showModal" @did-dismiss="closeModal">
      <div class="mo-wrap">
        <div class="mo-handle"></div>
        <div class="mo-head">
          <span class="mo-title">{{ editing ? '✏️ Edit Class' : '➕ New Class' }}</span>
          <button class="mo-close" @click="closeModal">✕</button>
        </div>
        <div class="mo-body">
          <div class="mo-field"><label class="mo-label">Class Name *</label><input v-model="form.name" class="mo-input" placeholder="e.g. Grade 7A" /></div>
          <div class="mo-row2">
            <div class="mo-field"><label class="mo-label">Grade</label><input v-model="form.grade" class="mo-input" placeholder="7" /></div>
            <div class="mo-field"><label class="mo-label">Room</label><input v-model="form.room" class="mo-input" placeholder="101" /></div>
          </div>
          <div class="mo-field"><label class="mo-label">Description</label><input v-model="form.description" class="mo-input" placeholder="Optional notes" /></div>
          <div class="mo-field"><label class="mo-label">Academic Year</label><input v-model="form.academicYear" class="mo-input" placeholder="2025-2026" /></div>
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
const classes = ref<any[]>(LocalStorageService.get<any[]>('classes', []) || [])
const students = ref<any[]>(LocalStorageService.get<any[]>('students', []) || [])
const form = ref({ name:'', grade:'', room:'', description:'', academicYear:'' })

const filtered = computed(() => {
  if (!searchQuery.value) return classes.value
  const q = searchQuery.value.toLowerCase()
  return classes.value.filter(c => c.name?.toLowerCase().includes(q) || c.grade?.toLowerCase().includes(q))
})

const palette = ['#1976d2','#2e7d32','#e65100','#6a1b9a','#c62828','#00838f','#4527a0','#558b2f']
function aColor(n: string) { return palette[(n?.charCodeAt(0)||0) % palette.length] }
function studentCount(id: string) { return students.value.filter(s=>s.classId===id).length }

function openCreate() { form.value={name:'',grade:'',room:'',description:'',academicYear:''}; editing.value=null; showModal.value=true }
function editItem(c: any) { editing.value=c; form.value={...c}; showModal.value=true }
function closeModal()     { showModal.value=false; editing.value=null }
function deleteItem(id: string) {
  if (confirm(t('messages.confirmDelete'))) { classes.value=classes.value.filter(c=>c.id!==id); LocalStorageService.set('classes',classes.value) }
}
function saveItem() {
  if (!form.value.name) return
  if (editing.value) {
    const i = classes.value.findIndex(c=>c.id===editing.value.id)
    if (i!==-1) classes.value[i]={...classes.value[i],...form.value}
  } else {
    classes.value.push({id:`cls_${Date.now()}`,schoolId:'school_1',...form.value})
  }
  LocalStorageService.set('classes',classes.value); closeModal()
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
.pg-meta   { margin-bottom:12px; }
.pg-count  { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.pg-empty  { text-align:center; padding:60px 20px 40px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#1976d2; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }
/* Grid layout for classes */
.pg-grid   { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.pg-cls-card { background:white; border-radius:14px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.pg-cls-top  { padding:18px 12px 14px; display:flex; align-items:flex-start; justify-content:space-between; }
.pg-cls-icon { font-size:28px; }
.pg-cls-actions { display:flex; gap:4px; }
.pg-btn-sm { background:rgba(255,255,255,.25); border:none; border-radius:6px; padding:4px 6px; cursor:pointer; font-size:13px; }
.pg-cls-body { padding:10px 12px 12px; }
.pg-cls-name { font-size:15px; font-weight:700; color:#1f2937; margin-bottom:4px; }
.pg-cls-row  { font-size:12px; color:#6b7280; font-weight:500; margin-bottom:2px; }
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
</style>
