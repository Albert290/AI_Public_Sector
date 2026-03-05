import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const runtime = 'nodejs';

const completeSchema = z.object({
  lessonId: z.string(),
  answer: z.string().min(50, 'Answer must be at least 50 characters'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('=== Lesson Complete API called ===');
    const session = await auth();
    console.log('Session:', session ? 'exists' : 'null');

    if (!session || !session.user) {
      console.log('Unauthorized - no session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', { lessonId: body.lessonId, answerLength: body.answer?.length });
    const { lessonId } = completeSchema.parse(body);

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Create or update progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}
