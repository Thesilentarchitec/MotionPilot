import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Use a getter to avoid initializing at build time when env vars might be missing
export const getAnthropic = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not defined');
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
};

export const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};
