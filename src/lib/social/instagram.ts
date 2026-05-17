import { PostData, PublishResult, SocialPlatform } from './types';

export class InstagramPlatform extends SocialPlatform {
  name = 'instagram';

  async publish(data: PostData, _accessToken: string): Promise<PublishResult> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unused = _accessToken;
    console.log(`[Instagram] Publishing post: ${data.quote}`);
    
    try {
      // Mocking Meta Graph API flow for Instagram
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        platform: this.name,
        postId: `ig_${Math.random().toString(36).substr(2, 9)}`,
        url: `https://www.instagram.com/p/mock`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown Instagram error';
      return {
        success: false,
        platform: this.name,
        error: errorMessage,
      };
    }
  }
}
