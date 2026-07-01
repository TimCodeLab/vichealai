<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <template #start>
          <ion-buttons>
            <ion-button @click="router.back()">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              ><path
                d="M19 12H5M5 12l7 7M5 12l7-7"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg>
            </ion-button>
          </ion-buttons>
        </template>
        <ion-title>{{ t('roles.title') }}</ion-title>
        <template #end>
          <ion-buttons>
            <ion-button @click="openNewRole">
              <span style="font-size:20px">+</span>
            </ion-button>
          </ion-buttons>
        </template>
      </ion-toolbar>
    </ion-header>

    <ion-content
      :fullscreen="true"
      style="--background:#f0f4ff"
    >
      <!-- Role selector chips -->
      <div class="role-chips-wrap">
        <div class="role-chips">
          <button
            v-for="role in roles"
            :key="role.id"
            class="role-chip"
            :class="{ active: selectedRoleId === role.id }"
            :style="selectedRoleId === role.id ? { background: role.color, borderColor: role.color } : {}"
            @click="selectedRoleId = role.id"
          >
            <span class="rchip-icon">{{ role.icon }}</span>
            <span class="rchip-name">{{ role.name }}</span>
            <span
              v-if="!role.isSystem"
              class="rchip-del"
              @click.stop="deleteRole(role.id)"
            >×</span>
          </button>
        </div>
      </div>

      <div
        v-if="selectedRole"
        class="content-wrap"
      >
        <!-- Role info card -->
        <div class="role-card">
          <div
            class="role-icon-big"
            :style="{ background: selectedRole.color + '22' }"
          >
            {{ selectedRole.icon }}
          </div>
          <div class="role-meta">
            <div class="role-name">
              {{ selectedRole.name }}
            </div>
            <div class="role-desc">
              {{ selectedRole.description || t('roles.noDesc') }}
            </div>
            <div
              class="role-tag"
              :style="{ background: selectedRole.color + '22', color: selectedRole.color }"
            >
              {{ selectedRole.isSystem ? t('roles.system') : t('roles.custom') }}
            </div>
          </div>
          <button
            v-if="!selectedRole.isSystem"
            class="edit-btn"
            @click="openEditRole(selectedRole)"
          >
            ✏️
          </button>
        </div>

        <!-- Permission matrix -->
        <div class="matrix-section">
          <div class="matrix-title">
            🛡 {{ t('roles.permissions') }}
          </div>
          <div class="matrix-table">
            <div class="matrix-head">
              <div class="mh-module">
                {{ t('roles.module') }}
              </div>
              <div
                v-for="action in actions"
                :key="action"
                class="mh-action"
              >
                {{ t('roles.' + action) }}
              </div>
            </div>
            <div
              v-for="mod in modules"
              :key="mod.key"
              class="matrix-row"
            >
              <div class="mr-module">
                <span class="mr-icon">{{ mod.icon }}</span>
                <span class="mr-name">{{ t('nav.' + mod.key) }}</span>
              </div>
              <div
                v-for="action in actions"
                :key="action"
                class="mr-cell"
              >
                <button
                  class="perm-toggle"
                  :class="{ on: hasPermission(selectedRole.id, mod.key, action), disabled: selectedRole.isSystem && isSystemAlwaysOn(selectedRole.id, mod.key, action) }"
                  @click="togglePermission(selectedRole.id, mod.key, action)"
                >
                  <span v-if="hasPermission(selectedRole.id, mod.key, action)">✓</span>
                  <span
                    v-else
                    class="x-mark"
                  >✕</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="!selectedRole.isSystem"
          class="btn-save"
          @click="savePermissions"
        >
          💾 {{ t('roles.savePermissions') }}
        </button>
      </div>

      <!-- Toast -->
      <div
        v-if="toast"
        class="toast"
      >
        {{ toast }}
      </div>
    </ion-content>

    <!-- Role modal -->
    <ion-modal
      :is-open="showModal"
      :breakpoints="[0,1]"
      :initial-breakpoint="1"
      @did-dismiss="showModal = false"
    >
      <ion-content style="--background:white">
        <div class="modal-inner">
          <div class="modal-title">
            {{ editing ? '✏️ ' + t('roles.editRole') : '➕ ' + t('roles.newRole') }}
          </div>

          <div class="field-group">
            <label class="field-label">{{ t('roles.roleName') }} *</label>
            <input
              v-model="form.name"
              class="field-input"
              :placeholder="t('roles.roleNamePlaceholder')"
            >
          </div>
          <div class="field-group">
            <label class="field-label">{{ t('roles.roleDesc') }}</label>
            <input
              v-model="form.description"
              class="field-input"
              :placeholder="t('roles.roleDescPlaceholder')"
            >
          </div>
          <div class="field-group">
            <label class="field-label">{{ t('roles.icon') }}</label>
            <div class="icon-picker">
              <button
                v-for="ic in iconOptions"
                :key="ic"
                class="icon-opt"
                :class="{ active: form.icon === ic }"
                @click="form.icon = ic"
              >
                {{ ic }}
              </button>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">{{ t('roles.color') }}</label>
            <div class="color-picker">
              <button
                v-for="col in colorOptions"
                :key="col"
                class="color-opt"
                :class="{ active: form.color === col }"
                :style="{ background: col }"
                @click="form.color = col"
              />
            </div>
          </div>

          <div
            v-if="formError"
            class="error-msg"
          >
            ⚠ {{ formError }}
          </div>

          <div class="modal-btns">
            <button
              class="mbtn-cancel"
              @click="showModal = false"
            >
              {{ t('actions.cancel') }}
            </button>
            <button
              class="mbtn-save"
              @click="saveRole"
            >
              {{ t('actions.save') }}
            </button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonModal} from '@ionic/vue';
