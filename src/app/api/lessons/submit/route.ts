import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const submitSchema = z.object({
  lessonId: z.string(),
  userId: z.string(),
  submission: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, userId } = submitSchema.parse(body);

    // Update or create progress
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    );
  }
}
