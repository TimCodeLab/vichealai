import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import type {Timetable, Schedule} from '@/types';
import api from '@/services/api';

export const useTimetableStore = defineStore('timetable', () => {
  const timetables = ref<Timetable[]>([]);
  const schedules = ref<Schedule[]>([]);
  const loading = ref(false);
  const error = ref('');

  const getTimetableByEntity = computed(() => (entityId: string) =>
    timetables.value.filter(t => t.entityId === entityId).sort((a, b) => a.dayOfWeek - b.dayOfWeek)
  );

  const getTimetableByDay = computed(() => (day: number) =>
    timetables.value.filter(t => t.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
  );

  async function fetchTimetables(schoolId: string, type?: string, entityId?: string) {
    loading.value = true;
    error.value = '';
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (entityId) params.append('entityId', entityId);
      const query = params.toString() ? `?${params}` : '';
      const data = await api.get(`/schools/${schoolId}/timetables${query}`);
      timetables.value = data.timetables;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchSchedules(schoolId: string) {
    loading.value = true;
    try {
      const data = await api.get(`/schools/${schoolId}/schedules`);
      schedules.value = data.schedules;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function createTimetable(schoolId: string, timetable: Omit<Timetable, 'id'>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.post(`/schools/${schoolId}/timetables`, timetable);
      timetables.value.push(data.timetable);
      return data.timetable;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTimetable(schoolId: string, timetableId: string, updates: Partial<Timetable>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.put(`/schools/${schoolId}/timetables/${timetableId}`, updates);
      const index = timetables.value.findIndex(t => t.id === timetableId);
      if (index !== -1) {
        timetables.value[index] = data.timetable;
      }
      return data.timetable;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    timetables,
    schedules,
    loading,
    error,
    getTimetableByEntity,
    getTimetableByDay,
    fetchTimetables,
    fetchSchedules,
    createTimetable,
    updateTimetable
  };
});
