import { generateStory } from './api';

class StoryGeneratorService {
  private static instance: StoryGeneratorService;

  private constructor() {}

  public static getInstance(): StoryGeneratorService {
    if (!StoryGeneratorService.instance) {
      StoryGeneratorService.instance = new StoryGeneratorService();
    }
    return StoryGeneratorService.instance;
  }

  async generateStory(childName: string, theme: string, image?: string): Promise<string> {
    try {
      const response = await generateStory(childName, theme, image);
      return response.story;
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  }
}

export default StoryGeneratorService;