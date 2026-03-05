# Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │  Landing   │  │    Auth    │  │  Role Dashboard    │   │
│  │    Page    │  │   Pages    │  │    (Secretary)     │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Routes                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │ /api/auth  │  │ /api/users │  │  /api/lessons      │   │
│  │ (NextAuth) │  │            │  │                    │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Prisma ORM                              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL / Neon Database                      │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌──────────────┐     │
│  │ Users  │  │ Roles  │  │Lessons │  │   Progress   │     │
│  └────────┘  └────────┘  └────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Application Flow

### 1. User Journey Flow

```
Landing Page
     │
     ├─→ About Section (What we do)
     ├─→ Features Overview
     ├─→ Role Categories Display
     └─→ CTA to Sign Up
          │
          ▼
     Sign Up Page
          │
          ├─→ Enter email, name, password
          ├─→ Select Job Category (Role)
          │   └─→ Secretary (clickable)
          │   └─→ Other roles (disabled, "Coming Soon")
          └─→ Submit
               │
               ▼
     Authentication
          │
          └─→ Create user in database
               │
               ▼
     Redirect to Dashboard
          │
          └─→ /dashboard/secretary
               │
               ├─→ Welcome Section
               ├─→ Learning Progress
               ├─→ Lessons List
               └─→ Start Learning
                    │
                    ▼
               Lesson Viewer
                    │
                    ├─→ Lesson Content
                    ├─→ Interactive Elements
                    ├─→ Mark as Complete
                    └─→ Next Lesson
```

### 2. Authentication Flow

```
┌──────────────┐
│  User Action │
└──────┬───────┘
       │
       ├─→ Sign Up
       │    │
       │    ├─→ Hash password (bcrypt)
       │    ├─→ Create user record
       │    ├─→ Create session (JWT)
       │    └─→ Redirect to dashboard
       │
       └─→ Login
            │
            ├─→ Verify credentials
            ├─→ Create session (JWT)
            └─→ Redirect to dashboard
```

### 3. Data Flow

```
Component Request
       │
       ▼
API Route Handler
       │
       ├─→ Validate session (NextAuth)
       ├─→ Authorize request
       │
       ▼
Prisma Query
       │
       ▼
Database (PostgreSQL/Neon)
       │
       ▼
Return Data
       │
       ▼
Component Render
```

## Detailed File Structure

```
AI_Public_Sector/
│
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # Root layout (providers, fonts)
│   │   ├── page.tsx                      # Landing page
│   │   ├── globals.css                   # Global styles
│   │   │
│   │   ├── (auth)/                       # Auth route group (shared layout)
│   │   │   ├── layout.tsx               # Auth pages layout (centered card)
│   │   │   ├── login/
│   │   │   │   └── page.tsx             # Login page
│   │   │   └── signup/
│   │   │       └── page.tsx             # Signup with role selection
│   │   │
│   │   ├── (protected)/                  # Protected routes (require auth)
│   │   │   ├── layout.tsx               # Protected layout (auth check)
│   │   │   └── dashboard/
│   │   │       └── [role]/              # Dynamic role-based dashboards
│   │   │           ├── page.tsx         # Dashboard overview
│   │   │           └── lesson/
│   │   │               └── [id]/
│   │   │                   └── page.tsx # Individual lesson viewer
│   │   │
│   │   └── api/                          # API routes
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts         # NextAuth configuration
│   │       ├── users/
│   │       │   ├── route.ts             # GET current user
│   │       │   └── [id]/
│   │       │       └── route.ts         # GET/PATCH user by ID
│   │       ├── roles/
│   │       │   └── route.ts             # GET all roles
│   │       ├── lessons/
│   │       │   ├── route.ts             # GET lessons by role
│   │       │   └── [id]/
│   │       │       └── route.ts         # GET specific lesson
│   │       └── progress/
│   │           ├── route.ts             # POST update progress
│   │           └── [userId]/
│   │               └── route.ts         # GET user progress
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── form.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   └── ...
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx           # Login form component
│   │   │   ├── SignupForm.tsx          # Signup form component
│   │   │   └── RoleSelector.tsx        # Role selection component
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Header.tsx              # Dashboard header
│   │   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   │   ├── ProgressOverview.tsx    # Progress statistics
│   │   │   ├── LessonCard.tsx          # Individual lesson card
│   │   │   └── LessonList.tsx          # List of lessons
│   │   │
│   │   ├── landing/
│   │   │   ├── Hero.tsx                # Hero section
│   │   │   ├── Features.tsx            # Features showcase
│   │   │   ├── RolesShowcase.tsx       # Display all roles
│   │   │   └── CTA.tsx                 # Call-to-action section
│   │   │
│   │   └── lesson/
│   │       ├── LessonContent.tsx       # Lesson content renderer
│   │       ├── LessonNavigation.tsx    # Previous/Next navigation
│   │       └── CompleteButton.tsx      # Mark as complete
│   │
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   ├── auth.ts                     # NextAuth configuration
│   │   ├── utils.ts                    # Utility functions (cn, etc.)
│   │   └── validations.ts              # Zod schemas for validation
│   │
│   ├── types/
│   │   ├── index.ts                    # Shared TypeScript types
│   │   ├── auth.ts                     # Auth-related types
│   │   └── lesson.ts                   # Lesson-related types
│   │
│   ├── hooks/
│   │   ├── useUser.ts                  # Current user hook
│   │   ├── useLessons.ts               # Fetch lessons hook
│   │   └── useProgress.ts              # Progress tracking hook
│   │
│   └── styles/
│       └── globals.css                 # Global CSS (Tailwind directives)
│
├── prisma/
│   ├── schema.prisma                   # Database schema
│   ├── migrations/                     # Migration history
│   │   └── 20260305_init/
│   │       └── migration.sql
│   └── seed.ts                         # Seed data script
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── hero-image.png
│   └── favicon.ico
│
├── .env.example                        # Environment variables template
├── .env.local                          # Local environment (gitignored)
├── .gitignore
├── next.config.js                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
├── postcss.config.js                   # PostCSS configuration
├── package.json
├── README.md
├── GETTING_STARTED.md
└── ARCHITECTURE.md
```

