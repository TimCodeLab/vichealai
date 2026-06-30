import {defineStore} from 'pinia';
import {ref, computed} from 'vue';

export interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent'
  schoolId: string
  phone?: string
  isActive?: boolean
  createdAt?: string
}

export const useAuth = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('authToken'));
  const isAuthenticated = computed(() => !!token.value);

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  function initializeFromStorage() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser);
      token.value = storedToken;
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
    initializeFromStorage,
  };
});
