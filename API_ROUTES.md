# techocam API Routes

## Base URL
```
http://localhost:3000/api
```

## Authentication

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@school.com",
  "password": "password123",
  "schoolCode": "SCHOOL001"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "schoolId": "school_id",
    "email": "user@school.com",
    "name": "John Doe",
    "role": "teacher"
  }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {token}
```

### Refresh Token
```
POST /auth/refresh
Authorization: Bearer {token}
```

---

## Schools

### Get School Details
```
GET /schools/{schoolId}
Authorization: Bearer {token}
```

### Update School Settings
```
PUT /schools/{schoolId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "School Name",
  "address": "School Address",
  "timezone": "Asia/Phnom_Penh"
}
```

---

## Students

### List Students
```
GET /schools/{schoolId}/students?page=1&limit=50&classId={classId}&search={search}
Authorization: Bearer {token}
```

### Get Student Details
```
GET /schools/{schoolId}/students/{studentId}
Authorization: Bearer {token}
```

### Create Student
```
POST /schools/{schoolId}/students
Authorization: Bearer {token}
Content-Type: application/json

{
  "enrollmentNumber": "STU001",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "dateOfBirth": "2005-01-15",
  "parentId": "parent_id",
  "address": "123 Main St"
}
```

### Update Student
```
PUT /schools/{schoolId}/students/{studentId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jane",
  "status": "active"
}
```

### Delete Student
```
DELETE /schools/{schoolId}/students/{studentId}
Authorization: Bearer {token}
```

### Get Parents
```
GET /schools/{schoolId}/parents
Authorization: Bearer {token}
```

---

## Teachers

### List Teachers
```
GET /schools/{schoolId}/teachers?page=1&limit=50&search={search}
Authorization: Bearer {token}
```

### Get Teacher Details
```
GET /schools/{schoolId}/teachers/{teacherId}
Authorization: Bearer {token}
```

### Create Teacher
```
POST /schools/{schoolId}/teachers
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "employeeId": "TEA001",
  "firstName": "Jane",
  "lastName": "Smith",
  "qualification": "B.Sc in Mathematics",
  "specialization": "Mathematics",
  "email": "jane@school.com"
}
```

### Assign Teacher to Subject
```
POST /schools/{schoolId}/teacher-assignments
Authorization: Bearer {token}
Content-Type: application/json

{
  "teacherId": "teacher_id",
  "sectionId": "section_id",
  "subjectId": "subject_id",
  "academicYearId": "year_id"
}
```

---

## Academic Structure

### List Grades
```
GET /schools/{schoolId}/grades
Authorization: Bearer {token}
```

### Create Grade
```
POST /schools/{schoolId}/grades
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Grade 10",
  "level": 10
}
```

### List Classes
```
GET /schools/{schoolId}/classes?gradeId={gradeId}
Authorization: Bearer {token}
```

### Create Class
```
POST /schools/{schoolId}/classes
Authorization: Bearer {token}
Content-Type: application/json

{
  "gradeId": "grade_id",
  "name": "Class 10A",
  "classTeacherId": "teacher_id"
}
```

### List Subjects
```
GET /schools/{schoolId}/subjects
Authorization: Bearer {token}
```

### Create Subject
```
POST /schools/{schoolId}/subjects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Mathematics",
  "code": "MATH101",
  "description": "General Mathematics"
}
```

---

## Attendance

### Get Attendance
```
GET /schools/{schoolId}/attendance?classId={classId}&date={date}
Authorization: Bearer {token}
```

### Mark Attendance
```
POST /schools/{schoolId}/attendance/mark
Authorization: Bearer {token}
Content-Type: application/json

{
  "classId": "class_id",
  "date": "2024-01-15",
  "records": [
    {
      "studentId": "student_id",
      "status": "present"
    }
  ]
}
```

### Get Attendance Report
```
GET /schools/{schoolId}/attendance/report?studentId={studentId}&startDate={date}&endDate={date}
Authorization: Bearer {token}
```

---

## Timetable

### Get Timetables
```
GET /schools/{schoolId}/timetables?type=student&entityId={entityId}
Authorization: Bearer {token}
```

### Create Timetable Entry
```
POST /schools/{schoolId}/timetables
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "student",
  "entityId": "section_id",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "10:00",
  "subjectId": "subject_id",
  "teacherId": "teacher_id"
}
```

---

## Homework

### List Homework
```
GET /schools/{schoolId}/homework?classId={classId}
Authorization: Bearer {token}
```

### Create Homework
```
POST /schools/{schoolId}/homework
Authorization: Bearer {token}
Content-Type: application/json

{
  "classId": "class_id",
  "teacherId": "teacher_id",
  "subjectId": "subject_id",
  "title": "Chapter 5 Exercises",
  "description": "Complete all exercises",
  "dueDate": "2024-01-20"
}
```

### Submit Homework
```
POST /schools/{schoolId}/homework/{homeworkId}/submit
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "studentId": "student_id",
  "attachments": [file]
}
```

### Grade Submission
```
PUT /schools/{schoolId}/homework/submissions/{submissionId}/grade
Authorization: Bearer {token}
Content-Type: application/json

