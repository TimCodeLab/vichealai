<template>
  <ion-page>
    <ion-header class="pg-header">
      <div class="pg-bar">
        <button class="pg-back" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="pg-title">{{ t('nav.reports') }}</span>
        <span class="pg-badge-header">{{ currentMonth }}</span>
      </div>
    </ion-header>

    <ion-content style="--background:#f5f7fa">
      <div class="pg-body">

        <!-- Summary stats -->
        <div class="stat-grid">
          <div class="stat-card" style="background:linear-gradient(135deg,#1565c0,#1976d2)">
            <div class="stat-icon">👥</div>
            <div class="stat-num">{{ stats.students }}</div>
            <div class="stat-lbl">Students</div>
          </div>
          <div class="stat-card" style="background:linear-gradient(135deg,#2e7d32,#43a047)">
            <div class="stat-icon">👩‍🏫</div>
            <div class="stat-num">{{ stats.teachers }}</div>
            <div class="stat-lbl">Teachers</div>
          </div>
          <div class="stat-card" style="background:linear-gradient(135deg,#e65100,#f57c00)">
            <div class="stat-icon">🏫</div>
            <div class="stat-num">{{ stats.classes }}</div>
            <div class="stat-lbl">Classes</div>
          </div>
          <div class="stat-card" style="background:linear-gradient(135deg,#6a1b9a,#8e24aa)">
            <div class="stat-icon">📊</div>
            <div class="stat-num">{{ stats.exams }}</div>
            <div class="stat-lbl">Exams</div>
          </div>
        </div>

        <!-- Attendance overview -->
        <div class="section-card">
          <div class="section-head">
            <span class="section-title">📋 Attendance Overview</span>
            <span class="section-sub">Today</span>
          </div>
          <div class="att-bar-wrap">
            <div class="att-row">
              <span class="att-lbl att-present">Present</span>
              <div class="att-track"><div class="att-fill" style="background:#22c55e" :style="{ width: attPct('present') + '%' }"></div></div>
              <span class="att-val">{{ countAtt('present') }}</span>
            </div>
            <div class="att-row">
              <span class="att-lbl att-absent">Absent</span>
              <div class="att-track"><div class="att-fill" style="background:#ef4444" :style="{ width: attPct('absent') + '%' }"></div></div>
              <span class="att-val">{{ countAtt('absent') }}</span>
            </div>
            <div class="att-row">
              <span class="att-lbl att-late">Late</span>
              <div class="att-track"><div class="att-fill" style="background:#f97316" :style="{ width: attPct('late') + '%' }"></div></div>
              <span class="att-val">{{ countAtt('late') }}</span>
            </div>
          </div>
          <div class="att-pct-row">
            <span class="att-pct-label">Attendance Rate</span>
            <span class="att-pct-value">{{ attendanceRate }}%</span>
          </div>
        </div>

        <!-- Generate Report -->
        <div class="section-card">
          <div class="section-head">
            <span class="section-title">📄 Generate Report</span>
          </div>

          <div class="gen-field">
            <label class="gen-label">Report Type</label>
            <div class="type-grid">
              <button v-for="rt in reportTypes" :key="rt.value" class="type-btn" :class="{ active: selectedType === rt.value }" @click="selectedType = rt.value">
                <span class="type-icon">{{ rt.icon }}</span>
                <span class="type-lbl">{{ rt.label }}</span>
              </button>
            </div>
          </div>

          <div class="gen-row2">
            <div class="gen-field">
              <label class="gen-label">From</label>
              <input v-model="dateFrom" type="date" class="gen-input" />
            </div>
            <div class="gen-field">
              <label class="gen-label">To</label>
              <input v-model="dateTo" type="date" class="gen-input" />
            </div>
          </div>

          <div class="gen-field">
            <label class="gen-label">Format</label>
            <div style="display:flex;gap:6px">
              <button v-for="f in formats" :key="f" class="fmt-btn" :class="{ active: selectedFormat === f }" @click="selectedFormat = f">{{ f }}</button>
            </div>
          </div>

          <button class="gen-btn" @click="generateReport" :disabled="generating">
            <span v-if="!generating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align:-3px;margin-right:6px"><path d="M12 2v10m0 0l-3-3m3 3l3-3M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Generate {{ selectedType ? reportTypes.find(r=>r.value===selectedType)?.label : '' }} Report
            </span>
            <span v-else>⏳ Generating...</span>
          </button>
        </div>

        <!-- Recent Reports -->
        <div class="section-card" v-if="recentReports.length > 0">
          <div class="section-head">
            <span class="section-title">🗂 Recent Reports</span>
            <button class="clear-btn" @click="clearReports">Clear all</button>
          </div>
          <div v-for="rep in recentReports" :key="rep.id" class="report-row">
            <div class="report-icon" :style="{ background: typeColor(rep.type) }">{{ typeIcon(rep.type) }}</div>
            <div class="report-info">
              <div class="report-name">{{ rep.name }}</div>
              <div class="report-meta">{{ rep.date }} · {{ rep.format }} · {{ rep.size }}</div>
            </div>
            <div style="display:flex;gap:6px">
              <button class="rep-act" title="Download" @click="downloadReport(rep)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2v10m0 0l-3-3m3 3l3-3M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="rep-act rep-del" title="Delete" @click="deleteReport(rep.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="section-card" v-else style="text-align:center;padding:32px 20px">
          <div style="font-size:40px;margin-bottom:8px">📂</div>
          <div style="font-size:14px;font-weight:600;color:#374151">No reports yet</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:4px">Generate your first report above</div>
        </div>

        <div style="height:28px"></div>
      </div>
    </ion-content>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
    </transition>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonHeader, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'

const router = useRouter()
const { t } = useI18n()

const today = new Date()
const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const todayStr = today.toISOString().split('T')[0]

const students   = ref<any[]>(LocalStorageService.get<any[]>('students',   []) || [])
const teachers   = ref<any[]>(LocalStorageService.get<any[]>('teachers',   []) || [])
const classes    = ref<any[]>(LocalStorageService.get<any[]>('classes',    []) || [])
const exams      = ref<any[]>(LocalStorageService.get<any[]>('exams',      []) || [])
const attendance = ref<any[]>(LocalStorageService.get<any[]>('attendance', []) || [])
const recentReports = ref<any[]>(LocalStorageService.get<any[]>('reports', []) || [])

const stats = computed(() => ({
  students: students.value.length,
  teachers: teachers.value.length,
  classes:  classes.value.length,
  exams:    exams.value.length,
}))

const todayAtt = computed(() => attendance.value.filter(a => a.date?.startsWith(todayStr)))
function countAtt(s: string) { return todayAtt.value.filter(a=>a.status===s).length }
function attPct(s: string)   { const total=todayAtt.value.length; return total ? Math.round(countAtt(s)/total*100) : 0 }
const attendanceRate = computed(() => {
  const total = todayAtt.value.length
  return total ? Math.round(countAtt('present') / total * 100) : 0
})

const selectedType   = ref('students')
const selectedFormat = ref('PDF')
const dateFrom       = ref(new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0])
const dateTo         = ref(todayStr)
const generating     = ref(false)
const toastMsg       = ref('')

