'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface LessonContentProps {
  content: string;
  isCompleted: boolean;
}

export default function LessonContent({ content, isCompleted }: LessonContentProps) {
  // Parse content sections (format: ## Section Title\nContent)
  const sections = content.split('##').filter(Boolean);

  return (
    <div className="space-y-6 mb-12">
      {sections.map((section, index) => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const body = lines.slice(1).join('\n').trim();

        return (
          <Card key={index} className="border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl text-slate-900">{title}</CardTitle>
                {isCompleted && index === sections.length - 1 && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                {body.split('\n\n').map((paragraph, pIndex) => {
                  // Check if it's a list
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n- ').map(item => item.replace(/^- /, ''));
                    return (
                      <ul key={pIndex} className="list-disc list-inside space-y-2 text-slate-700">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  // Regular paragraph
                  return (
                    <p key={pIndex} className="text-slate-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
