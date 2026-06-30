<template>
  <ion-page class="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 min-h-screen">
    <ion-content class="!bg-transparent flex items-center justify-center">
      <div class="w-full max-w-md px-4 animate-fade-in-up">
        <!-- Logo Section -->
        <div class="text-center mb-8 animate-float">
          <div class="text-6xl mb-4">🎓</div>
          <h1 class="gradient-text text-4xl font-bold mb-2">{{ t('app.title') }}</h1>
          <p class="text-purple-300 text-lg">{{ t('auth.goToSchool') }}</p>
        </div>

        <!-- Login Card -->
        <div class="glass-effect rounded-3xl p-8 shadow-2xl animate-slide-in-right">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email Input -->
            <div class="space-y-2 animate-fade-in-up" style="animation-delay: 0.1s">
              <label class="block text-sm font-semibold text-white">{{ t('auth.email') }}</label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                :placeholder="t('forms.email')"
              />
            </div>

            <!-- Password Input -->
            <div class="space-y-2 animate-fade-in-up" style="animation-delay: 0.2s">
              <label class="block text-sm font-semibold text-white">{{ t('auth.password') }}</label>
              <input
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                :placeholder="t('forms.password')"
              />
            </div>

            <!-- School Code Input -->
            <div class="space-y-2 animate-fade-in-up" style="animation-delay: 0.3s">
              <label class="block text-sm font-semibold text-white">{{ t('auth.schoolCode') }}</label>
              <input
                v-model="schoolCode"
                required
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                :placeholder="t('forms.code')"
              />
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm animate-slide-in-left">
              {{ error }}
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 px-4 rounded-xl font-bold text-white text-lg smooth-gradient hover:shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {{ loading ? t('auth.loggingIn') : t('auth.login') }}
            </button>
          </form>
        </div>

        <!-- Test Credentials Section -->
        <div class="mt-8 glass-effect rounded-2xl p-6 animate-slide-in-left">
          <p class="text-center text-white text-sm font-semibold mb-4">
            {{ t('auth.testCredentials') }}
          </p>
          <p class="text-center text-gray-300 text-xs mb-4">
            {{ t('auth.testPassword') }} • {{ t('auth.testCode') }}
          </p>

          <div class="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            <div
              v-for="(cred, email) in testAccounts"
              :key="email"
              @click="fillCredentials(email, cred.name)"
              class="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 rounded-lg border border-purple-500/30 cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <p class="text-white font-semibold text-xs">{{ cred.label }}</p>
              <p class="text-gray-300 text-xs truncate">{{ email }}</p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent } from '@ionic/vue'
import { useAuth } from '@/stores/auth'
import { useI18n } from '@/composables/useI18n'

const router = useRouter()
const authStore = useAuth()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const schoolCode = ref('')
const loading = ref(false)
const error = ref('')

const testAccounts: Record<string, { name: string; label: string }> = {
  'superadmin@school.com': { name: 'Super Administrator', label: 'Super Admin' },
  'admin@school.com': { name: 'School Administrator', label: 'Admin' },
  'vp@school.com': { name: 'Vice Principal', label: 'VP' },
  'teacher@school.com': { name: 'John Teacher', label: 'Teacher' },
  'student@school.com': { name: 'Jane Student', label: 'Student' },
  'parent@school.com': { name: 'Parent User', label: 'Parent' },
  'accountant@school.com': { name: 'Finance Accountant', label: 'Accountant' },
  'librarian@school.com': { name: 'Library Librarian', label: 'Librarian' },
  'receptionist@school.com': { name: 'Front Receptionist', label: 'Receptionist' },
  'security@school.com': { name: 'Security Guard', label: 'Security' }
}

function fillCredentials(acc: string, name: string) {
  email.value = acc
  password.value = 'test123'
  schoolCode.value = 'SCHOOL001'
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    if (!email.value || !password.value || !schoolCode.value) {
      error.value = t('auth.fillAllFields')
      return
    }

    const cred = testAccounts[email.value]
    if (cred && password.value === 'test123' && schoolCode.value === 'SCHOOL001') {
      const testUser = {
        id: `user_${email.value.split('@')[0]}`,
        schoolId: 'school_1',
        email: email.value,
        name: cred.name,
        role: email.value.split('@')[0] as any,
        phone: '0123456789',
        isActive: true,
        createdAt: new Date().toISOString()
      }

      authStore.setAuth(`test_token_${email.value}`, testUser)
      router.push('/dashboard')
      return
    }

    error.value = 'Invalid credentials. Please check the test accounts below.'
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
