<template>
  <ion-page>
    <ion-header class="pg-header">
      <div class="pg-bar">
        <button class="pg-back" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="pg-title-wrap">
          <span class="pg-title">{{ t('communication.title') }}</span>
          <span v-if="unreadCount > 0" class="pg-unread-dot">{{ unreadCount }}</span>
        </div>
        <button class="pg-new" @click="openCreate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
          {{ t('communication.new') }}
        </button>
      </div>
    </ion-header>

    <ion-content style="--background:#f5f7fa">
      <div class="pg-body anim-fade-up">

        <!-- Filter tabs -->
        <div class="tab-row">
          <button v-for="tab in tabs" :key="tab.val" class="tab-btn" :class="{ active: activeTab === tab.val }" @click="activeTab = tab.val">
            {{ tab.icon }} {{ tab.label }}
            <span v-if="tab.val !== 'all' && tabCount(tab.val) > 0" class="tab-count">{{ tabCount(tab.val) }}</span>
          </button>
        </div>

        <!-- Mark all read -->
        <div class="meta-row" v-if="filtered.length > 0">
          <span class="meta-count">{{ filtered.length }} {{ t('communication.notifications') }}</span>
          <button v-if="unreadCount > 0" class="mark-read-btn" @click="markAllRead">✓ {{ t('communication.markRead') }}</button>
        </div>

        <!-- Empty -->
        <div v-if="filtered.length === 0" class="pg-empty">
          <div style="font-size:56px;margin-bottom:12px">🔔</div>
          <div style="font-size:16px;font-weight:600;color:#374151">{{ t('communication.noNotifTitle') }}</div>
          <div style="font-size:13px;color:#9ca3af;margin-top:4px">{{ t('communication.noNotif') }}</div>
          <button class="pg-empty-btn" @click="openCreate">+ {{ t('communication.createAnnounce') }}</button>
        </div>

        <!-- Notification cards -->
        <div
          v-for="item in filtered"
          :key="item.id"
          class="notif-card"
          :class="{ unread: !item.read }"
          @click="markRead(item)"
        >
          <div class="notif-icon-wrap" :style="{ background: typeColor(item.type) }">
            {{ typeIcon(item.type) }}
            <span v-if="!item.read" class="unread-dot"></span>
          </div>
          <div class="notif-body">
            <div class="notif-top">
              <span class="notif-title">{{ item.title }}</span>
              <span class="notif-time">{{ timeAgo(item.publishedAt || item.createdAt) }}</span>
            </div>
            <div class="notif-content">{{ item.content }}</div>
            <div class="notif-footer">
              <span class="notif-badge" :style="{ background: typeColorLight(item.type), color: typeColorDark(item.type) }">
                {{ typeLabel(item.type || 'general') }}
              </span>
              <span v-if="item.targetRole" class="notif-badge notif-badge-gray">{{ item.targetRole }}</span>
            </div>
          </div>
          <button class="notif-del" @click.stop="deleteItem(item.id)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div style="height:28px"></div>
      </div>
    </ion-content>

    <!-- Create Modal -->
    <ion-modal :is-open="showModal" @did-dismiss="closeModal">
      <div class="mo-wrap">
        <div class="mo-handle"></div>
        <div class="mo-head">
          <span class="mo-title">📢 {{ t('communication.newTitle') }}</span>
          <button class="mo-close" @click="closeModal">✕</button>
        </div>
        <div class="mo-body">
          <div class="mo-field"><label class="mo-label">{{ t('communication.titleLabel') }} *</label><input v-model="form.title" class="mo-input" placeholder="Announcement title" /></div>
          <div class="mo-field"><label class="mo-label">{{ t('communication.contentLabel') }} *</label><textarea v-model="form.content" class="mo-input mo-textarea" placeholder="Write your message here..." rows="4"></textarea></div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('communication.typeLabel') }}</label>
              <select v-model="form.type" class="mo-input">
                <option value="general">📢 {{ t('communication.typeGeneral') }}</option>
                <option value="academic">📚 {{ t('communication.typeAcademic') }}</option>
                <option value="event">🎉 {{ t('communication.typeEvent') }}</option>
                <option value="urgent">🚨 {{ t('communication.typeUrgent') }}</option>
                <option value="holiday">🏖 {{ t('communication.typeHoliday') }}</option>
                <option value="exam">📝 {{ t('communication.typeExam') }}</option>
              </select>
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('communication.targetLabel') }}</label>
              <select v-model="form.targetRole" class="mo-input">
                <option value="all">{{ t('communication.everyone') }}</option>
                <option value="students">{{ t('communication.targetStudents') }}</option>
                <option value="teachers">{{ t('communication.targetTeachers') }}</option>
                <option value="parents">{{ t('communication.targetParents') }}</option>
              </select>
            </div>
          </div>
          <div class="mo-btns">
            <button class="mo-cancel" @click="closeModal">{{ t('actions.cancel') }}</button>
            <button class="mo-save" @click="saveItem" :disabled="!form.title || !form.content">📢 {{ t('communication.publish') }}</button>
          </div>
        </div>
      </div>
    </ion-modal>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
    </transition>
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

