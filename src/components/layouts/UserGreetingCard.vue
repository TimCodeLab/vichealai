<template>
  <div class="px-4 py-6 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col gap-4">
    <!-- Greeting Card -->
    <div class="glass-effect rounded-3xl p-6 flex items-center justify-between border-l-4 border-l-purple-500 animate-slide-in-left">
      <div class="flex items-center gap-4 flex-1">
        <div class="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-400 animate-glow-pulse">
          <img
            :src="userAvatar"
            :alt="user?.name"
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-transparent opacity-20" />
        </div>
        <div class="flex-1">
          <p class="text-xs uppercase text-purple-300 tracking-widest font-semibold">
            {{ greeting }}
          </p>
          <h2 class="text-2xl font-bold text-white mt-1 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            {{ user?.name || 'User' }}
          </h2>
          <p class="text-sm text-gray-300">
            {{ getRoleLabel(user?.role) }}
          </p>
        </div>
      </div>
      <div class="text-5xl animate-bounce-slow">
        👋
      </div>
    </div>

    <!-- Quick Actions Card -->
    <div class="glass-effect rounded-3xl p-6 border-t-4 border-t-pink-500 animate-slide-in-right">
      <h3 class="text-white font-bold mb-4 text-center">
        Quick Actions
      </h3>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="(action, index) in quickActions"
          :key="action.id"
          class="card-hover flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 rounded-2xl border border-purple-400/30 transition-all duration-300 active:scale-95 group"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="navigateTo(action.path)"
        >
          <div class="text-4xl group-hover:animate-float">
            {{ action.icon }}
          </div>
          <p class="text-xs text-white text-center font-semibold group-hover:text-purple-200 transition-colors">
            {{ action.label }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useAuth} from '@/stores/auth';
import {useI18n} from '@/composables/useI18n';

const router = useRouter();
const authStore = useAuth();
const {t} = useI18n();

const user = computed(() => authStore.user);

const userAvatar = computed(() => {
  if (!user.value) return '';
  const name = user.value.name || user.value.email || 'User';
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return t('greeting.morning');
  if (hour < 18) return t('greeting.afternoon');
  return t('greeting.evening');
});

const quickActions = computed(() => {
  const role = user.value?.role;
  const defaultActions = [
    {id: 'classes', icon: '📚', label: t('nav.academics'), path: '/classes'},
    {id: 'students', icon: '👥', label: t('roles.student'), path: '/students'},
    {id: 'teachers', icon: '👨‍🏫', label: t('roles.teacher'), path: '/teachers'}
  ];

  const roleActions: Record<string, any[]> = {
    teacher: [
      {id: 'attendance', icon: '📋', label: t('nav.attendance'), path: '/attendance'},
      {id: 'homework', icon: '📝', label: t('nav.homework'), path: '/homework'},
      {id: 'classes', icon: '📚', label: t('nav.academics'), path: '/classes'}
    ],
    student: [
      {id: 'homework', icon: '📝', label: t('nav.homework'), path: '/homework'},
      {id: 'classes', icon: '📚', label: t('nav.academics'), path: '/classes'},
      {id: 'exams', icon: '📊', label: t('nav.exams'), path: '/exams'}
    ],
    parent: [
      {id: 'students', icon: '👥', label: t('roles.student'), path: '/students'},
      {id: 'attendance', icon: '📋', label: t('nav.attendance'), path: '/attendance'},
      {id: 'homework', icon: '📝', label: t('nav.homework'), path: '/homework'}
    ],
    accountant: [
      {id: 'finance', icon: '💰', label: t('nav.finance'), path: '/finance'},
      {id: 'students', icon: '👥', label: t('roles.student'), path: '/students'},
      {id: 'reports', icon: '📊', label: t('nav.dashboard'), path: '/reports'}
    ],
    librarian: [
      {id: 'library', icon: '📖', label: t('nav.library'), path: '/library'},
      {id: 'students', icon: '👥', label: t('roles.student'), path: '/students'},
      {id: 'classes', icon: '📚', label: t('nav.academics'), path: '/classes'}
    ]
  };

  return roleActions[role || ''] || defaultActions;
});

function getRoleLabel(role?: string): string {
  const labels: Record<string, string> = {
    super_admin: '🔐 ' + t('roles.super_admin'),
    school_admin: '🏫 ' + t('roles.school_admin'),
    vice_principal: '👔 ' + t('roles.vice_principal'),
    teacher: '👨‍🏫 ' + t('roles.teacher'),
    student: '👨‍🎓 ' + t('roles.student'),
    parent: '👨‍👩‍👧 ' + t('roles.parent'),
    accountant: '💰 ' + t('roles.accountant'),
    librarian: '📖 ' + t('roles.librarian'),
    receptionist: '📞 ' + t('roles.receptionist'),
    security: '🔒 ' + t('roles.security')
  };
  return labels[role || ''] || 'User';
}

function navigateTo(path: string) {
  router.push(path);
}

onMounted(() => {
  authStore.initializeFromStorage();
});
</script>
