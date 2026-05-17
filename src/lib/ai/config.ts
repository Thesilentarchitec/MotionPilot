import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Use a getter to avoid initializing at build time when env vars might be missing
export const getAnthropic = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your-anthropic-key') {
    // Return a dummy client that will fail gracefully if used, 
    // but won't crash the import during build.
    return new Anthropic({ apiKey: 'dummy-key' });
  }
  return new Anthropic({
    apiKey: apiKey,
  });
};

export const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your-openai-key') {
    return new OpenAI({ apiKey: 'dummy-key' });
  }
  return new OpenAI({
    apiKey: apiKey,
  });
};
