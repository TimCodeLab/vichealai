<template>
  <ion-page>

    <!-- ── STEP 1: Select Class ── -->
    <template v-if="!selectedClass">
      <ion-header class="pg-header">
        <div class="pg-bar">
          <button class="pg-back" @click="router.back()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="pg-title">{{ t('nav.attendance') }}</span>
          <span style="width:36px"></span>
        </div>
        <!-- Date navigator -->
        <div class="date-bar">
          <button class="date-nav" @click="changeDate(-1)">‹</button>
          <div class="date-center">
            <span class="date-label">{{ formatDateHeader(selectedDate) }}</span>
            <span class="date-today-btn" v-if="selectedDate !== todayStr" @click="selectedDate = todayStr">Today</span>
          </div>
          <button class="date-nav" @click="changeDate(1)" :disabled="selectedDate >= todayStr">›</button>
        </div>
      </ion-header>

      <ion-content style="--background:#f5f7fa">
        <div class="pg-body anim-fade-up">

          <div class="pick-label">Select a class to take attendance</div>

          <!-- No classes -->
          <div v-if="classes.length === 0" class="pg-empty">
            <div style="font-size:52px;margin-bottom:12px">🏫</div>
            <div style="font-size:15px;font-weight:600;color:#374151">No classes yet</div>
            <div style="font-size:13px;color:#9ca3af;margin-top:4px">Go to Classes and add a class first</div>
          </div>

          <!-- Class cards -->
          <div v-for="cls in classes" :key="cls.id" class="cls-pick-card" @click="pickClass(cls)">
            <div class="cls-pick-icon" :style="{ background: aColor(cls.name) }">🏫</div>
            <div class="cls-pick-info">
              <div class="cls-pick-name">{{ cls.name }}</div>
              <div class="cls-pick-sub">{{ classStudentCount(cls.id) }} students
                <span v-if="classHasRecord(cls.id)" class="cls-done-badge">✓ Done</span>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:#9ca3af;flex-shrink:0"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>

          <div style="height:28px"></div>
        </div>
      </ion-content>
    </template>

    <!-- ── STEP 2: Take Attendance ── -->
    <template v-else>
      <ion-header class="pg-header">
        <div class="pg-bar">
          <button class="pg-back" @click="selectedClass = null">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div style="display:flex;flex-direction:column;align-items:center;gap:1px">
            <span class="pg-title">{{ selectedClass.name }}</span>
            <span style="font-size:10px;color:rgba(255,255,255,.75);font-weight:600">{{ t('nav.attendance') }}</span>
          </div>
          <button class="pg-save-btn" @click="saveAll" :class="{ dirty: isDirty }">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="white" stroke-width="2" stroke-linecap="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="white" stroke-width="2" stroke-linecap="round"/><polyline points="7 3 7 8 15 8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
            Save
          </button>
        </div>
        <!-- Date navigator -->
        <div class="date-bar">
          <button class="date-nav" @click="changeDate(-1)">‹</button>
          <div class="date-center">
            <span class="date-label">{{ formatDateHeader(selectedDate) }}</span>
            <span class="date-today-btn" v-if="selectedDate !== todayStr" @click="selectedDate = todayStr">Today</span>
          </div>
          <button class="date-nav" @click="changeDate(1)" :disabled="selectedDate >= todayStr">›</button>
        </div>
      </ion-header>

      <ion-content style="--background:#f5f7fa">
        <div class="pg-body anim-fade-up">

          <!-- Summary pills -->
          <div class="summary-row">
            <div class="sum-pill sum-present">
              <span class="sum-num">{{ countStatus('present') }}</span>
              <span class="sum-lbl">Present</span>
            </div>
            <div class="sum-pill sum-permission">
              <span class="sum-num">{{ countStatus('permission') }}</span>
              <span class="sum-lbl">{{ t('attendance.permission') }}</span>
            </div>
            <div class="sum-pill sum-absent">
              <span class="sum-num">{{ countStatus('absent') }}</span>
              <span class="sum-lbl">{{ t('attendance.absent') }}</span>
            </div>
            <div class="sum-pill sum-total">
              <span class="sum-num">{{ shownStudents.length }}</span>
              <span class="sum-lbl">Total</span>
            </div>
          </div>

          <!-- No students in class -->
          <div v-if="shownStudents.length === 0" class="pg-empty">
            <div style="font-size:52px;margin-bottom:12px">👥</div>
            <div style="font-size:15px;font-weight:600;color:#374151">No students in this class</div>
            <div style="font-size:13px;color:#9ca3af;margin-top:4px">Assign students to {{ selectedClass.name }} first</div>
          </div>

          <!-- Attendance table -->
          <div v-else class="att-sheet">
            <!-- Table header -->
            <div class="att-thead">
              <div class="th-num">#</div>
              <div class="th-name">Student Name</div>
              <div class="th-check">
                <span class="th-icon">🙏</span>
                <span class="th-txt">{{ t('attendance.permission') }}</span>
              </div>
              <div class="th-check">
                <span class="th-icon">❌</span>
                <span class="th-txt">{{ t('attendance.absent') }}</span>
              </div>
              <div class="th-reason">Reason</div>
            </div>

            <!-- Student rows -->
            <div
              v-for="(row, idx) in rows"
              :key="row.studentId"
              class="att-row"
              :class="{
                'row-permission': row.status === 'permission',
                'row-absent':     row.status === 'absent',
                'row-alt':        idx % 2 === 1
              }"
            >
              <!-- Number -->
              <div class="td-num">{{ idx + 1 }}</div>

              <!-- Name + avatar -->
              <div class="td-name">
                <div class="row-avatar" :style="{ background: aColor(row.name) }">{{ aInitial(row.name) }}</div>
                <div class="row-info">
                  <span class="row-name">{{ row.name }}</span>
                  <span class="row-status-badge" :class="statusBadge(row.status)">{{ statusLabel(row.status) }}</span>
                </div>
              </div>

              <!-- Permission checkbox -->
              <div class="td-check">
                <div
                  class="chk-box"
                  :class="{ 'chk-checked-permission': row.status === 'permission' }"
                  @click="toggleStatus(row, 'permission')"
                >
                  <svg v-if="row.status === 'permission'" width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>

              <!-- Absent checkbox -->
              <div class="td-check">
                <div
                  class="chk-box"
                  :class="{ 'chk-checked-absent': row.status === 'absent' }"
                  @click="toggleStatus(row, 'absent')"
                >
                  <svg v-if="row.status === 'absent'" width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>

              <!-- Reason -->
              <div class="td-reason">
                <input
                  v-model="row.reason"
                  class="reason-input"
                  :placeholder="row.status === 'present' ? '—' : t('attendance.reason')"
                  :disabled="row.status === 'present'"
                  @input="isDirty = true"
                />
              </div>
            </div>
          </div>

          <!-- Bottom save -->
          <button v-if="shownStudents.length > 0" class="bottom-save-btn" @click="saveAll">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="white" stroke-width="2" stroke-linecap="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="white" stroke-width="2" stroke-linecap="round"/><polyline points="7 3 7 8 15 8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
            Save Attendance — {{ shownStudents.length }} students
          </button>

          <div style="height:28px"></div>
        </div>
      </ion-content>
    </template>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
    </transition>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IonPage, IonHeader, IonContent } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'

