import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ContactPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: params.get('service') || '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/messages', form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="section-title">Contact</h1>
        <p className="section-subtitle mx-auto">Get in touch for projects, services, or collaboration.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {[
            { icon: Mail, label: 'Email', value: 'ymohan5000@gmail.com', href: 'mailto:ymohan5000@gmail.com' },
            { icon: Phone, label: 'Phone / WhatsApp', value: '+977 9811639830', href: 'tel:+9779811639830' },
            { icon: MapPin, label: 'Location', value: 'Butwal, Nepal', href: undefined },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <Icon className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                {href ? (
                  <a href={href} className="font-medium hover:text-primary-600">{value}</a>
                ) : (
                  <p className="font-medium">{value}</p>
                )}
              </div>
            </div>
          ))}

          <a
            href="https://wa.me/9779811639830"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center bg-green-600 hover:bg-green-700 shadow-green-600/25"
          >
            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
          </a>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <input
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            placeholder="Service Interested In"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <textarea
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Your Message"
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            <Send className="w-5 h-5" /> {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
