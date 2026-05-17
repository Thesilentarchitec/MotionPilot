import { Worker, Job } from 'bullmq';
import { redisConnection } from './redis';
import { generateFullPost, PostTheme } from './ai/content';
import { createAdminClient } from './supabase/server';
import { Platform } from './ai/formatter';
import { SocialPublishingManager } from './social';

export const autopilotWorker = new Worker(
  'autopilot',
  async (job: Job) => {
    console.log(`Processing job ${job.id} for user ${job.data.userId}`);
    
    const supabase = createAdminClient();
    
    // 1. Fetch user settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', job.data.userId)
      .single();
      
    if (settingsError || !settings) {
      console.error(`Failed to fetch settings for user ${job.data.userId}:`, settingsError);
      throw new Error('Settings not found');
    }
    
    // 2. Determine theme and platforms
    const themes = settings.themes as PostTheme[];
    const theme = themes[Math.floor(Math.random() * themes.length)] || 'mindset';
    
    const platformToggles = settings.platform_toggles as Record<Platform, boolean>;
    const enabledPlatforms = Object.entries(platformToggles)
      .filter(([_, enabled]) => enabled)
      .map(([platform]) => platform as Platform);
      
    if (enabledPlatforms.length === 0) {
      console.log(`No platforms enabled for user ${job.data.userId}. Skipping.`);
      return;
    }
    
    // 3. Generate content
    console.log(`Generating content for theme: ${theme}, platforms: ${enabledPlatforms}`);
    try {
      const postContent = await generateFullPost(theme, enabledPlatforms);
      
      // 4. Save to database
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: job.data.userId,
          quote: postContent.original.quote,
          caption: postContent.original.caption,
          platforms: postContent.platforms,
          status: 'generated',
        })
        .select()
        .single();
        
      if (postError) {
        throw new Error(`Failed to save generated post: ${postError.message}`);
      }
      
      console.log(`Successfully generated and saved post ${post.id}`);
      
      // 5. Trigger posting
      const publishingManager = new SocialPublishingManager();
      
      // Map enabled platforms to their mock tokens from env
      const platformConfigs: any = {};
      enabledPlatforms.forEach(p => {
        platformConfigs[p] = process.env[`${p.toUpperCase()}_ACCESS_TOKEN`] || 'mock_token';
      });

      console.log(`Publishing post ${post.id} to platforms...`);
      
      const publishResults = await publishingManager.publishToAll({
        quote: postContent.original.quote,
        caption: postContent.original.caption,
        hashtags: postContent.original.hashtags,
        imageUrl: postContent.original.imageUrl,
      }, platformConfigs);

      const allSuccessful = publishResults.every(r => r.success);
      
      await supabase
        .from('posts')
        .update({ 
          status: allSuccessful ? 'posted' : 'failed',
          posted_at: allSuccessful ? new Date().toISOString() : null,
          metrics: { results: publishResults }
        })
        .eq('id', post.id);

      console.log(`Post ${post.id} status updated: ${allSuccessful ? 'posted' : 'failed'}`);
        
    } catch (error) {
      console.error(`Generation failed for user ${job.data.userId}:`, error);
      throw error;
    }
  },
  { connection: redisConnection }
);

autopilotWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

autopilotWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