import {useI18n} from '@/composables/useI18n';
import {LocalStorageService} from '@/services/localStorageService';

const {t} = useI18n();
const router = useRouter();

// ── Module list ──
const modules = [
  {key: 'students', icon: '🎒'},
  {key: 'teachers', icon: '👩‍🏫'},
  {key: 'classes', icon: '🏛'},
  {key: 'subjects', icon: '📖'},
  {key: 'attendance', icon: '✅'},
  {key: 'timetable', icon: '🗓'},
  {key: 'homework', icon: '📝'},
  {key: 'exams', icon: '📋'},
  {key: 'library', icon: '📚'},
  {key: 'reports', icon: '📊'},
  {key: 'finance', icon: '💰'},
  {key: 'communication', icon: '📢'},
  {key: 'calendar', icon: '📅'},
  {key: 'parents', icon: '👨‍👩‍👧'},
  {key: 'settings', icon: '⚙️'},
];

const actions = ['view', 'create', 'edit', 'delete'];

// ── Default roles ──
const defaultRoles = [
  {
    id: 'school_admin', name: 'School Admin', icon: '🏫', color: '#1565c0',
    description: 'Full school management access', isSystem: true,
  },
  {
    id: 'teacher', name: 'Teacher', icon: '👩‍🏫', color: '#2e7d32',
    description: 'Manage classes, attendance, homework, exams', isSystem: true,
  },
  {
    id: 'student', name: 'Student', icon: '🎒', color: '#e65100',
    description: 'View own data, submit homework', isSystem: true,
  },
  {
    id: 'parent', name: 'Parent', icon: '👨‍👩‍👧', color: '#c62828',
    description: "View child's data and progress", isSystem: true,
  },
];

const systemPermissions: Record<string, Record<string, string[]>> = {
  school_admin: Object.fromEntries(modules.map(m => [m.key, [...actions]])),
  teacher: Object.fromEntries(modules.map(m => {
    if (['students', 'attendance', 'homework', 'exams', 'timetable', 'subjects', 'communication'].includes(m.key))
      return [m.key, ['view', 'create', 'edit']];
    return [m.key, ['view']];
  })),
  student: Object.fromEntries(modules.map(m => {
    if (['homework', 'exams', 'timetable', 'subjects', 'attendance'].includes(m.key))
      return [m.key, ['view', 'create']];
    return [m.key, ['view']];
  })),
  parent: Object.fromEntries(modules.map(m => [m.key, ['view']])),
};

