# VICHEALAI Development Guide

## Project Overview
VICHEALAI is a comprehensive School Management System built with Vue 3 and Ionic for cross-platform support (web, iOS, Android). The application supports multiple schools with role-based access control and offline functionality.

## Tech Stack
- **Frontend**: Vue 3 + TypeScript + Ionic Vue
- **State Management**: Pinia
- **Routing**: Vue Router
- **Mobile**: Capacitor + Capacitor SQLite
- **Build Tool**: Vite
- **Styling**: CSS with design variables
- **Backend** (Phase 2): Node.js + PostgreSQL/MariaDB

## Architecture

### Frontend Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Page-level components for routing
├── stores/         # Pinia stores for state management
├── services/       # API and database service classes
├── utils/          # Helper functions
├── assets/         # Styles, images, icons
└── router/         # Vue Router configuration
```

### Database (Mobile - SQLite)
- Schools
- Users (with role-based access)
- Students & Parents
- Teachers
- Classes, Subjects, Sections
- Attendance Records
- Homework & Submissions
- Exams & Marks
- Announcements & Notifications
- Finance (Fees, Invoices, Payments)

## Key Features

### Authentication
- Multi-role support: Super Admin, School Admin, Teachers, Students, Parents
- JWT-based authentication
- School code verification
- Email + Password + School Code login

### Multi-School Support
- Each school has isolated data
- School-specific settings
- Academic year & semester management
- School branding (logo, name, settings)

### Core Modules
1. **Dashboard** - Role-specific dashboards
2. **Academic Management** - Students, Teachers, Classes, Subjects
3. **Attendance** - Attendance tracking with multiple statuses
4. **Timetable** - Schedule management
5. **Homework** - Assignment creation and submission
6. **Exams** - Exam scheduling and grading
7. **Finance** - Fee collection and financial reporting
8. **Library** - Book management with QR codes
9. **Communication** - Announcements and messaging

### Offline Support
- SQLite stores critical data
- Automatic sync when online
- Works seamlessly without internet
- Background sync support

## Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Getting Started
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Development Workflow

### Adding a New Feature
1. Create page component in `src/pages/[module]/`
2. Add route in `src/router/index.ts`
3. Create store in `src/stores/` if state needed
4. Create service in `src/services/` for API/DB calls
5. Add UI components in `src/components/`
6. Style with CSS variables from `src/assets/styles/main.css`

### State Management (Pinia)
- Keep stores focused and single-purpose
- Use `defineStore` for new stores
- Export store interface for TypeScript support
- Example in `src/stores/authStore.ts`

### API Service
- Use the APIClient class in `src/services/api.ts`
- Handle authentication tokens automatically
- Implement error handling and timeouts
- Use environment variables for API URL

### Database Service
- Use Database class in `src/services/database.ts`
- Initialize on app startup
- Use prepared statements for security
- Handle sync to backend when online

## Code Style

### Vue Components
- Use `<script setup>` syntax
- TypeScript for type safety
- Scoped CSS for styles
- Meaningful variable names
- One component per file

### Naming Conventions
- Components: PascalCase (LoginPage.vue)
- Stores: camelCase (authStore.ts)
- Services: camelCase (api.ts, database.ts)
- CSS Classes: kebab-case (.login-container)
- Variables: camelCase (userName, isLoading)

## Phased Development

### Phase 1: Foundation (Current)
- [ ] Authentication system
- [ ] School management
- [ ] Academic structure
- [ ] Basic dashboard

### Phase 2: Core Academic
- [ ] Student management
- [ ] Teacher management
- [ ] Classes & subjects
- [ ] Attendance system
- [ ] Timetable

### Phase 3: Learning
- [ ] Homework system
- [ ] Exams & grading
- [ ] Report cards
- [ ] Transcripts

### Phase 4: Administration
- [ ] Finance module
- [ ] Library system
- [ ] Announcements
- [ ] Reports

### Phase 5: Mobile & Offline
- [ ] SQLite sync
- [ ] Push notifications
- [ ] Backup/restore

### Phase 6: Advanced
- [ ] Parent portal
- [ ] AI assistant
- [ ] QR attendance
- [ ] Analytics

## Testing

- Unit tests: `npm run test`
- E2E testing: To be configured
- Test critical paths first
- Mock API calls in tests

## Deployment

### Web
- Build: `npm run build`
- Output: `dist/` folder
- Deploy to any static host (Vercel, Netlify, etc.)

### Mobile (Coming Soon)
- iOS: Generate .ipa with Xcode
- Android: Generate .apk with Android Studio

## Performance Considerations

- Lazy load pages with `() => import(...)`
- Use computed properties for derived state
- Cache API responses in Pinia stores
- Optimize images and assets
- Monitor bundle size with Vite

## Security

- Validate all user input
- Sanitize HTML content
- Use JWT for authentication
- Never store passwords in localStorage
- Use HTTPS in production
- Implement rate limiting (backend)
- Validate on both client and server

## Common Tasks

### Add a New Page
1. Create component in `src/pages/[module]/`
2. Add route to `src/router/index.ts`
3. Link from navigation/sidebar

### Add State Management
1. Create store in `src/stores/`
2. Use `defineStore()` and composition API
3. Import and use in components with `const store = useYourStore()`

### Call API
1. Add method to `src/services/api.ts` or create new service
2. Handle auth tokens (automatic in APIClient)
3. Handle errors in component
4. Store results in Pinia or component state

### Access Database
1. Call `database.initialize()` on app startup
2. Use `database.query()` or `database.execute()`
3. Handle offline/online transitions
4. Sync to backend when online

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8100 or change in vite.config.ts
```

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

### Mobile Build Issues
- Ensure Capacitor is properly configured
- Check platform-specific requirements (iOS/Android SDKs)
- Review Capacitor plugin documentation

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Ionic Docs](https://ionicframework.com/docs)
- [Capacitor Docs](https://capacitorjs.com/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)

## Future Enhancements

- PWA support
- Social login (Google, Microsoft)
- Advanced analytics
- AI-powered recommendations
- Video streaming for live classes
- Third-party integrations
