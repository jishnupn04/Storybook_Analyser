const API_BASE_URL = 'http://localhost:5000/api';

export async function generateStory(
  childName: string,
  theme: string,
  themePrompt: string,
  images: string[]
): Promise<{ story: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        childName,
        theme,
        themePrompt,
        images,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate story');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}