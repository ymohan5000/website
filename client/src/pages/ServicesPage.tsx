import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Globe, Brain, FileText, Download, Wrench, GraduationCap, Cpu, Shield, Heart } from 'lucide-react';
import api from '@/lib/api';
import Loading from '@/components/Loading';

const iconMap: Record<string, typeof Globe> = {
  Globe, Brain, FileText, Download, Wrench, GraduationCap, Cpu, Shield, Heart,
};

export default function ServicesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data.services),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="section-title">Our Services</h1>
        <p className="section-subtitle mx-auto">
          Professional IT services, AI development, education, and digital solutions.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data || []).map((service: {
          _id: string; slug: string; title: string; description: string;
          features: string[]; icon: string; category: string;
        }, i: number) => {
          const Icon = iconMap[service.icon] || Globe;
          return (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card group hover:scale-[1.02] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Icon className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <span className="text-xs text-primary-600 dark:text-primary-400">{service.category}</span>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">{service.description}</p>
              <ul className="space-y-1 mb-4">
                {service.features.slice(0, 4).map((f: string) => (
                  <li key={f} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to={`/contact?service=${service.slug}`} className="btn-primary text-sm py-2 justify-center">
                Request Service <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
