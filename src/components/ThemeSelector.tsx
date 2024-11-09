import React from 'react';
import { StoryTheme } from '../types';
import { Sparkles } from 'lucide-react';

interface ThemeSelectorProps {
  themes: StoryTheme[];
  selectedTheme: StoryTheme | null;
  onThemeSelect: (theme: StoryTheme) => void;
}

export function ThemeSelector({ themes, selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-purple-700 font-medium mb-2">
        Choose a Story Theme
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme)}
            className={`p-4 rounded-lg text-left transition-all ${
              selectedTheme?.id === theme.id
                ? 'bg-purple-100 border-2 border-purple-500 shadow-md'
                : 'bg-white border-2 border-purple-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className={`w-5 h-5 ${
                selectedTheme?.id === theme.id ? 'text-purple-600' : 'text-purple-400'
              }`} />
              <h3 className="font-medium text-purple-800">{theme.name}</h3>
            </div>
            <p className="text-sm text-purple-600">{theme.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}