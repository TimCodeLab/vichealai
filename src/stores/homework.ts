import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Homework, HomeworkSubmission } from '@/types'
import api from '@/services/api'

export const useHomeworkStore = defineStore('homework', () => {
  const homework = ref<Homework[]>([])
  const submissions = ref<HomeworkSubmission[]>([])
  const loading = ref(false)
  const error = ref('')

  const getHomeworkByClass = computed(() => (classId: string) =>
    homework.value.filter(h => h.classId === classId).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  )

  const getSubmissionsByStudent = computed(() => (studentId: string) =>
    submissions.value.filter(s => s.studentId === studentId)
  )

  async function fetchHomework(schoolId: string, classId?: string) {
    loading.value = true
    error.value = ''
    try {
      const query = classId ? `?classId=${classId}` : ''
      const data = await api.get(`/schools/${schoolId}/homework${query}`)
      homework.value = data.homework
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createHomework(schoolId: string, hw: Omit<Homework, 'id' | 'createdAt'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/homework`, hw)
      homework.value.push(data.homework)
      return data.homework
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitHomework(schoolId: string, homeworkId: string, submission: Omit<HomeworkSubmission, 'id' | 'submittedAt'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/homework/${homeworkId}/submit`, submission)
      submissions.value.push(data.submission)
      return data.submission
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function gradeSubmission(schoolId: string, submissionId: string, marks: number, feedback: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.put(`/schools/${schoolId}/homework/submissions/${submissionId}/grade`, {
        marks,
        feedback
      })
      const index = submissions.value.findIndex(s => s.id === submissionId)
      if (index !== -1) {
        submissions.value[index] = data.submission
      }
      return data.submission
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    homework,
    submissions,
    loading,
    error,
    getHomeworkByClass,
    getSubmissionsByStudent,
    fetchHomework,
    createHomework,
    submitHomework,
    gradeSubmission
  }
})
