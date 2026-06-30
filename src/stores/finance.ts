import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Fee, StudentFee, Invoice, Payment, FinancialReport } from '@/types'
import api from '@/services/api'

export const useFinance = defineStore('finance', () => {
  const fees = ref<Fee[]>([])
  const studentFees = ref<StudentFee[]>([])
  const invoices = ref<Invoice[]>([])
  const payments = ref<Payment[]>([])
  const reports = ref<FinancialReport[]>([])
  const loading = ref(false)
  const error = ref('')

  const getPendingInvoices = computed(() => invoices.value.filter(i => i.status === 'pending' || i.status === 'overdue'))
  const getTotalCollected = computed(() => payments.value.reduce((sum, p) => sum + p.amount, 0))
  const getStudentBalance = computed(() => (studentId: string) => {
    const studentFeeItems = studentFees.value.filter(sf => sf.studentId === studentId)
    return studentFeeItems.reduce((sum, sf) => sum + sf.amountDue, 0)
  })

  async function fetchFees(schoolId: string, academicYearId?: string) {
    loading.value = true
    error.value = ''
    try {
      const query = academicYearId ? `?academicYearId=${academicYearId}` : ''
      const data = await api.get(`/schools/${schoolId}/fees${query}`)
      fees.value = data.fees
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchStudentFees(schoolId: string, studentId?: string) {
    loading.value = true
    try {
      const query = studentId ? `?studentId=${studentId}` : ''
      const data = await api.get(`/schools/${schoolId}/student-fees${query}`)
      studentFees.value = data.studentFees
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function fetchInvoices(schoolId: string, filters?: { status?: string; studentId?: string }) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.studentId) params.append('studentId', filters.studentId)
      const query = params.toString() ? `?${params}` : ''
      const data = await api.get(`/schools/${schoolId}/invoices${query}`)
      invoices.value = data.invoices
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createPayment(schoolId: string, payment: Omit<Payment, 'id'>) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.post(`/schools/${schoolId}/payments`, payment)
      payments.value.push(data.payment)

      // Update invoice status
      const invoiceIndex = invoices.value.findIndex(i => i.id === payment.invoiceId)
      if (invoiceIndex !== -1) {
        invoices.value[invoiceIndex].status = 'paid'
      }

      return data.payment
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchFinancialReport(schoolId: string, period: string) {
    loading.value = true
    error.value = ''
    try {
      const data = await api.get(`/schools/${schoolId}/financial-reports?period=${period}`)
      const existing = reports.value.findIndex(r => r.period === period)
      if (existing !== -1) {
        reports.value[existing] = data.report
      } else {
        reports.value.push(data.report)
      }
      return data.report
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    fees,
    studentFees,
    invoices,
    payments,
    reports,
    loading,
    error,
    getPendingInvoices,
    getTotalCollected,
    getStudentBalance,
    fetchFees,
    fetchStudentFees,
    fetchInvoices,
    createPayment,
    fetchFinancialReport
  }
})
