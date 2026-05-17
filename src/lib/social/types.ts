export interface PostData {
  quote: string;
  caption: string;
  hashtags: string[];
  imageUrl: string;
  videoUrl?: string; // Some platforms prefer video, we might need to handle this
}

export interface PublishResult {
  success: boolean;
  platform: string;
  postId?: string;
  error?: string;
  url?: string;
}

export abstract class SocialPlatform {
  abstract name: string;
  abstract publish(data: PostData, accessToken: string): Promise<PublishResult>;
}
