import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: () => import('@/pages/dashboard/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    component: () => import('@/pages/students/StudentsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/teachers',
    component: () => import('@/pages/teachers/TeachersPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/attendance',
    component: () => import('@/pages/attendance/AttendancePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/classes',
    component: () => import('@/pages/classes/ClassesPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/homework',
    component: () => import('@/pages/homework/HomeworkPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/exams',
    component: () => import('@/pages/exams/ExamsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/finance',
    component: () => import('@/pages/finance/FinancePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/library',
    component: () => import('@/pages/library/LibraryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    component: () => import('@/pages/reports/ReportsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    component: () => import('@/pages/settings/SettingsPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Initialize from storage on first check
  if (!authStore.user && localStorage.getItem('user')) {
    authStore.initializeFromStorage()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
