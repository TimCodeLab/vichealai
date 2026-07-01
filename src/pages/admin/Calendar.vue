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
        <span class="pg-title">{{ t('calendar.title') }}</span>
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
        <!-- Month nav -->
        <div class="month-nav">
          <button
            class="month-btn"
            @click="prevMonth"
          >
            ‹
          </button>
          <div class="month-label">
            {{ monthLabel }}
          </div>
          <button
            class="month-btn"
            @click="nextMonth"
          >
            ›
          </button>
        </div>

        <!-- Calendar grid -->
        <div class="cal-grid-wrap">
          <div class="cal-days-head">
            <div
              v-for="d in dayNames"
              :key="d"
              class="cal-dname"
            >
              {{ d }}
            </div>
          </div>
          <div class="cal-grid">
            <div
              v-for="cell in calCells"
              :key="cell.key"
              class="cal-cell"
              :class="{ 'other-month': !cell.inMonth, 'today': cell.isToday, 'has-events': cell.events.length > 0 }"
              @click="cell.inMonth && selectDay(cell)"
            >
              <span class="cal-day-num">{{ cell.day }}</span>
              <div
                v-if="cell.events.length"
                class="event-dots"
              >
                <span
                  v-for="(ev, i) in cell.events.slice(0,3)"
                  :key="i"
                  class="event-dot"
                  :style="{ background: typeColor(ev.type) }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Events list -->
        <div class="filter-tabs">
          <button
            v-for="tab in filterTabs"
            :key="tab.val"
            class="filter-tab"
            :class="{ active: activeFilter === tab.val }"
            @click="activeFilter = tab.val"
          >
            {{ tab.label }}
          </button>
        </div>

        <div
          v-if="filteredEvents.length === 0"
          class="pg-empty"
        >
          <div style="font-size:48px;margin-bottom:12px">
            📅
          </div>
          <div class="empty-title">
            {{ t('calendar.noEvents') }}
          </div>
          <div class="empty-sub">
            {{ t('calendar.noEventsSub') }}
          </div>
        </div>

        <div
          v-for="ev in filteredEvents"
          :key="ev.id"
          class="ev-card"
        >
          <div
            class="ev-color-bar"
            :style="{ background: typeColor(ev.type) }"
          />
          <div class="ev-body">
            <div class="ev-name">
              {{ ev.name }}
            </div>
            <div class="ev-dates">
              {{ formatDate(ev.startDate) }} {{ ev.endDate && ev.endDate !== ev.startDate ? '→ ' + formatDate(ev.endDate) : '' }}
            </div>
            <span
              class="ev-type-badge"
              :style="{ background: typeColor(ev.type) + '22', color: typeColor(ev.type) }"
            >{{ typeName(ev.type) }}</span>
          </div>
          <button
            class="ev-del"
            @click="deleteEvent(ev.id)"
          >
            <svg
              width="13"
              height="13"
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
          <span class="mo-title">{{ editing ? '✏️ ' + t('calendar.editEvent') : '➕ ' + t('calendar.newEvent') }}</span>
          <button
            class="mo-close"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
        <div class="mo-body">
          <div class="mo-field">
            <label class="mo-label">{{ t('calendar.eventName') }} *</label><input
              v-model="form.name"
              class="mo-input"
              placeholder="e.g. Khmer New Year Holiday"
            >
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('calendar.startDate') }}</label><input
                v-model="form.startDate"
                type="date"
                class="mo-input"
              >
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('calendar.endDate') }}</label><input
                v-model="form.endDate"
                type="date"
                class="mo-input"
              >
            </div>
          </div>
          <div class="mo-field">
            <label class="mo-label">{{ t('calendar.type') }}</label>
            <div class="type-picker">
              <button
                v-for="type in eventTypes"
                :key="type.val"
                class="type-btn"
                :class="{ active: form.type === type.val }"
                :style="form.type === type.val ? { background: type.color, borderColor: type.color, color:'white' } : {}"
                @click="form.type = type.val"
              >
                {{ type.icon }} {{ type.label }}
              </button>
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
              :disabled="!form.name || !form.startDate"
              @click="saveEvent"
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

const now = new Date();
const viewYear = ref(now.getFullYear());
const viewMonth = ref(now.getMonth()); // 0-based
const showModal = ref(false);
const editing = ref<any>(null);
const activeFilter = ref('all');

