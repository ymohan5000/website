import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Github, Tag, Image as ImageIcon, Video, Music } from 'lucide-react';
import api from '@/lib/api';
import Loading from '@/components/Loading';

export default function ProjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then((r) => r.data.projects),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="section-title">Projects</h1>
        <p className="section-subtitle mx-auto">Web applications, AI projects, and digital solutions I've built.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data || []).map((project: {
          _id: string; slug: string; name: string; description: string;
          category: string; badge?: string; tags: string[]; demo?: string; code?: string;
          coverImage?: string; image?: string; featured: boolean; media?: { type: string; url: string }[];
        }, i: number) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card group hover:scale-[1.02] flex flex-col"
          >
            <div className="h-44 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 mb-4 flex items-center justify-center overflow-hidden">
              {(project.coverImage || project.image) ? (
                <img src={project.coverImage || project.image} alt={project.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-display font-bold text-primary-500">{project.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {project.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/10 text-primary-200">{project.badge}</span>
              )}
              <span className="text-xs text-slate-400">{project.category}</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">{project.name}</h3>
            <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-3">{project.description}</p>
            {project.media?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {project.media.map((item, idx) => (
                  <span key={`${item.url}-${idx}`} className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                    {item.type === 'video' && <Video className="w-3 h-3" />}
                    {item.type === 'audio' && <Music className="w-3 h-3" />}
                    {(item.type === 'image' || item.type === 'photo') && <ImageIcon className="w-3 h-3" />}
                    {item.type === 'link' && <ExternalLink className="w-3 h-3" />}
                    {item.title || item.type}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-slate-900 text-slate-300">{tag}</span>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 flex-1 justify-center">
                  <ExternalLink className="w-4 h-4" /> Demo
                </a>
              )}
              {project.code && (
                <a href={project.code} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2 flex-1 justify-center">
                  <Github className="w-4 h-4" /> Code
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
