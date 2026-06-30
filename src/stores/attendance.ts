import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Attendance, AttendanceReport } from '@/types'
import api from '@/services/api'

export const useattendance = defineStore('attendance', () => {
  const attendance = ref<Attendance[]>([])
  const reports = ref<AttendanceReport[]>([])
  const loading = ref(false)
  const error = ref('')

  const getTodayAttendance = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return attendance.value.filter(a => a.date === today)
  })

  const getAttendanceByStudent = computed(() => (studentId: string) =>
    attendance.value.filter(a => a.studentId === studentId)
  )

  async function fetchAttendance(schoolId: string, filters?: { classId?: string; date?: string }) {
    loading.value = true
    error.value = ''
    try {
      const params = new URLSearchParams()
      if (filters?.classId) params.append('classId', filters.classId)
      if (filters?.date) params.append('date', filters.date)
      const query = params.toString() ? `?${params}` : ''
      const data = await api.get(`/schools/${schoolId}/attendance${query}`)
      attendance.value = data.attendance
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function markAttendance(schoolId: string, classId: string, attendanceData: any[]) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/attendance/mark`, {
        classId,
        date: new Date().toISOString().split('T')[0],
        records: attendanceData
      })
      attendance.value = [...attendance.value, ...data.records]
      return data.records
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAttendanceReport(schoolId: string, filters: {
    studentId?: string
    classId?: string
    startDate?: string
    endDate?: string
  }) {
    loading.value = true
    error.value = ''
    try {
      const params = new URLSearchParams()
      if (filters.studentId) params.append('studentId', filters.studentId)
      if (filters.classId) params.append('classId', filters.classId)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      const query = params.toString() ? `?${params}` : ''
      const data = await api.get(`/schools/${schoolId}/attendance/report${query}`)
      reports.value = data.reports
      return data.reports
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    attendance,
    reports,
    loading,
    error,
    getTodayAttendance,
    getAttendanceByStudent,
    fetchAttendance,
    markAttendance,
    fetchAttendanceReport
  }
})
