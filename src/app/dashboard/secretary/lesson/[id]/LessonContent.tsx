'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { useRouter } from 'next/navigation';

interface LessonContentProps {
  lesson: {
    id: string;
    title: string;
    content: string;
    order: number;
  };
  isCompleted: boolean;
  userId: string;
}

interface Section {
  title: string;
  content: string;
}

interface Example {
  title: string;
  description: string;
}

interface ParsedContent {
  sections?: Section[];
  examples?: Example[];
  assignment?: {
    question: string;
    instructions: string;
  };
}

export default function LessonContent({ lesson, isCompleted, userId }: LessonContentProps) {
  const router = useRouter();
  const [assignment, setAssignment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAssignment, setShowAssignment] = useState(isCompleted);

  // Parse lesson content (expecting JSON format)
  let parsedContent: ParsedContent;
  try {
    parsedContent = JSON.parse(lesson.content);
  } catch {
    parsedContent = {
      sections: [{ title: 'Content', content: lesson.content }],
      assignment: { question: 'Complete this lesson', instructions: '' }
    };
  }

  const handleSubmit = async () => {
    if (!assignment.trim()) {
      alert('Please write your assignment before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/lessons/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          userId,
          submission: assignment,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      alert('Assignment submitted successfully!');
      router.push('/dashboard/secretary');
      router.refresh();
    } catch {
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Learning Content */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-2xl text-slate-900">📖 Lesson Content</CardTitle>
          <CardDescription>Read through the material carefully</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {parsedContent.sections?.map((section: Section, index: number) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              <div className="prose prose-slate max-w-none">
                {section.content.split('\n\n').map((paragraph: string, pIndex: number) => {
                  if (paragraph.startsWith('###')) {
                    return <h3 key={pIndex} className="text-xl font-semibold text-slate-900 mt-6 mb-3">{paragraph.replace('###', '').trim()}</h3>;
                  }
                  if (paragraph.startsWith('•')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={pIndex} className="list-disc list-inside space-y-2 text-slate-700">
                        {items.map((item, iIndex) => (
                          <li key={iIndex}>{item.replace('•', '').trim()}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={pIndex} className="text-slate-700 leading-relaxed">{paragraph}</p>;
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Examples Section */}
      {parsedContent.examples && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">💡 Practical Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parsedContent.examples.map((example: Example, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">{example.title}</h4>
                <p className="text-slate-600 text-sm">{example.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Complete Reading Button */}
      {!showAssignment && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowAssignment(true)}
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8"
          >
            I&apos;ve Finished Reading → Proceed to Assignment
          </Button>
        </div>
      )}

      {/* Assignment Section */}
      {showAssignment && (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader className="bg-green-100/50">
            <CardTitle className="text-2xl text-slate-900">✍️ Assignment</CardTitle>
            <CardDescription>Apply what you&apos;ve learned</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Assignment Question */}
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                {parsedContent.assignment?.question || 'Complete the assignment'}
              </h3>
              <p className="text-slate-600 mb-4">
                {parsedContent.assignment?.instructions || 'Write your response below.'}
              </p>
              
              {/* Submission Form */}
              {!isCompleted ? (
                <div className="space-y-4">
                  <Textarea
                    value={assignment}
                    onChange={(e) => setAssignment(e.target.value)}
                    placeholder="Write your detailed response here..."
                    rows={10}
                    className="border-slate-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || !assignment.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                    >
                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAssignment('')}
                      disabled={submitting}
                    >
                      Clear
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500">
                    Tip: Take your time to provide a thoughtful, detailed response.
                  </p>
                </div>
              ) : (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Assignment completed! Great work!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
