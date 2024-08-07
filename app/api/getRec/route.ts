import { createParser } from 'eventsource-parser';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
// import prisma from '../../../../lib/prisma';
import { OpenAI } from 'openai';
import { PassThrough } from 'stream';
import { OpenAIStream, StreamingTextResponse, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextRequest } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = createOpenAI({
  apiKey: OPENAI_API_KEY
});

const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same userId in 10 seconds
  limiter: Ratelimit.slidingWindow(6, '1 d')
});

async function generatePrompts(searched) {
  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages: [{ role: 'user', content: searched }],
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0
  });

  return new StreamingTextResponse(result.toAIStream());
}

export async function POST(request: NextRequest) {
  const res = await request.json();
  const { prompt } = res;

  const searchParams = request.nextUrl.searchParams;
  const clientIp = searchParams.get('clientIp') ?? '127.0.0.1';

  try {
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(clientIp);

    if (success) {
      return generatePrompts(prompt);
    }
    throw Error('Too many requests');
  } catch (e) {
    return Response.json({ response: e.message });
  }
}
