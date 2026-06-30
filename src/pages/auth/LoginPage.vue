<template>
  <ion-page>
    <ion-content>
      <div class="login-container">
        <div class="login-card">
          <h1>VICHEALAI</h1>
          <p class="subtitle">Go to your school</p>

          <form @submit.prevent="handleLogin">
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input v-model="email" type="email" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Password</ion-label>
              <ion-input v-model="password" type="password" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">School Code</ion-label>
              <ion-input v-model="schoolCode" required></ion-input>
            </ion-item>

            <ion-button expand="block" type="submit" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </ion-button>
          </form>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Test Credentials -->
          <div class="test-credentials">
            <p class="credentials-title">📋 Test Credentials (Password: test123, Code: SCHOOL001)</p>
            <div class="credentials-grid">
              <div class="credential-item">
                <strong>Super Admin</strong>
                <code>superadmin@school.com</code>
              </div>
              <div class="credential-item">
                <strong>School Admin</strong>
                <code>admin@school.com</code>
              </div>
              <div class="credential-item">
                <strong>Vice Principal</strong>
                <code>vp@school.com</code>
              </div>
              <div class="credential-item">
                <strong>Teacher</strong>
                <code>teacher@school.com</code>
              </div>
              <div class="credential-item">
                <strong>Student</strong>
                <code>student@school.com</code>
              </div>
              <div class="credential-item">
                <strong>Parent</strong>
                <code>parent@school.com</code>
              </div>
              <div class="credential-item">
                <strong>Accountant</strong>
                <code>accountant@school.com</code>
              </div>
              <div class="credential-item">
                <strong>Librarian</strong>
                <code>librarian@school.com</code>
              </div>
              <div class="credential-item">
                <strong>Receptionist</strong>
                <code>receptionist@school.com</code>
              </div>
              <div class="credential-item">
                <strong>Security</strong>
                <code>security@school.com</code>
              </div>
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
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const schoolCode = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    if (!email.value || !password.value || !schoolCode.value) {
      error.value = 'Please fill in all fields'
      return
    }

    // Test credentials for all roles
    const testCredentials: Record<string, { name: string; role: any }> = {
      'superadmin@school.com': { name: 'Super Administrator', role: 'super_admin' },
      'admin@school.com': { name: 'School Administrator', role: 'school_admin' },
      'vp@school.com': { name: 'Vice Principal', role: 'vice_principal' },
      'teacher@school.com': { name: 'John Teacher', role: 'teacher' },
      'student@school.com': { name: 'Jane Student', role: 'student' },
      'parent@school.com': { name: 'Parent User', role: 'parent' },
      'accountant@school.com': { name: 'Finance Accountant', role: 'accountant' },
      'librarian@school.com': { name: 'Library Librarian', role: 'librarian' },
      'receptionist@school.com': { name: 'Front Receptionist', role: 'receptionist' },
      'security@school.com': { name: 'Security Guard', role: 'security' }
    }

    // Check if email and password match test credentials
    const cred = testCredentials[email.value]
    if (cred && password.value === 'test123' && schoolCode.value === 'SCHOOL001') {
      const testUser = {
        id: `user_${email.value.split('@')[0]}`,
        schoolId: 'school_1',
        email: email.value,
        name: cred.name,
        role: cred.role,
        phone: '0123456789',
        isActive: true,
        createdAt: new Date().toISOString()
      }

      authStore.setAuth(`test_token_${email.value}`, testUser)
      router.push('/dashboard')
      return
    }

    // TODO: Implement actual authentication with backend
    // const response = await api.post('/auth/login', {
    //   email: email.value,
    //   password: password.value,
    //   schoolCode: schoolCode.value
    // })
    // authStore.setAuth(response.token, response.user)
    // router.push('/dashboard')

    error.value = 'Invalid credentials. Please check the test accounts below.'
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #667eea;
  margin-bottom: 10px;
  font-size: 32px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

form {
  margin-bottom: 20px;
}

ion-item {
  --padding-start: 0;
  margin-bottom: 20px;
}

ion-button {
  margin-top: 20px;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
}

.test-credentials {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.credentials-title {
  text-align: center;
  color: #333;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.credentials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.credential-item {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  border-left: 3px solid #667eea;
  font-size: 12px;
}

.credential-item strong {
  display: block;
  color: #333;
  margin-bottom: 4px;
  font-size: 11px;
}

.credential-item code {
  display: block;
  background: white;
  color: #667eea;
  padding: 4px;
  border-radius: 3px;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

@media (max-width: 600px) {
  .credentials-grid {
    grid-template-columns: 1fr;
  }

  .login-card {
    padding: 20px 15px;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
