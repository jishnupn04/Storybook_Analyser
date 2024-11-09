import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { StoryDisplay } from './components/StoryDisplay';
import { ThemeSelector } from './components/ThemeSelector';
import { storyThemes } from './data/themes';
import { StoryTheme, StoryImage } from './types';
import { generateStory } from './services/api';

function App() {
  const [childName, setChildName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme | null>(null);
  const [images, setImages] = useState<StoryImage[]>([]);
  const [currentStory, setCurrentStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 5 - images.length;
    const selectedFiles = files.slice(0, maxImages);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            dataUrl: reader.result as string,
            order: prev.length,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleReorderImage = (id: string, direction: 'up' | 'down') => {
    setImages((prev) => {
      const newImages = [...prev];
      const currentIndex = newImages.findIndex((img) => img.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < newImages.length) {
        [newImages[currentIndex], newImages[newIndex]] = [
          newImages[newIndex],
          newImages[currentIndex],
        ];
      }

      return newImages;
    });
  };

  const handleGenerateStory = async () => {
    if (!childName.trim() || !selectedTheme || images.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { story } = await generateStory(
        childName,
        selectedTheme.id,
        selectedTheme.prompt,
        images.map((img) => img.dataUrl)
      );
      setCurrentStory(story);
    } catch (error) {
      console.error('Error generating story:', error);
      setError('Failed to generate story. Please try again.');
      setCurrentStory('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">
              Magical Story Creator
            </h1>
            <p className="text-purple-600">
              Create wonderful personalized stories featuring your little one!
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="space-y-8">
              {/* Name Input */}
              <div>
                <label className="block text-purple-700 font-medium mb-2">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  placeholder="Enter your child's name"
                />
              </div>

              {/* Theme Selector */}
              <ThemeSelector
                themes={storyThemes}
                selectedTheme={selectedTheme}
                onThemeSelect={setSelectedTheme}
              />

              {/* Image Upload */}
              <ImageUpload
                images={images}
                onImagesUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                onReorderImage={handleReorderImage}
              />

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateStory}
                disabled={!childName.trim() || !selectedTheme || images.length === 0 || isGenerating}
                className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                {isGenerating ? 'Creating Magic...' : 'Generate Story'}
              </button>
            </div>

            {/* Story Display */}
            <StoryDisplay story={currentStory} isGenerating={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;