const events = ref<any[]>(LocalStorageService.get<any[]>('calendar_events', []) || [
  {id: 'ev1', name: 'Khmer New Year', startDate: '2026-04-13', endDate: '2026-04-16', type: 'holiday'},
  {id: 'ev2', name: 'Term 1 Exams', startDate: '2026-06-01', endDate: '2026-06-07', type: 'exam'},
  {id: 'ev3', name: 'Sports Day', startDate: '2026-03-15', endDate: '2026-03-15', type: 'activity'},
  {id: 'ev4', name: 'Parent Meeting', startDate: '2026-07-10', endDate: '2026-07-10', type: 'meeting'},
]);

const form = ref({name: '', startDate: '', endDate: '', type: 'holiday'});

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const eventTypes = computed(() => [
  {val: 'holiday', icon: '🏖', label: t('calendar.holiday'), color: '#dc2626'},
  {val: 'exam', icon: '📋', label: t('calendar.exam'), color: '#1976d2'},
  {val: 'activity', icon: '⚽', label: t('calendar.activity'), color: '#16a34a'},
  {val: 'meeting', icon: '🤝', label: t('calendar.meeting'), color: '#d97706'},
  {val: 'other', icon: '📌', label: t('calendar.other'), color: '#6b7280'},
]);

const filterTabs = computed(() => [
  {val: 'all', label: t('calendar.all')},
  {val: 'upcoming', label: t('calendar.upcoming')},
  {val: 'past', label: t('calendar.past')},
]);

const monthLabel = computed(() => {
  return new Date(viewYear.value, viewMonth.value).toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
});

const calCells = computed(() => {
  const firstDay = new Date(viewYear.value, viewMonth.value, 1).getDay();
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate();
  const daysInPrev = new Date(viewYear.value, viewMonth.value, 0).getDate();
  const cells: any[] = [];
  const todayStr = now.toISOString().slice(0, 10);

  // prev month
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({key: `p${i}`, day: daysInPrev - i, inMonth: false, events: []});
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = events.value.filter(ev => ev.startDate <= dateStr && (ev.endDate || ev.startDate) >= dateStr);
    cells.push({key: `c${d}`, day: d, date: dateStr, inMonth: true, isToday: dateStr === todayStr, events: dayEvents});
  }
  // next month
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({key: `n${i}`, day: i, inMonth: false, events: []});
  }
  return cells;
});

const filteredEvents = computed(() => {
  const todayStr = now.toISOString().slice(0, 10);
  return events.value.filter(ev => {
    if (activeFilter.value === 'upcoming') return (ev.endDate || ev.startDate) >= todayStr;
    if (activeFilter.value === 'past') return (ev.endDate || ev.startDate) < todayStr;
    return true;
  }).sort((a, b) => a.startDate.localeCompare(b.startDate));
});

function typeColor(type: string) {
  const map: Record<string, string> = {holiday: '#dc2626', exam: '#1976d2', activity: '#16a34a', meeting: '#d97706', other: '#6b7280'};
  return map[type] || '#6b7280';
}

function typeName(type: string) {
  const found = eventTypes.value.find(e => e.val === type);
  return found ? found.label : type;
}

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
}

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value--; }
  else viewMonth.value--;
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++; }
  else viewMonth.value++;
}

function selectDay(cell: any) {
  form.value.startDate = cell.date;
  form.value.endDate = cell.date;
  openCreate();
}

function openCreate() { if (!form.value.startDate) form.value = {name: '', startDate: '', endDate: '', type: 'holiday'}; editing.value = null; showModal.value = true; }
function closeModal() { showModal.value = false; editing.value = null; form.value = {name: '', startDate: '', endDate: '', type: 'holiday'}; }

function deleteEvent(id: string) {
  if (confirm(t('calendar.deleteEvent'))) {
    events.value = events.value.filter(e => e.id !== id);
    LocalStorageService.set('calendar_events', events.value);
  }
}

function saveEvent() {
  if (!form.value.name || !form.value.startDate) return;
  if (editing.value) {
    const i = events.value.findIndex(e => e.id === editing.value.id);
    if (i !== -1) events.value[i] = {...events.value[i], ...form.value};
  } else {
    events.value.push({id: `ev_${Date.now()}`, ...form.value});
  }
  LocalStorageService.set('calendar_events', events.value);
  closeModal();
}
</script>

