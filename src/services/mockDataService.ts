import type {
  School,
  Grade,
  Class,
  Section,
  Subject,
  Student,
  Teacher,
  Attendance,
  Homework,
  Exam,
  FinanceFee,
  Book,
  Announcement
} from '@/types';

export class MockDataService {
  static generateSchools(): School[] {
    return [
      {
        id: 'school_1',
        name: 'Royal Academy',
        code: 'SCHOOL001',
        address: '123 Main Street, Phnom Penh',
        phone: '023-999-999',
        email: 'info@royalacademy.edu.kh',
        logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Royal',
        foundedYear: 2010,
        principalId: 'user_1',
        status: 'active'
      },
      {
        id: 'school_2',
        name: 'Modern International School',
        code: 'SCHOOL002',
        address: '456 Park Avenue, Phnom Penh',
        phone: '023-888-888',
        email: 'info@modern.edu.kh',
        logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Modern',
        foundedYear: 2015,
        principalId: 'user_2',
        status: 'active'
      }
    ];
  }

  static generateGrades(): Grade[] {
    return [
      {id: 'grade_1', schoolId: 'school_1', name: 'Grade 9', level: 9},
      {id: 'grade_2', schoolId: 'school_1', name: 'Grade 10', level: 10},
      {id: 'grade_3', schoolId: 'school_1', name: 'Grade 11', level: 11},
      {id: 'grade_4', schoolId: 'school_1', name: 'Grade 12', level: 12}
    ];
  }

  static generateClasses(): Class[] {
    return [
      {id: 'class_1', schoolId: 'school_1', gradeId: 'grade_2', name: 'Class 10A', classTeacherId: 'teacher_1'},
      {id: 'class_2', schoolId: 'school_1', gradeId: 'grade_2', name: 'Class 10B', classTeacherId: 'teacher_2'},
      {id: 'class_3', schoolId: 'school_1', gradeId: 'grade_3', name: 'Class 11A', classTeacherId: 'teacher_3'},
      {id: 'class_4', schoolId: 'school_1', gradeId: 'grade_4', name: 'Class 12A', classTeacherId: 'teacher_4'}
    ];
  }

  static generateSections(): Section[] {
    return [
      {id: 'section_1', classId: 'class_1', name: 'Morning'},
      {id: 'section_2', classId: 'class_1', name: 'Afternoon'},
      {id: 'section_3', classId: 'class_2', name: 'Morning'},
      {id: 'section_4', classId: 'class_2', name: 'Afternoon'}
    ];
  }

  static generateSubjects(): Subject[] {
    return [
      {id: 'subj_1', schoolId: 'school_1', name: 'Mathematics', code: 'MATH101', description: 'General Mathematics'},
      {id: 'subj_2', schoolId: 'school_1', name: 'English', code: 'ENG101', description: 'English Language'},
      {id: 'subj_3', schoolId: 'school_1', name: 'Science', code: 'SCI101', description: 'General Science'},
      {id: 'subj_4', schoolId: 'school_1', name: 'History', code: 'HIST101', description: 'World History'},
      {id: 'subj_5', schoolId: 'school_1', name: 'Khmer', code: 'KHM101', description: 'Khmer Language'},
      {id: 'subj_6', schoolId: 'school_1', name: 'Physical Education', code: 'PE101', description: 'Physical Education'}
    ];
  }

  static generateStudents(): Student[] {
    return [
      {
        id: 'student_1',
        schoolId: 'school_1',
        classId: 'class_1',
        name: 'Sokha',
        email: 'sokha@student.edu.kh',
        dateOfBirth: '2008-05-15',
        gender: 'M',
        address: '123 Street, Phnom Penh',
        parentId: 'parent_1',
        enrollmentDate: '2022-09-01',
        status: 'active'
      },
      {
        id: 'student_2',
        schoolId: 'school_1',
        classId: 'class_1',
        name: 'Sophea',
        email: 'sophea@student.edu.kh',
        dateOfBirth: '2008-08-20',
        gender: 'F',
        address: '456 Street, Phnom Penh',
        parentId: 'parent_2',
        enrollmentDate: '2022-09-01',
        status: 'active'
      },
      {
        id: 'student_3',
        schoolId: 'school_1',
        classId: 'class_1',
        name: 'Visal',
        email: 'visal@student.edu.kh',
        dateOfBirth: '2008-03-10',
        gender: 'M',
        address: '789 Street, Phnom Penh',
        parentId: 'parent_3',
        enrollmentDate: '2022-09-01',
        status: 'active'
      },
      {
        id: 'student_4',
        schoolId: 'school_1',
        classId: 'class_2',
        name: 'Pheaktra',
        email: 'pheaktra@student.edu.kh',
        dateOfBirth: '2008-12-25',
        gender: 'F',
        address: '321 Street, Phnom Penh',
        parentId: 'parent_4',
        enrollmentDate: '2022-09-01',
        status: 'active'
      }
    ];
  }