const announcements = ref<any[]>(LocalStorageService.get<any[]>('announcements', []) || [])
const activeTab = ref('all')
const showModal = ref(false)
const toastMsg  = ref('')
const form = ref({ title:'', content:'', type:'general', targetRole:'all' })

const tabs = computed(() => [
  { val:'all',      icon:'🔔', label: t('communication.all')      },
  { val:'urgent',   icon:'🚨', label: t('communication.urgent')   },
  { val:'academic', icon:'📚', label: t('communication.academic') },
  { val:'event',    icon:'🎉', label: t('communication.event')    },
])

const filtered = computed(() => {
  if (activeTab.value === 'all') return announcements.value
  return announcements.value.filter(a => a.type === activeTab.value)
})

const unreadCount = computed(() => announcements.value.filter(a => !a.read).length)

function tabCount(val: string) { return announcements.value.filter(a=>a.type===val).length }

function typeLabel(type: string) {
  const map: Record<string, string> = {
    general:  t('communication.typeGeneral'),
    academic: t('communication.typeAcademic'),
    event:    t('communication.typeEvent'),
    urgent:   t('communication.typeUrgent'),
    holiday:  t('communication.typeHoliday'),
    exam:     t('communication.typeExam'),
  }
  return map[type] || type
}
function typeIcon(type: string) {
  return ({general:'📢',academic:'📚',event:'🎉',urgent:'🚨',holiday:'🏖',exam:'📝'} as any)[type] || '🔔'
}
function typeColor(type: string) {
  return ({general:'#1976d2',academic:'#2e7d32',event:'#e65100',urgent:'#c62828',holiday:'#0288d1',exam:'#6a1b9a'} as any)[type] || '#374151'
}
function typeColorLight(type: string) {
  return ({general:'#dbeafe',academic:'#dcfce7',event:'#ffedd5',urgent:'#fee2e2',holiday:'#e0f2fe',exam:'#f3e8ff'} as any)[type] || '#f3f4f6'
}
function typeColorDark(type: string) {
  return ({general:'#1d4ed8',academic:'#16a34a',event:'#c2410c',urgent:'#dc2626',holiday:'#0369a1',exam:'#7e22ce'} as any)[type] || '#374151'
}

function timeAgo(dateStr: string) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function markRead(item: any) {
  if (!item.read) {
    item.read = true
    LocalStorageService.set('announcements', announcements.value)
  }
}

function markAllRead() {
  announcements.value.forEach(a => a.read = true)
  LocalStorageService.set('announcements', announcements.value)
  showToast(t('communication.allMarkedRead'))
}

function deleteItem(id: string) {
  announcements.value = announcements.value.filter(a => a.id !== id)
  LocalStorageService.set('announcements', announcements.value)
}

function openCreate() { form.value={title:'',content:'',type:'general',targetRole:'all'}; showModal.value=true }
function closeModal()  { showModal.value=false }

function saveItem() {
  if (!form.value.title || !form.value.content) return
  announcements.value.unshift({
    id: `ann_${Date.now()}`,
    schoolId: 'school_1',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    read: false,
    ...form.value
  })
  LocalStorageService.set('announcements', announcements.value)
  closeModal()
  showToast('📢 ' + t('communication.published'))
}

function showToast(msg: string) { toastMsg.value=msg; setTimeout(()=>toastMsg.value='',2500) }
</script>

