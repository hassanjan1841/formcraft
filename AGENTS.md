# Agent Guidelines for formcraft-implementation

## Project Overview
- **Framework**: Next.js 16.2 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth v5 (credentials provider)
- **Styling**: Tailwind CSS v4 with postcss
- **Form Handling**: React Hook Form + Zod validation
- **UI Notifications**: Sonner (toast notifications)

## Build & Development Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint (includes TypeScript checks)
```

### Running a Single Test
No test framework is currently configured. To add tests, install Vitest or Jest:
```bash
npm install -D vitest @vitejs/plugin-react
```

## Code Style Guidelines

### ESLint Rules
- **No `any` types**: Always specify proper types; avoid `any`
- **No unused variables**: Remove or prefix with underscore

### File Organization
- Use the `@/*` alias for imports from `src/` directory
- Server components by default; add `'use client'` only when needed
- Group related components in feature folders (e.g., `components/builder/*`, `components/ui/*`)

### TypeScript Conventions
- Enable strict mode (already configured in `tsconfig.json`)
- Use explicit return types for utility functions and API routes
- Prefer interfaces over types for object shapes
- Use `as` type assertions sparingly; prefer Zod validation for runtime type safety

### Naming Conventions
- **Components**: PascalCase (e.g., `FormCard.tsx`, `PropertiesPanel.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useConfirmDialog`)
- **Utilities**: PascalCase for exported functions (e.g., `toast.ts`)
- **Files**: kebab-case for non-component files (e.g., `auth.ts`, `prisma.ts`)

### Import Order (recommended)
1. Built-in Node/Next imports
2. External packages (react, next-auth, etc.)
3. Path alias imports (`@/lib/*`, `@/components/*`)
4. Relative imports (last resort)

```typescript
// Example import order
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FormCard } from '@/components/FormCard'
```

### Component Patterns
- Use function components with explicit Props interfaces
- Keep client components at leaf nodes; prefer Server Components
- Use React Server Actions for mutations where applicable

### Error Handling
- Return `NextResponse.json({ error: '...' }, { status: 401 })` for API errors
- Use try/catch with meaningful error messages in database operations
- Display toast errors to users via `toast.error()` from `@/lib/toast`

### Database (Prisma)
- Run `npx prisma generate` after schema changes (already in postinstall)
- Use Prisma client via singleton pattern in `src/lib/prisma.ts`
- Define relations with `onDelete: Cascade` for cleanup

### Styling
- Use Tailwind CSS utility classes
- Follow the existing color palette (slate for neutrals, blue for primary actions)
- Use `hover:`, `focus:`, and transition utilities for interactive states

## Database Schema

Models defined in `prisma/schema.prisma`:
- **User**: id, email, passwordHash, createdAt, updatedAt
- **Form**: id, userId, title, schema (JSON), published, createdAt, updatedAt
- **Submission**: id, formId, data (JSON), ipAddress, createdAt

## Environment Variables
Create a `.env` file with:
```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
```

## Common Patterns

### API Route Handler
```typescript
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... logic
}
```

### Client Component
```typescript
'use client'
import toast from '@/lib/toast'

export function MyComponent({ ... }: Props) {
  // ... implementation
}
```

### Form Validation with Zod
```typescript
import { z } from 'zod'

const formSchema = z.object({
  title: z.string().min(1),
  email: z.string().email(),
})
```

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes (login, signup)
│   ├── api/              # API routes
│   ├── dashboard/        # Protected dashboard
│   ├── f/[id]/           # Public form view
│   └── page.tsx          # Landing page
├── components/
│   ├── builder/          # Form builder components
│   ├── dashboard/        # Dashboard components
│   ├── form/             # Form rendering
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and configs
└── types/                 # TypeScript type definitions
```

## Key Libraries

| Library | Purpose |
|---------|---------|
| next-auth | Authentication (credentials provider) |
| prisma | Database ORM (PostgreSQL) |
| react-hook-form | Form state management |
| zod | Schema validation |
| sonner | Toast notifications |
| tailwindcss | Styling (v4) |

## API Routes Reference

- `GET /api/forms` - List user's forms
- `POST /api/forms` - Create new form
- `GET /api/forms/[id]` - Get form details
- `PUT /api/forms/[id]` - Update form
- `DELETE /api/forms/[id]` - Delete form
- `POST /api/forms/[id]/submit` - Submit form response
- `GET /api/forms/[id]/responses` - List form submissions

## Important Notes

- Authentication uses NextAuth v5 with credentials provider
- Forms store their schema as JSON in the database
- The public form URL is `/f/[id]` (not in dashboard)
- Prisma runs `postinstall` to generate client after npm install