{
  "marks": 45,
  "feedback": "Good work!"
}
```

---

## Exams

### List Exams
```
GET /schools/{schoolId}/exams
Authorization: Bearer {token}
```

### Create Exam
```
POST /schools/{schoolId}/exams
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Semester 1 Exams",
  "description": "Mid-semester examinations",
  "startDate": "2024-02-01",
  "endDate": "2024-02-15",
  "status": "scheduled"
}
```

### Get Exam Schedule
```
GET /schools/{schoolId}/exam-schedules?examId={examId}
Authorization: Bearer {token}
```

### Record Exam Result
```
POST /schools/{schoolId}/exam-results
Authorization: Bearer {token}
Content-Type: application/json

{
  "examId": "exam_id",
  "studentId": "student_id",
  "subjectId": "subject_id",
  "marksObtained": 85,
  "totalMarks": 100
}
```

### Get Report Card
```
GET /schools/{schoolId}/students/{studentId}/report-card?semesterId={semesterId}
Authorization: Bearer {token}
```

---

## Finance

### List Fees
```
GET /schools/{schoolId}/fees?academicYearId={yearId}
Authorization: Bearer {token}
```

### Get Student Fees
```
GET /schools/{schoolId}/student-fees?studentId={studentId}
Authorization: Bearer {token}
```

### Get Invoices
```
GET /schools/{schoolId}/invoices?status=pending&studentId={studentId}
Authorization: Bearer {token}
```

### Record Payment
```
POST /schools/{schoolId}/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "invoiceId": "invoice_id",
  "studentId": "student_id",
  "amount": 500,
  "paymentDate": "2024-01-15",
  "paymentMethod": "cash"
}
```

### Get Financial Report
```
GET /schools/{schoolId}/financial-reports?period=2024-01
Authorization: Bearer {token}
```

---

## Library

### List Books
```
GET /schools/{schoolId}/books?category={category}&search={search}
Authorization: Bearer {token}
```

### Add Book
```
POST /schools/{schoolId}/books
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Mathematics Textbook",
  "author": "John Smith",
  "isbn": "978-3-16-148410-0",
  "category": "Mathematics",
  "quantity": 10
}
```

### Borrow Book
```
POST /schools/{schoolId}/book-borrows
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookId": "book_id",
  "userId": "user_id",
  "borrowDate": "2024-01-15",
  "dueDate": "2024-02-15"
}
```

### Return Book
```
PUT /schools/{schoolId}/book-borrows/{borrowId}/return
Authorization: Bearer {token}
Content-Type: application/json

{
  "returnDate": "2024-02-10"
}
```

---

## Communication

### Get Announcements
```
GET /schools/{schoolId}/announcements
Authorization: Bearer {token}
```

### Create Announcement
```
POST /schools/{schoolId}/announcements
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "School Closure",
  "content": "School will be closed on Jan 20",
  "targetRole": ["student", "teacher", "parent"]
}
```

### Get Notifications
```
GET /schools/{schoolId}/users/{userId}/notifications
Authorization: Bearer {token}
```

### Mark Notification Read
```
PUT /schools/{schoolId}/notifications/{notificationId}/read
Authorization: Bearer {token}
```

### Send Message
```
POST /schools/{schoolId}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "senderId": "user_id",
  "recipientId": "user_id",
  "subject": "Homework Question",
  "content": "I have a question about..."
}
```

---

## Reports

### Generate Report
```
POST /schools/{schoolId}/reports/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "students",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "classId": "class_id"
}
```

### Get Reports
```
GET /schools/{schoolId}/reports?type=students&limit=10
Authorization: Bearer {token}
```

---

## Settings

### Get School Settings
```
GET /schools/{schoolId}/settings
Authorization: Bearer {token}
```

### Update School Settings
```
PUT /schools/{schoolId}/settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "theme": "light",
  "language": "en",
  "timezone": "Asia/Phnom_Penh"
}
```

### Get User Settings
```
GET /users/{userId}/settings
Authorization: Bearer {token}
```

### Update User Settings
```
PUT /users/{userId}/settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "theme": "dark",
  "notifications": {
    "announcements": true
  }
}
```

### Create Backup
```
POST /schools/{schoolId}/backup
Authorization: Bearer {token}
```

### Restore Backup
```
POST /schools/{schoolId}/restore
Authorization: Bearer {token}
Content-Type: application/json

{
  "backupId": "backup_id"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "message": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Student not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong on the server"
}
```

---

## Pagination

All list endpoints support pagination:
- `page` (default: 1)
- `limit` (default: 50, max: 100)

Example:
```
GET /schools/{schoolId}/students?page=2&limit=25
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 25,
    "total": 250,
    "pages": 10
  }
}
```
