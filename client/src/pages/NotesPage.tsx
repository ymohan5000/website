import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Download, BookOpen, Filter } from 'lucide-react';
import api from '@/lib/api';
import Loading from '@/components/Loading';

const categories = ['All', 'Programming', 'Computer Science', 'Mathematics', 'Science', 'Loksewa', 'Engineering'];

export default function NotesPage() {
  const [category, setCategory] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['notes', category],
    queryFn: () => api.get('/notes', {
      params: { category: category === 'All' ? undefined : category },
    }).then((r) => r.data.notes),
  });

  const handleDownload = async (id: string) => {
    try {
      const { data: dl } = await api.get(`/notes/${id}/download`);
      if (dl.fileUrl) window.open(dl.fileUrl, '_blank');
    } catch {
      /* no file yet */
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="section-title">Study Notes</h1>
        <p className="section-subtitle mx-auto">Educational resources and study materials for students and developers.</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Filter className="w-5 h-5 text-gray-400 self-center" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              category === cat ? 'bg-primary-500 text-white' : 'glass'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? <Loading /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data || []).map((note: {
            _id: string; title: string; description: string;
            category: string; subject: string; downloads: number;
          }, i: number) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card flex flex-col"
            >
              <BookOpen className="w-8 h-8 text-primary-500 mb-3" />
              <span className="text-xs text-primary-600">{note.category} · {note.subject}</span>
              <h3 className="font-semibold text-lg mt-1 mb-2">{note.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">{note.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">{note.downloads} downloads</span>
                <button onClick={() => handleDownload(note._id)} className="btn-primary text-sm py-2">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
