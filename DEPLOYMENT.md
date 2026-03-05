# Deployment Guide

## Prerequisites

- A PostgreSQL database (production)
- A hosting platform account (Vercel recommended)
- Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deploy to Vercel (Recommended)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Set Up Production Database

#### Option A: Vercel Postgres
```bash
# In Vercel Dashboard:
# 1. Go to Storage tab
# 2. Create Postgres database
# 3. Copy connection string
```

#### Option B: Supabase (Recommended for free tier)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string (change mode to "Session" for Pooling)

#### Option C: Neon (Serverless PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Get both **Pooled** and **Direct** connection strings
4. See [NEON_MIGRATION.md](./NEON_MIGRATION.md) for detailed setup guide

**Quick Neon setup:**
```bash
./scripts/neon-setup.sh
```

### 4. Configure Environment Variables

In Vercel Dashboard (Settings > Environment Variables):

**For Vercel Postgres / Supabase:**
```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public&connection_limit=5&pool_timeout=20
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret
```

**For Neon (Recommended):**
```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require&pooler=true
DIRECT_DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret
```

Generate a new `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. Initialize Production Database

```bash
# Set production DATABASE_URL in your terminal
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Seed the database
npx tsx prisma/seed.ts
```

Or use Vercel CLI:
```bash
vercel env pull .env.production
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### 6. Verify Deployment

1. Visit your production URL
2. Test signup/login
3. Complete a lesson to verify database connectivity

---

## Deploy to Other Platforms

### Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

3. Add Postgres:
```bash
railway add postgres
```

4. Set environment variables in Railway dashboard

### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Add PostgreSQL from Railway, Supabase, or Neon
4. Set environment variables in Netlify dashboard

---

## Build Configuration

The project is configured with:
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)
- **Node Version**: 18+ (recommended)

---

## Post-Deployment Checklist

- [ ] Database is accessible and seeded
- [ ] Environment variables are set correctly
- [ ] NEXTAUTH_URL matches your domain
- [ ] Can create account and login
- [ ] Lessons load properly
- [ ] Assignment submission works
- [ ] Progress tracking updates

---

## Troubleshooting

### Build Errors

**Prisma Client issues:**
```bash
# Add to package.json scripts:
"postinstall": "prisma generate"
```

### Database Connection Issues

**Error: Connection timeout**
- Use connection pooling URL
- Check DATABASE_URL has `connection_limit` and `pool_timeout` parameters

**Error: SSL required**
```env
DATABASE_URL=postgresql://...?sslmode=require
```

### NextAuth Errors

**Error: Invalid session**
- Verify NEXTAUTH_URL matches your production domain
- Ensure NEXTAUTH_SECRET is set and consistent

### Runtime Errors

**Edge runtime errors:**
- All API routes use `export const runtime = 'nodejs'`
- Middleware uses nodejs runtime

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Production URL | `https://yourapp.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generated with openssl |

---

## Updating Production

```bash
# Make changes and commit
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on push
# Or manually: vercel --prod
```

---

## Database Migrations

When you update the schema:

```bash
# 1. Create migration locally
npx prisma migrate dev --name your_migration_name

# 2. Push to GitHub
git add . && git commit -m "Migration: description" && git push

# 3. Apply to production
vercel env pull
npx prisma migrate deploy
```

---

## Monitoring

- **Vercel Dashboard**: View logs, analytics, and errors
- **Database Monitoring**: Check connection pool usage
- **Error Tracking**: Consider adding Sentry for production errors

---

## Cost Estimates (as of 2026)

### Free Tier (Hobby Projects)
- **Vercel**: Free (100GB bandwidth, unlimited requests)
- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Total**: $0/month

### Production (Small Scale)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month  
- **Total**: ~$45/month

### Production (Medium Scale)
- **Vercel Pro**: $20/month
- **Railway/Neon**: $20-50/month
- **Total**: ~$40-70/month
