import { autopilotQueue, AUTOPILOT_JOB_NAME } from './queue';

export async function syncUserSchedule(userId: string, scheduleTimes: string[]) {
  // 1. Remove existing repeatable jobs for this user
  const repeatableJobs = await autopilotQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    if (job.id?.startsWith(`user_${userId}`)) {
      await autopilotQueue.removeRepeatableByKey(job.key);
    }
  }

  // 2. Add new repeatable jobs
  for (const time of scheduleTimes) {
    const [hour, minute] = time.split(':');
    const cron = `${minute} ${hour} * * *`;
    
    await autopilotQueue.add(
      AUTOPILOT_JOB_NAME,
      { userId },
      {
        repeat: {
          pattern: cron,
        },
        jobId: `user_${userId}_${time}`,
      }
    );
  }
  
  console.log(`Scheduled ${scheduleTimes.length} jobs for user ${userId}`);
}

export const DEFAULT_SCHEDULE = ['06:00', '10:00', '13:00', '16:00', '19:00', '22:00'];
