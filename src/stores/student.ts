import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import type {Student, Parent, StudentEnrollment} from '@/types';
import api from '@/services/api';

export const useStudentStore = defineStore('student', () => {
  const students = ref<Student[]>([]);
  const parents = ref<Parent[]>([]);
  const enrollments = ref<StudentEnrollment[]>([]);
  const selectedStudent = ref<Student | null>(null);
  const loading = ref(false);
  const error = ref('');

  const getStudentById = computed(() => (id: string) => students.value.find(s => s.id === id));
  const getStudentsByClass = computed(() =>
    students.value.filter(s => enrollments.value.find(e => e.studentId === s.id && e.status === 'active'))
  );

  async function fetchStudents(schoolId: string) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.get(`/schools/${schoolId}/students`);
      students.value = data.students;
    } catch (err) {
      console.warn('Failed to fetch students, using mock data:', (err as Error).message);
      students.value = [
        {
          id: 'stu_1',
          schoolId,
          enrollmentNumber: 'STU001',
          firstName: 'Alice',
          lastName: 'Johnson',
          gender: 'female',
          dateOfBirth: '2008-05-15',
          bloodGroup: 'O+',
          parentId: 'parent_1',
          address: '123 Main St',
          emergencyContact: '0987654321',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 'stu_2',
          schoolId,
          enrollmentNumber: 'STU002',
          firstName: 'Bob',
          lastName: 'Smith',
          gender: 'male',
          dateOfBirth: '2008-08-20',
          bloodGroup: 'A+',
          parentId: 'parent_2',
          address: '456 Oak Ave',
          emergencyContact: '0987654322',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 'stu_3',
          schoolId,
          enrollmentNumber: 'STU003',
          firstName: 'Carol',
          lastName: 'Brown',
          gender: 'female',
          dateOfBirth: '2008-03-10',
          bloodGroup: 'B+',
          parentId: 'parent_3',
          address: '789 Pine Rd',
          emergencyContact: '0987654323',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
    } finally {
      loading.value = false;
    }
  }

  async function fetchParents(schoolId: string) {
    loading.value = true;
    try {
      const data = await api.get(`/schools/${schoolId}/parents`);
      parents.value = data.parents;
    } catch (err) {
      console.warn('Failed to fetch parents, using mock data:', (err as Error).message);
      parents.value = [
        {
          id: 'parent_1',
          schoolId,
          firstName: 'John',
          lastName: 'Johnson',
          relationship: 'Father',
          phone: '0123456789',
          email: 'john@example.com',
          address: '123 Main St',
          occupation: 'Engineer'
        },
        {
          id: 'parent_2',
          schoolId,
          firstName: 'Mary',
          lastName: 'Smith',
          relationship: 'Mother',
          phone: '0123456790',
          email: 'mary@example.com',
          address: '456 Oak Ave',
          occupation: 'Doctor'
        }
      ];
    } finally {
      loading.value = false;
    }
  }

  async function createStudent(schoolId: string, student: Omit<Student, 'id' | 'createdAt'>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.post(`/schools/${schoolId}/students`, student);
      students.value.push(data.student);
      return data.student;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateStudent(schoolId: string, studentId: string, updates: Partial<Student>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.put(`/schools/${schoolId}/students/${studentId}`, updates);
      const index = students.value.findIndex(s => s.id === studentId);
      if (index !== -1) {
        students.value[index] = data.student;
      }
      return data.student;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteStudent(schoolId: string, studentId: string) {
    loading.value = true;
    error.value = '';
    try {
      await api.delete(`/schools/${schoolId}/students/${studentId}`);
      students.value = students.value.filter(s => s.id !== studentId);
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function selectStudent(student: Student) {
    selectedStudent.value = student;
  }

  function clearSelection() {
    selectedStudent.value = null;
  }

  return {
    students,
    parents,
    enrollments,
    selectedStudent,
    loading,
    error,
    getStudentById,
    getStudentsByClass,
    fetchStudents,
    fetchParents,
    createStudent,
    updateStudent,
    deleteStudent,
    selectStudent,
    clearSelection
  };
});
