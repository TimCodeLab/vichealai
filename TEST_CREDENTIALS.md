# techocam Test Credentials

## Common Details
- **School Code**: `SCHOOL001`
- **Password**: `test123` (for all accounts)

## Test Accounts by Role

### 1. **Super Admin** 👑
```
Email: superadmin@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Full access to all features across all schools

### 2. **School Administrator** 🏫
```
Email: admin@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Manage school, users, academics, reports

### 3. **Vice Principal** 👔
```
Email: vp@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Monitor students, teachers, attendance, exams

### 4. **Teacher** 👨‍🏫
```
Email: teacher@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Manage classes, attendance, homework, grades

### 5. **Student** 👨‍🎓
```
Email: student@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: View classes, homework, grades, attendance

### 6. **Parent** 👨‍👩‍👧
```
Email: parent@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Monitor child's attendance, grades, homework

### 7. **Accountant** 💰
```
Email: accountant@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Manage fees, invoices, payments, financial reports

### 8. **Librarian** 📖
```
Email: librarian@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Manage books, borrowing, returns, fines

### 9. **Receptionist** 📞
```
Email: receptionist@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Announcements, communication, general inquiries

### 10. **Security** 🔒
```
Email: security@school.com
Password: test123
School Code: SCHOOL001
```
**Permissions**: Access logs, security monitoring

---

## How to Test

1. **Visit the login page** at http://localhost:8100/login
2. **Select a role** and copy the email from the list above
3. **Enter credentials**:
   - Email: (from the list)
   - Password: `test123`
   - School Code: `SCHOOL001`
4. **Click Login** to access the dashboard

## Testing Tips

### Feature Testing by Role
- **Admin Account**: Test school settings, user management, reports
- **Teacher Account**: Test attendance marking, homework creation
- **Student Account**: Test viewing grades, homework submissions
- **Parent Account**: Test monitoring child's progress
- **Accountant Account**: Test finance module, fee tracking

### Navigation Testing
All authenticated users can navigate to:
- 📊 Dashboard - Role-specific view
- 👥 Students - Student management
- 👨‍🏫 Teachers - Teacher management
- 📝 Attendance - Mark and view attendance
- 📚 Classes - View class structure
- 📖 Homework - Create/submit homework
- 📋 Exams - Exam scheduling and grades
- 💵 Finance - Fee and payment tracking
- 📚 Library - Book management
- 📊 Reports - Generate various reports
- ⚙️ Settings - User preferences

### Test Data
All test accounts are pre-populated with:
- School ID: `school_1`
- Phone: `0123456789`
- Status: Active
- School: SCHOOL001

### No Backend Required
- Test credentials work with **localStorage only**
- No internet connection needed for testing
- All data persists in browser cache
- Clear browser data to reset

---

## Switching Users

To switch between accounts:
1. Click **Logout** in Settings
2. Login with a different email
3. Dashboard will update for the new role

## Notes for Development

When backend is ready:
1. Update `src/pages/auth/LoginPage.vue`
2. Uncomment the API call in `handleLogin()`
3. Remove test credentials logic
4. Credentials will be validated against backend

---

## Common Issues

**Q: I'm logged in but see a blank dashboard**
- A: Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors

**Q: Role-specific features aren't showing**
- A: Different roles have different permissions
- Some features only show for specific roles
- Check the dashboard for your role

**Q: Credentials not working**
- A: Make sure School Code is exactly `SCHOOL001`
- Password is case-sensitive: `test123`
- Email must be exactly as shown above

---

## Test Workflow Example

```
1. Login as Teacher
   📧 teacher@school.com / test123 / SCHOOL001
   
2. View Dashboard
   ✓ See teacher-specific stats
   ✓ See quick action buttons
   
3. Test Attendance
   📋 Mark attendance for a class
   ✓ Select students
   ✓ Submit attendance
   
4. Test Homework
   📝 Create homework
   ✓ Add title and due date
   ✓ Publish to class
   
5. Logout and Switch Role
   🔄 Login as Student
   ✓ See assigned homework
   ✓ View grades and attendance
   
6. Login as Parent
   👨‍👩‍👧 View child's progress
   ✓ Check attendance
   ✓ Monitor homework
```

---

**Status**: Ready for full testing! 🚀

All test accounts work immediately without backend configuration.