const router = useRouter()
const { t } = useI18n()

const today    = new Date()
const todayStr = today.toISOString().split('T')[0]

const selectedDate  = ref(todayStr)
const selectedClass = ref<any>(null)   // null = step 1 (pick class), object = step 2 (take attendance)
const isDirty       = ref(false)
const toastMsg      = ref('')

const students   = ref<any[]>(LocalStorageService.get<any[]>('students',   []) || [])
const classes    = ref<any[]>(LocalStorageService.get<any[]>('classes',    []) || [])
const allRecords = ref<any[]>(LocalStorageService.get<any[]>('attendance', []) || [])

// Students in selected class only
const shownStudents = computed(() =>
  selectedClass.value
    ? students.value.filter(s => s.classId === selectedClass.value.id)
    : []
)

// Class picker helpers
function classStudentCount(classId: string) {
  return students.value.filter(s => s.classId === classId).length
}
function classHasRecord(classId: string) {
  const ids = students.value.filter(s => s.classId === classId).map(s => s.id)
  return ids.some(id => allRecords.value.find(r => r.studentId === id && r.date?.startsWith(selectedDate.value)))
}
function pickClass(cls: any) {
  selectedClass.value = cls
  isDirty.value = false
}

// Build reactive attendance rows from students + existing records
const sourceRows = computed(() =>
  shownStudents.value.map(student => {
    const existing = allRecords.value.find(
      r => r.studentId === student.id && r.date?.startsWith(selectedDate.value)
    )
    return {
      studentId: student.id,
      name:      student.name || 'Unknown',
      status:    existing?.status || 'present',
      reason:    existing?.reason || '',
    }
  })
)

