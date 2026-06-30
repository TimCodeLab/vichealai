import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import type {Announcement, Notification, Message} from '@/types';
import api from '@/services/api';

export const useCommunication = defineStore('communication', () => {
  const announcements = ref<Announcement[]>([]);
  const notifications = ref<Notification[]>([]);
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const error = ref('');

  const getUnreadNotifications = computed(() => notifications.value.filter(n => !n.read));
  const getUnreadMessages = computed(() => messages.value.filter(m => !m.read));
  const getMessagesByUser = computed(() => (userId: string) =>
    messages.value.filter(m => m.senderId === userId || m.recipientId === userId)
  );

  async function fetchAnnouncements(schoolId: string) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.get(`/schools/${schoolId}/announcements`);
      announcements.value = data.announcements;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function createAnnouncement(schoolId: string, announcement: Omit<Announcement, 'id' | 'createdAt'>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.post(`/schools/${schoolId}/announcements`, announcement);
      announcements.value.push(data.announcement);
      return data.announcement;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchNotifications(schoolId: string, userId: string) {
    loading.value = true;
    try {
      const data = await api.get(`/schools/${schoolId}/users/${userId}/notifications`);
      notifications.value = data.notifications;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function markNotificationRead(schoolId: string, notificationId: string) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.put(`/schools/${schoolId}/notifications/${notificationId}/read`, {});
      const index = notifications.value.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        notifications.value[index].read = true;
      }
      return data.notification;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMessages(schoolId: string, userId: string) {
    loading.value = true;
    try {
      const data = await api.get(`/schools/${schoolId}/users/${userId}/messages`);
      messages.value = data.messages;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function sendMessage(schoolId: string, message: Omit<Message, 'id' | 'read' | 'createdAt'>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.post(`/schools/${schoolId}/messages`, message);
      messages.value.push(data.message);
      return data.message;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function markMessageRead(schoolId: string, messageId: string) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.put(`/schools/${schoolId}/messages/${messageId}/read`, {});
      const index = messages.value.findIndex(m => m.id === messageId);
      if (index !== -1) {
        messages.value[index].read = true;
      }
      return data.message;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    announcements,
    notifications,
    messages,
    loading,
    error,
    getUnreadNotifications,
    getUnreadMessages,
    getMessagesByUser,
    fetchAnnouncements,
    createAnnouncement,
    fetchNotifications,
    markNotificationRead,
    fetchMessages,
    sendMessage,
    markMessageRead
  };
});