// ── Stored roles & permissions ──
const roles = ref<any[]>([
  ...defaultRoles,
  ...(LocalStorageService.get<any[]>('custom_roles', []) || []),
]);

const permissions = ref<Record<string, Record<string, string[]>>>(
  LocalStorageService.get('role_permissions', {}) || {}
);

const selectedRoleId = ref(roles.value[0]?.id || '');
const selectedRole = computed(() => roles.value.find(r => r.id === selectedRoleId.value));

// ── Permission helpers ──
function hasPermission(roleId: string, module: string, action: string) {
  // System roles use hardcoded permissions
  if (systemPermissions[roleId]) {
    return (systemPermissions[roleId][module] || []).includes(action);
  }
  return (permissions.value[roleId]?.[module] || []).includes(action);
}

function isSystemAlwaysOn(roleId: string, module: string, action: string) {
  return hasPermission(roleId, module, action);
}

function togglePermission(roleId: string, module: string, action: string) {
  if (systemPermissions[roleId]) return; // System roles can't be edited
  if (!permissions.value[roleId]) permissions.value[roleId] = {};
  if (!permissions.value[roleId][module]) permissions.value[roleId][module] = [];
  const arr = permissions.value[roleId][module];
  const idx = arr.indexOf(action);
  if (idx === -1) arr.push(action);
  else arr.splice(idx, 1);
}

function savePermissions() {
  LocalStorageService.set('role_permissions', permissions.value);
  showToast('💾 ' + t('roles.savedMsg'));
}

// ── Modal ──
const showModal = ref(false);
const editing = ref<any>(null);
const formError = ref('');
const form = ref({name: '', description: '', icon: '🎭', color: '#6366f1'});