  static generateTeachers(): Teacher[] {
    return [
      {
        id: 'teacher_1',
        schoolId: 'school_1',
        name: 'Mr. Chheng',
        email: 'chheng@school.edu.kh',
        dateOfBirth: '1985-06-10',
        gender: 'M',
        phone: '012-345-678',
        qualification: 'Bachelor in Mathematics',
        specialization: 'Mathematics',
        joinDate: '2015-08-15',
        status: 'active'
      },
      {
        id: 'teacher_2',
        schoolId: 'school_1',
        name: 'Ms. Chenda',
        email: 'chenda@school.edu.kh',
        dateOfBirth: '1988-03-20',
        gender: 'F',
        phone: '012-456-789',
        qualification: 'Bachelor in English',
        specialization: 'English',
        joinDate: '2016-08-10',
        status: 'active'
      },
      {
        id: 'teacher_3',
        schoolId: 'school_1',
        name: 'Mr. Phirun',
        email: 'phirun@school.edu.kh',
        dateOfBirth: '1982-11-05',
        gender: 'M',
        phone: '012-567-890',
        qualification: 'Bachelor in Science',
        specialization: 'Physics',
        joinDate: '2014-09-01',
        status: 'active'
      },
      {
        id: 'teacher_4',
        schoolId: 'school_1',
        name: 'Ms. Sreypich',
        email: 'sreypich@school.edu.kh',
        dateOfBirth: '1990-07-18',
        gender: 'F',
        phone: '012-678-901',
        qualification: 'Bachelor in History',
        specialization: 'History',
        joinDate: '2017-08-20',
        status: 'active'
      }
    ];
  }

