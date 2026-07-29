import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Github, Linkedin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-xl gradient-text mb-3">Mohan Yadav Digital Solutions</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Full Stack Developer, AI Developer, and IT Service Provider from Butwal, Nepal.
              Building modern digital solutions for businesses and learners.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com/ymohan5000" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/ymohan5000" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://wa.me/9779811639830" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link to="/services" className="hover:text-primary-600">Services</Link></li>
              <li><Link to="/projects" className="hover:text-primary-600">Projects</Link></li>
              <li><Link to="/ai" className="hover:text-primary-600">Yadav AI</Link></li>
              <li><Link to="/blog" className="hover:text-primary-600">Blog</Link></li>
              <li><Link to="/tools" className="hover:text-primary-600">Digital Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:ymohan5000@gmail.com">ymohan5000@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:+9779811639830">+977 9811639830</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                {t('footer.location')}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
          © {year} Mohan Yadav. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
