#!/usr/bin/env node

/**
 * Production Database Seeding Script
 * 
 * This script seeds your Neon database with initial data (roles and lessons).
 * Since your local network blocks port 5432, this script is designed to be run
 * via cloud services or through Vercel.
 */

const { execSync } = require('child_process');

console.log('🌱 Starting production database seeding...\n');
console.log('📊 This will create:');
console.log('   - User roles (Secretary, Admin Officer, etc.)');
console.log('   - Training lessons for each role');
console.log('   - AI tool use cases\n');

try {
  // Run the TypeScript seed file
  console.log('⚙️  Running seed script...\n');
  execSync('npx tsx prisma/seed.ts', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
  
  console.log('\n✅ Production database seeded successfully!');
  console.log('🚀 You can now sign up at: https://ai-public-sector.vercel.app/signup');
  
} catch (error) {
  console.error('\n❌ Error seeding database:', error.message);
  console.log('\n📝 Troubleshooting:');
  console.log('   1. Verify DATABASE_URL in Vercel environment variables');
  console.log('   2. Check Neon database is active and accessible');
  console.log('   3. Run migrations first: npx prisma migrate deploy');
  process.exit(1);
}
