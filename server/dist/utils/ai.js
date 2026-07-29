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
export async function chatWithAI(messages, provider = 'openai') {
    if (provider === 'gemini' && gemini) {
        const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const history = messages.slice(0, -1).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));
        const chat = model.startChat({
            history,
            systemInstruction: SYSTEM_PROMPT,
        });
        const last = messages[messages.length - 1];
        const result = await chat.sendMessage(last.content);
        return result.response.text();
    }
    if (openai) {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
            max_tokens: 1500,
        });
        return response.choices[0]?.message?.content || 'No response generated.';
    }
    throw new Error('No AI provider configured. Set OPENAI_API_KEY or GEMINI_API_KEY.');
}
export async function generateContent(prompt, type) {
    const typePrompts = {
        blog: 'Write a professional, SEO-friendly blog post in markdown format.',
        resume: 'Generate a professional ATS-friendly resume/CV in clean markdown format.',
        tutor: 'Act as an expert tutor. Explain clearly with examples.',
        social: 'Generate engaging social media content.',
        summary: 'Provide a concise summary with key points.',
    };
    const fullPrompt = `${typePrompts[type]}\n\n${prompt}`;
    if (openai) {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: fullPrompt },
            ],
            max_tokens: 2000,
        });
        return response.choices[0]?.message?.content || '';
    }
    if (gemini) {
        const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
    }
    throw new Error('No AI provider configured.');
}
export async function analyzeDocument(text) {
    const prompt = `Analyze the following document and provide:
1. Executive Summary
2. Key Points (bullet list)
3. Important Details
4. Recommendations (if applicable)

Document:
${text.slice(0, 8000)}`;
    return generateContent(prompt, 'summary');
}
