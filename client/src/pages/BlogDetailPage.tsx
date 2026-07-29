import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, Eye, Link as LinkIcon, Play, Image as ImageIcon, Mic, Video } from 'lucide-react';
import api from '@/lib/api';
import Loading from '@/components/Loading';
import { formatDate } from '@/lib/utils';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get(`/blogs/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });

  if (isLoading) return <Loading />;
  if (!data?.blog) return <div className="text-center py-20">Blog not found</div>;

  const { blog, related } = data;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Link to="/blog" className="inline-flex items-center gap-2 text-primary-500 mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="rounded-3xl overflow-hidden border border-surface-border bg-slate-950 shadow-xl shadow-black/20 mb-8">
        {blog.coverImage ? (
          <img src={blog.coverImage} alt={blog.title} className="w-full h-72 object-cover" />
        ) : (
          <div className="h-72 flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
            <span className="text-6xl font-display font-bold text-primary-500">{blog.title.charAt(0)}</span>
          </div>
        )}
        <div className="p-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="rounded-full bg-slate-900 px-3 py-1">{blog.category}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {blog.readingTime} min read</span>
            <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> {blog.views}</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </div>

      {blog.media?.length > 0 && (
        <section className="grid gap-6 mb-10 md:grid-cols-2">
          {blog.media.map((item: any, index: number) => (
            <div key={`${item.url}-${index}`} className="rounded-3xl border border-surface-border bg-slate-950 p-4 shadow-sm shadow-black/10">
              <div className="flex items-center gap-3 mb-3 text-slate-300">
                {item.type === 'video' && <Video className="w-5 h-5 text-secondary-500" />}
                {item.type === 'audio' && <Mic className="w-5 h-5 text-success-500" />}
                {item.type === 'image' || item.type === 'photo' ? <ImageIcon className="w-5 h-5 text-primary-500" /> : null}
                {item.type === 'link' && <LinkIcon className="w-5 h-5 text-accent-500" />}
                <span className="uppercase tracking-[0.15em] text-[11px] text-slate-500">{item.type}</span>
              </div>
              {item.type === 'video' ? (
                <video controls src={item.url} className="w-full rounded-2xl bg-black" />
              ) : item.type === 'audio' ? (
                <audio controls src={item.url} className="w-full" />
              ) : item.type === 'link' ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary-500 hover:text-secondary-500">
                  <LinkIcon className="w-4 h-4" /> Open link
                </a>
              ) : (
                <img src={item.url} alt={item.title || blog.title} className="w-full h-48 rounded-2xl object-cover" />
              )}
              <div className="mt-4">
                {item.title && <h3 className="font-semibold text-white">{item.title}</h3>}
                {item.caption && <p className="text-slate-400 text-sm mt-1">{item.caption}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="prose prose-invert max-w-none mb-16 text-slate-100">
        <pre className="whitespace-pre-wrap font-sans leading-relaxed">{blog.content}</pre>
      </section>

      {related?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Related Posts</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((post: { _id: string; slug: string; title: string; category: string }) => (
              <Link key={post._id} to={`/blog/${post.slug}`} className="card hover:scale-[1.02] transition-all">
                <span className="text-xs text-primary-500">{post.category}</span>
                <h3 className="font-semibold mt-1 text-white">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
