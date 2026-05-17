export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'snapchat';

export interface PlatformFormat {
  aspectRatio: '9:16' | '1:1' | '16:9';
  maxCaptionLength: number;
  hashtagLimit: number;
}

export const PLATFORM_CONFIGS: Record<Platform, PlatformFormat> = {
  tiktok: {
    aspectRatio: '9:16',
    maxCaptionLength: 2200,
    hashtagLimit: 30,
  },
  instagram: {
    aspectRatio: '1:1',
    maxCaptionLength: 2200,
    hashtagLimit: 30,
  },
  youtube: {
    aspectRatio: '16:9',
    maxCaptionLength: 5000,
    hashtagLimit: 15,
  },
  snapchat: {
    aspectRatio: '9:16',
    maxCaptionLength: 250,
    hashtagLimit: 10,
  },
};

export function formatContentForPlatform(
  platform: Platform,
  content: { quote: string; caption: string; hashtags: string[] }
) {
  const config = PLATFORM_CONFIGS[platform];
  
  // Basic formatting: Combine quote and caption
  let fullCaption = `"${content.quote}"\n\n${content.caption}`;
  
  // Add hashtags
  const hashtags = content.hashtags.slice(0, config.hashtagLimit).join(' ');
  fullCaption = `${fullCaption}\n\n${hashtags}`;
  
  // Truncate if necessary
  if (fullCaption.length > config.maxCaptionLength) {
    fullCaption = fullCaption.substring(0, config.maxCaptionLength - 3) + '...';
  }

  return {
    platform,
    caption: fullCaption,
    aspectRatio: config.aspectRatio,
  };
}
