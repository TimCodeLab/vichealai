# techocam Quick Start Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Access at: `http://localhost:8100`

## Project Structure Overview

```
src/
├── pages/          # Page components (one per route)
├── stores/         # Pinia state management
├── services/       # API, Database, Sync, Notifications
├── components/     # Reusable Vue components
├── types/          # TypeScript type definitions
├── utils/          # Helper utilities
├── assets/         # Styles, images, icons
└── router/         # Route definitions
```

## Key Concepts

### Stores (State Management)
Pinia stores manage all application state. Each store handles one domain:

```typescript
import { useStudentStore } from '@/stores/studentStore'

const studentStore = useStudentStore()

// In component:
const students = computed(() => studentStore.students)
await studentStore.fetchStudents(schoolId)
```

### Services
Services handle API calls, database operations, and offline sync:

```typescript
import api from '@/services/api'
import database from '@/services/database'
import offlineService from '@/services/offlineService'
import syncService from '@/services/syncService'
import notificationService from '@/services/notificationService'
```

### Type Safety
All data structures are typed via `src/types/index.ts`:

```typescript
import type { Student, Teacher, Attendance } from '@/types'
```

## Common Development Tasks

### Adding a New Page

1. **Create component** in `src/pages/[module]/NewPage.vue`
2. **Add route** in `src/router/index.ts`:
   ```typescript
   {
     path: '/new-module',
     component: () => import('@/pages/new/NewPage.vue'),
     meta: { requiresAuth: true }
   }
   ```
3. **Use store** in component:
   ```typescript
   import { useNewStore } from '@/stores/newStore'
   ```

### Making API Calls

```typescript
import api from '@/services/api'

// GET request
const data = await api.get('/schools/{id}/students')

// POST request
await api.post('/schools/{id}/students', { name: 'John' })

// PUT request
await api.put('/schools/{id}/students/{id}', { name: 'Jane' })

// DELETE request
await api.delete('/schools/{id}/students/{id}')
```

### Storing/Retrieving Data Offline

```typescript
import offlineService from '@/services/offlineService'

// Save to local SQLite
await offlineService.saveToLocal('students', studentData)

// Get from local
const students = await offlineService.getFromLocal('students')
const student = await offlineService.getFromLocal('students', studentId)

// Delete from local
await offlineService.deleteFromLocal('students', studentId)
```

### Sending Notifications

```typescript
import notificationService from '@/services/notificationService'

// Send single notification
await notificationService.sendNotification({
  title: 'Homework Due',
  message: 'Complete math homework by tomorrow',
  type: 'homework',
  userId: 'user_id',
  schoolId: 'school_id'
})

// Send bulk notification
await notificationService.sendBulkNotifications(schoolId, userIds, {
  title: 'Announcement',
  message: 'School closure tomorrow',
  type: 'announcement'
})
```

### Working with Computed Properties

```typescript
import { computed, onMounted } from 'vue'

// Computed property
const completedHomework = computed(() =>
  homeworkStore.homework.filter(hw => hw.status === 'completed')
)

// Use in template
<div>{{ completedHomework.length }} completed</div>
```

### Form Validation

```typescript
import { validateStudent, validateTeacher } from '@/utils/validationUtils'

const errors = validateStudent({
  firstName: 'John',
  lastName: '',
  // ... other fields
})

if (errors.length > 0) {
  // Show errors to user
  errors.forEach(e => console.log(e.field, e.message))
}
```

### Date Utilities

```typescript
import { formatDate, isOverdue, getDateRange } from '@/utils/dateUtils'

const formatted = formatDate('2024-01-15', 'DD/MM/YYYY')
const overdue = isOverdue('2024-01-10')
const range = getDateRange(30) // Last 30 days
```

## Styling

### Global Styles
Edit `src/assets/styles/main.css` for global styles and variables.

### Component Styles
Use scoped CSS in components:

```vue
<style scoped>
.card {
  padding: 20px;
  border-radius: 8px;
}
</style>
```

### CSS Variables
```css
--primary-color: #007bff;
--secondary-color: #6c757d;
--border-radius: 8px;
--box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```

## Building for Production

```bash
# Build web app
npm run build

# Output in dist/ folder
```

## Building for Mobile

```bash
# Build first
npm run build

# Initialize Capacitor (first time only)
npx cap init
npx cap add ios
npx cap add android

# Sync native projects
npx cap sync

# Open in native IDE
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

## Debugging

### Browser DevTools
- Open browser DevTools (F12)
- Use Vue DevTools extension for Vue debugging
- Check Console for errors
- Use Network tab to inspect API calls

### Capacitor Debugging
```bash
# Sync to see changes
npx cap sync

# Open native IDE for device debugging
npx cap open ios
npx cap open android
```

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8100 or change vite.config.ts port setting
```

### Offline Service Not Working
- Check database initialization in `src/services/database.ts`
- Verify SQLite plugin is installed: `npm ls @capacitor-community/sqlite`
- Check browser console for database errors

### Sync Not Working
- Verify internet connection
- Check API endpoint in `.env.local`
- Review SyncService queue in DevTools

### Notification Permissions
- Grant permission when prompted
- Check browser notification settings
- Verify Firebase setup for push notifications

## Performance Tips

1. **Use computed properties** instead of methods for derived state
2. **Lazy load pages** with dynamic imports
3. **Cache API responses** in Pinia stores
4. **Optimize images** before adding to assets
5. **Monitor bundle size** with Vite plugins
6. **Use pagination** for large data lists
7. **Implement virtual scrolling** for large lists

## Best Practices

1. **Always use TypeScript types** from `src/types/index.ts`
2. **Keep components focused** - one responsibility per component
3. **Use stores for shared state** - don't prop drill
4. **Validate input** using utilities in `src/utils/validationUtils.ts`
5. **Handle errors gracefully** - show user-friendly messages
6. **Use meaningful variable names** - makes code self-documenting
7. **Add comments only for WHY** - not WHAT (code shows what)
8. **Test critical paths** - before pushing to production

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Ionic Docs](https://ionicframework.com/docs)
- [Capacitor Docs](https://capacitorjs.com/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)

## Need Help?

1. Check [CLAUDE.md](CLAUDE.md) for development guide
2. Review [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) for feature status
3. Check [API_ROUTES.md](API_ROUTES.md) for API documentation
4. Look at existing pages as examples
5. Check browser console for errors

## Next Steps

1. Set up backend (Node.js + Database)
2. Implement authentication endpoint
3. Create remaining page components
4. Add form validation and error handling
5. Set up automated testing
6. Deploy to test environment
7. Get user feedback
8. Deploy to production
