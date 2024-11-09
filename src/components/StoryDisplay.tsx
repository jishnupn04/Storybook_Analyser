import React from 'react';
import { BookOpen } from 'lucide-react';

interface StoryDisplayProps {
  story: string;
  isGenerating: boolean;
}

export function StoryDisplay({ story, isGenerating }: StoryDisplayProps) {
  if (!story && !isGenerating) return null;

  return (
    <div className="mt-8 bg-purple-50 rounded-lg p-6 shadow-inner">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-800">Your Story</h3>
      </div>
      
      {isGenerating ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="prose prose-purple max-w-none">
          {story.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-purple-900 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}