import { auth } from '@/lib/auth-wrapper';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SecretaryDashboard() {
  const session = await auth();

  if (!session || session.user.roleSlug !== 'secretary') {
    redirect('/dashboard');
  }

  // Fetch user with role and progress
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
      progress: {
        include: {
          lesson: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  const totalLessons = user.role.lessons.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedLessons = user.progress.filter((p: any) => p.completed).length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Get the next lesson to complete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nextLesson = user.role.lessons.find((lesson: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lessonProgress = user.progress.find((p: any) => p.lessonId === lesson.id);
    return !lessonProgress || !lessonProgress.completed;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-slate-600">
          Continue your journey to master AI tools for administrative work
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 mb-2">
              {Math.round(progressPercentage)}%
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Completed Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {completedLessons} / {totalLessons}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <div className="text-lg font-semibold text-slate-900">
                Secretary
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      {nextLesson && (
        <Card className="mb-8 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-900">Continue Learning</CardTitle>
                <CardDescription className="text-slate-600 mt-1">
                  Pick up where you left off
                </CardDescription>
              </div>
              <Badge className="bg-amber-600 text-white">Next Up</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{nextLesson.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{nextLesson.description}</p>
                {nextLesson.duration && (
                  <p className="text-xs text-slate-500">
                    ⏱️ {nextLesson.duration} minutes
                  </p>
                )}
              </div>
              <Link href={`/dashboard/secretary/lesson/${nextLesson.id}`}>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Start Lesson
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Lessons */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Learning Path</h2>
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {user.role.lessons.map((lesson: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const lessonProgress = user.progress.find((p: any) => p.lessonId === lesson.id);
            const isCompleted = lessonProgress?.completed || false;

            return (
              <Card
                key={lesson.id}
                className={`border-slate-200 ${
                  isCompleted ? 'bg-green-50/30' : 'bg-white'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Lesson {lesson.order}
                        </Badge>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-slate-900">
                        {lesson.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 mt-1">
                        {lesson.description}
                      </CardDescription>
                      {lesson.duration && (
                        <p className="text-sm text-slate-500 mt-2">
                          ⏱️ {lesson.duration} minutes
                        </p>
                      )}
                    </div>
                    <Link href={`/dashboard/secretary/lesson/${lesson.id}`}>
                      <Button
                        variant={isCompleted ? 'outline' : 'default'}
                        className={
                          isCompleted
                            ? 'border-slate-300'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
