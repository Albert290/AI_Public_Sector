# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

- [ ] All features working locally
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] Database migrations up to date
- [ ] Environment variables documented

## Database Setup

- [ ] Production PostgreSQL database created
- [ ] Connection string obtained
- [ ] Connection pooling configured (if needed)
- [ ] Database accessible from hosting platform

## Environment Variables

- [ ] `DATABASE_URL` - Production database connection string
- [ ] `NEXTAUTH_URL` - Production domain URL
- [ ] `NEXTAUTH_SECRET` - New secure secret generated
- [ ] All variables set in hosting platform

## Git & Repository

- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `.env` file in `.gitignore`
- [ ] Clean commit history
- [ ] Main/master branch ready

## Hosting Platform

- [ ] Account created (Vercel/Railway/Netlify)
- [ ] Repository connected
- [ ] Build settings verified
- [ ] Environment variables configured

## Database Migrations

- [ ] Migrations run on production: `npx prisma migrate deploy`
- [ ] Database seeded: `npx tsx prisma/seed.ts`
- [ ] Test user created successfully
- [ ] Database accessible from app

## Post-Deployment Testing

- [ ] App loads successfully
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard displays
- [ ] Lessons load
- [ ] Assignment submission works
- [ ] Progress tracking updates
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Navigation works

## Monitoring & Analytics

- [ ] Error logging configured (optional)
- [ ] Analytics set up (optional)
- [ ] Performance monitoring enabled
- [ ] Alerts configured for downtime

## Documentation

- [ ] Production URL documented
- [ ] Admin credentials secured
- [ ] Deployment process documented
- [ ] Team notified

## Security

- [ ] HTTPS enabled (auto with Vercel)
- [ ] NEXTAUTH_SECRET is secure and unique
- [ ] Database credentials secured
- [ ] No secrets in code
- [ ] Environment variables not exposed

## Optional Enhancements

- [ ] Custom domain configured
- [ ] CDN enabled for static assets
- [ ] Database backups scheduled
- [ ] CI/CD pipeline set up
- [ ] Staging environment created

---

## Quick Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations on production
npx prisma migrate deploy

# Seed production database
npx tsx prisma/seed.ts

# Test production build locally
npm run build && npm start

# Deploy with Vercel CLI
vercel --prod

# Pull production env variables
vercel env pull
```

---

## Troubleshooting Quick Links

- Database connection issues → [DEPLOYMENT.md](./DEPLOYMENT.md#database-connection-issues)
- Build errors → [DEPLOYMENT.md](./DEPLOYMENT.md#build-errors)
- NextAuth errors → [DEPLOYMENT.md](./DEPLOYMENT.md#nextauth-errors)
- Runtime errors → [DEPLOYMENT.md](./DEPLOYMENT.md#runtime-errors)

---

**Last Updated**: {date}
**Deployed By**: {name}
**Production URL**: {url}
