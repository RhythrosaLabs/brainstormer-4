import { storage } from './storage';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function generateImage(prompt: string): Promise<ApiResponse<Blob>> {
  const openaiKey = storage.getApiKey('openai');
  
  if (!openaiKey) {
    return {
      success: false,
      error: 'OpenAI API key is not set. Please add it in Settings.'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    if (!data.data?.[0]?.url) {
      throw new Error('No image URL in response');
    }

    const imageUrl = data.data[0].url;
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageBlob = await imageResponse.blob();
    if (!imageBlob.size) {
      throw new Error('Downloaded image is empty');
    }

    return {
      success: true,
      data: imageBlob
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Image generation error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
    console.error('Image generation error:', error);
    return {
      success: false,
      error: 'Failed to generate image'
    };
  }
}

export async function generateText(prompt: string): Promise<ApiResponse<string>> {
  const openaiKey = storage.getApiKey('openai');
  
  if (!openaiKey) {
    return {
      success: false,
      error: 'OpenAI API key is not set. Please add it in Settings.'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate text');
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format');
    }

    return {
      success: true,
      data: data.choices[0].message.content
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Text generation error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
    console.error('Text generation error:', error);
    return {
      success: false,
      error: 'Failed to generate text'
    };
  }
}

export async function uploadFile(file: File): Promise<ApiResponse<string>> {
  try {
    // Create a URL for the uploaded file
    const url = URL.createObjectURL(file);
    return {
      success: true,
      data: url
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('File upload error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'Failed to upload file'
    };
  }
}