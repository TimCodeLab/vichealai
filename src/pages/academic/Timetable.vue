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
        <span class="pg-title">{{ t('timetable.title') }}</span>
        <button
          class="pg-add"
          @click="openCreate()"
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
          {{ t('actions.add') }}
        </button>
      </div>
    </ion-header>

    <ion-content style="--background:#f0f2f8">
      <div class="content anim-fade-up">
        <!-- My Class Banner -->
        <div
          v-if="myClassId"
          class="my-banner"
        >
          <div class="my-left">
            <span class="my-star">★</span>
            <div>
              <p class="my-lbl">
                My Class
              </p>
              <p class="my-name">
                {{ className(myClassId) }}
              </p>
            </div>
          </div>
          <button
            class="my-change"
            @click="clearMyClass"
          >
            {{ t('actions.edit') }}
          </button>
        </div>

        <!-- Class selector -->
        <div class="card-sec">
          <div class="sec-row">
            <span class="sec-ttl">{{ t('nav.classes') }}</span>
            <button
              v-if="filterClass && filterClass !== myClassId"
              class="pin-btn"
              @click="setMyClass"
            >
              ☆ Pin as My Class
            </button>
            <button
              v-else-if="filterClass && filterClass === myClassId"
              class="pin-btn pinned"
              @click="clearMyClass"
            >
              ★ My Class
            </button>
          </div>
          <div class="cls-scroll">
            <button
              class="cls-chip"
              :class="{ 'cls-active': filterClass === '' }"
              @click="selectClass('')"
            >
              {{ t('actions.all') }}
            </button>
            <button
              v-for="c in allClasses"
              :key="c.id"
              class="cls-chip"
              :class="{ 'cls-active': filterClass === c.id, 'cls-pinned': myClassId === c.id }"
              @click="selectClass(c.id)"
            >
              <span
                v-if="myClassId === c.id"
                class="chip-star"
              >★</span>{{ c.name }}
            </button>
          </div>
        </div>

        <!-- Teacher filter -->
        <div class="tf-row">
          <span class="tf-icon">👨‍🏫</span>
          <select
            v-model="filterTeacher"
            class="tf-sel"
          >
            <option value="">
              {{ t('timetable.filterTeacher') }}: {{ t('actions.all') }}
            </option>
            <option
              v-for="tc in allTeachers"
              :key="tc.id"
              :value="tc.id"
            >
              {{ tc.name }}
            </option>
          </select>
        </div>

        <!-- Day tabs -->
        <div class="day-tabs">
          <button
            v-for="day in DAYS"
            :key="day.key"
            class="day-tab"
            :class="{ 'dt-active': activeDay === day.key, 'dt-today': todayKey === day.key }"
            :style="activeDay === day.key ? { background: day.color, borderColor: day.color } : {}"
            @click="activeDay = day.key"
          >
            <span class="dt-name">{{ t('timetable.' + day.key) }}</span>
            <span
              v-if="periodsForDay(day.key).length"
              class="dt-badge"
              :style="activeDay === day.key ? { background: 'rgba(255,255,255,.3)', color: 'white' } : {}"
            >{{ periodsForDay(day.key).length }}</span>
            <span
              v-if="todayKey === day.key && activeDay !== day.key"
              class="dt-dot"
            />
          </button>
        </div>

        <!-- Day heading -->
        <div class="dh-row">
          <span
            class="dh-name"
            :style="{ color: activeDayColor }"
          >{{ t('timetable.' + activeDay) }}</span>
          <span
            v-if="todayKey === activeDay"
            class="today-pill"
          >Today</span>
          <span
            v-if="periodsForDay(activeDay).length"
            class="dh-count"
          >{{ periodsForDay(activeDay).length }} {{ periodsForDay(activeDay).length === 1 ? 'class' : 'classes' }}</span>
        </div>

        <!-- Empty state -->
        <div
          v-if="!periodsForDay(activeDay).length"
          class="empty-day"
        >
          <div class="empty-ico">
            📋
          </div>
          <p class="empty-msg">
            No classes scheduled
          </p>
          <button
            class="empty-add"
            @click="openCreate(activeDay)"
          >
            + Add Period
          </button>
        </div>

        <!-- Period cards -->
        <div
          v-else
          class="periods-list"
        >
          <div
            v-for="p in periodsForDay(activeDay)"
            :key="p.id"
            class="period-card"
            :style="{ '--accent': subjectColor(p.subjectId) }"
            @click="editItem(p)"
          >
            <div class="pc-bar" />
            <div class="pc-time">
              <span class="pct-from">{{ p.timeFrom }}</span>
              <div class="pct-line" />
              <span class="pct-to">{{ p.timeTo }}</span>
            </div>
            <div class="pc-body">
              <div class="pc-subj">
                {{ subjectName(p.subjectId) }}
              </div>
              <div
                v-if="p.teacherId"
                class="pc-tchr"
              >
                👨‍🏫 {{ teacherName(p.teacherId) }}
              </div>
              <div class="pc-chips">
                <span
                  v-if="p.room"
                  class="chip-room"
                >📍 {{ p.room }}</span>
                <span
                  v-if="!filterClass && p.classId"
                  class="chip-cls"
                >{{ className(p.classId) }}</span>
              </div>
            </div>
            <div class="pc-dur">
              {{ duration(p.timeFrom, p.timeTo) }}
            </div>
            <button
              class="pc-del"
              @click.stop="deleteItem(p.id)"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Add period -->
        <button
          class="add-fab"
          @click="openCreate(activeDay)"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
          ><path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          /></svg>
          Add Period for {{ t('timetable.' + activeDay) }}
        </button>

        <!-- Legend -->
        <div
          v-if="allSubjects.length"
          class="legend"
        >
          <p class="legend-ttl">
            {{ t('nav.subjects') }}
          </p>
          <div class="legend-list">
            <div
              v-for="s in allSubjects"
              :key="s.id"
              class="legend-item"
            >
              <span
                class="legend-dot"
                :style="{ background: subjectColor(s.id) }"
              />
              <span class="legend-nm">{{ s.name }}</span>
            </div>
          </div>
        </div>
        <div style="height:32px" />
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
          <span class="mo-title">{{ editing ? '✏️ ' + t('timetable.editPeriod') : '➕ ' + t('timetable.addPeriod') }}</span>
          <button
            class="mo-close"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
        <div class="mo-body">
          <div class="mo-field">
            <label class="mo-lbl">{{ t('timetable.day') }} <span class="req">*</span></label>
            <div class="dpick">
              <button
                v-for="d in DAYS"
                :key="d.key"
                class="dpick-btn"
                :class="{ 'dpick-on': form.day === d.key }"
                :style="form.day === d.key ? { background: d.color, borderColor: d.color } : {}"
                @click="form.day = d.key"
              >
                {{ t('timetable.' + d.key) }}
              </button>
            </div>
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-lbl">{{ t('timetable.timeFrom') }} <span class="req">*</span></label>
              <input
                v-model="form.timeFrom"
                type="time"
                class="mo-inp"
              >
            </div>
            <div class="mo-field">
              <label class="mo-lbl">{{ t('timetable.timeTo') }} <span class="req">*</span></label>
              <input
                v-model="form.timeTo"
                type="time"
                class="mo-inp"
              >
            </div>
          </div>
          <div class="mo-field">
            <label class="mo-lbl">{{ t('nav.subjects') }} <span class="req">*</span></label>
            <select
              v-model="form.subjectId"
              class="mo-inp"
            >
              <option value="">
                — {{ t('timetable.selectSubject') }} —
              </option>
              <option
                v-for="s in allSubjects"
                :key="s.id"
                :value="s.id"
              >
                {{ s.name }}
              </option>
            </select>
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-lbl">{{ t('nav.teachers') }}</label>
              <select
                v-model="form.teacherId"
                class="mo-inp"
              >
                <option value="">
                  —
                </option>
                <option
                  v-for="tc in allTeachers"
                  :key="tc.id"
                  :value="tc.id"
                >
                  {{ tc.name }}
                </option>
              </select>
            </div>
            <div class="mo-field">
              <label class="mo-lbl">{{ t('nav.classes') }}</label>
              <select
                v-model="form.classId"
                class="mo-inp"
              >
                <option value="">
                  —
                </option>
                <option
                  v-for="c in allClasses"
                  :key="c.id"
                  :value="c.id"
                >
                  {{ c.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="mo-field">
            <label class="mo-lbl">{{ t('timetable.room') }}</label>
            <input
              v-model="form.room"
              class="mo-inp"
              :placeholder="t('timetable.roomPlaceholder')"
            >
          </div>
          <div class="mo-field">
            <label class="mo-lbl">{{ t('timetable.notes') }}</label>
            <textarea
              v-model="form.notes"
              class="mo-inp mo-ta"
              rows="2"
              :placeholder="t('timetable.notesPlaceholder')"
            />
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
              :disabled="!canSave"
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
import {ref, computed, onMounted} from 'vue';
import {IonPage, IonHeader, IonContent, IonModal} from '@ionic/vue';
import {useRouter} from 'vue-router';
import {useI18n} from '@/composables/useI18n';
import {LocalStorageService} from '@/services/localStorageService';

const router = useRouter();
const {t} = useI18n();

const DAYS = [
  {key: 'mon', color: '#1565c0'}, {key: 'tue', color: '#2e7d32'},
  {key: 'wed', color: '#e65100'}, {key: 'thu', color: '#6a1b9a'},
  {key: 'fri', color: '#c62828'}, {key: 'sat', color: '#00838f'},
];
const DAY_MAP: Record<number, string> = {1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'sun'};
const todayKey = DAY_MAP[new Date().getDay()] ?? 'mon';

// ── Seed ──────────────────────────────────────────────
function seedDefaultData() {
  const SUBJ = [
    {id: 'seed_math', name: 'Mathematics', code: 'MATH'},
    {id: 'seed_kh', name: 'Khmer Literature', code: 'KH'},
    {id: 'seed_en', name: 'English', code: 'EN'},
    {id: 'seed_sci', name: 'Science', code: 'SCI'},
    {id: 'seed_hist', name: 'History', code: 'HIST'},
    {id: 'seed_pe', name: 'Physical Education', code: 'PE'},
  ];
  const TCH = [
    {id: 'seed_t1', name: 'Mr. Phin Dara', email: 'phin@school.edu'},
    {id: 'seed_t2', name: 'Ms. Chan Sothy', email: 'chan@school.edu'},
    {id: 'seed_t3', name: 'Mr. Sok Vanna', email: 'sok@school.edu'},
    {id: 'seed_t4', name: 'Ms. Rin Chanthy', email: 'rin@school.edu'},
    {id: 'seed_t5', name: 'Mr. Lim Sopheak', email: 'lim@school.edu'},
    {id: 'seed_t6', name: 'Mr. Heng Bora', email: 'heng@school.edu'},
  ];
  const CLS = [
    {id: 'seed_10a', name: 'Grade 10A', grade: '10', section: 'A'},
    {id: 'seed_10b', name: 'Grade 10B', grade: '10', section: 'B'},
    {id: 'seed_11a', name: 'Grade 11A', grade: '11', section: 'A'},
  ];
  const PER = [
    // Grade 10A
    {id: 'sp01', day: 'mon', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp02', day: 'mon', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_en', teacherId: 'seed_t3', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp03', day: 'mon', timeFrom: '10:00', timeTo: '11:30', subjectId: 'seed_kh', teacherId: 'seed_t2', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp04', day: 'mon', timeFrom: '13:00', timeTo: '14:30', subjectId: 'seed_sci', teacherId: 'seed_t4', classId: 'seed_10a', room: 'Lab 1'},
    {id: 'sp05', day: 'tue', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_hist', teacherId: 'seed_t5', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp06', day: 'tue', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp07', day: 'tue', timeFrom: '10:00', timeTo: '11:30', subjectId: 'seed_pe', teacherId: 'seed_t6', classId: 'seed_10a', room: 'Gymnasium'},
    {id: 'sp08', day: 'wed', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_en', teacherId: 'seed_t3', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp09', day: 'wed', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_sci', teacherId: 'seed_t4', classId: 'seed_10a', room: 'Lab 1'},
    {id: 'sp10', day: 'wed', timeFrom: '10:00', timeTo: '11:30', subjectId: 'seed_kh', teacherId: 'seed_t2', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp11', day: 'wed', timeFrom: '13:00', timeTo: '14:30', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp12', day: 'thu', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_kh', teacherId: 'seed_t2', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp13', day: 'thu', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_hist', teacherId: 'seed_t5', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp14', day: 'thu', timeFrom: '10:00', timeTo: '11:30', subjectId: 'seed_en', teacherId: 'seed_t3', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp15', day: 'fri', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_sci', teacherId: 'seed_t4', classId: 'seed_10a', room: 'Lab 1'},
    {id: 'sp16', day: 'fri', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp17', day: 'fri', timeFrom: '10:00', timeTo: '11:30', subjectId: 'seed_pe', teacherId: 'seed_t6', classId: 'seed_10a', room: 'Gymnasium'},
    {id: 'sp18', day: 'sat', timeFrom: '07:00', timeTo: '09:00', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_10a', room: 'Room 101'},
    {id: 'sp19', day: 'sat', timeFrom: '09:00', timeTo: '11:00', subjectId: 'seed_en', teacherId: 'seed_t3', classId: 'seed_10a', room: 'Room 101'},
    // Grade 10B
    {id: 'sp20', day: 'mon', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_en', teacherId: 'seed_t3', classId: 'seed_10b', room: 'Room 102'},
    {id: 'sp21', day: 'mon', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_kh', teacherId: 'seed_t2', classId: 'seed_10b', room: 'Room 102'},
    {id: 'sp22', day: 'mon', timeFrom: '10:00', timeTo: '11:30', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_10b', room: 'Room 102'},
    {id: 'sp23', day: 'tue', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_sci', teacherId: 'seed_t4', classId: 'seed_10b', room: 'Lab 1'},
    {id: 'sp24', day: 'tue', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_hist', teacherId: 'seed_t5', classId: 'seed_10b', room: 'Room 102'},
    {id: 'sp25', day: 'tue', timeFrom: '10:00', timeTo: '11:30', subjectId: 'seed_pe', teacherId: 'seed_t6', classId: 'seed_10b', room: 'Gymnasium'},
    {id: 'sp26', day: 'wed', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_10b', room: 'Room 102'},
    {id: 'sp27', day: 'wed', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_en', teacherId: 'seed_t3', classId: 'seed_10b', room: 'Room 102'},
    {id: 'sp28', day: 'thu', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_sci', teacherId: 'seed_t4', classId: 'seed_10b', room: 'Lab 1'},
    {id: 'sp29', day: 'fri', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_kh', teacherId: 'seed_t2', classId: 'seed_10b', room: 'Room 102'},
    {id: 'sp30', day: 'fri', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_10b', room: 'Room 102'},
    // Grade 11A
    {id: 'sp31', day: 'mon', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_11a', room: 'Room 201'},
    {id: 'sp32', day: 'mon', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_sci', teacherId: 'seed_t4', classId: 'seed_11a', room: 'Lab 2'},
    {id: 'sp33', day: 'mon', timeFrom: '10:00', timeTo: '11:30', subjectId: 'seed_en', teacherId: 'seed_t3', classId: 'seed_11a', room: 'Room 201'},
    {id: 'sp34', day: 'tue', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_kh', teacherId: 'seed_t2', classId: 'seed_11a', room: 'Room 201'},
    {id: 'sp35', day: 'tue', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_hist', teacherId: 'seed_t5', classId: 'seed_11a', room: 'Room 201'},
    {id: 'sp36', day: 'wed', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_en', teacherId: 'seed_t3', classId: 'seed_11a', room: 'Room 201'},
    {id: 'sp37', day: 'wed', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_math', teacherId: 'seed_t1', classId: 'seed_11a', room: 'Room 201'},
    {id: 'sp38', day: 'thu', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_sci', teacherId: 'seed_t4', classId: 'seed_11a', room: 'Lab 2'},
    {id: 'sp39', day: 'fri', timeFrom: '07:00', timeTo: '08:30', subjectId: 'seed_pe', teacherId: 'seed_t6', classId: 'seed_11a', room: 'Gymnasium'},
    {id: 'sp40', day: 'fri', timeFrom: '08:30', timeTo: '10:00', subjectId: 'seed_kh', teacherId: 'seed_t2', classId: 'seed_11a', room: 'Room 201'},
  ];

  const merge = (key: string, items: any[]) => {
    const existing: any[] = LocalStorageService.get<any[]>(key, []) || [];
    const toAdd = items.filter(i => !existing.find((e: any) => e.id === i.id));
    if (toAdd.length) LocalStorageService.set(key, [...existing, ...toAdd]);
  };
  merge('subjects', SUBJ);
  merge('teachers', TCH);
  merge('classes', CLS);
  LocalStorageService.set('timetable', PER);
  LocalStorageService.set('timetable_seeded', 'yes');
}

// ── Data ──────────────────────────────────────────────
const periods = ref<any[]>([]);
const allClasses = ref<any[]>([]);
const allTeachers = ref<any[]>([]);
const allSubjects = ref<any[]>([]);

function loadData() {
  periods.value = LocalStorageService.get<any[]>('timetable', []) || [];
  allClasses.value = LocalStorageService.get<any[]>('classes', []) || [];
  allTeachers.value = LocalStorageService.get<any[]>('teachers', []) || [];
  allSubjects.value = LocalStorageService.get<any[]>('subjects', []) || [];
}

onMounted(() => {
  if (LocalStorageService.get<string>('timetable_seeded', '') !== 'yes') seedDefaultData();
  loadData();
  const saved = LocalStorageService.get<string>('timetable_myClass', '') || '';
  if (saved) { myClassId.value = saved; filterClass.value = saved; }
  else if (allClasses.value.length) { filterClass.value = allClasses.value[0].id; }
  activeDay.value = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].includes(todayKey) ? todayKey : 'mon';
});

// ── Filter ────────────────────────────────────────────
const filterClass = ref('');
const filterTeacher = ref('');
const activeDay = ref('mon');
const myClassId = ref('');

function selectClass(id: string) { filterClass.value = id; }
function setMyClass() { myClassId.value = filterClass.value; LocalStorageService.set('timetable_myClass', myClassId.value); }
function clearMyClass(){ myClassId.value = ''; LocalStorageService.set('timetable_myClass', ''); }

const activeDayColor = computed(() => DAYS.find(d => d.key === activeDay.value)?.color || '#1565c0');

const filteredPeriods = computed(() => {
  let list = periods.value;
  if (filterClass.value) list = list.filter(p => p.classId === filterClass.value);
  if (filterTeacher.value) list = list.filter(p => p.teacherId === filterTeacher.value);
  return list;
});

function periodsForDay(day: string) {
  return filteredPeriods.value.filter(p => p.day === day).sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));
}

// ── Helpers ───────────────────────────────────────────
const SCOLORS: Record<string, string> = {
  seed_math: '#1976d2', seed_kh: '#e53935', seed_en: '#43a047',
  seed_sci: '#fb8c00', seed_hist: '#8e24aa', seed_pe: '#00acc1',
};
const PAL = ['#1976d2', '#e53935', '#43a047', '#fb8c00', '#8e24aa', '#00acc1', '#4527a0', '#558b2f', '#00695c', '#ad1457'];

function subjectColor(id: string) {
  if (SCOLORS[id]) return SCOLORS[id];
  const i = allSubjects.value.findIndex(s => s.id === id);
  return PAL[Math.max(0, i) % PAL.length];
}
function subjectName(id: string) { return allSubjects.value.find(s => s.id === id)?.name || id; }
function teacherName(id: string) { return allTeachers.value.find(t => t.id === id)?.name || ''; }
function className(id: string) { return allClasses.value.find(c => c.id === id)?.name || ''; }

function duration(from: string, to: string): string {
  try {
    const [fh, fm] = from.split(':').map(Number);
    const [th, tm] = to.split(':').map(Number);
    const m = (th * 60 + tm) - (fh * 60 + fm);
    if (m <= 0) return '';
    return m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? m % 60 + 'm' : ''}` : `${m}m`;
  } catch { return ''; }
}

// ── CRUD ──────────────────────────────────────────────
const showModal = ref(false);
const editing = ref<any>(null);
const emptyForm = (day = '') => ({day, timeFrom: '07:00', timeTo: '08:30', subjectId: '', teacherId: '', classId: filterClass.value || '', room: '', notes: ''});
const form = ref(emptyForm());
const canSave = computed(() => !!form.value.day && !!form.value.timeFrom && !!form.value.timeTo && !!form.value.subjectId);

function openCreate(day = activeDay.value) { form.value = emptyForm(day); editing.value = null; showModal.value = true; }
function editItem(p: any) { editing.value = p; form.value = {...p}; showModal.value = true; }
function closeModal() { showModal.value = false; editing.value = null; }

function deleteItem(id: string) {
  if (confirm(t('messages.confirmDelete'))) {
    periods.value = periods.value.filter(p => p.id !== id);
    LocalStorageService.set('timetable', periods.value);
  }
}
function saveItem() {
  if (!canSave.value) return;
  if (editing.value) {
    const i = periods.value.findIndex(p => p.id === editing.value.id);
    if (i !== -1) periods.value[i] = {...periods.value[i], ...form.value};
  } else {
    periods.value.push({id: 'tt_' + Date.now(), ...form.value});
  }
  LocalStorageService.set('timetable', periods.value);
  closeModal();
}
</script>

<style scoped>
.pg-header{background:linear-gradient(135deg,#4527a0 0%,#512da8 50%,#7b1fa2 100%);box-shadow:0 4px 20px rgba(69,39,160,.4)}
.pg-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;height:56px}
.pg-back{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.18);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pg-title{font-size:17px;font-weight:700;color:white;flex:1;text-align:center;letter-spacing:.3px}
.pg-add{display:flex;align-items:center;gap:5px;padding:7px 13px;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.35);border-radius:20px;color:white;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}
.content{padding:14px;display:flex;flex-direction:column;gap:12px}
/* My banner */
.my-banner{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#4527a0,#7b1fa2);border-radius:14px;padding:12px 16px}
.my-left{display:flex;align-items:center;gap:10px}
.my-star{font-size:22px;color:#ffd54f}
.my-lbl{font-size:10px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.8px;font-weight:600;margin:0 0 2px}
.my-name{font-size:16px;font-weight:800;color:white;margin:0}
.my-change{padding:7px 14px;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);border-radius:20px;color:white;font-size:12px;font-weight:600;cursor:pointer}
/* Class card */
.card-sec{background:white;border-radius:16px;padding:14px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.sec-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.sec-ttl{font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.6px}
.pin-btn{font-size:11px;font-weight:600;color:#7c3aed;background:#f5f3ff;border:1.5px solid #ddd6fe;border-radius:20px;padding:5px 11px;cursor:pointer;white-space:nowrap}
.pin-btn.pinned{color:#f59e0b;background:#fffbeb;border-color:#fde68a}
.cls-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.cls-scroll::-webkit-scrollbar{display:none}
.cls-chip{white-space:nowrap;padding:7px 14px;border-radius:20px;border:1.5px solid #e5e7eb;background:#f9fafb;font-size:13px;font-weight:600;color:#6b7280;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all .15s;flex-shrink:0}
.cls-chip:hover{border-color:#7c3aed;color:#7c3aed}
.cls-active{background:#4527a0!important;border-color:#4527a0!important;color:white!important}
.cls-pinned{border-color:#f59e0b}
.chip-star{font-size:11px;color:#fbbf24}
.cls-active .chip-star{color:#ffd54f}
/* Teacher filter */
.tf-row{display:flex;align-items:center;gap:10px;background:white;border-radius:12px;padding:10px 14px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.tf-icon{font-size:18px;flex-shrink:0}
.tf-sel{flex:1;border:none;background:transparent;font-size:13px;font-weight:600;color:#374151;outline:none;cursor:pointer}
/* Day tabs */
.day-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.day-tabs::-webkit-scrollbar{display:none}
.day-tab{flex:1;min-width:44px;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;border-radius:12px;border:1.5px solid #e5e7eb;background:white;cursor:pointer;transition:all .2s;position:relative}
.dt-name{font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase}
.dt-badge{font-size:10px;font-weight:700;background:#f3f4f6;color:#374151;border-radius:8px;padding:1px 6px;min-width:16px;text-align:center}
.dt-dot{position:absolute;bottom:5px;width:5px;height:5px;border-radius:50%;background:#ef4444}
.dt-active .dt-name{color:white}
.dt-today:not(.dt-active){border-color:#ef4444}
.dt-today:not(.dt-active) .dt-name{color:#ef4444}
/* Day heading */
.dh-row{display:flex;align-items:center;gap:8px;padding:0 2px}
.dh-name{font-size:18px;font-weight:800}
.today-pill{font-size:10px;font-weight:700;background:#fef2f2;color:#ef4444;border:1px solid #fecaca;border-radius:10px;padding:2px 8px}
.dh-count{font-size:12px;color:#9ca3af;margin-left:auto}
/* Empty */
.empty-day{display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px 20px;background:white;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.empty-ico{font-size:40px}
.empty-msg{font-size:14px;color:#9ca3af;margin:0}
.empty-add{padding:10px 22px;background:linear-gradient(135deg,#4527a0,#7b1fa2);color:white;border:none;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer}
/* Period cards */
.periods-list{display:flex;flex-direction:column;gap:10px}
.period-card{display:flex;align-items:stretch;background:white;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.06);overflow:hidden;cursor:pointer;transition:box-shadow .15s,transform .15s;position:relative}
.period-card:hover{box-shadow:0 4px 18px rgba(0,0,0,.12);transform:translateY(-1px)}
.pc-bar{width:5px;background:var(--accent);flex-shrink:0}
.pc-time{display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:12px 10px;min-width:50px;background:#fafafa;border-right:1px solid #f3f4f6}
.pct-from{font-size:12px;font-weight:800;color:#374151}
.pct-line{flex:1;width:2px;background:#e5e7eb;margin:4px 0;border-radius:1px}
.pct-to{font-size:12px;font-weight:700;color:#9ca3af}
.pc-body{flex:1;padding:12px 12px 12px 14px;min-width:0}
.pc-subj{font-size:15px;font-weight:800;color:#1f2937;margin-bottom:4px}
.pc-tchr{font-size:12px;color:#6b7280;margin-bottom:6px}
.pc-chips{display:flex;flex-wrap:wrap;gap:5px}
.chip-room{font-size:11px;font-weight:600;background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;border-radius:8px;padding:2px 8px}
.chip-cls{font-size:11px;font-weight:600;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;border-radius:8px;padding:2px 8px}
.pc-dur{font-size:11px;font-weight:700;color:#9ca3af;padding:12px 10px 12px 4px;align-self:flex-start;white-space:nowrap}
.pc-del{position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;background:#fee2e2;border:none;cursor:pointer;font-size:9px;color:#ef4444;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}
.period-card:hover .pc-del{opacity:1}
/* Add fab */
.add-fab{width:100%;padding:13px;background:white;border:2px dashed #d1d5db;border-radius:14px;color:#9ca3af;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px}
.add-fab:hover{border-color:#7c3aed;color:#7c3aed;background:#f5f3ff}
/* Legend */
.legend{background:white;border-radius:14px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.05)}
.legend-ttl{font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;margin:0 0 10px}
.legend-list{display:flex;flex-wrap:wrap;gap:8px}
.legend-item{display:flex;align-items:center;gap:6px}
.legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.legend-nm{font-size:12px;font-weight:600;color:#374151}
/* Modal */
.mo-wrap{display:flex;flex-direction:column;height:100%;background:white;border-radius:20px 20px 0 0}
.mo-handle{width:40px;height:4px;border-radius:4px;background:#e5e7eb;margin:12px auto 0}
.mo-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px 10px;border-bottom:1px solid #f3f4f6}
.mo-title{font-size:16px;font-weight:700;color:#1f2937}
.mo-close{width:30px;height:30px;border-radius:50%;background:#f3f4f6;border:none;cursor:pointer;font-size:13px;color:#6b7280}
.mo-body{flex:1;overflow-y:auto;padding:16px 18px;display:flex;flex-direction:column;gap:13px}
.mo-field{display:flex;flex-direction:column;gap:5px}
.mo-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mo-lbl{font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.5px}
.req{color:#ef4444}
.mo-inp{width:100%;padding:11px 13px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;color:#1f2937;background:#f9fafb;outline:none;box-sizing:border-box}
.mo-inp:focus{border-color:#7c3aed;background:white}
.mo-ta{resize:vertical;min-height:60px}
.mo-btns{display:flex;gap:10px;padding-top:4px}
.mo-cancel{flex:1;padding:13px;background:#f3f4f6;color:#374151;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer}
.mo-save{flex:2;padding:13px;background:linear-gradient(135deg,#4527a0,#7b1fa2);color:white;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer}
.mo-save:disabled{opacity:.45;cursor:default}
.dpick{display:flex;flex-wrap:wrap;gap:6px}
.dpick-btn{padding:7px 12px;border:1.5px solid #e5e7eb;border-radius:20px;background:white;font-size:12px;font-weight:600;color:#6b7280;cursor:pointer;transition:all .15s}
.dpick-btn:hover{border-color:#7c3aed;color:#7c3aed}
.dpick-on{color:white!important}
@keyframes fade-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.anim-fade-up{animation:fade-up .3s ease-out}
</style>
