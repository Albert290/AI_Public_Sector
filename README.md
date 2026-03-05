# AI Training Platform for Public Servants

A web application designed to teach public servants how to use AI tools efficiently based on their specific job roles and responsibilities.

## 🎯 Project Overview

This platform provides role-based AI training for public sector employees. Users select their job category during signup and receive personalized learning content tailored to their specific role and responsibilities.

### Current Status
- **Phase**: Planning & Initial Development
- **Active Roles**: Secretary (fully functional)
- **Coming Soon**: Administrative Officer, Data Analyst, HR Manager, Policy Advisor, IT Support

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context API / Zustand (for complex state)
- **Form Handling**: React Hook Form + Zod validation

### Backend
- **API**: Next.js API Routes (Serverless Functions)
- **Runtime**: Node.js
- **Language**: TypeScript

### Database
- **Current**: PostgreSQL
- **Future**: Neon (Postgres-compatible serverless)
- **ORM**: Prisma
- **Migrations**: Prisma Migrate

### Authentication
- **Solution**: NextAuth.js v5 (Auth.js)
- **Strategy**: Credentials-based (email/password)
- **Session**: JWT tokens

### Deployment
- **Platform**: Vercel
- **CI/CD**: Automatic deployments via GitHub integration
- **Environment**: Production, Preview, Development

### Development Tools
- **Package Manager**: pnpm (or npm/yarn)
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky (optional)
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
AI_Public_Sector/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (protected)/         # Protected routes
│   │   │   └── dashboard/
│   │   │       └── [role]/      # Dynamic role-based dashboards
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── users/           # User management
│   │   │   └── lessons/         # Learning content
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── auth/                # Auth-related components
│   │   ├── dashboard/           # Dashboard components
│   │   └── landing/             # Landing page components
│   ├── lib/                     # Utility libraries
│   │   ├── prisma.ts           # Prisma client
│   │   ├── auth.ts             # Auth configuration
│   │   └── utils.ts            # Helper functions
│   ├── types/                   # TypeScript types
│   ├── hooks/                   # Custom React hooks
│   └── styles/                  # Global styles
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Seed data
├── public/                      # Static assets
├── .env.example                # Environment variables template
├── .env.local                  # Local environment (gitignored)
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
└── README.md
```

## 🗄 Database Schema (Initial)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String    // Hashed
  role          Role      @relation(fields: [roleId], references: [id])
  roleId        String
  progress      Progress[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Role {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  description   String
  isActive      Boolean   @default(false)
  lessons       Lesson[]
  users         User[]
}

model Lesson {
  id            String    @id @default(cuid())
  title         String
  description   String
  content       String    @db.Text
  order         Int
  roleId        String
  role          Role      @relation(fields: [roleId], references: [id])
  progress      Progress[]
}

model Progress {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  lessonId      String
  lesson        Lesson    @relation(fields: [lessonId], references: [id])
  completed     Boolean   @default(false)
  completedAt   DateTime?
  createdAt     DateTime  @default(now())
  
  @@unique([userId, lessonId])
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AI_Public_Sector

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
pnpm prisma generate
pnpm prisma migrate dev

# Seed initial data
pnpm prisma db seed

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 🎓 User Journey

1. **Landing Page**: Visitor learns about the platform and its benefits
2. **Sign Up**: User creates account and selects job category
3. **Role Selection**: Choose from available roles (currently: Secretary)
4. **Dashboard**: Personalized learning dashboard based on role
5. **Lessons**: Interactive AI tool training modules
6. **Progress Tracking**: Monitor completion and achievements

## 📋 Development Milestones

### Milestone 1: Project Setup & Foundation (Week 1)
- [x] Define tech stack and architecture
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS and shadcn/ui
- [ ] Configure PostgreSQL database
- [ ] Set up Prisma ORM
- [ ] Create initial database schema
- [ ] Configure environment variables
- [ ] Set up Git repository

### Milestone 2: Landing Page & Authentication (Week 2)
- [ ] Design and implement landing page
  - [ ] Hero section
  - [ ] Features overview
  - [ ] Role categories display
  - [ ] Call-to-action sections
- [ ] Implement authentication system
  - [ ] NextAuth.js configuration
  - [ ] Sign up flow
  - [ ] Login flow
  - [ ] Password hashing (bcrypt)
- [ ] Create role selection component
  - [ ] Display all roles
  - [ ] Enable only "Secretary" role
  - [ ] Show "Coming Soon" for other roles

### Milestone 3: Secretary Dashboard & Core Features (Week 3)
- [ ] Build secretary-specific dashboard
  - [ ] Overview/welcome section
  - [ ] Learning modules list
  - [ ] Progress indicators
- [ ] Create lesson content structure
  - [ ] Lesson viewer component
  - [ ] Navigation between lessons
  - [ ] Content formatting (text, images, videos)
- [ ] Implement progress tracking
  - [ ] Mark lessons as complete
  - [ ] Update progress in database
  - [ ] Display completion percentage

### Milestone 4: Content & Learning Modules (Week 4)
- [ ] Develop Secretary role content
  - [ ] Introduction to AI tools
  - [ ] Email management with AI
  - [ ] Calendar optimization
  - [ ] Document summarization
  - [ ] Meeting transcription tools
  - [ ] Task prioritization with AI
- [ ] Create interactive elements
  - [ ] Quizzes/knowledge checks
  - [ ] Practical exercises
  - [ ] AI tool demonstrations

### Milestone 5: Testing & Refinement (Week 5)
- [ ] User testing with secretary role
- [ ] Bug fixes and optimizations
- [ ] Responsive design improvements
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Add loading states and error handling

### Milestone 6: Deployment & Migration (Week 6)
- [ ] Deploy to Vercel
  - [ ] Configure production environment
  - [ ] Set up custom domain (if applicable)
- [ ] Migrate from PostgreSQL to Neon
  - [ ] Create Neon project
  - [ ] Update connection string
  - [ ] Test database connectivity
  - [ ] Run migrations on Neon
- [ ] Set up monitoring and analytics
- [ ] Create user documentation

### Future Milestones
- **Milestone 7**: Add Administrative Officer role
- **Milestone 8**: Add Data Analyst role
- **Milestone 9**: Add HR Manager role
- **Milestone 10**: Add Policy Advisor role
- **Milestone 11**: Admin dashboard for content management
- **Milestone 12**: Certificate generation upon completion
- **Milestone 13**: Community features (forums, peer learning)

## 🔐 Environment Variables

Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_public_sector"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: Analytics, etc.
```

## 🚢 Deployment on Vercel

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

For Neon database:
1. Create project on Neon.tech
2. Copy connection string
3. Update `DATABASE_URL` in Vercel environment variables
4. Redeploy

## 🤝 Contributing

(Add contribution guidelines as project grows)

## 📄 License

(Choose appropriate license)

## 📞 Contact

(Add contact information)

---

**Built with ❤️ for Public Sector Excellence**
# AI_Public_Sector
