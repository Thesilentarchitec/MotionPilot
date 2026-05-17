import { createAdminClient } from './supabase/server';
import { syncUserSchedule, DEFAULT_SCHEDULE } from './scheduler';

export async function initAllUserSchedules() {
  const supabase = createAdminClient();
  
  const { data: allSettings, error } = await supabase
    .from('settings')
    .select('user_id, schedule_times');
    
  if (error) {
    console.error('Failed to fetch all settings:', error);
    return;
  }
  
  console.log(`Initializing schedules for ${allSettings?.length} users`);
  
  for (const settings of allSettings || []) {
    const scheduleTimes = settings.schedule_times as string[] || DEFAULT_SCHEDULE;
    await syncUserSchedule(settings.user_id, scheduleTimes);
  }
}

if (require.main === module) {
  initAllUserSchedules()
    .then(() => {
      console.log('All user schedules initialized');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to initialize schedules:', err);
      process.exit(1);
    });
}
