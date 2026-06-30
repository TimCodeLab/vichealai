export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

export function isStrongPassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*]/.test(password)
  return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
}

export function validateEnrollmentNumber(number: string): boolean {
  return number.length > 0 && number.length <= 20
}

export function validateEmployeeId(id: string): boolean {
  return id.length > 0 && id.length <= 20
}

export function validateBloodGroup(bloodGroup: string): boolean {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  return validGroups.includes(bloodGroup)
}

export interface ValidationError {
  field: string
  message: string
}

export function validateStudent(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.firstName || data.firstName.trim() === '') {
    errors.push({ field: 'firstName', message: 'First name is required' })
  }

  if (!data.lastName || data.lastName.trim() === '') {
    errors.push({ field: 'lastName', message: 'Last name is required' })
  }

  if (!data.enrollmentNumber || data.enrollmentNumber.trim() === '') {
    errors.push({ field: 'enrollmentNumber', message: 'Enrollment number is required' })
  }

  if (!data.dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' })
  }

  if (!data.emergencyContact || data.emergencyContact.trim() === '') {
    errors.push({ field: 'emergencyContact', message: 'Emergency contact is required' })
  }

  return errors
}

export function validateTeacher(data: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.firstName || data.firstName.trim() === '') {
    errors.push({ field: 'firstName', message: 'First name is required' })
  }

  if (!data.lastName || data.lastName.trim() === '') {
    errors.push({ field: 'lastName', message: 'Last name is required' })
  }

  if (!data.employeeId || data.employeeId.trim() === '') {
    errors.push({ field: 'employeeId', message: 'Employee ID is required' })
  }

  if (!data.qualification || data.qualification.trim() === '') {
    errors.push({ field: 'qualification', message: 'Qualification is required' })
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' })
  }

  return errors
}
