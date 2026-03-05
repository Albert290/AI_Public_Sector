import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Simple secret to prevent unauthorized seeding
const SEED_SECRET = process.env.SEED_SECRET || 'change-me-in-production';

export async function POST(request: Request) {
  try {
    // Check authorization
    const { secret } = await request.json();
    
    if (secret !== SEED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if database is already seeded
    const existingRoles = await prisma.role.count();
    if (existingRoles > 0) {
      return NextResponse.json({
        message: 'Database is already seeded',
        rolesCount: existingRoles,
      });
    }

    console.log('Starting database seed...');

    // Create roles
    const secretary = await prisma.role.create({
      data: {
        name: 'Secretary',
        slug: 'secretary',
        description: 'Administrative support and office management',
        isActive: true,
        icon: '📋',
      },
    });

    await prisma.role.createMany({
      data: [
        {
          name: 'Administrative Officer',
          slug: 'admin-officer',
          description: 'Administrative operations and coordination',
          isActive: false,
          icon: '👔',
        },
        {
          name: 'Data Analyst',
          slug: 'data-analyst',
          description: 'Data analysis and reporting',
          isActive: false,
          icon: '📊',
        },
        {
          name: 'HR Manager',
          slug: 'hr-manager',
          description: 'Human resources management',
          isActive: false,
          icon: '👥',
        },
        {
          name: 'Policy Advisor',
          slug: 'policy-advisor',
          description: 'Policy development and analysis',
          isActive: false,
          icon: '📜',
        },
      ],
    });

    // Create lessons for Secretary role
    await prisma.lesson.createMany({
      data: [
        {
          title: 'Introduction to AI Tools',
          description: 'Learn the basics of AI and how it can help in your daily tasks',
          content: '# Introduction to AI Tools\n\nLearn the fundamentals of AI and its applications in administrative work.',
          order: 1,
          duration: 30,
          roleId: secretary.id,
        },
        {
          title: 'Email Management with AI',
          description: 'Automate and improve your email workflow',
          content: '# Email Management with AI\n\nDiscover how AI can help you manage emails more efficiently.',
          order: 2,
          duration: 25,
          roleId: secretary.id,
        },
        {
          title: 'Document Processing',
          description: 'Use AI to process and organize documents',
          content: '# Document Processing\n\nLearn AI-powered document management techniques.',
          order: 3,
          duration: 35,
          roleId: secretary.id,
        },
      ],
    });

    const rolesCount = await prisma.role.count();
    const lessonsCount = await prisma.lesson.count();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        roles: rolesCount,
        lessons: lessonsCount,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
