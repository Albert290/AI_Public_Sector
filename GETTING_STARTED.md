# Getting Started Guide

## Quick Start: Next Steps to Build the App

### Step 1: Initialize the Next.js Project

```bash
# In the AI_Public_Sector directory
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

Answer the prompts:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: Yes
- ✅ App Router: Yes
- ✅ Import alias: Yes (@/*)

### Step 2: Install Core Dependencies

```bash
# Install Prisma for database management
npm install prisma @prisma/client

# Install NextAuth.js for authentication
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs

# Install form handling and validation
npm install react-hook-form zod @hookform/resolvers

# Install shadcn/ui (for beautiful UI components)
npx shadcn-ui@latest init
```

### Step 3: Set Up Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file with DATABASE_URL
```

### Step 4: Configure Database

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_public_sector"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### Step 5: Create Database Schema

Replace `prisma/schema.prisma` content with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String
  password  String
  roleId    String
  role      Role       @relation(fields: [roleId], references: [id])
  progress  Progress[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([email])
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String
  isActive    Boolean  @default(false)
  icon        String?
  lessons     Lesson[]
  users       User[]
  createdAt   DateTime @default(now())
}

model Lesson {
  id          String     @id @default(cuid())
  title       String
  description String
  content     String     @db.Text
  order       Int
  duration    Int?
  roleId      String
  role        Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  progress    Progress[]
  createdAt   DateTime   @default(now())

  @@index([roleId, order])
}

model Progress {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId    String
  lesson      Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  completed   Boolean   @default(false)
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId, lessonId])
  @@index([userId])
}
```

### Step 6: Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# This creates the database tables
```

### Step 7: Create Seed Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const secretary = await prisma.role.upsert({
    where: { slug: 'secretary' },
    update: {},
    create: {
      name: 'Secretary',
      slug: 'secretary',
      description: 'Administrative support and office management',
      isActive: true,
      icon: '📋',
    },
  });

  const adminOfficer = await prisma.role.upsert({
    where: { slug: 'admin-officer' },
    update: {},
    create: {
      name: 'Administrative Officer',
      slug: 'admin-officer',
      description: 'Administrative operations and coordination',
      isActive: false,
      icon: '👔',
    },
  });

  const dataAnalyst = await prisma.role.upsert({
    where: { slug: 'data-analyst' },
    update: {},
    create: {
      name: 'Data Analyst',
      slug: 'data-analyst',
      description: 'Data analysis and reporting',
      isActive: false,
      icon: '📊',
    },
  });

  const hrManager = await prisma.role.upsert({
    where: { slug: 'hr-manager' },
    update: {},
    create: {
      name: 'HR Manager',
      slug: 'hr-manager',
      description: 'Human resources management',
      isActive: false,
      icon: '👥',
    },
  });

  const policyAdvisor = await prisma.role.upsert({
    where: { slug: 'policy-advisor' },
    update: {},
    create: {
      name: 'Policy Advisor',
      slug: 'policy-advisor',
      description: 'Policy development and analysis',
      isActive: false,
      icon: '📜',
    },
  });

  // Create lessons for Secretary role
  const lessons = [
    {
      title: 'Introduction to AI Tools',
      description: 'Learn the basics of AI and how it can help in your daily tasks',
      content: 'Welcome to AI tools training...',
      order: 1,
      duration: 15,
    },
    {
      title: 'Email Management with AI',
      description: 'Use AI to organize, prioritize, and draft emails efficiently',
      content: 'AI can revolutionize email management...',
      order: 2,
      duration: 20,
    },
    {
      title: 'Calendar Optimization',
      description: 'Smart scheduling and meeting management with AI',
      content: 'Learn to optimize your calendar...',
      order: 3,
      duration: 18,
    },
    {
      title: 'Document Summarization',
      description: 'Quickly understand long documents using AI summarization',
      content: 'AI document summarization...',
      order: 4,
      duration: 25,
    },
    {
      title: 'Meeting Transcription Tools',
      description: 'Automate note-taking and action items from meetings',
      content: 'Meeting transcription with AI...',
      order: 5,
      duration: 22,
    },
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: {
        roleId_order: {
          roleId: secretary.id,
          order: lesson.order,
        },
      },
      update: {},
      create: {
        ...lesson,
        roleId: secretary.id,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Update `package.json` to add seed script:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Install ts-node:
```bash
npm install -D ts-node
```

Run seed:
```bash
npx prisma db seed
```

### Step 8: Project Structure Setup

Create the basic folder structure:

```bash
mkdir -p src/components/{ui,auth,dashboard,landing}
mkdir -p src/lib
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/app/{api,\(auth\),\(protected\)}
```

## Development Workflow

### Daily Development
```bash
# Start development server
npm run dev

# In another terminal, watch Prisma schema changes
npx prisma studio  # Visual database browser
```

### Database Changes
```bash
# After modifying schema.prisma
npx prisma migrate dev --name description_of_changes
npx prisma generate
```

### Adding shadcn/ui Components
```bash
# Add components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
```

## Architecture Decisions

### Why Next.js?
- ✅ Full-stack framework (frontend + backend API)
- ✅ Perfect for Vercel deployment
- ✅ Server-side rendering for SEO
- ✅ File-based routing
- ✅ Built-in API routes

### Why Prisma?
- ✅ Type-safe database access
- ✅ Easy migrations
- ✅ Works with PostgreSQL and Neon
- ✅ Great developer experience

### Why NextAuth.js?
- ✅ Industry standard for Next.js authentication
- ✅ Secure session management
- ✅ Easy to extend
- ✅ Supports multiple providers

### Why Tailwind CSS?
- ✅ Rapid development
- ✅ Consistent design system
- ✅ Small production bundle
- ✅ Works great with shadcn/ui

## Key Features to Implement First

1. **Landing Page**: Explain the platform (1-2 days)
2. **Authentication**: Sign up + Login (2-3 days)
3. **Role Selection**: During signup (1 day)
4. **Secretary Dashboard**: Main learning interface (2-3 days)
5. **Lesson Viewer**: Display content (2 days)
6. **Progress Tracking**: Mark lessons complete (1-2 days)

## Tips for Success

- 🎯 Start with the Secretary role completely before adding others
- 📝 Keep content simple and practical
- 🎨 Use shadcn/ui components for consistent design
- 🔒 Test authentication thoroughly
- 📱 Make it mobile-responsive from the start
- ⚡ Use Next.js Image component for optimization
- 🐛 Test on different browsers

## Common Issues & Solutions

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### Prisma Client Not Found
- Run: `npx prisma generate`

### Build Errors on Vercel
- Ensure all environment variables are set
- Check build logs for specific errors
- Run `npm run build` locally first

## Next: Start Building!

Begin with **Milestone 1** from the README and work through each milestone systematically. Focus on getting a working MVP with the Secretary role before expanding to other features.

Good luck! 🚀
