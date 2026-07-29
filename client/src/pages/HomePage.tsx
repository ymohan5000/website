import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight, Bot, Code, Briefcase, BookOpen, Sparkles,
  Rocket, Users, FileText, Wrench,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const statIcons = [Briefcase, Users, BookOpen, Bot, FileText];

export default function HomePage() {
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ['home-stats'],
    queryFn: async () => {
      try {
        const [projects, blogs] = await Promise.all([
          api.get('/projects'),
          api.get('/blogs?limit=1'),
        ]);
        return {
          projects: projects.data.projects?.length || 10,
          clients: 25,
          blogs: blogs.data.total || 30,
          aiTools: 5,
          certificates: 8,
        };
      } catch {
        return { projects: 10, clients: 25, blogs: 30, aiTools: 5, certificates: 8 };
      }
    },
  });

  const statValues = stats ? [stats.projects, stats.clients, stats.blogs, stats.aiTools, stats.certificates] : [10, 25, 30, 5, 8];
  const statLabels = ['projects', 'clients', 'blogs', 'aiTools', 'certificates'];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">{t('hero.greeting')}</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
                {t('hero.name').split(' ')[0]}{' '}
                <span className="gradient-text">{t('hero.name').split(' ')[1]}</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">{t('hero.title')}</p>
              <p className="text-primary-600 dark:text-primary-400 mb-6">{t('hero.subtitle')}</p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">{t('hero.description')}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="btn-primary">
                  {t('hero.startProject')} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/services" className="btn-secondary">{t('hero.exploreServices')}</Link>
                <Link to="/ai" className="btn-secondary">
                  <Bot className="w-4 h-4" /> {t('hero.chatAI')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-purple-600/30 rounded-3xl blur-2xl animate-float" />
                <div className="relative glass rounded-3xl p-8 h-full flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-6">
                    <Code className="w-16 h-16 text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 w-full">
                    {['React', 'Node', 'AI', 'MongoDB', 'TS', 'Cloud'].map((tech) => (
                      <div key={tech} className="glass rounded-xl p-3 text-center text-sm font-medium animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {statLabels.map((label, i) => {
              const Icon = statIcons[i];
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary-500" />
                  <div className="text-3xl font-bold gradient-text">{statValues[i]}+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t(`stats.${label}`)}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle mx-auto">Professional IT services and digital solutions tailored to your needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Code, title: 'Web Development', desc: 'Modern websites and web applications' },
              { icon: Bot, title: 'AI Development', desc: 'Intelligent chatbots and automation' },
              { icon: Wrench, title: 'IT Support', desc: 'Hardware, software, and network services' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group hover:scale-[1.02]"
              >
                <Icon className="w-10 h-10 text-primary-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="btn-primary">View All Services <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card bg-gradient-to-r from-primary-500/10 to-purple-600/10 text-center py-16">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary-500" />
            <h2 className="text-3xl font-display font-bold mb-4">Meet Yadav AI</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
              Your intelligent assistant for programming help, learning, resume building, and content generation.
            </p>
            <Link to="/ai" className="btn-primary">
              <Bot className="w-5 h-5" /> Try Yadav AI
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Rocket className="w-12 h-12 mx-auto mb-4 text-primary-500" />
          <h2 className="section-title">Ready to Start Your Project?</h2>
          <p className="section-subtitle mx-auto mb-8">Let's build something amazing together.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-primary">{t('hero.startProject')}</Link>
            <Link to="/projects" className="btn-secondary">{t('hero.viewProjects')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
