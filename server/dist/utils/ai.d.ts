export declare function chatWithAI(messages: {
    role: 'user' | 'assistant';
    content: string;
}[], provider?: 'openai' | 'gemini'): Promise<string>;
export declare function generateContent(prompt: string, type: 'blog' | 'resume' | 'tutor' | 'social' | 'summary'): Promise<string>;
export declare function analyzeDocument(text: string): Promise<string>;
