# VICHEALAI - School Management System

A modern, multi-school platform for managing high schools with comprehensive features for administrators, teachers, students, and parents. Built with Vue 3, Ionic, and Capacitor for cross-platform support.

## 🚀 Features

### Core Modules
- **Authentication & Authorization** - Multi-role support (Super Admin, School Admin, Teachers, Students, Parents)
- **School Management** - Multi-school data isolation, school settings, and configuration
- **Academic Structure** - Year → Semester → Grade → Class → Section → Subjects
- **Student Management** - Student profiles, documents, and enrollment tracking
- **Teacher Management** - Staff profiles, qualifications, and assignments
- **Attendance** - Multiple attendance statuses with reporting
- **Timetable** - School, teacher, student, and room schedules
- **Homework** - Assignment creation, submission, and grading
- **Exams** - Exam scheduling, question papers, marks, and report cards
- **Finance** - Fee management, invoices, receipts, scholarships, and financial reports
- **Library** - Book management, borrowing, returns, and QR codes
- **Communication** - Announcements, notifications, email, and messaging
- **Reports** - Comprehensive reporting for students, teachers, attendance, fees, and more

### Technical Features
- **Cross-Platform** - Web (Ionic Vue) and Mobile (iOS/Android via Capacitor)
- **Offline Support** - SQLite offline storage with cloud synchronization
- **Multi-Language** - Support for multiple languages and timezones
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode** - Built-in dark mode support
- **Role-Based Access** - Granular permission system for different user roles

## 📋 Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Ionic Vue** - UI framework for cross-platform apps
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management
- **Vue Router** - Client-side routing

### Mobile
- **Capacitor** - Bridge between web and native mobile
- **Capacitor SQLite** - Native SQLite database
- **Capacitor Plugins** - Native device features

### Backend (Phase 2)
- **Node.js** - JavaScript runtime
- **MariaDB/PostgreSQL** - Relational database
- **Express.js** - Web framework

### Development
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety
- **ESLint** - Code quality
- **Vitest** - Unit testing

## 🛠️ Installation

### Prerequisites
- Node.js 16+ and npm
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vichealai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8100`

## 📱 Building for Mobile

### iOS
```bash
npm run build
npx cap init
npx cap add ios
npx cap open ios
```

### Android
```bash
npm run build
npx cap add android
npx cap open android
```

## 📂 Project Structure

```
vichealai/
├── src/
│   ├── assets/          # Images, styles, icons
│   ├── components/      # Reusable Vue components
│   ├── pages/           # Page components for routing
│   ├── services/        # API and database services
│   ├── stores/          # Pinia state management
│   ├── utils/           # Utility functions
│   ├── router/          # Vue Router configuration
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── capacitor.config.ts  # Capacitor configuration
└── package.json         # Project dependencies
```

## 🗺️ Development Roadmap

### Phase 1: Foundation
- [ ] Authentication and role management
- [ ] School management
- [ ] Academic structure setup
- [ ] Basic dashboard

### Phase 2: Core Academic
- [ ] Student management
- [ ] Teacher management
- [ ] Classes and subjects
- [ ] Attendance tracking
- [ ] Timetable management

### Phase 3: Learning
- [ ] Homework system
- [ ] Exam management
- [ ] Grades and report cards
- [ ] Student transcripts

### Phase 4: Administration
- [ ] Finance module
- [ ] Library management
- [ ] Announcements
- [ ] Reporting system

### Phase 5: Mobile & Offline
- [ ] SQLite offline storage
- [ ] Data synchronization
- [ ] Push notifications
- [ ] Backup and restore

### Phase 6: Advanced Features
- [ ] Parent portal
- [ ] AI study assistant
- [ ] QR code attendance
- [ ] Analytics dashboard
- [ ] Third-party integrations

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- HTTPS for all API communications
- Secure password hashing
- SQLite encryption support (mobile)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed for schools in Southeast Asia, with a focus on offline-first architecture and multi-school support.

## 📞 Support

For support, email support@vichealai.com or open an issue in the repository.

## 🎯 Goals

- **Allow all high schools to use the app** - Multi-school platform with data isolation
- **Work offline** - SQLite for mobile with cloud sync
- **Accessible to all** - Cross-platform support (Web, iOS, Android)
- **Easy to use** - Intuitive UI for various user roles
- **Scalable** - Handle large numbers of schools and students
