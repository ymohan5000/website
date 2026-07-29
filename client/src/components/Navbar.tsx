import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Menu, X, Sun, Moon, Globe, LogOut, LayoutDashboard,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore, useThemeStore } from '@/store';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'home' },
  { to: '/about', label: 'about' },
  { to: '/services', label: 'services' },
  { to: '/projects', label: 'projects' },
  { to: '/ai', label: 'ai' },
  { to: '/tools', label: 'tools' },
  { to: '/blog', label: 'blog' },
  { to: '/notes', label: 'notes' },
  { to: '/gallery', label: 'gallery' },
  { to: '/contact', label: 'contact' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuthStore();
  const { dark, toggle } = useThemeStore();

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'ne' : 'en');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-display font-bold text-xl gradient-text">
            Mohan Yadav
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === to
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {t(`nav.${label}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle language">
              <Globe className="w-5 h-5" />
            </button>
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle theme">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                {isAdmin() && (
                  <Link to="/admin" className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                    <LayoutDashboard className="w-4 h-4" /> {t('nav.dashboard')}
                  </Link>
                )}
                <button onClick={logout} className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                  <LogOut className="w-4 h-4" /> {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="hidden sm:block btn-primary text-sm py-2 px-4">
                {t('nav.login')}
              </Link>
            )}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden glass border-t border-gray-200/50 dark:border-gray-800/50"
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  'block px-4 py-2 rounded-lg text-sm font-medium',
                  location.pathname === to
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {t(`nav.${label}`)}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setOpen(false)} className="block btn-primary text-center mt-2">
                {t('nav.login')}
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
