import './worker'; // Import worker to start it
import { initAllUserSchedules } from './init-scheduler';

console.log('Starting MotionPilot Worker and Scheduler...');

initAllUserSchedules()
  .then(() => {
    console.log('Schedules initialized successfully');
  })
  .catch((err) => {
    console.error('Failed to initialize schedules during startup:', err);
  });

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  process.exit(0);
});
