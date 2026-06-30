import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import type {Teacher, TeacherAssignment} from '@/types';
import api from '@/services/api';

export const useTeacherStore = defineStore('teacher', () => {
  const teachers = ref<Teacher[]>([]);
  const assignments = ref<TeacherAssignment[]>([]);
  const selectedTeacher = ref<Teacher | null>(null);
  const loading = ref(false);
  const error = ref('');

  const getTeacherById = computed(() => (id: string) => teachers.value.find(t => t.id === id));
  const getTeachersBySubject = computed(() => (subjectId: string) =>
    assignments.value
      .filter(a => a.subjectId === subjectId)
      .map(a => teachers.value.find(t => t.id === a.teacherId))
      .filter(Boolean)
  );

  async function fetchTeachers(schoolId: string) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.get(`/schools/${schoolId}/teachers`);
      teachers.value = data.teachers;
    } catch (err) {
      console.warn('Failed to fetch teachers, using mock data:', (err as Error).message);
      teachers.value = [
        {
          id: 'teacher_1',
          schoolId,
          userId: 'user_1',
          employeeId: 'TEA001',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'male',
          dateOfBirth: '1985-06-15',
          qualification: 'B.Sc Mathematics',
          specialization: 'Mathematics',
          phone: '0123456789',
          email: 'john.doe@school.com',
          address: '100 Teacher Lane',
          hireDate: '2015-01-01',
          salary: 50000,
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 'teacher_2',
          schoolId,
          userId: 'user_2',
          employeeId: 'TEA002',
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'female',
          dateOfBirth: '1988-03-20',
          qualification: 'B.A English',
          specialization: 'English',
          phone: '0123456790',
          email: 'jane.smith@school.com',
          address: '200 Teacher Lane',
          hireDate: '2016-06-01',
          salary: 48000,
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
    } finally {
      loading.value = false;
    }
  }

  async function fetchAssignments(schoolId: string) {
    loading.value = true;
    try {
      const data = await api.get(`/schools/${schoolId}/teacher-assignments`);
      assignments.value = data.assignments;
    } catch (err) {
      console.warn('Failed to fetch assignments, using mock data:', (err as Error).message);
      assignments.value = [
        {
          id: 'assign_1',
          schoolId,
          teacherId: 'teacher_1',
          sectionId: 'class_1',
          subjectId: 'subj_1',
          academicYearId: 'year_1'
        },
        {
          id: 'assign_2',
          schoolId,
          teacherId: 'teacher_2',
          sectionId: 'class_1',
          subjectId: 'subj_2',
          academicYearId: 'year_1'
        }
      ];
    } finally {
      loading.value = false;
    }
  }

  async function createTeacher(schoolId: string, teacher: Omit<Teacher, 'id' | 'createdAt'>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.post(`/schools/${schoolId}/teachers`, teacher);
      teachers.value.push(data.teacher);
      return data.teacher;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTeacher(schoolId: string, teacherId: string, updates: Partial<Teacher>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.put(`/schools/${schoolId}/teachers/${teacherId}`, updates);
      const index = teachers.value.findIndex(t => t.id === teacherId);
      if (index !== -1) {
        teachers.value[index] = data.teacher;
      }
      return data.teacher;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function assignTeacher(schoolId: string, assignment: Omit<TeacherAssignment, 'id'>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.post(`/schools/${schoolId}/teacher-assignments`, assignment);
      assignments.value.push(data.assignment);
      return data.assignment;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function selectTeacher(teacher: Teacher) {
    selectedTeacher.value = teacher;
  }

  function clearSelection() {
    selectedTeacher.value = null;
  }

  return {
    teachers,
    assignments,
    selectedTeacher,
    loading,
    error,
    getTeacherById,
    getTeachersBySubject,
    fetchTeachers,
    fetchAssignments,
    createTeacher,
    updateTeacher,
    assignTeacher,
    selectTeacher,
    clearSelection
  };
});
