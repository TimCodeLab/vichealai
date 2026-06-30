<template>
  <ion-page>
    <ion-header class="pg-header">
      <div class="pg-bar">
        <button class="pg-back" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="pg-title">{{ t('nav.homework') }}</span>
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
          <span v-if="searchQuery" @click="searchQuery=''" style="color:#9ca3af;cursor:pointer;font-size:13px">✕</span>
        </div>

        <div class="pg-meta">
          <span class="pg-count">{{ filtered.length }} {{ t('homework.assignmentsLabel') }}</span>
          <div style="display:flex;gap:4px">
            <button class="pg-filter" :class="{ active: filter==='all' }"     @click="filter='all'">{{ t('homework.all') }}</button>
            <button class="pg-filter" :class="{ active: filter==='pending' }" @click="filter='pending'">{{ t('homework.pending') }}</button>
            <button class="pg-filter" :class="{ active: filter==='overdue' }" @click="filter='overdue'">{{ t('homework.overdue') }}</button>
          </div>
        </div>

        <div v-if="filtered.length === 0" class="pg-empty">
          <div style="font-size:52px;margin-bottom:12px">📝</div>
          <div style="font-size:16px;font-weight:600;color:#374151">{{ t('homework.notFound') }}</div>
          <button class="pg-empty-btn" @click="openCreate">+ {{ t('homework.add') }}</button>
        </div>

        <div v-for="hw in filtered" :key="hw.id" class="pg-card">
          <div class="pg-hw-icon" :style="{ background: aColor(hw.title) }">📝</div>
          <div class="pg-info">
            <div class="pg-name">{{ hw.title }}</div>
            <div class="pg-row" v-if="hw.description"><span style="color:#6b7280;font-size:12px">{{ hw.description }}</span></div>
            <div class="pg-row"><span>🏫</span><span class="pg-val">{{ getClassName(hw.classId) }}</span></div>
            <div class="pg-row"><span>📅</span><span class="pg-val" :class="{ 'overdue-text': isOverdue(hw.dueDate) }">{{ t('homework.dueLabel') }}: {{ formatDate(hw.dueDate) }}</span></div>
            <span class="pg-badge" :class="isOverdue(hw.dueDate) ? 'badge-red' : 'badge-orange'">{{ isOverdue(hw.dueDate) ? '⚠ ' + t('homework.overdue') : '⏳ ' + t('homework.pending') }}</span>
          </div>
          <div class="pg-actions">
            <button class="pg-btn pg-btn-edit" @click="editItem(hw)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <button class="pg-btn pg-btn-del" @click="deleteItem(hw.id)">
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
          <span class="mo-title">{{ editing ? '✏️ ' + t('homework.editTitle') : '📝 ' + t('homework.newTitle') }}</span>
          <button class="mo-close" @click="closeModal">✕</button>
        </div>
        <div class="mo-body">
          <div class="mo-field"><label class="mo-label">{{ t('homework.titleLabel') }} *</label><input v-model="form.title" class="mo-input" placeholder="e.g. Math Chapter 5 Exercises" /></div>
          <div class="mo-field"><label class="mo-label">{{ t('homework.description') }}</label><textarea v-model="form.description" class="mo-input mo-textarea" placeholder="Instructions for students..." rows="3"></textarea></div>
          <div class="mo-field">
            <label class="mo-label">{{ t('nav.classes') }}</label>
            <select v-model="form.classId" class="mo-input">
              <option value="">-- {{ t('homework.selectClass') }} --</option>
              <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="mo-field"><label class="mo-label">{{ t('homework.dueDate') }}</label><input v-model="form.dueDate" type="date" class="mo-input" /></div>
          <div class="mo-btns">
            <button class="mo-cancel" @click="closeModal">{{ t('actions.cancel') }}</button>
            <button class="mo-save" @click="saveItem" :disabled="!form.title">{{ t('actions.save') }}</button>
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
const filter = ref('all')
const showModal = ref(false)
const editing = ref<any>(null)
const items = ref<any[]>(LocalStorageService.get<any[]>('homework', []) || [])
const classes = ref<any[]>(LocalStorageService.get<any[]>('classes', []) || [])
const form = ref({ title:'', description:'', classId:'', dueDate:'' })

const filtered = computed(() => {
  let list = items.value
  if (searchQuery.value) list = list.filter(i => i.title?.toLowerCase().includes(searchQuery.value.toLowerCase()))
  if (filter.value === 'overdue') list = list.filter(i => isOverdue(i.dueDate))
  if (filter.value === 'pending') list = list.filter(i => !isOverdue(i.dueDate))
  return list
})

const palette = ['#1976d2','#2e7d32','#e65100','#6a1b9a','#c62828','#00838f']
function aColor(n: string) { return palette[(n?.charCodeAt(0)||0) % palette.length] }
function getClassName(id: string) { return classes.value.find(c=>c.id===id)?.name || '—' }
function formatDate(d: string) { return d ? new Date(d).toLocaleDateString() : '—' }
function isOverdue(d: string)  { return d ? new Date(d) < new Date() : false }

