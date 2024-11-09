import React from 'react';
import { Camera, X, MoveUp, MoveDown } from 'lucide-react';
import { StoryImage } from '../types';

interface ImageUploadProps {
  images: StoryImage[];
  onImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
  onReorderImage: (id: string, direction: 'up' | 'down') => void;
}

export function ImageUpload({ images, onImagesUpload, onRemoveImage, onReorderImage }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <label className="block text-purple-700 font-medium mb-2">Upload Story Photos</label>
      <div className="space-y-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative flex items-center gap-4 bg-purple-50 p-4 rounded-lg">
            <img
              src={image.dataUrl}
              alt={`Story image ${index + 1}`}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex flex-col gap-2">
              <span className="text-purple-700 font-medium">Image {index + 1}</span>
              <div className="flex gap-2">
                {index > 0 && (
                  <button
                    onClick={() => onReorderImage(image.id, 'up')}
                    className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition"
                  >
                    <MoveUp className="w-4 h-4 text-purple-600" />
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    onClick={() => onReorderImage(image.id, 'down')}
                    className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition"
                  >
                    <MoveDown className="w-4 h-4 text-purple-600" />
                  </button>
                )}
                <button
                  onClick={() => onRemoveImage(image.id)}
                  className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {images.length < 5 && (
          <label className="block w-full cursor-pointer">
            <div className="flex flex-col items-center px-4 py-6 bg-purple-50 text-purple rounded-lg border-2 border-purple-300 border-dashed hover:bg-purple-100 transition">
              <Camera className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-sm text-purple-600">
                Click to add {images.length === 0 ? 'photos' : 'another photo'} (max 5)
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImagesUpload}
              multiple={images.length === 0}
            />
          </label>
        )}
      </div>
    </div>
  );
}