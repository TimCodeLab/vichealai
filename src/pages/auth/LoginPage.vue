<template>
  <ion-page>
    <ion-content>
      <div class="login-container">
        <div class="login-card">
          <h1>VICHEALAI</h1>
          <p class="subtitle">School Management System</p>

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
    // TODO: Implement actual authentication
    // const response = await api.post('/auth/login', {
    //   email: email.value,
    //   password: password.value,
    //   schoolCode: schoolCode.value
    // })
    // authStore.setAuth(response.token, response.user)
    // router.push('/dashboard')

    // Placeholder for development
    console.log('Login attempt:', { email: email.value, schoolCode: schoolCode.value })
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
}
</style>
