import { Worker, Job } from 'bullmq';
import { redisConnection } from './redis';
import { processAutopilotForUser } from './autopilot-core';

export const autopilotWorker = new Worker(
  'autopilot',
  async (job: Job) => {
    console.log(`Processing job ${job.id} for user ${job.data.userId}`);
    return await processAutopilotForUser(job.data.userId);
  },
  { connection: redisConnection }
);

autopilotWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

autopilotWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
