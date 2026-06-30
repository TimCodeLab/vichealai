// Authentication & Users
export interface User {
  id: string
  schoolId: string
  email: string
  name: string
  role: UserRole
  phone?: string
  photo?: string
  isActive: boolean
  createdAt: string
}

export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'vice_principal'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'librarian'
  | 'receptionist'
  | 'security'

// School
export interface School {
  id: string
  name: string
  code: string
  logo?: string
  address: string
  phone: string
  email: string
  principalId: string
  academicYear: string
  semester: string
  language: string
  timezone: string
  createdAt: string
}

// Academic Structure
export interface AcademicYear {
  id: string
  schoolId: string
  year: number
  startDate: string
  endDate: string
  isActive: boolean
}

export interface Semester {
  id: string
  academicYearId: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

export interface Grade {
  id: string
  schoolId: string
  name: string
  level: number
}

export interface Class {
  id: string
  schoolId: string
  gradeId: string
  name: string
  classTeacherId: string
}

export interface Section {
  id: string
  classId: string
  name: string
}

export interface Subject {
  id: string
  schoolId: string
  name: string
  code: string
  description?: string
}

// Student Management
export interface Student {
  id: string
  schoolId: string
  userId?: string
  enrollmentNumber: string
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  bloodGroup?: string
  parentId?: string
  address: string
  emergencyContact: string
  status: 'active' | 'inactive' | 'graduated' | 'suspended'
  createdAt: string
}

export interface Parent {
  id: string
  schoolId: string
  userId?: string
  firstName: string
  lastName: string
  relationship: string
  phone: string
  email: string
  address: string
  occupation?: string
}

export interface StudentEnrollment {
  id: string
  schoolId: string
  studentId: string
  sectionId: string
  academicYearId: string
  enrollmentDate: string
  status: 'active' | 'dropped'
}

// Teacher Management
export interface Teacher {
  id: string
  schoolId: string
  userId: string
  employeeId: string
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  qualification: string
  specialization: string
  phone: string
  email: string
  address: string
  hireDate: string
  salary?: number
  status: 'active' | 'inactive' | 'on_leave'
  createdAt: string
}

export interface TeacherAssignment {
  id: string
  schoolId: string
  teacherId: string
  sectionId: string
  subjectId: string
  academicYearId: string
}

// Attendance
export interface Attendance {
  id: string
  schoolId: string
  studentId?: string
  teacherId?: string
  classId?: string
  date: string
  status: AttendanceStatus
  remarks?: string
  createdAt: string
}

export type AttendanceStatus = 'present' | 'absent' | 'permission' | 'sick' | 'late'

export interface AttendanceReport {
  studentId: string
  name: string
  presentDays: number
  absentDays: number
  permissionDays: number
  sickDays: number
  lateDays: number
  percentage: number
}

// Timetable
export interface Timetable {
  id: string
  schoolId: string
  type: 'school' | 'teacher' | 'student' | 'room'
  entityId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  subjectId?: string
  roomId?: string
  teacherId?: string
}

export interface Schedule {
  id: string
  schoolId: string
  name: string
  startDate: string
  endDate: string
  timetables: Timetable[]
}

// Homework
export interface Homework {
  id: string
  schoolId: string
  classId: string
  teacherId: string
  subjectId: string
  title: string
  description?: string
  dueDate: string
  attachments?: string[]
  createdAt: string
}

export interface HomeworkSubmission {
  id: string
  schoolId: string
  homeworkId: string
  studentId: string
  submissionDate: string
  attachments?: string[]
  marks?: number
  feedback?: string
  submittedAt: string
}

// Exams
export interface Exam {
  id: string
  schoolId: string
  name: string
  description?: string
  startDate: string
  endDate: string
  status: 'scheduled' | 'ongoing' | 'completed'
}

export interface ExamSchedule {
  id: string
  examId: string
  subjectId: string
  classId: string
  date: string
  startTime: string
  endTime: string
  roomId?: string
  totalMarks: number
}

export interface ExamResult {
  id: string
  schoolId: string
  examId: string
  studentId: string
  subjectId: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade: string
}

export interface ReportCard {
  id: string
  schoolId: string
  studentId: string
  semesterId: string
  subjects: {
    subjectId: string
    subjectName: string
    marksObtained: number
    totalMarks: number
    percentage: number
    grade: string
  }[]
  totalMarks: number
  totalObtained: number
  percentage: number
  gradePoint: number
  remarks?: string
  generatedDate: string
}

// Finance
export interface Fee {
  id: string
  schoolId: string
  name: string
  amount: number
  academicYearId: string
  dueDate: string
}

export interface StudentFee {
  id: string
  schoolId: string
  studentId: string
  feeId: string
  academicYearId: string
  status: 'pending' | 'partial' | 'paid'
  amountPaid: number
  amountDue: number
  dueDate: string
}

export interface Invoice {
  id: string
  schoolId: string
  studentFeeId: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  amount: number
  status: 'pending' | 'paid' | 'overdue'
}

export interface Payment {
  id: string
  schoolId: string
  invoiceId: string
  studentId: string
  amount: number
  paymentDate: string
  paymentMethod: 'cash' | 'check' | 'transfer' | 'online'
  reference?: string
}

export interface Scholarship {
  id: string
  schoolId: string
  studentId: string
  amount: number
  reason: string
  fromDate: string
  toDate: string
  status: 'active' | 'inactive'
}

export interface FinancialReport {
  id: string
  schoolId: string
  period: string
  totalIncome: number
  totalExpense: number
  totalFeeCollected: number
  totalFeeOutstanding: number
  summary: string
  generatedDate: string
}

// Library
export interface Book {
  id: string
  schoolId: string
  title: string
  author: string
  isbn?: string
  publisher?: string
  category: string
  quantity: number
  availableQuantity: number
  location?: string
  qrCode?: string
  addedDate: string
}

export interface BookBorrow {
  id: string
  schoolId: string
  bookId: string
  userId: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: 'active' | 'returned' | 'overdue'
  fine?: number
}

// Communication
export interface Announcement {
  id: string
  schoolId: string
  title: string
  content: string
  authorId: string
  targetRole: UserRole[]
  attachments?: string[]
  createdAt: string
  expiryDate?: string
}

export interface Notification {
  id: string
  schoolId: string
  userId: string
  title: string
  message: string
  type: 'announcement' | 'homework' | 'exam' | 'fee' | 'system'
  read: boolean
  createdAt: string
}

export interface Message {
  id: string
  schoolId: string
  senderId: string
  recipientId: string
  subject: string
  content: string
  attachments?: string[]
  read: boolean
  createdAt: string
}

// Reports
export interface ReportFilter {
  schoolId: string
  startDate?: string
  endDate?: string
  classId?: string
  studentId?: string
  teacherId?: string
  type: 'students' | 'teachers' | 'attendance' | 'fees' | 'exam' | 'income' | 'expenses' | 'library'
}

export interface Report {
  id: string
  name: string
  description: string
  generatedDate: string
  data: unknown
  filters: ReportFilter
}

// Settings
export interface SchoolSettings {
  schoolId: string
  theme: 'light' | 'dark'
  language: string
  timezone: string
  academicYear: string
  semester: string
  currency: string
  dateFormat: string
  timeFormat: string
  logo?: string
  banner?: string
  enableOfflineMode: boolean
  autoSyncInterval: number
}

export interface UserSettings {
  userId: string
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    announcements: boolean
    homework: boolean
    exams: boolean
    fees: boolean
  }
  privacy: {
    showEmail: boolean
    showPhone: boolean
  }
}
