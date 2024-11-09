export interface StoryTheme {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface StoryImage {
  id: string;
  dataUrl: string;
  order: number;
}

export interface GenerateStoryResponse {
  story: string;
  processedImages: string[];
}