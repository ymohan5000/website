import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Image, Video, Music, Scan, Shield, QrCode, Key,
  Merge, Split, Download, ArrowRight,
} from 'lucide-react';

const toolCategories = [
  {
    title: 'PDF Tools',
    icon: FileText,
    tools: [
      { name: 'PDF Maker', desc: 'Convert text/images to PDF', icon: FileText },
      { name: 'PDF Converter', desc: 'Convert PDF to other formats', icon: Download },
      { name: 'PDF Compressor', desc: 'Reduce PDF file size', icon: Download },
      { name: 'PDF Merger', desc: 'Combine multiple PDFs', icon: Merge },
      { name: 'PDF Splitter', desc: 'Split PDF into pages', icon: Split },
    ],
  },
  {
    title: 'Image Tools',
    icon: Image,
    tools: [
      { name: 'Image Compressor', desc: 'Reduce image file size', icon: Download },
      { name: 'Image Converter', desc: 'Convert between formats', icon: Download },
      { name: 'Image Resizer', desc: 'Resize images to any dimension', icon: Image },
      { name: 'Background Remover', desc: 'Remove image backgrounds with AI', icon: Image },
    ],
  },
  {
    title: 'Video Tools',
    icon: Video,
    tools: [
      { name: 'Video Converter', desc: 'Convert video formats', icon: Download },
      { name: 'Video Compressor', desc: 'Reduce video file size', icon: Download },
    ],
  },
  {
    title: 'Audio Tools',
    icon: Music,
    tools: [
      { name: 'MP3 Converter', desc: 'Convert audio to MP3', icon: Download },
      { name: 'Audio Converter', desc: 'Convert between audio formats', icon: Music },
    ],
  },
  {
    title: 'OCR Tool',
    icon: Scan,
    tools: [
      { name: 'Text Extractor', desc: 'Extract text from images', icon: Scan },
    ],
  },
  {
    title: 'Security Tools',
    icon: Shield,
    tools: [
      { name: 'Password Generator', desc: 'Generate secure passwords', icon: Key },
      { name: 'QR Generator', desc: 'Create QR codes', icon: QrCode },
    ],
  },
];

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);

  const generate = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  return (
    <div className="card">
      <h3 className="font-semibold mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-primary-500" /> Password Generator</h3>
      <div className="flex gap-2 mb-4">
        <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={8} max={64} className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
        <button onClick={generate} className="btn-primary flex-1">Generate</button>
      </div>
      {password && (
        <div className="flex gap-2">
          <code className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm break-all">{password}</code>
          <button onClick={() => navigator.clipboard.writeText(password)} className="btn-secondary text-sm">Copy</button>
        </div>
      )}
    </div>
  );
}

function QRGenerator() {
  const [text, setText] = useState('');
  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}` : '';

  return (
    <div className="card">
      <h3 className="font-semibold mb-4 flex items-center gap-2"><QrCode className="w-5 h-5 text-primary-500" /> QR Code Generator</h3>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter URL or text..." className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mb-4" />
      {qrUrl && (
        <div className="text-center">
          <img src={qrUrl} alt="QR Code" className="mx-auto rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default function ToolsPage() {
  const [activeUtility, setActiveUtility] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="section-title">Digital Tools</h1>
        <p className="section-subtitle mx-auto">Free online tools for PDF, image, video, audio, OCR, and security.</p>
      </motion.div>

      {activeUtility === 'password' && (
        <div className="mb-8"><PasswordGenerator /></div>
      )}
      {activeUtility === 'qr' && (
        <div className="mb-8"><QRGenerator /></div>
      )}

      <div className="space-y-12">
        {toolCategories.map((cat, ci) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <cat.icon className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-display font-bold">{cat.title}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.tools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => {
                    if (tool.name === 'Password Generator') setActiveUtility('password');
                    else if (tool.name === 'QR Generator') setActiveUtility('qr');
                  }}
                  className="card text-left hover:scale-[1.02] transition-all group"
                >
                  <tool.icon className="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tool.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-primary-600 mt-3">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
