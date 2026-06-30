<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Library</ion-title>
        <ion-buttons slot="end" v-if="isLibrarian">
          <ion-button @click="openAddDialog">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="library-container">
        <ion-searchbar v-model="searchQuery" placeholder="Search books..."></ion-searchbar>

        <ion-segment v-model="selectedTab">
          <ion-segment-button value="available">
            <ion-label>Available</ion-label>
          </ion-segment-button>
          <ion-segment-button value="borrowed">
            <ion-label>My Books</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div v-if="filteredBooks.length === 0" class="ion-text-center ion-padding">
          <p>No books found</p>
        </div>

        <ion-list v-else>
          <ion-item v-for="book in filteredBooks" :key="book.id" @click="selectBook(book)">
            <ion-label>
              <h2>{{ book.title }}</h2>
              <p>{{ book.author }} - {{ book.category }}</p>
              <p v-if="selectedTab === 'available'">Available: {{ book.availableQuantity }}/{{ book.quantity }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { add } from 'ionicons/icons'
import { useLibraryStore } from '@/stores/libraryStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const libraryStore = useLibraryStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedTab = ref('available')
const isLibrarian = computed(() => authStore.user?.role === 'librarian')

const filteredBooks = computed(() => {
  let books = selectedTab.value === 'available' ? libraryStore.getAvailableBooks : libraryStore.books
  return books.filter(b => b.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

function selectBook(book: any) {
  router.push(`/library/${book.id}`)
}

function openAddDialog() {
  // TODO: Open add book modal
}

onMounted(async () => {
  const user = authStore.user
  if (user) {
    await libraryStore.fetchBooks(user.schoolId)
  }
})
</script>

<style scoped>
.library-container {
  padding: 16px;
}
</style>