<style scoped>
/* Header */
.pg-header    { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar       { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back      { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pg-title-wrap { display:flex; align-items:center; gap:7px; }
.pg-title     { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-unread-dot { background:#ef4444; color:white; font-size:11px; font-weight:800; min-width:20px; height:20px; border-radius:20px; padding:0 5px; display:flex; align-items:center; justify-content:center; }
.pg-new       { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }

/* Body */
.pg-body      { padding:14px; }

/* Tabs */
.tab-row      { display:flex; gap:6px; margin-bottom:12px; overflow-x:auto; padding-bottom:2px; }
.tab-btn      { display:flex; align-items:center; gap:4px; padding:7px 13px; border-radius:20px; border:1.5px solid #e5e7eb; background:white; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,.05); flex-shrink:0; }
.tab-btn.active { background:#1976d2; border-color:#1976d2; color:white; }
.tab-count    { background:rgba(255,255,255,.3); color:inherit; font-size:10px; font-weight:800; padding:1px 6px; border-radius:20px; }
.tab-btn.active .tab-count { background:rgba(255,255,255,.3); color:white; }
.tab-btn:not(.active) .tab-count { background:#fee2e2; color:#dc2626; }

/* Meta row */
.meta-row     { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.meta-count   { font-size:12px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mark-read-btn { font-size:12px; font-weight:600; color:#1976d2; background:none; border:none; cursor:pointer; }

/* Empty */
.pg-empty     { text-align:center; padding:60px 20px 40px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#1976d2; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }

/* Notification card */
.notif-card   { display:flex; align-items:flex-start; gap:12px; background:white; border-radius:14px; padding:14px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); border:1.5px solid transparent; cursor:pointer; transition:border-color .15s; }
.notif-card.unread { border-color:#dbeafe; background:#fafcff; }
.notif-card:active  { background:#f9fafb; }

/* Icon */
.notif-icon-wrap { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; position:relative; }
.unread-dot   { position:absolute; top:-3px; right:-3px; width:10px; height:10px; background:#ef4444; border-radius:50%; border:2px solid white; }

/* Body */
.notif-body   { flex:1; min-width:0; }
.notif-top    { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:4px; }
.notif-title  { font-size:14px; font-weight:700; color:#1f2937; line-height:1.3; }
.notif-time   { font-size:10px; color:#9ca3af; font-weight:500; flex-shrink:0; margin-top:2px; }
.notif-content { font-size:12px; color:#6b7280; line-height:1.5; margin-bottom:8px; }
.notif-footer { display:flex; gap:5px; flex-wrap:wrap; }
.notif-badge  { font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; text-transform:capitalize; }
.notif-badge-gray { background:#f3f4f6; color:#6b7280; }

/* Delete btn */
.notif-del    { width:28px; height:28px; border-radius:7px; border:none; background:#fff5f5; color:#ef4444; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; opacity:0; transition:opacity .15s; }
.notif-card:hover .notif-del { opacity:1; }
.notif-card:active .notif-del { opacity:1; }

/* Modal */
ion-modal     { --border-radius:20px 20px 0 0; --max-height:90vh; align-items:flex-end; }
.mo-wrap      { background:white; border-radius:20px 20px 0 0; display:flex; flex-direction:column; max-height:90vh; }
.mo-handle    { width:36px; height:4px; border-radius:2px; background:#e5e7eb; margin:12px auto 0; }
.mo-head      { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 10px; border-bottom:1px solid #f3f4f6; }
.mo-title     { font-size:16px; font-weight:700; color:#1f2937; }
.mo-close     { width:30px; height:30px; border-radius:50%; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; color:#6b7280; }
.mo-body      { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
.mo-field     { display:flex; flex-direction:column; gap:5px; }
.mo-row2      { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.mo-label     { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mo-input     { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.mo-input:focus { border-color:#1976d2; background:white; }
.mo-textarea  { resize:vertical; font-family:inherit; }
.mo-btns      { display:flex; gap:10px; padding-top:4px; }
.mo-cancel    { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save      { flex:2; padding:13px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save:disabled { opacity:.45; cursor:default; }

/* Toast */
.toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#1f2937; color:white; padding:11px 20px; border-radius:24px; font-size:13px; font-weight:600; z-index:9999; white-space:nowrap; box-shadow:0 4px 20px rgba(0,0,0,.2); }
.toast-enter-active, .toast-leave-active { transition: all .25s; }
.toast-enter-from, .toast-leave-to { opacity:0; transform:translateX(-50%) translateY(12px); }
.notif-card { animation: fadeUp .35s ease both; }
.notif-card:nth-child(1){animation-delay:.05s}.notif-card:nth-child(2){animation-delay:.10s}.notif-card:nth-child(3){animation-delay:.15s}.notif-card:nth-child(4){animation-delay:.20s}.notif-card:nth-child(5){animation-delay:.25s}.notif-card:nth-child(6){animation-delay:.30s}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
