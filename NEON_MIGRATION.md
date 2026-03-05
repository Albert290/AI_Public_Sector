# Migrating to Neon Database

This guide covers connecting your application to Neon and ensuring your database remains intact during migration.

## What is Neon?

Neon is a serverless PostgreSQL database with:
- **Automatic scaling** - Scales to zero when idle
- **Branching** - Create database branches like Git
- **Free tier** - 0.5 GB storage, generous compute hours
- **Fast cold starts** - Sub-second activation
- **Built-in connection pooling**

---

## Step 1: Create Neon Account & Project

### 1.1 Sign Up
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub, Google, or email
3. Verify your email

### 1.2 Create New Project
1. Click "New Project"
2. Project settings:
   - **Name**: `ai-training-platform` (or your choice)
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16 (recommended)
3. Click "Create Project"

### 1.3 Get Connection Strings

Neon provides multiple connection strings:

**Pooled Connection** (recommended for serverless):
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require&pooler=true
```

**Direct Connection** (for migrations):
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**Copy both** - you'll need them!

---

## Step 2: Backup Your Current Database (IMPORTANT!)

### Option A: Using pg_dump (Recommended)

```bash
# Export your current database
pg_dump -h localhost -U postgres -d ai_public_sector -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# Or export as SQL
pg_dump -h localhost -U postgres -d ai_public_sector > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Option B: Using Prisma

```bash
# Export data as JSON (manual approach)
# Create a script to export data:
cat > scripts/export-data.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  const users = await prisma.user.findMany({ include: { progress: true } });
  const roles = await prisma.role.findMany({ include: { lessons: true } });
  
  const data = { users, roles };
  
  writeFileSync(
    `backup-${new Date().toISOString()}.json`,
    JSON.stringify(data, null, 2)
  );
  
  console.log('✅ Data exported successfully!');
  await prisma.$disconnect();
}

exportData();
EOF

# Run the export
npx tsx scripts/export-data.ts
```

---

## Step 3: Configure Neon Connection

### 3.1 Update Environment Variables

**For Development (test first):**
```bash
# Create .env.neon for testing
cp .env .env.neon
```

Edit `.env.neon`:
```env
# Neon Database - Use POOLED connection for app
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require&pooler=true"

# For migrations, use DIRECT connection
DIRECT_DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Keep these same
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-existing-secret"
```

### 3.2 Update Prisma Configuration

Edit `prisma.config.ts`:
```typescript
import { defineConfig } from 'prisma';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
  seed: 'tsx prisma/seed.ts',
});
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_DATABASE_URL")
  relationMode      = "prisma" // Optional: for better serverless compatibility
}
```

---

## Step 4: Migrate Schema to Neon

### 4.1 Test Connection
```bash
# Test if Neon is accessible
npx prisma db execute --stdin <<< "SELECT version();" --preview-feature
```

### 4.2 Push Schema to Neon

**Option A: Using Prisma Migrate (Recommended)**
```bash
# Use the Neon credentials
export DATABASE_URL="your-neon-pooled-url"
export DIRECT_DATABASE_URL="your-neon-direct-url"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify tables created
npx prisma studio
```

**Option B: Using Prisma Push (Development)**
```bash
# Push schema without creating migration files
npx prisma db push
```

### 4.3 Verify Schema
```bash
# Check tables exist
psql "your-neon-direct-url" -c "\dt"

# Should show: Role, User, Lesson, Progress tables
```

---

## Step 5: Migrate Data to Neon

### Method 1: Restore from pg_dump

```bash
# Restore from backup
pg_restore -d "your-neon-direct-url" backup_20260305_120000.dump

# Or using SQL file
psql "your-neon-direct-url" < backup_20260305_120000.sql
```

### Method 2: Seed Fresh Data

If you haven't added real user data yet:
```bash
# Just seed with initial data
npx tsx prisma/seed.ts
```

### Method 3: Copy Data Between Databases

```bash
# Create migration script
cat > scripts/migrate-to-neon.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

// Old database
const oldDb = new PrismaClient({
  datasources: { db: { url: process.env.OLD_DATABASE_URL } }
});

// New Neon database
const newDb = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function migrate() {
  try {
    // Copy Roles
    const roles = await oldDb.role.findMany();
    for (const role of roles) {
      await newDb.role.create({ data: role });
    }
    console.log(`✅ Migrated ${roles.length} roles`);

    // Copy Lessons
    const lessons = await oldDb.lesson.findMany();
    for (const lesson of lessons) {
      await newDb.lesson.create({ data: lesson });
    }
    console.log(`✅ Migrated ${lessons.length} lessons`);

    // Copy Users (without progress first)
    const users = await oldDb.user.findMany();
    for (const user of users) {
      await newDb.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password,
          roleId: user.roleId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      });
    }
    console.log(`✅ Migrated ${users.length} users`);

    // Copy Progress
    const progress = await oldDb.progress.findMany();
    for (const p of progress) {
      await newDb.progress.create({ data: p });
    }
    console.log(`✅ Migrated ${progress.length} progress records`);

    console.log('\n🎉 Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  }
}

migrate();
EOF

# Run migration
OLD_DATABASE_URL="postgresql://localhost:5432/ai_public_sector" \
DATABASE_URL="your-neon-direct-url" \
npx tsx scripts/migrate-to-neon.ts
```

