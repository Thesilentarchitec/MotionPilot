import { PostData, PublishResult } from './types';
import { TikTokPlatform } from './tiktok';
import { InstagramPlatform } from './instagram';
import { YouTubePlatform } from './youtube';
import { SnapchatPlatform } from './snapchat';

export * from './types';

export class SocialPublishingManager {
  private platforms = {
    tiktok: new TikTokPlatform(),
    instagram: new InstagramPlatform(),
    youtube: new YouTubePlatform(),
    snapchat: new SnapchatPlatform(),
  };

  /**
   * Publishes content to multiple platforms simultaneously.
   * 
   * @param data The content to publish
   * @param platformConfigs A record of platform keys and their respective access tokens
   */
  async publishToAll(
    data: PostData,
    platformConfigs: Partial<Record<keyof typeof this.platforms, string>>
  ): Promise<PublishResult[]> {
    const publishPromises = Object.entries(platformConfigs).map(async ([platform, token]) => {
      if (!token) {
        return {
          success: false,
          platform,
          error: 'Access token missing for platform',
        };
      }

      const handler = this.platforms[platform as keyof typeof this.platforms];
      if (!handler) {
        return {
          success: false,
          platform,
          error: `Platform ${platform} not supported`,
        };
      }

      return handler.publish(data, token);
    });

    return Promise.all(publishPromises);
  }
}