const reportTypes = [
  { value:'students',   label:'Students',   icon:'👥' },
  { value:'teachers',   label:'Teachers',   icon:'👩‍🏫' },
  { value:'attendance', label:'Attendance', icon:'📋' },
  { value:'exams',      label:'Exams',      icon:'📊' },
  { value:'homework',   label:'Homework',   icon:'📝' },
  { value:'finance',    label:'Finance',    icon:'💰' },
]
const formats = ['PDF', 'Excel', 'CSV']

function typeColor(type: string) {
  return ({students:'#1976d2',teachers:'#2e7d32',attendance:'#e65100',exams:'#6a1b9a',homework:'#c62828',finance:'#00838f'} as any)[type] || '#374151'
}
function typeIcon(type: string) {
  return ({students:'👥',teachers:'👩‍🏫',attendance:'📋',exams:'📊',homework:'📝',finance:'💰'} as any)[type] || '📄'
}

function showToast(msg: string) { toastMsg.value=msg; setTimeout(()=>toastMsg.value='', 2800) }

function generateReport() {
  generating.value = true
  setTimeout(() => {
    const typeName = reportTypes.find(r=>r.value===selectedType.value)?.label || selectedType.value
    const rep = {
      id:     `rep_${Date.now()}`,
      type:   selectedType.value,
      name:   `${typeName} Report — ${dateFrom.value} to ${dateTo.value}`,
      format: selectedFormat.value,
      date:   new Date().toLocaleDateString(),
      size:   `${Math.floor(Math.random()*900+100)} KB`,
    }
    recentReports.value.unshift(rep)
    if (recentReports.value.length > 10) recentReports.value = recentReports.value.slice(0,10)
    LocalStorageService.set('reports', recentReports.value)
    generating.value = false
    showToast(`✅ ${typeName} report generated!`)
  }, 1400)
}

