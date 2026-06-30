# Development Mode Guide

## Current Status: Frontend-Only (Mock Data)

The app is running in **frontend-only mode** with automatic fallback to mock data when the backend is unavailable.

### How It Works

1. **Stores attempt API calls** to `http://localhost:3000`
2. **If backend is down**, the stores automatically use mock data
3. **No errors displayed** to user - graceful degradation
4. **All features work** with mock/test data

### Mock Data Included

Each store provides realistic test data:

| Store | Mock Data | Records |
|-------|-----------|---------|
| **Academic** | Grades, Classes, Sections, Subjects | 4-10 items |
| **Students** | Student profiles | 3 students |
| **Teachers** | Teacher profiles, assignments | 2 teachers |
| **Attendance** | Empty (added per session) | - |
| **Homework** | Empty (created per session) | - |
| **Finance** | Empty (created per session) | - |

## Development Workflow

### Phase 1: Frontend Development (Current)
✅ Build UI without backend
✅ Test navigation and flows
✅ Use mock data for testing
✅ No internet required

### Phase 2: Backend Integration
When backend is ready:

1. **Start backend server**:
   ```bash
   node server.js  # or your backend start command
   ```

2. **Backend must be running at**:
   ```
   http://localhost:3000
   ```

3. **Update environment** if needed:
   ```bash
   # In .env.local
   VITE_API_URL=http://localhost:3000
   ```

4. **Real data** will be fetched instead of mock data

## Console Output

### With Backend Down (Current)
```
⚠️ Failed to fetch grades, using mock data: error message
⚠️ Failed to fetch classes, using mock data: error message
✓ App continues to work with mock data
```

### With Backend Running
```
✓ GET /schools/school_1/grades → 200 OK
✓ GET /schools/school_1/classes → 200 OK
✓ Real data loaded from database
```

## Testing Checklist

### ✅ What Works Now (Without Backend)
- [x] User authentication with test accounts
- [x] Dashboard (all roles)
- [x] Navigate between pages
- [x] View mock student data
- [x] View mock teacher data
- [x] View mock classes & subjects
- [x] Form submissions (saved to localStorage)
- [x] Settings & preferences
- [x] Logout functionality

### ⏳ Requires Backend to Fully Test
- [ ] Real student data from database
- [ ] Real teacher data from database
- [ ] Real attendance data persistence
- [ ] Real homework assignments
- [ ] Real exam data
- [ ] Real finance records
- [ ] Real library books
- [ ] Persistent data across sessions

## Switching to Backend

### Step 1: Start Backend
```bash
cd backend-directory
npm install
npm start
# Server should run on http://localhost:3000
```

### Step 2: Verify Backend is Running
Open browser console and check:
```
✓ GET http://localhost:3000/schools/school_1/grades → 200
✓ GET http://localhost:3000/schools/school_1/classes → 200
```

### Step 3: Real Data Will Load Automatically
- No code changes needed
- Stores automatically use real API data
- Mock data no longer shows

## API Endpoints Required

Minimal backend must implement these endpoints:

```
GET  /schools/{schoolId}/grades
GET  /schools/{schoolId}/classes
GET  /schools/{schoolId}/subjects
GET  /schools/{schoolId}/teachers
GET  /schools/{schoolId}/students
GET  /schools/{schoolId}/parents
GET  /schools/{schoolId}/teacher-assignments
GET  /schools/{schoolId}/attendance
POST /schools/{schoolId}/attendance/mark
```

See **API_ROUTES.md** for full API specification.

## Troubleshooting

### Q: I see "ERR_CONNECTION_REFUSED" errors
A: **This is normal!** Backend isn't running. App automatically uses mock data.

### Q: Why isn't real data showing?
A: 
1. Backend must be running on `http://localhost:3000`
2. Check backend logs for errors
3. Verify network tab in DevTools shows 200 responses

### Q: Can I disable these warnings?
A: Edit the stores to remove `console.warn()` calls, but keep the mock data fallback.

### Q: Data doesn't persist between page reloads
A: 
- With backend: Data persists in database (needs backend)
- Without backend: Data only in current session (browser memory)
- Use localStorage for persistence (current implementation)

## Best Practices During Development

1. **Keep mock data realistic** - Test with production-like datasets
2. **Test error handling** - What happens when API fails?
3. **Check DevTools Network tab** - See which requests fail
4. **Use test credentials** - Test all 10 roles
5. **Clear localStorage** - `localStorage.clear()` between tests

## Frontend-Only Limitations

| Feature | Status | Notes |
|---------|--------|-------|
| View data | ✅ Works | Mock data included |
| Create data | ⚠️ Limited | Saved to localStorage only |
| Update data | ⚠️ Limited | Saved to localStorage only |
| Delete data | ⚠️ Limited | Saved to localStorage only |
| Real persistence | ❌ No | Needs backend database |
| Multi-device sync | ❌ No | Needs backend |
| User accounts | ❌ No | Test-only logins |

## Summary

**Current State:**
- ✅ Frontend complete and functional
- ✅ All UI pages working
- ✅ Navigation working
- ✅ Mock data for testing
- ⏳ Backend API not required for testing UI

**Next Step:**
- Build backend using API_ROUTES.md as spec
- Database schema matches types/index.ts
- Start backend on localhost:3000
- Real data automatically loads

**No changes needed to frontend** when backend is ready! 🚀
