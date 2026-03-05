'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { CheckCircle, FileText } from 'lucide-react';

interface LessonAssignmentProps {
  lessonId: string;
  userId: string;
  isCompleted: boolean;
}

export default function LessonAssignment({ lessonId, isCompleted }: LessonAssignmentProps) {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(isCompleted);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          answer: answer.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assignment');
      }

      setSubmitted(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-green-900">Assignment Completed!</CardTitle>
              <CardDescription className="text-green-700">
                Great job! You&apos;ve completed this lesson.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => router.push('/dashboard/secretary')}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-slate-900">Practice Assignment</CardTitle>
            <CardDescription className="text-slate-600">
              Apply what you&apos;ve learned by completing this exercise
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-slate-900 mb-2">Your Task:</h4>
          <p className="text-slate-700">
            Based on what you&apos;ve learned in this lesson, write a brief summary (150-200 words) 
            explaining how you would apply these AI tools in your daily work as a secretary. 
            Include at least 2 specific examples.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="answer" className="text-slate-700">Your Answer</Label>
          <Textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your response here..."
            className="min-h-[200px] border-slate-300 focus:border-amber-500 focus:ring-amber-500"
            disabled={loading}
          />
          <p className="text-sm text-slate-500">
            {answer.length} characters
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !answer.trim()}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {loading ? 'Submitting...' : 'Submit Assignment'}
        </Button>
      </CardContent>
    </Card>
  );
}
