import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, FileText, GraduationCap, PenTool, FileSearch, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const tools = [
  { id: 'chatbot', icon: Bot, title: 'AI Chatbot', desc: 'Ask anything about programming, services, or learning' },
  { id: 'resume', icon: FileText, title: 'Resume Builder', desc: 'Generate professional ATS-friendly CVs' },
  { id: 'tutor', icon: GraduationCap, title: 'AI Tutor', desc: 'Learn concepts with examples and quizzes' },
  { id: 'content', icon: PenTool, title: 'Content Generator', desc: 'Create blog posts and social media content' },
  { id: 'analyzer', icon: FileSearch, title: 'Document Analyzer', desc: 'Upload and analyze documents with AI' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIPage() {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [genInput, setGenInput] = useState('');
  const [genOutput, setGenOutput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendChat = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: userMsg, sessionId });
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      toast.error('AI service unavailable. Check API keys.');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I am temporarily unavailable. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const generate = async (type: string) => {
    if (!genInput.trim()) return;
    setLoading(true);
    setGenOutput('');
    try {
      const { data } = await api.post('/ai/generate', { prompt: genInput, type });
      setGenOutput(data.content);
    } catch {
      toast.error('Generation failed. Check API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const typeMap: Record<string, string> = {
    resume: 'resume', tutor: 'tutor', content: 'blog', analyzer: 'summary',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-primary-500" />
          <h1 className="section-title mb-0">Yadav AI</h1>
        </div>
        <p className="section-subtitle mx-auto">Intelligent assistant powered by OpenAI and Gemini.</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          {tools.map(({ id, icon: Icon, title, desc }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setGenOutput(''); }}
              className={`w-full text-left card p-4 transition-all ${activeTab === id ? 'ring-2 ring-primary-500' : ''}`}
            >
              <Icon className="w-5 h-5 text-primary-500 mb-2" />
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'chatbot' ? (
            <div className="card flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-20">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me about programming, web development, services, or learning!</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl text-sm animate-pulse">Thinking...</div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button onClick={sendChat} disabled={loading} className="btn-primary px-4">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <h3 className="font-semibold text-lg mb-4">{tools.find((t) => t.id === activeTab)?.title}</h3>
              <textarea
                value={genInput}
                onChange={(e) => setGenInput(e.target.value)}
                placeholder={
                  activeTab === 'resume' ? 'Enter your details: name, education, skills, experience...'
                    : activeTab === 'tutor' ? 'What concept would you like to learn?'
                    : activeTab === 'content' ? 'Describe the content you want to generate...'
                    : 'Paste document text to analyze...'
                }
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none mb-4"
              />
              <button
                onClick={() => generate(typeMap[activeTab] || 'summary')}
                disabled={loading}
                className="btn-primary mb-6"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
              {genOutput && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm font-sans">{genOutput}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