function downloadReport(rep: any) { showToast(`📥 Downloading ${rep.format} report...`) }
function deleteReport(id: string) {
  recentReports.value = recentReports.value.filter(r=>r.id!==id)
  LocalStorageService.set('reports', recentReports.value)
}
function clearReports() {
  if (confirm('Clear all recent reports?')) { recentReports.value=[]; LocalStorageService.set('reports',[]) }
}
</script>

<style scoped>
.pg-header      { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar         { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back        { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title       { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-badge-header { font-size:11px; font-weight:700; color:white; background:rgba(255,255,255,.2); padding:4px 10px; border-radius:20px; }
.pg-body        { padding:14px; }
/* Stats */
.stat-grid      { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:14px; }
.stat-card      { border-radius:14px; padding:12px 8px; text-align:center; box-shadow:0 4px 14px rgba(0,0,0,.12); }
.stat-icon      { font-size:20px; margin-bottom:4px; }
.stat-num       { font-size:22px; font-weight:800; color:white; line-height:1; }
.stat-lbl       { font-size:10px; font-weight:600; color:rgba(255,255,255,.85); margin-top:3px; }
/* Section */
.section-card   { background:white; border-radius:16px; padding:16px; margin-bottom:14px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.section-head   { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.section-title  { font-size:14px; font-weight:700; color:#1f2937; }
.section-sub    { font-size:11px; font-weight:600; color:#6b7280; background:#f3f4f6; padding:3px 8px; border-radius:10px; }
.clear-btn      { font-size:11px; color:#ef4444; background:none; border:none; cursor:pointer; font-weight:600; }
/* Attendance */
.att-bar-wrap   { display:flex; flex-direction:column; gap:10px; }
.att-row        { display:flex; align-items:center; gap:8px; }
.att-lbl        { font-size:11px; font-weight:700; min-width:52px; }
.att-present    { color:#16a34a; }
.att-absent     { color:#dc2626; }
.att-late       { color:#c2410c; }
.att-track      { flex:1; height:8px; background:#f3f4f6; border-radius:4px; overflow:hidden; }
.att-fill       { height:100%; border-radius:4px; transition:width .4s ease; min-width:4px; }
.att-val        { font-size:12px; font-weight:700; color:#374151; min-width:20px; text-align:right; }
.att-pct-row    { display:flex; align-items:center; justify-content:space-between; margin-top:12px; padding-top:12px; border-top:1px solid #f3f4f6; }
.att-pct-label  { font-size:12px; color:#6b7280; }
.att-pct-value  { font-size:18px; font-weight:800; color:#1976d2; }
/* Generate */
.gen-field      { margin-bottom:12px; }
.gen-label      { display:block; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; margin-bottom:7px; }
.gen-row2       { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
.gen-input      { width:100%; padding:10px 12px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.gen-input:focus { border-color:#1976d2; background:white; }
.type-grid      { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; }
.type-btn       { display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 6px; border-radius:12px; border:1.5px solid #e5e7eb; background:#f9fafb; cursor:pointer; }
.type-btn.active { border-color:#1976d2; background:#eff6ff; }
.type-icon      { font-size:20px; }
.type-lbl       { font-size:11px; font-weight:600; color:#374151; }
.type-btn.active .type-lbl { color:#1976d2; }
.fmt-btn        { padding:6px 14px; border-radius:20px; border:1.5px solid #e5e7eb; background:white; font-size:12px; font-weight:700; color:#6b7280; cursor:pointer; }
.fmt-btn.active { border-color:#1976d2; background:#1976d2; color:white; }
.gen-btn        { width:100%; margin-top:14px; padding:14px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; }
.gen-btn:disabled { opacity:.55; cursor:not-allowed; }
/* Recent */
.report-row     { display:flex; align-items:center; gap:11px; padding:10px 0; border-bottom:1px solid #f3f4f6; }
.report-row:last-child { border-bottom:none; }
.report-icon    { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.report-info    { flex:1; min-width:0; }
.report-name    { font-size:13px; font-weight:600; color:#1f2937; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.report-meta    { font-size:11px; color:#9ca3af; margin-top:1px; }
.rep-act        { width:30px; height:30px; border-radius:8px; border:none; background:#f3f4f6; color:#374151; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.rep-del        { background:#fff5f5; color:#ef4444; }
/* Toast */
.toast          { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#1f2937; color:white; padding:11px 20px; border-radius:24px; font-size:13px; font-weight:600; z-index:9999; white-space:nowrap; box-shadow:0 4px 20px rgba(0,0,0,.2); }
.toast-enter-active, .toast-leave-active { transition: all .25s; }
.toast-enter-from, .toast-leave-to { opacity:0; transform:translateX(-50%) translateY(12px); }
</style>
