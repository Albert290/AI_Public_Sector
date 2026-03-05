#!/bin/bash

# Quick test script to verify Neon database connection

echo "🔍 Testing Neon Database Connection..."
echo ""

# Test 1: Check environment variables
echo "1️⃣ Checking environment variables..."
if grep -q "neon.tech" .env; then
    echo "✅ Neon connection strings found in .env"
else
    echo "❌ Neon connection strings not found in .env"
    exit 1
fi

# Test 2: Test raw PostgreSQL connection
echo ""
echo "2️⃣ Testing raw PostgreSQL connection..."
node << 'EOF'
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT version()', (err, result) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected successfully!');
    console.log('PostgreSQL version:', result.rows[0].version.split(' ')[1]);
    pool.end();
  }
});
EOF

# Test 3: Test Prisma connection
echo ""
echo "3️⃣ Testing Prisma Client connection..."
npx tsx << 'EOF'
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

try {
  const result = await prisma.$queryRaw`SELECT current_database(), current_user`;
  console.log('✅ Prisma connected successfully!');
  console.log('Database:', result);
  
  // Test table access
  const roleCount = await prisma.role.count();
  console.log(`Roles in database: ${roleCount}`);
  
} catch (error: any) {
  console.error('❌ Prisma connection failed:', error.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
  await pool.end();
}
EOF

echo ""
echo "🎉 All connection tests passed!"
echo ""
echo "Now you can run:"
echo "  npx tsx prisma/seed.ts"
echo "  npm run dev"