const rows = ref<any[]>([])
watch(sourceRows, val => { rows.value = val.map(r => ({ ...r })); isDirty.value = false }, { immediate: true })

function toggleStatus(row: any, status: 'permission' | 'absent') {
  row.status = row.status === status ? 'present' : status
  if (row.status === 'present') row.reason = ''
  isDirty.value = true
}

function countStatus(s: string) { return rows.value.filter(r => r.status === s).length }

const palette = ['#1976d2','#2e7d32','#e65100','#6a1b9a','#c62828','#00838f','#4527a0','#558b2f']
function aColor(n: string)   { return palette[(n?.charCodeAt(0) || 0) % palette.length] }
function aInitial(n: string) { return (n || '?').charAt(0).toUpperCase() }

function statusLabel(s: string) {
  return ({ present:'Present', permission:'Permission', absent:'Absent' } as any)[s] || s
}
function statusBadge(s: string) {
  return ({ present:'badge-present', permission:'badge-permission', absent:'badge-absent' } as any)[s] || ''
}

function formatDateHeader(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
}
function changeDate(dir: number) {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + dir)
  selectedDate.value = d.toISOString().split('T')[0]
}

function showToast(msg: string) { toastMsg.value = msg; setTimeout(() => toastMsg.value = '', 2500) }

function saveAll() {
  const datePrefix = selectedDate.value
  const studentIds = new Set(shownStudents.value.map(s => s.id))
  // Remove old records for this date+class
  allRecords.value = allRecords.value.filter(
    r => !(r.date?.startsWith(datePrefix) && studentIds.has(r.studentId))
  )
  // Write updated rows
  rows.value.forEach(row => {
    allRecords.value.push({
      id:        `att_${row.studentId}_${datePrefix}`,
      schoolId:  'school_1',
      studentId: row.studentId,
      classId:   selectedClass.value?.id,
      date:      datePrefix,
      status:    row.status,
      reason:    row.reason || '',
      createdAt: new Date().toISOString(),
    })
  })
  LocalStorageService.set('attendance', allRecords.value)
  isDirty.value = false
  showToast(`✅ Saved — ${shownStudents.value.length} students recorded`)
}
</script>

