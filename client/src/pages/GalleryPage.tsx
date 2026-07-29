import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { X, Search, FolderOpen } from 'lucide-react';
import api from '@/lib/api';
import Loading from '@/components/Loading';

export default function GalleryPage() {
  const [folder, setFolder] = useState('All');
  const [search, setSearch] = useState('');
  const [lightbox, setLightbox] = useState<{ title: string; imageUrl: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', folder, search],
    queryFn: () => api.get('/gallery', {
      params: {
        folder: folder === 'All' ? undefined : folder,
        search: search || undefined,
      },
    }).then((r) => r.data),
  });

  const folders = ['All', ...(data?.folders || ['Projects', 'Events', 'Certificates', 'Social Work', 'Design'])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="section-title">Gallery</h1>
        <p className="section-subtitle mx-auto">Projects, events, certificates, and social work highlights.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gallery..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {folders.map((f: string) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 ${
                folder === f ? 'bg-primary-500 text-white' : 'glass'
              }`}
            >
              <FolderOpen className="w-4 h-4" /> {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <Loading /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(data?.items || []).length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No gallery items yet. Upload images via the admin dashboard.</p>
            </div>
          ) : (
            (data?.items || []).map((item: { _id: string; title: string; imageUrl: string; folder: string }, i: number) => (
              <motion.button
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setLightbox(item)}
                className="aspect-square rounded-xl overflow-hidden group relative"
              >
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</span>
                </div>
              </motion.button>
            ))
          )}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white p-2" aria-label="Close">
              <X className="w-8 h-8" />
            </button>
            <img src={lightbox.imageUrl} alt={lightbox.title} className="max-w-full max-h-[90vh] rounded-xl" />
            <p className="absolute bottom-4 text-white text-lg">{lightbox.title}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
