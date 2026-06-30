import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Class, Section, Subject, Grade } from '@/types'
import api from '@/services/api'
import { useAppToast } from '@/utils/toastUtils'

export const useAcademicStore = defineStore('academic', () => {
  const { showError, showWarning } = useAppToast()
  const grades = ref<Grade[]>([])
  const classes = ref<Class[]>([])
  const sections = ref<Section[]>([])
  const subjects = ref<Subject[]>([])
  const loading = ref(false)
  const error = ref('')

  const getGradeById = computed(() => (id: string) => grades.value.find(g => g.id === id))
  const getClassesByGrade = computed(() => (gradeId: string) => classes.value.filter(c => c.gradeId === gradeId))
  const getSectionsByClass = computed(() => (classId: string) => sections.value.filter(s => s.classId === classId))
  const getSubjectsBySchool = computed(() => subjects.value)

  async function fetchGrades(schoolId: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/schools/${schoolId}/grades`)
      grades.value = data.grades
    } catch (err: any) {
      // Show error message to user if it's an offline mode error
      if ((err as any).isOfflineError) {
        await showWarning(err.message)
      } else {
        console.warn('Failed to fetch grades, using mock data:', err.message)
      }

      // Mock data for development
      grades.value = [
        { id: 'grade_1', schoolId, name: 'Grade 9', level: 9 },
        { id: 'grade_2', schoolId, name: 'Grade 10', level: 10 },
        { id: 'grade_3', schoolId, name: 'Grade 11', level: 11 },
        { id: 'grade_4', schoolId, name: 'Grade 12', level: 12 }
      ]
    } finally {
      loading.value = false
    }
  }

  async function fetchClasses(schoolId: string) {
    loading.value = true
    try {
      const data = await api.get(`/schools/${schoolId}/classes`)
      classes.value = data.classes
    } catch (err: any) {
      console.warn('Failed to fetch classes, using mock data:', err.message)
      // Mock data for development
      classes.value = [
        { id: 'class_1', schoolId, gradeId: 'grade_2', name: 'Class 10A', classTeacherId: 'teacher_1' },
        { id: 'class_2', schoolId, gradeId: 'grade_2', name: 'Class 10B', classTeacherId: 'teacher_2' },
        { id: 'class_3', schoolId, gradeId: 'grade_3', name: 'Class 11A', classTeacherId: 'teacher_3' }
      ]
    } finally {
      loading.value = false
    }
  }

  async function fetchSections(classId: string) {
    loading.value = true
    try {
      const data = await api.get(`/classes/${classId}/sections`)
      sections.value = data.sections
    } catch (err: any) {
      console.warn('Failed to fetch sections, using mock data:', err.message)
      sections.value = [
        { id: 'section_1', classId, name: 'Morning' },
        { id: 'section_2', classId, name: 'Afternoon' }
      ]
    } finally {
      loading.value = false
    }
  }

  async function fetchSubjects(schoolId: string) {
    loading.value = true
    try {
      const data = await api.get(`/schools/${schoolId}/subjects`)
      subjects.value = data.subjects
    } catch (err: any) {
      console.warn('Failed to fetch subjects, using mock data:', err.message)
      subjects.value = [
        { id: 'subj_1', schoolId, name: 'Mathematics', code: 'MATH101', description: 'General Mathematics' },
        { id: 'subj_2', schoolId, name: 'English', code: 'ENG101', description: 'English Language' },
        { id: 'subj_3', schoolId, name: 'Science', code: 'SCI101', description: 'General Science' },
        { id: 'subj_4', schoolId, name: 'History', code: 'HIST101', description: 'World History' }
      ]
    } finally {
      loading.value = false
    }
  }

  async function createGrade(schoolId: string, grade: Omit<Grade, 'id'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/grades`, grade)
      grades.value.push(data.grade)
      return data.grade
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createClass(schoolId: string, cls: Omit<Class, 'id'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/classes`, cls)
      classes.value.push(data.class)
      return data.class
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSubject(schoolId: string, subject: Omit<Subject, 'id'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/subjects`, subject)
      subjects.value.push(data.subject)
      return data.subject
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
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
    createSubject
  }
})
