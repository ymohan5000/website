import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';

const openai = config.openaiApiKey
  ? new OpenAI({ apiKey: config.openaiApiKey })
  : null;

const gemini = config.geminiApiKey
  ? new GoogleGenerativeAI(config.geminiApiKey)
  : null;

const SYSTEM_PROMPT = `You are Yadav AI, the intelligent assistant for Mohan Yadav Digital Solutions.
Mohan Yadav is a Full Stack Developer, AI Developer, and IT Service Provider from Butwal, Nepal.
Contact: ymohan5000@gmail.com, WhatsApp: +9779811639830
Services: Web Development, AI Development, CV/Resume, Software Installation, Hardware Maintenance, Education & Training, IoT & Robotics, Cybersecurity.
Be helpful, professional, and concise. Answer questions about programming, web development, services, and learning.`;

const GEMINI_MODEL = 'gemini-2.0-flash';
const OPENAI_MODEL = 'gpt-4o-mini';

type Provider = 'openai' | 'gemini';

function isRetryableProviderError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const message = error.message.toLowerCase();
  return (
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('429') ||
    message.includes('401') ||
    message.includes('403') ||
    message.includes('invalid api key') ||
    message.includes('api key not valid')
  );
}

function localFallbackResponse(message: string): string {
  const text = message.toLowerCase();

  if (text.includes('service') || text.includes('offer')) {
    return 'Mohan Yadav Digital Solutions offers Website Development, AI Development, CV & Resume services, Software Installation, Hardware Maintenance, Education & Training, IoT & Robotics, and Cybersecurity. Contact ymohan5000@gmail.com or WhatsApp +9779811639830.';
  }

  if (text.includes('contact') || text.includes('email') || text.includes('whatsapp')) {
    return 'You can reach Mohan Yadav at ymohan5000@gmail.com or WhatsApp +9779811639830.';
  }

  if (text.includes('price') || text.includes('cost') || text.includes('hire')) {
    return 'Pricing depends on the project scope. Share your requirements through the contact page or WhatsApp +9779811639830 for a quote.';
  }

  if (text.includes('react') || text.includes('node') || text.includes('mongodb')) {
    return 'Mohan works with React, Node.js, Express, MongoDB, TypeScript, and AI integrations. Ask a specific question and I can help once the AI providers are available again.';
  }

  return 'Yadav AI is temporarily running in offline mode because the configured AI providers are unavailable. For urgent help, contact ymohan5000@gmail.com or WhatsApp +9779811639830.';
}

async function chatWithOpenAI(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  if (!openai) throw new Error('OpenAI is not configured');

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    max_tokens: 1500,
  });

  return response.choices[0]?.message?.content || 'No response generated.';
}

async function chatWithGemini(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  if (!gemini) throw new Error('Gemini is not configured');

  const model = gemini.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
  });

  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'user' ? ('user' as const) : ('model' as const),
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const last = messages[messages.length - 1];
  const result = await chat.sendMessage(last.content);
  return result.response.text();
}

function getProviderOrder(requested: Provider | 'auto'): Provider[] {
  if (requested === 'gemini') return ['gemini', 'openai'];
  if (requested === 'openai') return ['openai', 'gemini'];
  return ['openai', 'gemini'];
}

export async function chatWithAI(
  messages: { role: 'user' | 'assistant'; content: string }[],
  provider: Provider | 'auto' = 'auto'
): Promise<string> {
  const providers = getProviderOrder(provider).filter((name) =>
    name === 'openai' ? Boolean(openai) : Boolean(gemini)
  );

  if (!providers.length) {
    return localFallbackResponse(messages[messages.length - 1]?.content || '');
  }

  const errors: string[] = [];

  for (const name of providers) {
    try {
      return name === 'openai'
        ? await chatWithOpenAI(messages)
        : await chatWithGemini(messages);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown provider error';
      console.warn(`${name} chat failed:`, message);
      errors.push(`${name}: ${message}`);
      if (!isRetryableProviderError(error)) break;
    }
  }

  console.warn('All AI providers failed, using local fallback.', errors.join(' | '));
  return localFallbackResponse(messages[messages.length - 1]?.content || '');
}

export async function generateContent(
  prompt: string,
  type: 'blog' | 'resume' | 'tutor' | 'social' | 'summary'
): Promise<string> {
  const typePrompts: Record<string, string> = {
    blog: 'Write a professional, SEO-friendly blog post in markdown format.',
    resume: 'Generate a professional ATS-friendly resume/CV in clean markdown format.',
    tutor: 'Act as an expert tutor. Explain clearly with examples.',
    social: 'Generate engaging social media content.',
    summary: 'Provide a concise summary with key points.',
  };

  const fullPrompt = `${typePrompts[type]}\n\n${prompt}`;
  const chatMessages = [{ role: 'user' as const, content: fullPrompt }];
  const result = await chatWithAI(chatMessages, 'auto');

  if (result.startsWith('Yadav AI is temporarily running in offline mode')) {
    throw new Error('AI generation is unavailable right now. Check your OpenAI or Gemini API keys and billing.');
  }

  return result;
}

export async function analyzeDocument(text: string): Promise<string> {
  const prompt = `Analyze the following document and provide:
1. Executive Summary
2. Key Points (bullet list)
3. Important Details
4. Recommendations (if applicable)

Document:
${text.slice(0, 8000)}`;

  return generateContent(prompt, 'summary');
}