---

## Step 6: Verify Data Integrity

### 6.1 Check Record Counts
```bash
# Create verification script
cat > scripts/verify-migration.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  const roleCount = await prisma.role.count();
  const userCount = await prisma.user.count();
  const lessonCount = await prisma.lesson.count();
  const progressCount = await prisma.progress.count();

  console.log('\n📊 Database Record Counts:');
  console.log(`   Roles: ${roleCount}`);
  console.log(`   Users: ${userCount}`);
  console.log(`   Lessons: ${lessonCount}`);
  console.log(`   Progress: ${progressCount}`);

  // Verify relationships
  const usersWithProgress = await prisma.user.findMany({
    include: { progress: true, role: true }
  });

  console.log(`\n✅ All users have valid role relationships: ${
    usersWithProgress.every(u => u.role !== null)
  }`);

  await prisma.$disconnect();
}

verify();
EOF

npx tsx scripts/verify-migration.ts
```

### 6.2 Test Application Locally

```bash
# Use Neon database
export DATABASE_URL="your-neon-pooled-url"
export DIRECT_DATABASE_URL="your-neon-direct-url"

# Start dev server
npm run dev
```

**Test checklist:**
- [ ] Can access landing page
- [ ] Can sign up new user
- [ ] Can login with existing user
- [ ] Dashboard loads with correct data
- [ ] Lessons display properly
- [ ] Can submit assignments
- [ ] Progress tracking works

---

## Step 7: Update Production Configuration

### 7.1 Update Prisma Client for Production

Edit `src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Use native driver for Neon (better performance)
const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString,
  max: 10, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
```

### 7.2 Deploy to Vercel

```bash
# Set environment variables in Vercel
vercel env add DATABASE_URL
# Paste your Neon POOLED connection URL

vercel env add DIRECT_DATABASE_URL
# Paste your Neon DIRECT connection URL

vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET

# Deploy
vercel --prod
```

Or in Vercel Dashboard:
- Settings → Environment Variables
- Add all variables for Production, Preview, and Development

---

## Step 8: Neon-Specific Optimizations

### 8.1 Enable Connection Pooling

Neon includes built-in Pooling via `?pooler=true` in connection string. No additional setup needed!

### 8.2 Configure Auto-Suspend

In Neon Console:
1. Go to Project Settings
2. Compute → Auto-suspend
3. Set to 5 minutes (default) or customize
4. Saves costs when idle

### 8.3 Set Up Database Branching (Optional)

```bash
# Install Neon CLI
npm i -g neonctl

# Create development branch
neonctl branches create --name development --parent main

# Get branch connection string
neonctl connection-string development

# Use for local development
export DATABASE_URL="$(neonctl connection-string development)"
```

---

## Rollback Plan (If Something Goes Wrong)

### Switch Back to Local Database

```bash
# Restore your .env
cp .env.backup .env

# Or set variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_public_sector"

# Restart app
npm run dev
```

### Restore from Backup

```bash
# Restore to local
pg_restore -d ai_public_sector backup_20260305_120000.dump

# Or to Neon
pg_restore -d "your-neon-direct-url" backup_20260305_120000.dump
```

---

## Monitoring & Maintenance

### Check Connection Health
```bash
# Create health check
cat > scripts/db-health.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function healthCheck() {
  const start = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const duration = Date.now() - start;
    console.log(`✅ Database healthy (${duration}ms)`);
  } catch (error) {
    console.error('❌ Database unhealthy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

healthCheck();
EOF

npx tsx scripts/db-health.ts
```

### Monitor in Neon Dashboard
- View active connections
- Check query performance
- Monitor storage usage
- Set up alerts

---

## Cost Optimization Tips

1. **Use Pooled Connections**: Always use `?pooler=true` for serverless
2. **Auto-suspend**: Let Neon sleep when idle (free tier)
3. **Database Branching**: Use branches for development instead of separate projects
4. **Connection Limits**: Keep pool size reasonable (5-10 connections)

---

## Troubleshooting

### Error: "Connection timeout"
```bash
# Increase timeout in connection string
DATABASE_URL="...?sslmode=require&pooler=true&connect_timeout=30"
```

### Error: "Too many connections"
```bash
# Reduce pool size
max: 5 // in Pool config
```

### Error: "SSL required"
```bash
# Ensure sslmode in connection string
DATABASE_URL="...?sslmode=require"
```

### Slow queries
- Check indexes in Neon Console
- Use `EXPLAIN ANALYZE` for query optimization
- Consider connection pooling if not using it

---

## Summary Checklist

- [ ] Backup current database
- [ ] Create Neon project
- [ ] Get pooled & direct connection strings
- [ ] Update environment variables
- [ ] Update Prisma configuration
- [ ] Run migrations on Neon
- [ ] Migrate/seed data
- [ ] Verify data integrity
- [ ] Test locally with Neon
- [ ] Update production config
- [ ] Deploy to hosting platform
- [ ] Monitor performance

**Your data is now safely on Neon! 🎉**
