# Offline/Online Mode Guide

## Overview

VICHEALAI now has a smart offline/online toggle in the header that allows users to work offline while showing clear limitations and error messages when features require internet.

## Features

### 1. **Status Indicator in Header**
Shows current connectivity status:
- ✅ **Online** - Green indicator, all features available
- 📵 **Offline Mode** - Yellow indicator, limited features
- 🌐 **No Internet** - Red indicator, no backend access

### 2. **Toggle Button**
- Click the WiFi/WiFi-Off icon in header
- Switch between Online and Offline modes
- Status immediately updates

### 3. **Status Information Modal**
- Click on status indicator to see:
  - Current mode and description
  - Available features for current mode
  - Features requiring online
  - Quick toggle button

## What Users Can Do

### 📵 Offline Mode
Available features (no internet needed):
- ✅ View Mock Classes
- ✅ View Mock Students
- ✅ View Mock Teachers
- ✅ Change Settings
- ✅ View Profile
- ✅ Logout

### ✅ Online Mode
All features available:
- ✅ View & Create/Edit Classes
- ✅ View & Create/Edit Students
- ✅ View & Create/Edit Teachers
- ✅ Create Homework
- ✅ Record Attendance
- ✅ Real-time Data Sync
- ✅ All offline features

### 🌐 No Internet (Auto-detected)
- App automatically detects internet loss
- Same as offline mode for feature access
- Status shows "No Internet"

## Error Messages

### Offline Mode Error
```
⚠️ "Create/Edit Students" requires online mode. 
Please switch to online to access this feature.
```
- **Context**: User tries to create data while in offline mode
- **Action**: User must click header toggle to switch to online

### No Internet Error
```
🌐 No internet connection. 
Please check your network connection to use "Create/Edit Students".
```
- **Context**: No internet connection detected
- **Action**: User should check their network

### Server Connection Error
```
❌ Unable to connect to server. 
Please try again later.
```
- **Context**: Server is down or unreachable
- **Action**: User can use mock data or try again later

## How It Works

### User Journey

**Scenario 1: User wants to work offline**
```
1. User clicks WiFi icon in header
   ↓
2. Header shows "Offline Mode" (yellow indicator)
   ↓
3. Status bar appears saying "Offline Mode: Limited Features"
   ↓
4. User can view mock data, change settings
5. If user tries to create data:
   ↓
6. Toast shows: "Requires online mode. Please switch to online."
   ↓
7. User clicks WiFi icon again to switch back to online
   ↓
8. Feature is now available
```

**Scenario 2: Internet drops unexpectedly**
```
1. User is browsing online
2. Internet connection drops
   ↓
3. Header automatically shows "No Internet" (red indicator)
   ↓
4. Status bar explains no internet detected
   ↓
5. User can continue viewing offline data
6. If they try to refresh or create data:
   ↓
7. Toast shows: "No internet connection. Check your network."
   ↓
8. When internet returns, header goes back to "Online"
```

**Scenario 3: User switches to online and backend is running**
```
1. User clicks toggle to switch to online
2. If backend is running on localhost:3000
   ↓
3. Real data loads automatically
4. All features become available
5. Data syncs properly
```

## Status Messages Explained

### Header Status Bar
- **Success (✅ Online)**: All systems ready
- **Warning (📵 Offline Mode)**: User deliberately chose offline, click to switch
- **Danger (🌐 No Internet)**: Network connection issue detected

### Toast Notifications
Appear when user tries to access offline-only features:
- **Offline Mode Warning**: Yellow, clear action needed
- **No Internet Warning**: Yellow, network issue
- **Server Error**: Red, temporary backend issue

## Implementation Details

### Offline Mode Store
Location: `src/stores/offlineModeStore.ts`

Properties:
- `isOfflineMode` - User toggle state
- `hasInternet` - Actual internet connectivity
- `canUseAPI` - Can access backend (online + has internet)
- `status` - Current status string

Methods:
- `toggleOfflineMode()` - Switch mode
- `setOfflineMode(bool)` - Force offline/online
- `getErrorMessage(action)` - Get appropriate error message

### Auto-Detection
```javascript
// Automatically detects internet changes
window.addEventListener('online', () => {
  hasInternet.value = true
})

window.addEventListener('offline', () => {
  hasInternet.value = false
})
```

## For Developers

### Adding Offline Support to New Features

1. **Store Function**
```typescript
async function fetchData(id: string) {
  try {
    const data = await api.get(`/endpoint/${id}`)
    data.value = data
  } catch (err: any) {
    if (err.isOfflineError) {
      await showWarning(err.message) // Show to user
    }
    // Fall back to mock data
    data.value = getMockData()
  }
}
```

2. **API Checks Offline Mode Automatically**
```typescript
// No need to check manually - API service does it
const response = await api.get('/endpoint')
// Throws error with isOfflineError flag if offline
```

3. **Show Toast on Error**
```typescript
import { useAppToast } from '@/utils/toastUtils'

const { showWarning, showError } = useAppToast()

// In catch block:
if (error.isOfflineError) {
  await showWarning(error.message)
}
```

## Testing Offline Features

### Test Offline Mode
1. Click WiFi icon in header
2. Header shows "📵 Offline Mode"
3. Try to create/edit data
4. See warning: "Requires online mode"
5. Click header status to see available features
6. Click toggle to go back online

### Test No Internet
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Header shows "🌐 No Internet"
5. Similar behavior to offline mode
6. Uncheck "Offline" to restore internet

### Test with Backend
1. Start backend on `http://localhost:3000`
2. Switch to online mode
3. Real data loads (no more mock data)
4. All features available
5. Data syncs properly

## FAQ

**Q: Why see mock data in offline mode?**
A: Provides realistic testing experience without backend. Helps test UI before backend is ready.

**Q: Can users save data offline?**
A: In offline mode, data uses localStorage. When online, it syncs to server (when backend is ready).

**Q: What happens if internet drops mid-action?**
A: API call fails with appropriate error message. User can retry when internet returns.

**Q: Does offline mode disable all API calls?**
A: Yes. No API calls made when in offline mode. Prevents errors and confusion.

**Q: Can I force users into offline mode?**
A: Developers can call: `offlineModeStore.setOfflineMode(true)`

**Q: How do error messages appear?**
A: As toast notifications at top of screen, auto-dismiss in 3-4 seconds.

## Best Practices

✅ **Do**
- Always show appropriate error messages
- Test both offline and online modes
- Use mock data for development
- Auto-detect internet changes
- Save to localStorage in offline mode

❌ **Don't**
- Make API calls in offline mode
- Confuse user with technical errors
- Force a mode on users
- Lose user data due to offline
- Ignore internet connection changes

## Examples

### Complete Feature with Offline Support
```vue
<template>
  <button @click="loadStudents" :disabled="loading">
    Load Students
  </button>
  <div v-if="students.length">
    <p v-for="student in students" :key="student.id">
      {{ student.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useStudentStore } from '@/stores/studentStore'
import { useOfflineModeStore } from '@/stores/offlineModeStore'

const studentStore = useStudentStore()
const offlineModeStore = useOfflineModeStore()

async function loadStudents() {
  // Store handles offline mode internally
  // Shows mock data if offline
  // Shows real data if online
  await studentStore.fetchStudents('school_1')
}
</script>
```

## Future Improvements

Potential enhancements:
- [ ] Persistent offline cache/sync queue
- [ ] Conflict resolution when going back online
- [ ] Sync progress indicator
- [ ] Offline-first service worker
- [ ] Local data encryption
- [ ] Backup/restore functionality

---

**Status**: Feature complete and tested! 🚀
