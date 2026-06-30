import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import offlineService from './services/offlineService'
import syncService from './services/syncService'

/* Ionic CSS Framework */
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

/* App styles */
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(IonicVue)
app.use(router)

// Initialize offline and sync services
async function initializeServices() {
  try {
    // Initialize offline service (graceful fallback for web)
    await offlineService.initialize()

    // Initialize sync service (will sync when app comes online)
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        await syncService.initializeSync(userData.schoolId)
      } catch (syncError) {
        console.warn('Sync service initialization warning:', syncError)
        // Continue - sync will work when user is authenticated
      }
    }
  } catch (error) {
    console.warn('Service initialization warning (non-fatal):', error)
    // App continues to work - services degrade gracefully
  }
}

router.isReady().then(async () => {
  await initializeServices()
  app.mount('#app')
})
