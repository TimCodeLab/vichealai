import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: () => import('@/pages/dashboard/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    component: () => import('@/pages/academic/Students.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/teachers',
    component: () => import('@/pages/academic/Teachers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/attendance',
    component: () => import('@/pages/academic/Attendance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/classes',
    component: () => import('@/pages/academic/Classes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/homework',
    component: () => import('@/pages/academic/Homework.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/exams',
    component: () => import('@/pages/academic/Exams.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/communication',
    component: () => import('@/pages/communication/Communication.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/finance',
    component: () => import('@/pages/finance/Finance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/library',
    component: () => import('@/pages/library/Library.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    component: () => import('@/pages/reports/Reports.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    component: () => import('@/pages/settings/Settings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuth()

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