function openCreate() { form.value={title:'',description:'',classId:'',dueDate:''}; editing.value=null; showModal.value=true }
function editItem(i: any) { editing.value=i; form.value={...i}; showModal.value=true }
function closeModal()     { showModal.value=false; editing.value=null }
function deleteItem(id: string) {
  if (confirm(t('messages.confirmDelete'))) { items.value=items.value.filter(i=>i.id!==id); LocalStorageService.set('homework',items.value) }
}
function saveItem() {
  if (!form.value.title) return
  if (editing.value) {
    const idx=items.value.findIndex(i=>i.id===editing.value.id)
    if (idx!==-1) items.value[idx]={...items.value[idx],...form.value}
  } else {
    items.value.push({id:`hw_${Date.now()}`,schoolId:'school_1',createdAt:new Date().toISOString(),...form.value})
  }
  LocalStorageService.set('homework',items.value); closeModal()
}
</script>

<style scoped>
.pg-header  { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar     { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back    { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title   { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-new     { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }
.pg-body    { padding:14px; }
.pg-search  { display:flex; align-items:center; gap:8px; background:white; border:1.5px solid #e5e7eb; border-radius:12px; padding:10px 14px; margin-bottom:12px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
.pg-search:focus-within { border-color:#1976d2; }
.pg-search-input { flex:1; border:none; outline:none; font-size:14px; color:#1f2937; background:transparent; }
.pg-search-input::placeholder { color:#9ca3af; }
.pg-meta    { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.pg-count   { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.pg-filter  { padding:4px 10px; border-radius:20px; border:1.5px solid #e5e7eb; background:white; font-size:11px; font-weight:600; color:#6b7280; cursor:pointer; }
.pg-filter.active { background:#1976d2; border-color:#1976d2; color:white; }
.pg-empty   { text-align:center; padding:60px 20px 40px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#1976d2; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }
.pg-card    { display:flex; align-items:flex-start; gap:12px; background:white; border-radius:14px; padding:14px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); transition:transform .18s,box-shadow .18s; }
.pg-card:active { transform:scale(.98); }
.pg-hw-icon { width:46px; height:46px; border-radius:12px; font-size:22px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pg-info    { flex:1; min-width:0; }
.pg-name    { font-size:15px; font-weight:700; color:#1f2937; margin-bottom:5px; }
.pg-row     { display:flex; align-items:center; gap:5px; font-size:12px; margin-bottom:2px; }
.pg-val     { color:#374151; font-weight:500; }
.overdue-text { color:#ef4444; font-weight:700; }
.pg-badge   { display:inline-block; font-size:11px; font-weight:600; padding:2px 9px; border-radius:20px; margin-top:6px; }
.badge-orange { background:#ffedd5; color:#c2410c; }
.badge-red    { background:#fee2e2; color:#dc2626; }
.pg-actions { display:flex; flex-direction:column; gap:6px; flex-shrink:0; }
.pg-btn     { width:32px; height:32px; border-radius:8px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.pg-btn-edit { background:#eff6ff; color:#1976d2; }
.pg-btn-del  { background:#fff5f5; color:#ef4444; }
ion-modal   { --border-radius:20px 20px 0 0; --max-height:90vh; align-items:flex-end; }
.mo-wrap    { background:white; border-radius:20px 20px 0 0; display:flex; flex-direction:column; max-height:90vh; }
.mo-handle  { width:36px; height:4px; border-radius:2px; background:#e5e7eb; margin:12px auto 0; }
.mo-head    { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 10px; border-bottom:1px solid #f3f4f6; }
.mo-title   { font-size:16px; font-weight:700; color:#1f2937; }
.mo-close   { width:30px; height:30px; border-radius:50%; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; color:#6b7280; }
.mo-body    { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
.mo-field   { display:flex; flex-direction:column; gap:5px; }
.mo-label   { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mo-input   { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.mo-input:focus { border-color:#1976d2; background:white; }
.mo-textarea { resize:vertical; font-family:inherit; }
.mo-btns    { display:flex; gap:10px; padding-top:4px; }
.mo-cancel  { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save    { flex:2; padding:13px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save:disabled { opacity:.45; cursor:default; }
.pg-body.anim-fade-up { animation: fadeUp .4s ease both; }
.pg-card { animation: fadeUp .35s ease both; }
.pg-card:nth-child(1){animation-delay:.05s}.pg-card:nth-child(2){animation-delay:.10s}.pg-card:nth-child(3){animation-delay:.15s}.pg-card:nth-child(4){animation-delay:.20s}.pg-card:nth-child(5){animation-delay:.25s}.pg-card:nth-child(6){animation-delay:.30s}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
