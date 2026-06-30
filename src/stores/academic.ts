import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import type {Class, Section, Subject, Grade} from '@/types';
import api from '@/services/api';
import {useAppToast} from '@/utils/toastUtils';
import {LocalStorageService} from '@/services/localStorageService';

export const useacademic = defineStore('academic', () => {
  interface OfflineError extends Error {
    isOfflineError?: boolean;
  }

  const {showWarning, showSuccess} = useAppToast();
  const grades = ref<Grade[]>([]);
  const classes = ref<Class[]>([]);
  const sections = ref<Section[]>([]);
  const subjects = ref<Subject[]>([]);
  const loading = ref(false);
  const error = ref('');

  const getGradeById = computed(() => (id: string) => grades.value.find(g => g.id === id));
  const getClassesByGrade = computed(() => (gradeId: string) => classes.value.filter(c => c.gradeId === gradeId));
  const getSectionsByClass = computed(() => (classId: string) => sections.value.filter(s => s.classId === classId));
  const getSubjectsBySchool = computed(() => subjects.value);

  async function fetchGrades(schoolId: string) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.get(`/schools/${schoolId}/grades`);
      grades.value = data.grades;
    } catch (err) {
      if ((err as Error).message) {
        if ((err as OfflineError).isOfflineError) {
          await showWarning((err as Error).message);
        } else {
          console.warn('Failed to fetch grades, loading from localStorage:', (err as Error).message);
        }
      }

      grades.value = LocalStorageService.get<Grade[]>('grades', []) || [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchClasses(schoolId: string) {
    loading.value = true;
    try {
      const data = await api.get(`/schools/${schoolId}/classes`);
      classes.value = data.classes;
    } catch (err) {
      console.warn('Failed to fetch classes, loading from localStorage:', (err as Error).message);
      classes.value = LocalStorageService.get<Class[]>('classes', []) || [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchSections(classId: string) {
    loading.value = true;
    try {
      const data = await api.get(`/classes/${classId}/sections`);
      sections.value = data.sections;
    } catch (err) {
      console.warn('Failed to fetch sections, loading from localStorage:', (err as Error).message);
      sections.value = LocalStorageService.get<Section[]>('sections', []) || [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchSubjects(schoolId: string) {
    loading.value = true;
    try {
      const data = await api.get(`/schools/${schoolId}/subjects`);
      subjects.value = data.subjects;
    } catch (err) {
      console.warn('Failed to fetch subjects, loading from localStorage:', (err as Error).message);
      subjects.value = LocalStorageService.get<Subject[]>('subjects', []) || [];
    } finally {
      loading.value = false;
    }
  }

  async function createGrade(schoolId: string, grade: Omit<Grade, 'id'>) {
    loading.value = true;
    error.value = '';
    try {
      const newGrade: Grade = {
        ...grade,
        id: `grade_${Date.now()}`
      };
      const data = await api.post(`/schools/${schoolId}/grades`, newGrade);
      grades.value.push(data.grade);
      LocalStorageService.push('grades', data.grade);
      await showSuccess('Grade created successfully');
      return data.grade;
    } catch (err) {
      error.value = (err as Error).message;
      const newGrade: Grade = {
        ...grade,
        id: `grade_${Date.now()}`
      };
      grades.value.push(newGrade);
      LocalStorageService.push('grades', newGrade);
      await showSuccess('Grade created (local)');
      return newGrade;
    } finally {
      loading.value = false;
    }
  }

  async function createClass(schoolId: string, cls: Omit<Class, 'id'>) {
    loading.value = true;
    error.value = '';
    try {
      const newClass: Class = {
        ...cls,
        id: `class_${Date.now()}`
      };
      const data = await api.post(`/schools/${schoolId}/classes`, newClass);
      classes.value.push(data.class);
      LocalStorageService.push('classes', data.class);
      await showSuccess('Class created successfully');
      return data.class;
    } catch (err) {
      error.value = (err as Error).message;
      const newClass: Class = {
        ...cls,
        id: `class_${Date.now()}`
      };
      classes.value.push(newClass);
      LocalStorageService.push('classes', newClass);
      await showSuccess('Class created (local)');
      return newClass;
    } finally {
      loading.value = false;
    }
  }

  async function createSubject(schoolId: string, subject: Omit<Subject, 'id'>) {
    loading.value = true;
    error.value = '';
    try {
      const newSubject: Subject = {
        ...subject,
        id: `subject_${Date.now()}`
      };
      const data = await api.post(`/schools/${schoolId}/subjects`, newSubject);
      subjects.value.push(data.subject);
      LocalStorageService.push('subjects', data.subject);
      await showSuccess('Subject created successfully');
      return data.subject;
    } catch (err) {
      error.value = (err as Error).message;
      const newSubject: Subject = {
        ...subject,
        id: `subject_${Date.now()}`
      };
      subjects.value.push(newSubject);
      LocalStorageService.push('subjects', newSubject);
      await showSuccess('Subject created (local)');
      return newSubject;
    } finally {
      loading.value = false;
    }
  }

  async function updateGrade(schoolId: string, gradeId: string, updates: Partial<Grade>) {
    loading.value = true;
    try {
      const data = await api.put(`/schools/${schoolId}/grades/${gradeId}`, updates);
      const index = grades.value.findIndex(g => g.id === gradeId);
      if (index !== -1) {
        grades.value[index] = data.grade;
        LocalStorageService.update<Grade>('grades', g => g.id === gradeId, () => data.grade);
      }
      await showSuccess('Grade updated successfully');
      return data.grade;
    } catch (err) {
      const index = grades.value.findIndex(g => g.id === gradeId);
      if (index !== -1) {
        grades.value[index] = {...grades.value[index], ...updates};
        LocalStorageService.update<Grade>('grades', g => g.id === gradeId, g => ({...g, ...updates}));
        await showSuccess('Grade updated (local)');
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteGrade(schoolId: string, gradeId: string) {
    loading.value = true;
    try {
      await api.delete(`/schools/${schoolId}/grades/${gradeId}`);
      grades.value = grades.value.filter(g => g.id !== gradeId);
      LocalStorageService.remove_item<Grade>('grades', g => g.id === gradeId);
      await showSuccess('Grade deleted successfully');
    } catch (err) {
      grades.value = grades.value.filter(g => g.id !== gradeId);
      LocalStorageService.remove_item<Grade>('grades', g => g.id === gradeId);
      await showSuccess('Grade deleted (local)');
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    grades,
    classes,
    sections,
    subjects,
    loading,
    error,
    getGradeById,
    getClassesByGrade,
    getSectionsByClass,
    getSubjectsBySchool,
    fetchGrades,
    fetchClasses,
    fetchSections,
    fetchSubjects,
    createGrade,
    createClass,
    createSubject,
    updateGrade,
    deleteGrade
  };
});