  static generateAttendance(): Attendance[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'attend_1',
        studentId: 'student_1',
        classId: 'class_1',
        date: today,
        status: 'present',
        recordedBy: 'teacher_1',
        recordedAt: new Date().toISOString()
      },
      {
        id: 'attend_2',
        studentId: 'student_2',
        classId: 'class_1',
        date: today,
        status: 'present',
        recordedBy: 'teacher_1',
        recordedAt: new Date().toISOString()
      },
      {
        id: 'attend_3',
        studentId: 'student_3',
        classId: 'class_1',
        date: today,
        status: 'absent',
        recordedBy: 'teacher_1',
        recordedAt: new Date().toISOString()
      }
    ];
  }

  static generateHomework(): Homework[] {
    return [
      {
        id: 'hw_1',
        classId: 'class_1',
        subjectId: 'subj_1',
        createdBy: 'teacher_1',
        title: 'Chapter 5: Algebra Exercises',
        description: 'Solve exercises 1-20 from page 45',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'assigned'
      },
      {
        id: 'hw_2',
        classId: 'class_1',
        subjectId: 'subj_2',
        createdBy: 'teacher_2',
        title: 'Essay Writing: My Future Dreams',
        description: 'Write a 500-word essay about your dreams',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'assigned'
      }
    ];
  }

  static generateExams(): Exam[] {
    return [
      {
        id: 'exam_1',
        classId: 'class_1',
        subjectId: 'subj_1',
        name: 'Mid-term Exam',
        description: 'Comprehensive exam covering chapters 1-5',
        examDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        examTime: '08:00',
        duration: 120,
        totalMarks: 100,
        passingMarks: 40,
        createdBy: 'teacher_1',
        status: 'scheduled'
      },
      {
        id: 'exam_2',
        classId: 'class_1',
        subjectId: 'subj_2',
        name: 'Monthly Test',
        description: 'Grammar and vocabulary test',
        examDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        examTime: '09:00',
        duration: 60,
        totalMarks: 50,
        passingMarks: 25,
        createdBy: 'teacher_2',
        status: 'scheduled'
      }
    ];
  }

  static generateFinanceFees(): FinanceFee[] {
    return [
      {
        id: 'fee_1',
        schoolId: 'school_1',
        name: 'Tuition Fee',
        amount: 100,
        currency: 'USD',
        dueDate: '2026-09-30',
        academicYear: '2024-2025',
        description: 'Monthly tuition fee',
        status: 'active'
      },
      {
        id: 'fee_2',
        schoolId: 'school_1',
        name: 'Sports Activity Fee',
        amount: 20,
        currency: 'USD',
        dueDate: '2026-09-30',
        academicYear: '2024-2025',
        description: 'For extracurricular activities',
        status: 'active'
      },
      {
        id: 'fee_3',
        schoolId: 'school_1',
        name: 'Library Fee',
        amount: 10,
        currency: 'USD',
        dueDate: '2026-09-30',
        academicYear: '2024-2025',
        description: 'Library access and materials',
        status: 'active'
      }
    ];
  }

  static generateBooks(): Book[] {
    return [
      {
        id: 'book_1',
        schoolId: 'school_1',
        title: 'Advanced Mathematics',
        author: 'John Smith',
        isbn: '978-0-123456-78-9',
        quantity: 15,
        availableQuantity: 12,
        category: 'Mathematics',
        status: 'available'
      },
      {
        id: 'book_2',
        schoolId: 'school_1',
        title: 'English Grammar Guide',
        author: 'Sarah Johnson',
        isbn: '978-0-987654-32-1',
        quantity: 20,
        availableQuantity: 18,
        category: 'English',
        status: 'available'
      },
      {
        id: 'book_3',
        schoolId: 'school_1',
        title: 'Science Fundamentals',
        author: 'Dr. Robert Brown',
        isbn: '978-0-555555-55-5',
        quantity: 10,
        availableQuantity: 7,
        category: 'Science',
        status: 'available'
      }
    ];
  }

  static generateAnnouncements(): Announcement[] {
    return [
      {
        id: 'announce_1',
        schoolId: 'school_1',
        title: 'School Holiday Notice',
        content: 'School will be closed from June 15-30 for summer break',
        category: 'holiday',
        publishedBy: 'school_admin',
        publishedAt: new Date().toISOString(),
        status: 'published'
      },
      {
        id: 'announce_2',
        schoolId: 'school_1',
        title: 'New Sports Program Launch',
        content: 'We are excited to announce our new basketball program starting July 1',
        category: 'event',
        publishedBy: 'school_admin',
        publishedAt: new Date().toISOString(),
        status: 'published'
      },
      {
        id: 'announce_3',
        schoolId: 'school_1',
        title: 'Exam Schedule Released',
        content: 'Final exams will be held from June 20-30. Timetable available on the portal',
        category: 'academic',
        publishedBy: 'school_admin',
        publishedAt: new Date().toISOString(),
        status: 'published'
      }
    ];
  }

  static initializeLocalStorage() {
    const schoolsKey = 'schools';
    const gradesKey = 'grades';
    const classesKey = 'classes';
    const sectionsKey = 'sections';
    const subjectsKey = 'subjects';
    const studentsKey = 'students';
    const teachersKey = 'teachers';
    const attendanceKey = 'attendance';
    const homeworkKey = 'homework';
    const examsKey = 'exams';
    const feesKey = 'fees';
    const booksKey = 'books';
    const announcementsKey = 'announcements';

    if (!localStorage.getItem(schoolsKey)) {
      localStorage.setItem(schoolsKey, JSON.stringify(this.generateSchools()));
    }
    if (!localStorage.getItem(gradesKey)) {
      localStorage.setItem(gradesKey, JSON.stringify(this.generateGrades()));
    }
    if (!localStorage.getItem(classesKey)) {
      localStorage.setItem(classesKey, JSON.stringify(this.generateClasses()));
    }
    if (!localStorage.getItem(sectionsKey)) {
      localStorage.setItem(sectionsKey, JSON.stringify(this.generateSections()));
    }
    if (!localStorage.getItem(subjectsKey)) {
      localStorage.setItem(subjectsKey, JSON.stringify(this.generateSubjects()));
    }
    if (!localStorage.getItem(studentsKey)) {
      localStorage.setItem(studentsKey, JSON.stringify(this.generateStudents()));
    }
    if (!localStorage.getItem(teachersKey)) {
      localStorage.setItem(teachersKey, JSON.stringify(this.generateTeachers()));
    }
    if (!localStorage.getItem(attendanceKey)) {
      localStorage.setItem(attendanceKey, JSON.stringify(this.generateAttendance()));
    }
    if (!localStorage.getItem(homeworkKey)) {
      localStorage.setItem(homeworkKey, JSON.stringify(this.generateHomework()));
    }
    if (!localStorage.getItem(examsKey)) {
      localStorage.setItem(examsKey, JSON.stringify(this.generateExams()));
    }
    if (!localStorage.getItem(feesKey)) {
      localStorage.setItem(feesKey, JSON.stringify(this.generateFinanceFees()));
    }
    if (!localStorage.getItem(booksKey)) {
      localStorage.setItem(booksKey, JSON.stringify(this.generateBooks()));
    }
    if (!localStorage.getItem(announcementsKey)) {
      localStorage.setItem(announcementsKey, JSON.stringify(this.generateAnnouncements()));
    }
  }
}