<style scoped>
/* ── Header ── */
.pg-header   { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar      { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; height:52px; }
.pg-back     { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pg-title    { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-save-btn { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.15); border:1.5px solid rgba(255,255,255,.3); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; flex-shrink:0; }
.pg-save-btn.dirty { background:rgba(255,255,255,.28); border-color:white; }

/* ── Date bar ── */
.date-bar    { display:flex; align-items:center; justify-content:space-between; padding:4px 14px 12px; gap:8px; }
.date-nav    { background:rgba(255,255,255,.2); border:none; color:white; font-size:22px; width:32px; height:32px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.date-nav:disabled { opacity:.3; cursor:default; }
.date-center { display:flex; align-items:center; gap:8px; flex:1; justify-content:center; flex-wrap:wrap; }
.date-label  { font-size:12px; font-weight:600; color:white; text-align:center; }
.date-today-btn { font-size:10px; font-weight:700; background:rgba(255,255,255,.25); color:white; border:1px solid rgba(255,255,255,.4); border-radius:10px; padding:2px 8px; cursor:pointer; white-space:nowrap; }

/* ── Body ── */
.pg-body     { padding:12px 12px 0; }

/* ── Step 1: Class picker ── */
.pick-label  { font-size:13px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; margin-bottom:12px; }

.cls-pick-card { display:flex; align-items:center; gap:12px; background:white; border-radius:14px; padding:14px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); cursor:pointer; border:1.5px solid transparent; transition:all .15s; }
.cls-pick-card:active { background:#f0f7ff; border-color:#1976d2; }
.cls-pick-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
.cls-pick-info { flex:1; min-width:0; }
.cls-pick-name { font-size:16px; font-weight:700; color:#1f2937; margin-bottom:3px; }
.cls-pick-sub  { font-size:12px; color:#6b7280; font-weight:500; display:flex; align-items:center; gap:8px; }
.cls-done-badge { background:#dcfce7; color:#16a34a; font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; }

/* ── Step 2: Summary pills ── */
.summary-row    { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:12px; }
.sum-pill       { border-radius:12px; padding:10px 6px; text-align:center; }
.sum-present    { background:linear-gradient(135deg,#2e7d32,#43a047); }
.sum-permission { background:linear-gradient(135deg,#e65100,#f57c00); }
.sum-absent     { background:linear-gradient(135deg,#c62828,#ef5350); }
.sum-total      { background:linear-gradient(135deg,#1565c0,#1976d2); }
.sum-num  { display:block; font-size:20px; font-weight:800; color:white; line-height:1; }
.sum-lbl  { display:block; font-size:9px; font-weight:700; color:rgba(255,255,255,.85); margin-top:3px; text-transform:uppercase; letter-spacing:.3px; }

/* Empty */
.pg-empty { text-align:center; padding:60px 20px; }

/* ── Attendance sheet ── */
.att-sheet  { background:white; border-radius:16px; overflow:hidden; box-shadow:0 2px 14px rgba(0,0,0,.08); margin-bottom:14px; }

/* Table header */
.att-thead  { display:grid; grid-template-columns:28px 1fr 54px 54px 84px; background:linear-gradient(135deg,#1565c0,#1976d2); padding:10px 8px; gap:4px; align-items:center; }
.th-num     { font-size:10px; font-weight:700; color:rgba(255,255,255,.7); text-align:center; }
.th-name    { font-size:10px; font-weight:700; color:rgba(255,255,255,.9); text-transform:uppercase; letter-spacing:.5px; }
.th-check   { display:flex; flex-direction:column; align-items:center; gap:1px; }
.th-icon    { font-size:13px; }
.th-txt     { font-size:8px; font-weight:700; color:rgba(255,255,255,.8); text-transform:uppercase; letter-spacing:.3px; text-align:center; }
.th-reason  { font-size:10px; font-weight:700; color:rgba(255,255,255,.9); text-transform:uppercase; letter-spacing:.4px; padding-left:2px; }

/* Student rows */
.att-row    { display:grid; grid-template-columns:28px 1fr 54px 54px 84px; padding:8px 8px; gap:4px; align-items:center; border-bottom:1px solid #f3f4f6; }
.att-row:last-child { border-bottom:none; }
.row-alt        { background:#fafafa; }
.row-permission { background:#fffbf5; }
.row-absent     { background:#fff5f5; }

/* Number */
.td-num     { font-size:11px; font-weight:600; color:#9ca3af; text-align:center; }

/* Name cell */
.td-name    { display:flex; align-items:center; gap:7px; min-width:0; }
.row-avatar { width:32px; height:32px; border-radius:50%; color:white; font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.row-info   { min-width:0; display:flex; flex-direction:column; gap:1px; }
.row-name   { font-size:13px; font-weight:600; color:#1f2937; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.row-status-badge { font-size:9px; font-weight:700; padding:1px 6px; border-radius:20px; align-self:flex-start; text-transform:uppercase; letter-spacing:.3px; }
.badge-present    { background:#dcfce7; color:#16a34a; }
.badge-permission { background:#ffedd5; color:#c2410c; }
.badge-absent     { background:#fee2e2; color:#dc2626; }

/* Checkbox cell */
.td-check   { display:flex; align-items:center; justify-content:center; }
.chk-box    { width:28px; height:28px; border-radius:8px; border:2px solid #d1d5db; background:white; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; flex-shrink:0; }
.chk-box:active { transform:scale(.92); }
.chk-checked-permission { background:#f57c00; border-color:#f57c00; }
.chk-checked-absent     { background:#ef4444; border-color:#ef4444; }

/* Reason */
.td-reason  { }
.reason-input { width:100%; padding:5px 7px; border:1.5px solid #e5e7eb; border-radius:8px; font-size:12px; color:#374151; background:#f9fafb; outline:none; box-sizing:border-box; font-family:inherit; }
.reason-input:focus    { border-color:#1976d2; background:white; }
.reason-input:disabled { background:transparent; color:#d1d5db; border-color:transparent; cursor:default; }
.reason-input::placeholder { color:#d1d5db; }

/* Bottom save */
.bottom-save-btn { width:100%; padding:14px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:14px; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 16px rgba(21,101,192,.35); margin-bottom:10px; }
.bottom-save-btn:active { opacity:.88; }

/* Toast */
.toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#1f2937; color:white; padding:11px 20px; border-radius:24px; font-size:13px; font-weight:600; z-index:9999; white-space:nowrap; box-shadow:0 4px 20px rgba(0,0,0,.2); }
.toast-enter-active, .toast-leave-active { transition:all .25s; }
.toast-enter-from, .toast-leave-to { opacity:0; transform:translateX(-50%) translateY(12px); }
</style>
