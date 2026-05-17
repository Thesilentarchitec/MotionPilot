import { PostData, PublishResult, SocialPlatform } from './types';

export class TikTokPlatform extends SocialPlatform {
  name = 'tiktok';

  async publish(data: PostData, _accessToken: string): Promise<PublishResult> {
    console.log(`[TikTok] Publishing post: ${data.quote}`);
    
    try {
      // Mocking TikTok Content Posting API v2 flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      return {
        success: true,
        platform: this.name,
        postId: `tt_${Math.random().toString(36).substr(2, 9)}`,
        url: `https://www.tiktok.com/@user/video/mock`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown TikTok error';
      return {
        success: false,
        platform: this.name,
        error: errorMessage,
      };
    }
  }
}