## Key Components Breakdown

### Authentication (`src/lib/auth.ts`)
```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      // Configuration here
    })
  ],
  callbacks: {
    // JWT and session callbacks
  }
})
```

### Prisma Client (`src/lib/prisma.ts`)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

### API Route Example (`src/app/api/lessons/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lessons = await prisma.lesson.findMany({
    where: { roleId: session.user.roleId },
    orderBy: { order: 'asc' }
  })

  return NextResponse.json(lessons)
}
```

## Security Considerations

### 1. Authentication
- ✅ Password hashing with bcrypt (10+ rounds)
- ✅ JWT tokens for sessions
- ✅ HTTP-only cookies
- ✅ Secure cookie flags in production

### 2. Authorization
- ✅ Role-based access control
- ✅ Server-side session validation
- ✅ Protected API routes
- ✅ User can only access their role's content

### 3. Data Validation
- ✅ Zod schemas for input validation
- ✅ Sanitize user inputs
- ✅ Prevent SQL injection (Prisma handles this)
- ✅ XSS protection (React handles this)

### 4. Environment Variables
- ✅ Never commit .env files
- ✅ Use strong secrets
- ✅ Different keys for dev/prod

## Performance Optimizations

### 1. Database
- ✅ Database indexes on frequently queried fields
- ✅ Connection pooling with Prisma
- ✅ Efficient queries (avoid N+1 problems)

### 2. Frontend
- ✅ Next.js automatic code splitting
- ✅ Image optimization with next/image
- ✅ Static page generation where possible
- ✅ Dynamic imports for heavy components

### 3. Caching
- ✅ Next.js caching strategies
- ✅ SWR or React Query for client-side caching
- ✅ Vercel Edge caching

## Deployment Architecture (Vercel)

```
User Request
     │
     ▼
Vercel Edge Network (CDN)
     │
     ├─→ Static Assets (cached)
     │
     ▼
Next.js Server (Serverless)
     │
     ├─→ SSR Pages
     ├─→ API Routes (Serverless Functions)
     │
     ▼
Neon Database (Postgres)
```

### Vercel Features Used
- **Edge Network**: Global CDN for fast content delivery
- **Serverless Functions**: Auto-scaling API routes
- **Preview Deployments**: Every PR gets a preview URL
- **Environment Variables**: Secure config management
- **Analytics**: Performance monitoring

### Migration to Neon
1. Create Neon project
2. Copy connection string
3. Update DATABASE_URL in Vercel
4. Run migrations: `npx prisma migrate deploy`
5. Zero downtime migration possible

## Scalability Considerations

### Phase 1: MVP (0-100 users)
- Single database instance
- Basic Vercel plan
- No caching needed

### Phase 2: Growth (100-1000 users)
- Database connection pooling
- Client-side caching (SWR)
- Vercel Pro plan

### Phase 3: Scale (1000+ users)
- Multiple database read replicas
- Redis for session storage
- CDN for static content
- Advanced monitoring

## Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics**: Page performance
- **Sentry**: Error tracking
- **PostHog**: User analytics
- **Prisma Pulse**: Database monitoring (optional)

## Future Enhancements

### Technical Improvements
- [ ] Add Redis for caching
- [ ] Implement search functionality (Algolia or ElasticSearch)
- [ ] Add real-time features (WebSockets)
- [ ] Implement AI chatbot for support
- [ ] Add video content support
- [ ] Progressive Web App (PWA)
- [ ] Multi-language support (i18n)

### Feature Additions
- [ ] Admin dashboard
- [ ] Content management system
- [ ] Certificate generation
- [ ] Gamification (badges, points)
- [ ] Social features (comments, forums)
- [ ] Mobile apps (React Native)

---

This architecture provides a solid foundation that can scale from MVP to thousands of users while maintaining performance and security.
