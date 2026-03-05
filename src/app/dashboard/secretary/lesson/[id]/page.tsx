import { auth } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import LessonContent from '@/components/lesson/LessonContent';
import LessonAssignment from '@/components/lesson/LessonAssignment';

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth();

  if (!session || session.user.roleSlug !== 'secretary') {
    redirect('/dashboard');
  }

  const { id } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      role: true,
      progress: {
        where: { userId: session.user.id },
      },
    },
  });

  if (!lesson) {
    redirect('/dashboard/secretary');
  }

  const isCompleted = lesson.progress[0]?.completed || false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/dashboard/secretary"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          {/* Lesson Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="text-amber-700 border-amber-300">
                Lesson {lesson.order}
              </Badge>
              {lesson.duration && (
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration} minutes</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {lesson.title}
            </h1>
            <p className="text-lg text-slate-600">
              {lesson.description}
            </p>
          </div>

          {/* Lesson Content */}
          <LessonContent content={lesson.content} isCompleted={isCompleted} />

          {/* Assignment Section */}
          <LessonAssignment
            lessonId={lesson.id}
            userId={session.user.id}
            isCompleted={isCompleted}
          />
        </div>
      </div>
    </div>
  );
}
