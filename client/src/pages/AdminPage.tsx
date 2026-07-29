import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard, FileText, Briefcase, BookOpen, Image, MessageSquare,
  Plus, UploadCloud, Trash2, CheckCircle, ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store';
import Loading from '@/components/Loading';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'blog', label: 'Create Blog' },
  { id: 'project', label: 'Add Project' },
  { id: 'note', label: 'Upload Note' },
  { id: 'messages', label: 'View Messages' },
];

const statCards = [
  { key: 'blogs', label: 'Total Blogs', icon: FileText },
  { key: 'projects', label: 'Projects', icon: Briefcase },
  { key: 'notes', label: 'Notes', icon: BookOpen },
  { key: 'gallery', label: 'Gallery', icon: Image },
  { key: 'unreadMessages', label: 'Unread Messages', icon: MessageSquare },
];

const mediaTypes = ['image', 'photo', 'audio', 'video', 'link'] as const;

type MediaType = (typeof mediaTypes)[number];

export default function AdminPage() {
  const { user, isAdmin } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then((r) => r.data.stats),
    enabled: isAdmin(),
  });

  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => api.get('/messages').then((r) => r.data.messages),
    enabled: isAdmin() && activeTab === 'messages',
  });

  const [blogForm, setBlogForm] = useState({
    slug: '',
    title: '',
    category: '',
    tags: '',
    excerpt: '',
    content: '',
    coverImage: '',
    published: true,
  });
  const [blogMedia, setBlogMedia] = useState<{ type: MediaType; url: string; title: string; caption: string }[]>([]);
  const [blogMediaDraft, setBlogMediaDraft] = useState({ type: 'image' as MediaType, url: '', title: '', caption: '' });

  const [projectForm, setProjectForm] = useState({
    slug: '',
    name: '',
    category: '',
    badge: '',
    year: '',
    role: '',
    tags: '',
    description: '',
    features: '',
    technologies: '',
    demo: '',
    code: '',
    coverImage: '',
    featured: false,
  });
  const [projectMedia, setProjectMedia] = useState<{ type: MediaType; url: string; title: string; caption: string }[]>([]);
  const [projectMediaDraft, setProjectMediaDraft] = useState({ type: 'image' as MediaType, url: '', title: '', caption: '' });

  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    category: '',
    subject: '',
    fileUrl: '',
    fileType: '',
    published: true,
  });

  const createBlog = useMutation((body: Record<string, unknown>) => api.post('/blogs', body), {
    onSuccess: () => {
      toast.success('Blog created successfully');
      queryClient.invalidateQueries(['admin-stats']);
      setBlogForm({ slug: '', title: '', category: '', tags: '', excerpt: '', content: '', coverImage: '', published: true });
      setBlogMedia([]);
    },
    onError: () => toast.error('Could not create blog'),
  });

  const createProject = useMutation((body: Record<string, unknown>) => api.post('/projects', body), {
    onSuccess: () => {
      toast.success('Project added successfully');
      queryClient.invalidateQueries(['admin-stats']);
      setProjectForm({ slug: '', name: '', category: '', badge: '', year: '', role: '', tags: '', description: '', features: '', technologies: '', demo: '', code: '', coverImage: '', featured: false });
      setProjectMedia([]);
    },
    onError: () => toast.error('Could not add project'),
  });

  const createNote = useMutation((body: Record<string, unknown>) => api.post('/notes', body), {
    onSuccess: () => {
      toast.success('Note uploaded successfully');
      queryClient.invalidateQueries(['admin-stats']);
      setNoteForm({ title: '', description: '', category: '', subject: '', fileUrl: '', fileType: '', published: true });
    },
    onError: () => toast.error('Could not upload note'),
  });

  const markMessageRead = useMutation((id: string) => api.put(`/messages/${id}/read`), {
    onSuccess: () => {
      toast.success('Message marked as read');
      refetchMessages();
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: () => toast.error('Could not update message'),
  });

  const deleteMessage = useMutation((id: string) => api.delete(`/messages/${id}`), {
    onSuccess: () => {
      toast.success('Message deleted');
      refetchMessages();
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: () => toast.error('Could not delete message'),
  });

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/" />;
  if (isLoading) return <Loading />;

  const handleAddBlogMedia = () => {
    if (!blogMediaDraft.url) return;
    setBlogMedia((prev) => [...prev, blogMediaDraft]);
    setBlogMediaDraft({ type: 'image', url: '', title: '', caption: '' });
  };

  const handleAddProjectMedia = () => {
    if (!projectMediaDraft.url) return;
    setProjectMedia((prev) => [...prev, projectMediaDraft]);
    setProjectMediaDraft({ type: 'image', url: '', title: '', caption: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-surface-card border border-surface-border px-4 py-3 shadow-sm shadow-black/10">
            <LayoutDashboard className="w-8 h-8 text-primary-500" />
            <div>
              <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
              <p className="text-slate-400">Manage blogs, projects, notes, and messages from one place.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {statCards.map(({ key, label, icon: Icon }) => (
          <div key={key} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-6 h-6 text-primary-500" />
              <span className="text-2xl font-semibold">{data?.[key] ?? 0}</span>
            </div>
            <p className="text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${activeTab === tab.id ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Quick actions</h2>
              <div className="space-y-3">
                <div className="rounded-2xl border border-surface-border bg-slate-950 p-4">
                  <div className="flex items-center gap-3 text-slate-200">
                    <Plus className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-medium">Create Blog</p>
                      <p className="text-sm text-slate-500">Add posts with images, audio, video, and links.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-surface-border bg-slate-950 p-4">
                  <div className="flex items-center gap-3 text-slate-200">
                    <UploadCloud className="w-5 h-5 text-secondary-500" />
                    <div>
                      <p className="font-medium">Upload Notes</p>
                      <p className="text-sm text-slate-500">Publish notes with file links for students.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Platform health</h2>
              <p className="text-slate-400 mb-4">Use the tabs to manage content, then review messages and maintain a clean, responsive SaaS-style admin interface.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-950 p-4 border border-surface-border">
                  <p className="text-sm text-slate-500">Pending reviews</p>
                  <p className="text-lg font-semibold text-white">{data?.pendingReviews ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4 border border-surface-border">
                  <p className="text-sm text-slate-500">Unread messages</p>
                  <p className="text-lg font-semibold text-white">{data?.unreadMessages ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Create a new blog</h2>
                <p className="text-slate-400">Publish premium posts with rich media support.</p>
              </div>
              <button type="button" className="btn-secondary flex items-center gap-2" onClick={() => { setActiveTab('overview'); }}>
                <ExternalLink className="w-4 h-4" /> Back to overview
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Title
                  <input
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="Enter blog title"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Slug
                  <input
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="unique-blog-slug"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Category
                  <input
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="Web Development"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Tags (comma separated)
                  <input
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="react,saas,ui"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Excerpt
                  <textarea
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    rows={4}
                    placeholder="Write a short blog summary."
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Cover image URL
                  <input
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </label>
              </div>
              <div className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Blog content
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    rows={12}
                    placeholder="Write the full blog content in markdown or plain text."
                  />
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={blogForm.published}
                    onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-primary-500 focus:ring-primary-500"
                  />
                  Publish immediately
                </label>
              </div>
            </div>

            <div className="border-t border-surface-border pt-6">
              <h3 className="text-lg font-semibold mb-4">Media items</h3>
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                  <label className="block text-sm text-slate-300">
                    Type
                    <select
                      value={blogMediaDraft.type}
                      onChange={(e) => setBlogMediaDraft({ ...blogMediaDraft, type: e.target.value as MediaType })}
                      className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    >
                      {mediaTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm text-slate-300">
                    URL
                    <input
                      value={blogMediaDraft.url}
                      onChange={(e) => setBlogMediaDraft({ ...blogMediaDraft, url: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Title
                    <input
                      value={blogMediaDraft.title}
                      onChange={(e) => setBlogMediaDraft({ ...blogMediaDraft, title: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                      placeholder="Hero image, Demo video, Audio clip"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Caption
                    <input
                      value={blogMediaDraft.caption}
                      onChange={(e) => setBlogMediaDraft({ ...blogMediaDraft, caption: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                      placeholder="A short description displayed in the post."
                    />
                  </label>
                  <button type="button" onClick={handleAddBlogMedia} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add media item
                  </button>
                </div>
                <div className="rounded-3xl border border-surface-border bg-slate-950 p-4">
                  <p className="text-sm text-slate-500 mb-3">Current media</p>
                  <div className="space-y-3">
                    {blogMedia.length === 0 ? (
                      <p className="text-sm text-slate-400">No media items added yet.</p>
                    ) : (
                      blogMedia.map((item, index) => (
                        <div key={`${item.url}-${index}`} className="rounded-2xl border border-slate-800 p-3 bg-slate-900">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-white">{item.title || item.url}</p>
                              <p className="text-xs text-slate-500">{item.type}</p>
                            </div>
                            <button type="button" onClick={() => setBlogMedia((prev) => prev.filter((_, idx) => idx !== index))} className="text-slate-400 hover:text-danger-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {item.caption && <p className="mt-2 text-sm text-slate-500">{item.caption}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => createBlog.mutate({
                ...blogForm,
                tags: blogForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                media: blogMedia,
              })}
              className="btn-primary mt-6"
            >
              <CheckCircle className="w-4 h-4" /> Create blog post
            </button>
          </div>
        )}

        {activeTab === 'project' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Add a new project</h2>
                <p className="text-slate-400">Publish projects with rich media, demo links, and code references.</p>
              </div>
              <button type="button" className="btn-secondary flex items-center gap-2" onClick={() => setActiveTab('overview')}>
                <ExternalLink className="w-4 h-4" /> Back to overview
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Project name
                  <input
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="SaaS Dashboard UI"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Slug
                  <input
                    value={projectForm.slug}
                    onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="saas-dashboard-ui"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Category
                  <input
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="Web App"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Badge
                  <input
                    value={projectForm.badge}
                    onChange={(e) => setProjectForm({ ...projectForm, badge: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="Featured"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Year
                  <input
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="2026"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Role
                  <input
                    value={projectForm.role}
                    onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="Lead Developer"
                  />
                </label>
              </div>
              <div className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Demo URL
                  <input
                    value={projectForm.demo}
                    onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="https://demo.example.com"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Code URL
                  <input
                    value={projectForm.code}
                    onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Cover image URL
                  <input
                    value={projectForm.coverImage}
                    onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Tags
                  <input
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    placeholder="react,tailwind,saas"
                  />
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-primary-500 focus:ring-primary-500"
                  />
                  Feature this project
                </label>
              </div>
            </div>
            <label className="block text-sm text-slate-300 mt-4">
              Description
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                rows={4}
              />
            </label>
            <div className="grid gap-4 lg:grid-cols-2 mt-4">
              <label className="block text-sm text-slate-300">
                Features (comma separated)
                <input
                  value={projectForm.features}
                  onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                  placeholder="Responsive UI, Admin panel"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Technologies
                <input
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                  placeholder="React,Node,MongoDB"
                />
              </label>
            </div>

            <div className="border-t border-surface-border pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Media items</h3>
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                  <label className="block text-sm text-slate-300">
                    Type
                    <select
                      value={projectMediaDraft.type}
                      onChange={(e) => setProjectMediaDraft({ ...projectMediaDraft, type: e.target.value as MediaType })}
                      className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                    >
                      {mediaTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm text-slate-300">
                    URL
                    <input
                      value={projectMediaDraft.url}
                      onChange={(e) => setProjectMediaDraft({ ...projectMediaDraft, url: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Title
                    <input
                      value={projectMediaDraft.title}
                      onChange={(e) => setProjectMediaDraft({ ...projectMediaDraft, title: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                      placeholder="Demo walkthrough"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    Caption
                    <input
                      value={projectMediaDraft.caption}
                      onChange={(e) => setProjectMediaDraft({ ...projectMediaDraft, caption: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                      placeholder="Short caption"
                    />
                  </label>
                  <button type="button" onClick={handleAddProjectMedia} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add media
                  </button>
                </div>
                <div className="rounded-3xl border border-surface-border bg-slate-950 p-4">
                  <p className="text-sm text-slate-500 mb-3">Current media</p>
                  <div className="space-y-3">
                    {projectMedia.length === 0 ? (
                      <p className="text-sm text-slate-400">No media items added yet.</p>
                    ) : (
                      projectMedia.map((item, index) => (
                        <div key={`${item.url}-${index}`} className="rounded-2xl border border-slate-800 p-3 bg-slate-900">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-white">{item.title || item.url}</p>
                              <p className="text-xs text-slate-500">{item.type}</p>
                            </div>
                            <button type="button" onClick={() => setProjectMedia((prev) => prev.filter((_, idx) => idx !== index))} className="text-slate-400 hover:text-danger-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {item.caption && <p className="mt-2 text-sm text-slate-500">{item.caption}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => createProject.mutate({
                ...projectForm,
                year: projectForm.year ? Number(projectForm.year) : undefined,
                tags: projectForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                features: projectForm.features.split(',').map((item) => item.trim()).filter(Boolean),
                technologies: projectForm.technologies.split(',').map((item) => item.trim()).filter(Boolean),
                media: projectMedia,
              })}
              className="btn-primary mt-6"
            >
              <CheckCircle className="w-4 h-4" /> Add project
            </button>
          </div>
        )}

        {activeTab === 'note' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Upload a note</h2>
                <p className="text-slate-400">Share notes with an interactive, responsive note library.</p>
              </div>
              <button type="button" className="btn-secondary flex items-center gap-2" onClick={() => setActiveTab('overview')}>
                <ExternalLink className="w-4 h-4" /> Back to overview
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block text-sm text-slate-300">
                Title
                <input
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                  placeholder="JavaScript Cheat Sheet"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Subject
                <input
                  value={noteForm.subject}
                  onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                  placeholder="Programming"
                />
              </label>
            </div>
            <label className="block text-sm text-slate-300 mt-4">
              Category
              <input
                value={noteForm.category}
                onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                placeholder="Computer Science"
              />
            </label>
            <label className="block text-sm text-slate-300 mt-4">
              Description
              <textarea
                value={noteForm.description}
                onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                rows={5}
                placeholder="Describe the note contents and learning goals."
              />
            </label>
            <div className="grid gap-4 lg:grid-cols-2 mt-4">
              <label className="block text-sm text-slate-300">
                File URL
                <input
                  value={noteForm.fileUrl}
                  onChange={(e) => setNoteForm({ ...noteForm, fileUrl: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                  placeholder="https://..."
                />
              </label>
              <label className="block text-sm text-slate-300">
                File type
                <input
                  value={noteForm.fileType}
                  onChange={(e) => setNoteForm({ ...noteForm, fileType: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-surface-border bg-slate-950 px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                  placeholder="pdf, docx, mp3"
                />
              </label>
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-300 mt-4">
              <input
                type="checkbox"
                checked={noteForm.published}
                onChange={(e) => setNoteForm({ ...noteForm, published: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-primary-500 focus:ring-primary-500"
              />
              Publish note immediately
            </label>
            <button
              type="button"
              onClick={() => createNote.mutate(noteForm)}
              className="btn-primary mt-6"
            >
              <UploadCloud className="w-4 h-4" /> Upload note
            </button>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Messages</h2>
                <p className="text-slate-400">Read and manage contact messages from users.</p>
              </div>
              <button type="button" className="btn-secondary" onClick={() => refetchMessages()}>
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {(messagesData || []).length === 0 ? (
                <div className="rounded-3xl border border-surface-border bg-slate-950 p-6 text-slate-400">
                  No messages yet.
                </div>
              ) : (
                messagesData.map((message: any) => (
                  <div key={message._id} className="rounded-3xl border border-surface-border bg-slate-950 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{message.name}</p>
                        <p className="text-sm text-slate-500">{message.email}{message.phone ? ` · ${message.phone}` : ''}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`rounded-full px-3 py-1 ${message.read ? 'bg-slate-800 text-slate-300' : 'bg-primary-500/15 text-primary-200'}`}>{message.read ? 'Read' : 'Unread'}</span>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-400">{new Date(message.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4">{message.message}</p>
                    <div className="flex flex-wrap gap-2">
                      {!message.read && (
                        <button
                          type="button"
                          onClick={() => markMessageRead.mutate(message._id)}
                          className="btn-secondary"
                        >
                          <CheckCircle className="w-4 h-4" /> Mark read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteMessage.mutate(message._id)}
                        className="btn-secondary text-danger-500 border-danger-500 hover:bg-danger-500/10"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
