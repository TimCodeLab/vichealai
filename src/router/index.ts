import {createRouter, createWebHistory} from 'vue-router';
import type {RouteRecordRaw} from 'vue-router';
import {useAuth} from '@/stores/auth';

const routes: Array<RouteRecordRaw> = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: () => import('@/pages/auth/Login.vue'), meta: {requiresAuth: false}},
  {path: '/dashboard', component: () => import('@/pages/dashboard/Dashboard.vue'), meta: {requiresAuth: true}},
  {path: '/students', component: () => import('@/pages/academic/Students.vue'), meta: {requiresAuth: true}},
  {path: '/teachers', component: () => import('@/pages/academic/Teachers.vue'), meta: {requiresAuth: true}},
  {path: '/attendance', component: () => import('@/pages/academic/Attendance.vue'), meta: {requiresAuth: true}},
  {path: '/classes', component: () => import('@/pages/academic/Classes.vue'), meta: {requiresAuth: true}},
  {path: '/homework', component: () => import('@/pages/academic/Homework.vue'), meta: {requiresAuth: true}},
  {path: '/exams', component: () => import('@/pages/academic/Exams.vue'), meta: {requiresAuth: true}},
  {
    path: '/communication',
    component: () => import('@/pages/communication/Communication.vue'),
    meta: {requiresAuth: true},
  },
  {path: '/finance', component: () => import('@/pages/finance/Finance.vue'), meta: {requiresAuth: true}},
  {path: '/library', component: () => import('@/pages/library/Library.vue'), meta: {requiresAuth: true}},
  {path: '/reports', component: () => import('@/pages/reports/Reports.vue'), meta: {requiresAuth: true}},
  {path: '/settings', component: () => import('@/pages/settings/Settings.vue'), meta: {requiresAuth: true}},
  {path: '/profile', component: () => import('@/pages/profile/Profile.vue'), meta: {requiresAuth: true}},
  {path: '/subjects', component: () => import('@/pages/academic/Subjects.vue'), meta: {requiresAuth: true}},
  {path: '/parents', component: () => import('@/pages/academic/Parents.vue'), meta: {requiresAuth: true}},
  {path: '/calendar', component: () => import('@/pages/admin/Calendar.vue'), meta: {requiresAuth: true}},
  {path: '/roles', component: () => import('@/pages/admin/RolesPermissions.vue'), meta: {requiresAuth: true}},
  {path: '/school-approvals', component: () => import('@/pages/admin/SchoolApprovals.vue'), meta: {requiresAuth: true}},
  {
    path: '/school-register',
    component: () => import('@/pages/register/SchoolRegister.vue'),
    meta: {requiresAuth: false},
  },
  {path: '/change-password', component: () => import('@/pages/auth/ChangePassword.vue'), meta: {requiresAuth: false}},
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuth();

  const hasToken = !!localStorage.getItem('authToken');
  if (!authStore.user && hasToken) {
    authStore.initializeFromStorage();
  }

  const isAuthenticated = !!localStorage.getItem('authToken') && authStore.isAuthenticated;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
