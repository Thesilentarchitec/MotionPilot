import { getAnthropic, getOpenAI } from './config';
import { formatContentForPlatform, Platform } from './formatter';

export type PostTheme = 'mindset' | 'discipline' | 'success' | 'resilience' | 'focus' | 'growth' | 'abundance' | 'leadership';

export interface GeneratedContent {
  quote: string;
  caption: string;
  hashtags: string[];
}

export interface GeneratedImage {
  url: string;
  revisedPrompt: string;
}

export async function generateTextContent(theme: PostTheme): Promise<GeneratedContent> {
  // Mock fallback for development
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-anthropic-key') {
    console.log(`[Mock] Generating text content for theme: ${theme}`);
    return {
      quote: `Success is not final, failure is not fatal: it is the courage to continue that counts. (${theme})`,
      caption: `Keep pushing forward in your ${theme} journey. The only limit is the one you set for yourself.`,
      hashtags: [`#${theme}`, '#motivation', '#success', '#discipline', '#growth'],
    };
  }

  const prompt = `Generate a unique, powerful motivational quote and a matching social media caption for the theme: "${theme}".
  The quote should be short and impactful.
  The caption should be engaging and include a call to action.
  Also provide 5-8 relevant hashtags.
  
  Format your response as a JSON object with the following keys:
  "quote": "the quote text",
  "caption": "the caption text",
  "hashtags": ["hashtag1", "hashtag2", ...]`;

  const anthropic = getAnthropic();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514', // As specified in core features
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  try {
    // Basic JSON extraction in case there's preamble
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    return JSON.parse(jsonMatch[0]) as GeneratedContent;
  } catch (error) {
    console.error('Failed to parse Claude response:', content, error);
    throw new Error('Failed to generate valid text content');
  }
}

export async function generateImage(quote: string, aspectRatio: 'v' | 's' | 'w'): Promise<GeneratedImage> {
  // Mock fallback for development
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-key') {
    console.log(`[Mock] Generating image for quote: ${quote.substring(0, 30)}...`);
    return {
      url: `https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop&ratio=${aspectRatio}`,
      revisedPrompt: `Minimalist dark luxury image representing: ${quote}`,
    };
  }

  const prompt = `A visually striking, high-quality professional photograph or digital art piece that captures the essence of this motivational quote: "${quote}". 
  Minimalist, luxury aesthetic, dark background, evocative lighting. 
  No text in the image. High resolution.`;

  const openai = getOpenAI();
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: (aspectRatio === 'v' ? '1024x1792' : aspectRatio === 'w' ? '1792x1024' : '1024x1024') as "1024x1024" | "1024x1792" | "1792x1024",
    response_format: 'url',
  });

  return {
    url: response.data?.[0]?.url || '',
    revisedPrompt: response.data?.[0]?.revised_prompt || '',
  };
}

export interface PlatformPostContent {
  platform: Platform;
  caption: string;
  aspectRatio: string;
  imageUrl?: string;
}

export async function generateFullPost(theme: PostTheme, platforms: Platform[]): Promise<{
  original: GeneratedContent;
  platforms: PlatformPostContent[];
}> {
  const textContent = await generateTextContent(theme);
  
  // Generate unique visual variations for each aspect ratio required
  const uniqueAspectRatios = Array.from(new Set(platforms.map(p => {
    if (p === 'tiktok' || p === 'snapchat') return 'v';
    if (p === 'youtube') return 'w';
    return 's';
  })));

  const imagesPromise = uniqueAspectRatios.map(async (ratio) => {
    const img = await generateImage(textContent.quote, ratio as 'v' | 's' | 'w');
    return { ratio, ...img };
  });

  const generatedImages = await Promise.all(imagesPromise);

  // Format content for each platform
  const platformContent = platforms.map(platform => {
    const formatted = formatContentForPlatform(platform, textContent);
    const ratio = platform === 'tiktok' || platform === 'snapchat' ? 'v' : platform === 'youtube' ? 'w' : 's';
    const image = generatedImages.find(img => img.ratio === ratio);
    
    return {
      ...formatted,
      imageUrl: image?.url,
    };
  });

  return {
    original: textContent,
    platforms: platformContent,
  };
}