const iconOptions = ['🎭', '🔧', '📋', '🌟', '🏆', '💡', '🔑', '📌', '🎯', '👤', '📊', '🛡'];
const colorOptions = ['#6366f1', '#1976d2', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#374151', '#0f766e'];

function openNewRole() {
  editing.value = null;
  form.value = {name: '', description: '', icon: '🎭', color: '#6366f1'};
  formError.value = '';
  showModal.value = true;
}

function openEditRole(role: any) {
  editing.value = role;
  form.value = {name: role.name, description: role.description || '', icon: role.icon, color: role.color};
  formError.value = '';
  showModal.value = true;
}

function saveRole() {
  formError.value = '';
  if (!form.value.name.trim()) { formError.value = t('roles.nameRequired'); return; }

  if (editing.value) {
    const r = roles.value.find(r => r.id === editing.value.id);
    if (r) Object.assign(r, {name: form.value.name, description: form.value.description, icon: form.value.icon, color: form.value.color});
  } else {
    const newRole = {
      id: 'role_' + Date.now(),
      name: form.value.name,
      description: form.value.description,
      icon: form.value.icon,
      color: form.value.color,
      isSystem: false,
    };
    roles.value.push(newRole);
    selectedRoleId.value = newRole.id;
  }

  const custom = roles.value.filter(r => !r.isSystem);
  LocalStorageService.set('custom_roles', custom);
  showModal.value = false;
  showToast('✅ ' + t('roles.savedMsg'));
}

function deleteRole(id: string) {
  if (!confirm(t('roles.deleteConfirm'))) return;
  const idx = roles.value.findIndex(r => r.id === id);
  if (idx !== -1) roles.value.splice(idx, 1);
  if (selectedRoleId.value === id) selectedRoleId.value = roles.value[0]?.id || '';
  const custom = roles.value.filter(r => !r.isSystem);
  LocalStorageService.set('custom_roles', custom);
  showToast('🗑 ' + t('messages.deletedSuccessfully'));
}

// ── Toast ──
const toast = ref('');
function showToast(msg: string) {
  toast.value = msg;
  setTimeout(() => toast.value = '', 2500);
}
</script>

<style scoped>
ion-toolbar { --background:white; }

/* Role chips */
.role-chips-wrap { background:white; padding:12px 16px; border-bottom:1px solid #f3f4f6; }
.role-chips { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; }

.role-chip {
  display:flex; align-items:center; gap:6px; padding:7px 12px; border-radius:20px;
  border:1.5px solid #e5e7eb; background:white; cursor:pointer; white-space:nowrap;
  font-size:13px; font-weight:600; color:#6b7280; flex-shrink:0; transition:all .2s;
}
.role-chip.active { color:white; }
.rchip-icon { font-size:14px; }
.rchip-name { font-size:12px; font-weight:700; }
.rchip-del  { font-size:14px; font-weight:700; color:rgba(255,255,255,.7); margin-left:4px; line-height:1; }

/* Content */
.content-wrap { padding:16px; }

/* Role card */
.role-card { background:white; border-radius:16px; padding:16px; display:flex; align-items:center; gap:14px; margin-bottom:16px; box-shadow:0 2px 10px rgba(0,0,0,.07); }
.role-icon-big { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; flex-shrink:0; }
.role-meta { flex:1; min-width:0; }
.role-name { font-size:16px; font-weight:800; color:#1f2937; }
.role-desc { font-size:12px; color:#6b7280; margin-top:2px; }
.role-tag  { display:inline-block; font-size:10px; font-weight:700; padding:2px 8px; border-radius:8px; margin-top:5px; }
.edit-btn  { background:none; border:none; font-size:18px; cursor:pointer; padding:8px; }

/* Matrix */
.matrix-section { background:white; border-radius:16px; padding:16px; box-shadow:0 2px 10px rgba(0,0,0,.07); }
.matrix-title  { font-size:14px; font-weight:800; color:#1f2937; margin-bottom:12px; }

.matrix-table { overflow-x:auto; }
.matrix-head  { display:grid; grid-template-columns:1fr repeat(4,44px); gap:4px; margin-bottom:4px; }
.mh-module    { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; }
.mh-action    { font-size:9px; font-weight:700; color:#9ca3af; text-align:center; text-transform:uppercase; }

.matrix-row   { display:grid; grid-template-columns:1fr repeat(4,44px); gap:4px; align-items:center; padding:6px 0; border-top:1px solid #f9fafb; }
.mr-module    { display:flex; align-items:center; gap:6px; }
.mr-icon      { font-size:13px; }
.mr-name      { font-size:12px; font-weight:600; color:#374151; }
.mr-cell      { display:flex; align-items:center; justify-content:center; }

.perm-toggle  {
  width:30px; height:30px; border-radius:8px; border:1.5px solid #e5e7eb;
  background:#f9fafb; color:#d1d5db; font-size:12px; font-weight:700;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:all .15s;
}
.perm-toggle.on { background:#dcfce7; border-color:#16a34a; color:#16a34a; }
.perm-toggle.disabled { cursor:default; opacity:.7; }
.x-mark { color:#d1d5db; }

/* Save button */
.btn-save { width:100%; margin-top:16px; padding:14px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; }

/* Toast */
.toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#1f2937; color:white; padding:10px 20px; border-radius:20px; font-size:13px; font-weight:600; z-index:999; animation:fadeIn .25s ease; white-space:nowrap; }
@keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

/* Modal */
.modal-inner   { padding:24px 20px; }
.modal-title   { font-size:18px; font-weight:800; color:#1f2937; margin-bottom:16px; }
.field-group   { margin-bottom:14px; }
.field-label   { display:block; font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; margin-bottom:5px; }
.field-input   { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.field-input:focus { border-color:#1976d2; }

.icon-picker { display:flex; flex-wrap:wrap; gap:6px; }
.icon-opt    { width:38px; height:38px; border-radius:10px; border:1.5px solid #e5e7eb; background:white; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.icon-opt.active { border-color:#1976d2; background:#eff6ff; }

.color-picker { display:flex; flex-wrap:wrap; gap:8px; }
.color-opt    { width:32px; height:32px; border-radius:50%; border:3px solid transparent; cursor:pointer; transition:border-color .15s; }
.color-opt.active { border-color:#1f2937; }

.error-msg { color:#dc2626; font-size:13px; background:#fef2f2; padding:9px 12px; border-radius:8px; border-left:3px solid #dc2626; margin-bottom:10px; }
.modal-btns { display:flex; gap:10px; margin-top:16px; }
.mbtn-cancel { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mbtn-save   { flex:2; padding:13px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; }
</style>
