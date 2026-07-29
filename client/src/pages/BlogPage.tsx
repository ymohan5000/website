import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, Clock, Eye } from 'lucide-react';
import api from '@/lib/api';
import { SkeletonCard } from '@/components/Loading';
import { formatDate } from '@/lib/utils';

const categories = ['All', 'Web Development', 'AI', 'Cybersecurity', 'Programming', 'IoT', 'Robotics', 'Software', 'Career'];

export default function BlogPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', category, search],
    queryFn: () => api.get('/blogs', {
      params: {
        category: category === 'All' ? undefined : category,
        search: search || undefined,
        limit: 20,
      },
    }).then((r) => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="section-title">Blog</h1>
        <p className="section-subtitle mx-auto">Technology articles, tutorials, and insights.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary-500 text-white'
                  : 'glass hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.blogs || []).map((blog: {
            _id: string; slug: string; title: string; excerpt: string;
            category: string; readingTime: number; views: number;
            tone?: string; createdAt: string;
          }, i: number) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link to={`/blog/${blog.slug}`} className="card block hover:scale-[1.02] transition-all group">
                <div
                  className="h-40 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${blog.tone || '#6366f1'}33, ${blog.tone || '#6366f1'}66)` }}
                >
                  <span className="text-2xl font-display font-bold" style={{ color: blog.tone || '#6366f1' }}>
                    {blog.title.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-primary-600 dark:text-primary-400">{blog.category}</span>
                <h3 className="font-semibold text-lg mt-1 mb-2 group-hover:text-primary-600 transition-colors">{blog.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{blog.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readingTime} min</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {blog.views}</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
