<template>
  <div class="greeting-section">
    <!-- Greeting Card -->
    <div class="greeting-card">
      <div class="greeting-content">
        <div class="user-avatar">
          <img :src="userAvatar" :alt="user?.name" />
        </div>
        <div class="greeting-text">
          <p class="greeting">{{ greeting }}</p>
          <h2>{{ user?.name || 'User' }}</h2>
          <p class="role">{{ getRoleLabel(user?.role) }}</p>
        </div>
      </div>
      <div class="greeting-icon">👋</div>
    </div>

    <!-- Quick Actions Card -->
    <div class="quick-actions">
      <div class="actions-container">
        <div
          v-for="action in quickActions"
          :key="action.id"
          class="action-button"
          @click="navigateTo(action.path)"
        >
          <div class="action-icon">{{ action.icon }}</div>
          <p class="action-label">{{ action.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const userAvatar = computed(() => {
  if (!user.value) return ''
  const name = user.value.name || user.value.email || 'User'
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 18) return 'Good afternoon!'
  return 'Good evening!'
})

const quickActions = computed(() => {
  const role = user.value?.role
  const defaultActions = [
    { id: 'classes', icon: '📚', label: 'Classes', path: '/classes' },
    { id: 'students', icon: '👥', label: 'Students', path: '/students' },
    { id: 'teachers', icon: '👨‍🏫', label: 'Teachers', path: '/teachers' }
  ]

  const roleActions: Record<string, any[]> = {
    teacher: [
      { id: 'attendance', icon: '📋', label: 'Attendance', path: '/attendance' },
      { id: 'homework', icon: '📝', label: 'Homework', path: '/homework' },
      { id: 'classes', icon: '📚', label: 'Classes', path: '/classes' }
    ],
    student: [
      { id: 'homework', icon: '📝', label: 'Homework', path: '/homework' },
      { id: 'classes', icon: '📚', label: 'Classes', path: '/classes' },
      { id: 'exams', icon: '📊', label: 'Exams', path: '/exams' }
    ],
    parent: [
      { id: 'students', icon: '👥', label: 'Child Progress', path: '/students' },
      { id: 'attendance', icon: '📋', label: 'Attendance', path: '/attendance' },
      { id: 'homework', icon: '📝', label: 'Homework', path: '/homework' }
    ],
    accountant: [
      { id: 'finance', icon: '💰', label: 'Finance', path: '/finance' },
      { id: 'students', icon: '👥', label: 'Students', path: '/students' },
      { id: 'reports', icon: '📊', label: 'Reports', path: '/reports' }
    ],
    librarian: [
      { id: 'library', icon: '📖', label: 'Library', path: '/library' },
      { id: 'students', icon: '👥', label: 'Students', path: '/students' },
      { id: 'classes', icon: '📚', label: 'Classes', path: '/classes' }
    ]
  }

  return roleActions[role || ''] || defaultActions
})

function getRoleLabel(role?: string): string {
  const labels: Record<string, string> = {
    super_admin: '🔐 Super Administrator',
    school_admin: '🏫 School Administrator',
    vice_principal: '👔 Vice Principal',
    teacher: '👨‍🏫 Teacher',
    student: '👨‍🎓 Student',
    parent: '👨‍👩‍👧 Parent',
    accountant: '💰 Accountant',
    librarian: '📖 Librarian',
    receptionist: '📞 Receptionist',
    security: '🔒 Security'
  }
  return labels[role || ''] || 'User'
}

function navigateTo(path: string) {
  router.push(path)
}

onMounted(() => {
  authStore.initializeFromStorage()
})
</script>

<style scoped>
.greeting-section {
  padding: 16px;
  background: linear-gradient(135deg, #1a2a3a 0%, #2a3a4a 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.greeting-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.greeting-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.greeting-text {
  flex: 1;
}

.greeting {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.greeting-text h2 {
  margin: 4px 0 2px 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.role {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.greeting-icon {
  font-size: 32px;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
}

.quick-actions {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.actions-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.1);
}

.action-icon {
  font-size: 28px;
}

.action-label {
  margin: 0;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 600px) {
  .greeting-card {
    padding: 12px;
  }

  .user-avatar {
    width: 48px;
    height: 48px;
  }

  .greeting-text h2 {
    font-size: 16px;
  }

  .actions-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
