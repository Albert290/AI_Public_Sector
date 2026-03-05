#!/bin/bash

# Deployment Setup Script for AI Training Platform
# This script helps prepare your project for deployment

set -e

echo "🚀 AI Training Platform - Deployment Setup"
echo "=========================================="
echo ""

# Check if running in project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Function to generate secret
generate_secret() {
    openssl rand -base64 32
}

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file"
    else
        echo "❌ No .env.example found"
        exit 1
    fi
fi

echo ""
echo "📝 Pre-Deployment Checks"
echo "------------------------"

# Check Node version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Check if build succeeds
echo ""
echo "🏗️  Testing production build..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "🔐 Security Setup"
echo "-----------------"

# Generate new NEXTAUTH_SECRET
NEW_SECRET=$(generate_secret)
echo "Generated new NEXTAUTH_SECRET:"
echo "$NEW_SECRET"
echo ""
echo "⚠️  IMPORTANT: Use this secret in your production environment!"
echo "Add this to your hosting platform's environment variables:"
echo "NEXTAUTH_SECRET=\"$NEW_SECRET\""

echo ""
echo "📋 Deployment Checklist"
echo "----------------------"
echo ""
echo "Before deploying, ensure you have:"
echo "  [ ] Production PostgreSQL database ready"
echo "  [ ] GitHub repository created and pushed"
echo "  [ ] Hosting platform account (Vercel recommended)"
echo ""
echo "Environment variables needed:"
echo "  [ ] DATABASE_URL - Your production database connection string"
echo "  [ ] NEXTAUTH_URL - Your production domain (e.g., https://yourapp.vercel.app)"
echo "  [ ] NEXTAUTH_SECRET - The secret generated above"
echo ""
echo "After deployment:"
echo "  [ ] Run: npx prisma migrate deploy"
echo "  [ ] Run: npx tsx prisma/seed.ts"
echo "  [ ] Test signup/login functionality"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - DEPLOYMENT.md (comprehensive guide)"
echo "   - DEPLOYMENT_CHECKLIST.md (step-by-step checklist)"
echo ""
echo "🎉 Setup complete! Ready to deploy."
echo ""
echo "Quick deploy with Vercel CLI:"
echo "  npm i -g vercel"
echo "  vercel"
echo ""
