import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Exam, ExamSchedule, ExamResult, ReportCard } from '@/types'
import api from '@/services/api'

export const useExamStore = defineStore('exam', () => {
  const exams = ref<Exam[]>([])
  const schedules = ref<ExamSchedule[]>([])
  const results = ref<ExamResult[]>([])
  const reportCards = ref<ReportCard[]>([])
  const loading = ref(false)
  const error = ref('')

  const getActiveExams = computed(() => exams.value.filter(e => e.status !== 'completed'))
  const getExamScheduleByClass = computed(() => (classId: string) =>
    schedules.value.filter(s => s.classId === classId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  )
  const getResultsByStudent = computed(() => (studentId: string) =>
    results.value.filter(r => r.studentId === studentId)
  )

  async function fetchExams(schoolId: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/schools/${schoolId}/exams`)
      exams.value = data.exams
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchSchedules(schoolId: string, examId?: string) {
    loading.value = true
    try {
      const query = examId ? `?examId=${examId}` : ''
      const data = await api.get(`/schools/${schoolId}/exam-schedules${query}`)
      schedules.value = data.schedules
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createExam(schoolId: string, exam: Omit<Exam, 'id'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/exams`, exam)
      exams.value.push(data.exam)
      return data.exam
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createExamSchedule(schoolId: string, schedule: Omit<ExamSchedule, 'id'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/exam-schedules`, schedule)
      schedules.value.push(data.schedule)
      return data.schedule
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function recordResult(schoolId: string, result: Omit<ExamResult, 'id'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/exam-results`, result)
      results.value.push(data.result)
      return data.result
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchReportCard(schoolId: string, studentId: string, semesterId: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/schools/${schoolId}/students/${studentId}/report-card?semesterId=${semesterId}`)
      const existing = reportCards.value.findIndex(rc => rc.studentId === studentId && rc.semesterId === semesterId)
      if (existing !== -1) {
        reportCards.value[existing] = data.reportCard
      } else {
        reportCards.value.push(data.reportCard)
      }
      return data.reportCard
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    exams,
    schedules,
    results,
    reportCards,
    loading,
    error,
    getActiveExams,
    getExamScheduleByClass,
    getResultsByStudent,
    fetchExams,
    fetchSchedules,
    createExam,
    createExamSchedule,
    recordResult,
    fetchReportCard
  }
})
