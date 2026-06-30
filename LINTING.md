# Code Quality & Linting

## Status

The project uses **TypeScript strict mode** for type checking instead of traditional ESLint, which provides better code quality for modern Vue 3 + TypeScript projects.

## Type Checking

### In Your IDE
The best way to catch issues is through your IDE's TypeScript support:

#### **VS Code** (Recommended)
1. Install "Vetur" or "Vue - Official" extension
2. TypeScript errors appear as red squiggles in code
3. Hover over errors to see details
4. Problems panel shows all issues

#### **WebStorm/IntelliJ**
- Built-in TypeScript support
- Automatic code inspection
- Refactoring tools available

### Command Line
```bash
# Check TypeScript without building
npx tsc --noEmit

# Or through build
npm run build
```

## Code Quality Practices

Instead of ESLint rules, follow these best practices:

### 1. Type Safety ✅
```typescript
// ✅ Good - fully typed
interface User {
  id: string
  name: string
  role: 'admin' | 'user'
}

const user: User = { ... }

// ❌ Bad - implicit any
const user = { ... }
```

### 2. Naming Conventions ✅
```typescript
// ✅ Good
const userCount = ref(0)
const getStudentById = (id: string) => { ... }
const StudentCard = defineComponent({ ... })

// ❌ Bad
const uc = ref(0)
const get_student_by_id = (id: string) => { ... }
const student_card = defineComponent({ ... })
```

### 3. Component Organization ✅
```typescript
// ✅ Good structure
<template>
  <!-- template code -->
</template>

<script setup lang="ts">
// imports at top
// reactive state
// computed properties
// methods
// lifecycle hooks
</script>

<style scoped>
/* component styles */
</style>
```

### 4. Error Handling ✅
```typescript
// ✅ Good
try {
  const data = await api.get('/users')
  users.value = data
} catch (error: any) {
  error.value = error.message
  console.error('Failed to load users:', error)
}

// ❌ Bad
const data = await api.get('/users')
users.value = data
```

### 5. No Console Logs in Production ✅
```typescript
// ✅ Good
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// ❌ Bad
console.log('Debug info:', data) // left in production
```

## Pre-commit Hooks (Optional)

To add automated checking, install husky:

```bash
npm install --save-dev husky lint-staged

npx husky install

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run build
EOF
```

## Formatting

The project uses **Prettier** for consistent code formatting:

### Automatic Formatting
Most IDEs support format-on-save:

#### **VS Code**
1. Install "Prettier" extension
2. Set as default formatter
3. Enable "Format on Save" in settings

#### **WebStorm/IntelliJ**
1. Enable "Prettier" in Code Style settings
2. Set to reformat on save

### Manual Formatting
```bash
# Format all files (if ESLint properly configured)
npm run lint --fix
```

## Common Patterns

### ✅ Good Code

**Type-safe Store Usage**
```typescript
import { useStudentStore } from '@/stores/studentStore'
const studentStore = useStudentStore()

const students = computed(() => studentStore.students)
await studentStore.fetchStudents(schoolId)
```

**Error Handling**
```typescript
const loading = ref(false)
const error = ref('')

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    await store.fetch()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

**Vue Component Structure**
```vue
<template>
  <div class="my-component">
    <!-- template -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MyType } from '@/types'

const data = ref<MyType[]>([])
const isLoading = ref(false)

const filtered = computed(() => data.value.filter(...))

function handleClick() { ... }
</script>

<style scoped>
.my-component { ... }
</style>
```

## Issues to Watch For

### Red Flags in Code Review

1. **any types**
   ```typescript
   // ❌ Avoid
   const data: any = await api.get('/endpoint')
   
   // ✅ Prefer
   const data: User[] = await api.get('/endpoint')
   ```

2. **Missing error handling**
   ```typescript
   // ❌ Avoid
   await api.post('/save', data)
   
   // ✅ Prefer
   try {
     await api.post('/save', data)
   } catch (err) {
     console.error('Save failed:', err)
   }
   ```

3. **Unused variables**
   ```typescript
   // ❌ Avoid
   const userStore = useUserStore() // Never used
   
   // ✅ Delete unused imports
   ```

4. **Inconsistent naming**
   ```typescript
   // ❌ Avoid mixing styles
   const user_name = ref('')
   const phoneNumber = ref('')
   
   // ✅ Use camelCase consistently
   const userName = ref('')
   const phoneNumber = ref('')
   ```

## Best Practices

1. **Use strict TypeScript** - Catch errors early
2. **Import types explicitly** - Use `import type` for type-only imports
3. **Validate at boundaries** - User input, API responses
4. **Handle errors gracefully** - Show user-friendly messages
5. **Use meaningful names** - Code documents itself
6. **Keep functions small** - Single responsibility
7. **Prefer composition** - Over deep nesting
8. **Comment WHY not WHAT** - Code shows what, comment explains why

## IDE Recommendations

### Best Overall: VS Code
- Free and lightweight
- Excellent TypeScript support
- Great Vue extensions
- Active community

### Best for Large Projects: WebStorm
- Built-in TypeScript/Vue support
- Advanced refactoring
- Better for teams
- Requires license

### VS Code Extensions
```json
{
  "Vue - Official": "Official Vue support",
  "TypeScript Vue Plugin": "Vue template TypeScript",
  "Prettier - Code formatter": "Automatic formatting",
  "ESLint": "Error checking (optional)",
  "Volar": "Enhanced Vue support"
}
```

## Continuous Improvement

As you develop, gradually improve code quality:

1. **Start**: Write working code with proper types
2. **Review**: Check for errors using IDE
3. **Refactor**: Improve structure and clarity
4. **Document**: Add comments for complex logic
5. **Test**: Add tests for critical paths

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vue 3 Style Guide](https://vuejs.org/guide/scaling-up/sfc.html)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)

---

**Note**: The traditional ESLint setup requires additional dependencies (`@babel/eslint-parser`, `@typescript-eslint/parser`, etc.) which aren't strictly necessary when using TypeScript's built-in type checking. Modern Vue 3 projects with TypeScript achieve better code quality through IDE integration and strict TypeScript configuration.