<style scoped>
.pg-header { background:linear-gradient(135deg,#0891b2 0%,#06b6d4 45%,#22d3ee 100%); box-shadow:0 4px 20px rgba(8,145,178,.4); }
.pg-bar    { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back   { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title  { font-size:17px; font-weight:700; color:white; }
.pg-new    { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }
.pg-body   { padding:14px; }

/* Month nav */
.month-nav   { display:flex; align-items:center; justify-content:space-between; background:white; border-radius:14px; padding:12px 16px; margin-bottom:12px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.month-btn   { width:36px; height:36px; border-radius:50%; background:#f3f4f6; border:none; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#374151; }
.month-label { font-size:16px; font-weight:700; color:#1f2937; }

/* Calendar grid */
.cal-grid-wrap { background:white; border-radius:14px; padding:12px; margin-bottom:12px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.cal-days-head { display:grid; grid-template-columns:repeat(7,1fr); margin-bottom:4px; }
.cal-dname     { text-align:center; font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; padding:4px; }
.cal-grid      { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.cal-cell      { aspect-ratio:1; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; padding-top:4px; cursor:pointer; transition:background .15s; position:relative; }
.cal-cell:hover { background:#f0f9ff; }
.cal-cell.other-month { opacity:.35; cursor:default; }
.cal-cell.today .cal-day-num { background:#0891b2; color:white; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; }
.cal-cell.has-events { background:#f0fdfa; }
.cal-day-num  { font-size:13px; font-weight:600; color:#374151; line-height:1; }
.event-dots   { display:flex; gap:2px; margin-top:2px; flex-wrap:wrap; justify-content:center; }
.event-dot    { width:5px; height:5px; border-radius:50%; }

/* Filters */
.filter-tabs { display:flex; gap:6px; margin-bottom:12px; }
.filter-tab  { padding:6px 14px; border-radius:20px; border:1.5px solid #e5e7eb; background:white; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer; }
.filter-tab.active { background:#0891b2; border-color:#0891b2; color:white; }

/* Empty */
.pg-empty { text-align:center; padding:40px 20px; }
.empty-title { font-size:16px; font-weight:600; color:#374151; }
.empty-sub   { font-size:13px; color:#9ca3af; margin-top:4px; }

/* Event cards */
.ev-card { display:flex; align-items:center; background:white; border-radius:12px; margin-bottom:8px; box-shadow:0 2px 8px rgba(0,0,0,.06); overflow:hidden; }
.ev-color-bar { width:4px; height:100%; min-height:60px; flex-shrink:0; }
.ev-body { flex:1; padding:12px; }
.ev-name { font-size:14px; font-weight:700; color:#1f2937; margin-bottom:4px; }
.ev-dates { font-size:12px; color:#6b7280; margin-bottom:6px; }
.ev-type-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:8px; }
.ev-del  { width:40px; height:40px; background:none; border:none; cursor:pointer; color:#9ca3af; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* Type picker */
.type-picker { display:flex; flex-wrap:wrap; gap:6px; }
.type-btn    { padding:7px 12px; border-radius:10px; border:1.5px solid #e5e7eb; background:white; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer; transition:all .15s; }

/* Modal */
ion-modal  { --border-radius:20px 20px 0 0; --max-height:80vh; align-items:flex-end; }
.mo-wrap   { background:white; border-radius:20px 20px 0 0; display:flex; flex-direction:column; max-height:80vh; }
.mo-handle { width:36px; height:4px; border-radius:2px; background:#e5e7eb; margin:12px auto 0; }
.mo-head   { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 10px; border-bottom:1px solid #f3f4f6; }
.mo-title  { font-size:16px; font-weight:700; color:#1f2937; }
.mo-close  { width:30px; height:30px; border-radius:50%; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; color:#6b7280; }
.mo-body   { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
.mo-field  { display:flex; flex-direction:column; gap:5px; }
.mo-row2   { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.mo-label  { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mo-input  { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.mo-input:focus { border-color:#0891b2; background:white; }
.mo-btns   { display:flex; gap:10px; padding-top:4px; }
.mo-cancel { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save   { flex:2; padding:13px; background:linear-gradient(135deg,#0891b2,#06b6d4); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save:disabled { opacity:.45; cursor:default; }

.pg-body.anim-fade-up { animation:fadeUp .4s ease both; }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
</style>
