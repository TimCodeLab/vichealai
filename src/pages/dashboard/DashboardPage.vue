<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="dashboard">
        <div class="welcome-section">
          <h1>Welcome, {{ userName }}! 👋</h1>
          <p class="role-badge">{{ getRoleLabel(user?.role) }}</p>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
          <ion-card class="stat-card">
            <ion-card-content>
              <div class="stat-icon">📚</div>
              <div class="stat-label">Classes</div>
              <div class="stat-value">12</div>
            </ion-card-content>
          </ion-card>

          <ion-card class="stat-card">
            <ion-card-content>
              <div class="stat-icon">👥</div>
              <div class="stat-label">Students</div>
              <div class="stat-value">450</div>
            </ion-card-content>
          </ion-card>

          <ion-card class="stat-card">
            <ion-card-content>
              <div class="stat-icon">📝</div>
              <div class="stat-label">Homework</div>
              <div class="stat-value">8</div>
            </ion-card-content>
          </ion-card>

          <ion-card class="stat-card">
            <ion-card-content>
              <div class="stat-icon">📊</div>
              <div class="stat-label">Exams</div>
              <div class="stat-value">3</div>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Quick Actions -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Quick Actions</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="action-buttons">
              <ion-button expand="block" fill="outline" @click="navigate('/attendance')">
                Mark Attendance
              </ion-button>
              <ion-button expand="block" fill="outline" @click="navigate('/homework')">
                View Homework
              </ion-button>
              <ion-button expand="block" fill="outline" @click="navigate('/classes')">
                Classes
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- User Info Card -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Account Info</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">{{ user?.email }}</span>
            </div>
            <div class="info-row">
              <span class="label">Role:</span>
              <span class="value">{{ user?.role }}</span>
            </div>
            <div class="info-row">
              <span class="label">School ID:</span>
              <span class="value">{{ user?.schoolId }}</span>
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="value" :style="{ color: user?.isActive ? 'green' : 'red' }">
                {{ user?.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const userName = computed(() => {
  if (!user.value) return 'Guest'
  return user.value.name || user.value.email || 'User'
})

function getRoleLabel(role?: string): string {
  const roleLabels: Record<string, string> = {
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
  return roleLabels[role || ''] || 'User'
}

function navigate(path: string) {
  router.push(path)
}
</script>

<style scoped>
.dashboard {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
}

.welcome-section {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.welcome-section h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
}

.role-badge {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:active {
  transform: scale(0.95);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.action-buttons {
  display: grid;
  gap: 10px;
}

.action-buttons ion-button {
  --border-color: #667eea;
  color: #667eea;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #333;
}

.value {
  color: #666;
  word-break: break-word;
  text-align: right;
  flex: 1;
  margin-left: 20px;
}

ion-card {
  margin-bottom: 16px;
}
</style>
