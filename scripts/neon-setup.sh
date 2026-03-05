#!/bin/bash

# Quick Neon Database Setup Script
# This script helps you migrate to Neon database safely

set -e

echo "🚀 Neon Database Migration Script"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in project directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this from project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  IMPORTANT: This will help you migrate to Neon database${NC}"
echo ""
read -p "Have you created a Neon project? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please create a Neon project first:"
    echo "1. Go to https://neon.tech"
    echo "2. Sign up and create a new project"
    echo "3. Copy your connection strings"
    echo ""
    exit 1
fi

echo ""
echo "📋 Step 1: Backup Current Database"
echo "-----------------------------------"

if [ -f ".env" ]; then
    # Extract current DATABASE_URL
    CURRENT_DB=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    
    if [ ! -z "$CURRENT_DB" ]; then
        echo "Found database: $CURRENT_DB"
        read -p "Create backup? (y/n) " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
            echo "Creating backup: $BACKUP_FILE"
            
            # Try to create backup
            if pg_dump "$CURRENT_DB" > "$BACKUP_FILE" 2>/dev/null; then
                echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
            else
                echo -e "${YELLOW}⚠️  Could not create automatic backup${NC}"
                echo "Please manually backup your database before continuing"
                read -p "Press enter when backup is complete..."
            fi
        fi
    fi
fi

echo ""
echo "🔌 Step 2: Configure Neon Connection"
echo "-------------------------------------"

# Backup current .env
if [ -f ".env" ]; then
    cp .env .env.backup
    echo -e "${GREEN}✅ Backed up .env to .env.backup${NC}"
fi

echo ""
echo "Please provide your Neon connection strings:"
echo "(You can find these in your Neon project dashboard)"
echo ""

read -p "Pooled Connection URL: " POOLED_URL
read -p "Direct Connection URL: " DIRECT_URL

# Update .env file
cat > .env << EOF
# Neon Database Connection
DATABASE_URL="$POOLED_URL"
DIRECT_DATABASE_URL="$DIRECT_URL"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
EOF

echo -e "${GREEN}✅ Updated .env file${NC}"

echo ""
echo "🔧 Step 3: Update Prisma Configuration"
echo "---------------------------------------"

# Check if prisma.config.ts exists and update it
if [ -f "prisma.config.ts" ]; then
    cat > prisma.config.ts << 'EOF'
import { defineConfig } from 'prisma';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
  seed: 'tsx prisma/seed.ts',
});
EOF
    echo -e "${GREEN}✅ Updated prisma.config.ts${NC}"
fi

# Update schema.prisma to include directUrl
if [ -f "prisma/schema.prisma" ]; then
    # Check if directUrl already exists
    if ! grep -q "directUrl" prisma/schema.prisma; then
        # Add directUrl after url line
        sed -i '/url[[:space:]]*=[[:space:]]*env("DATABASE_URL")/a\  directUrl = env("DIRECT_DATABASE_URL")' prisma/schema.prisma
        echo -e "${GREEN}✅ Updated schema.prisma with directUrl${NC}"
    fi
fi

echo ""
echo "📦 Step 4: Generate Prisma Client"
echo "----------------------------------"

npx prisma generate
echo -e "${GREEN}✅ Prisma client generated${NC}"

echo ""
echo "🗄️  Step 5: Migrate Schema to Neon"
echo "-----------------------------------"

read -p "Deploy schema to Neon now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    if npx prisma migrate deploy; then
        echo -e "${GREEN}✅ Schema migrated successfully${NC}"
    else
        echo -e "${RED}❌ Migration failed. Check error messages above.${NC}"
        exit 1
    fi
fi

echo ""
echo "🌱 Step 6: Seed Database"
echo "------------------------"

read -p "Seed the database with initial data? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    if npx tsx prisma/seed.ts; then
        echo -e "${GREEN}✅ Database seeded successfully${NC}"
    else
        echo -e "${RED}❌ Seeding failed${NC}"
        exit 1
    fi
fi

echo ""
echo "✅ Step 7: Verify Connection"
echo "----------------------------"

cat > /tmp/neon-test.ts << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Connected to PostgreSQL:', result);
    
    const counts = {
      roles: await prisma.role.count(),
      lessons: await prisma.lesson.count(),
      users: await prisma.user.count(),
    };
    
    console.log('\n📊 Database contents:');
    console.log(`   Roles: ${counts.roles}`);
    console.log(`   Lessons: ${counts.lessons}`);
    console.log(`   Users: ${counts.users}`);
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
EOF

npx tsx /tmp/neon-test.ts
rm /tmp/neon-test.ts

echo ""
echo -e "${GREEN}🎉 Neon migration complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Test your application: npm run dev"
echo "  2. Verify all features work correctly"
echo "  3. Update production environment variables"
echo "  4. Deploy to your hosting platform"
echo ""
echo "For detailed deployment instructions, see:"
echo "  - NEON_MIGRATION.md (complete guide)"
echo "  - DEPLOYMENT.md (deployment process)"
echo ""
echo "Rollback if needed:"
echo "  cp .env.backup .env && npm run dev"
echo ""
