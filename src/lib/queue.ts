import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const autopilotQueue = new Queue('autopilot', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
  },
});

export const AUTOPILOT_JOB_NAME = 'generate-and-post';
