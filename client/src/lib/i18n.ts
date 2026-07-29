import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        projects: 'Projects',
        ai: 'Yadav AI',
        tools: 'Tools',
        blog: 'Blog',
        notes: 'Notes',
        gallery: 'Gallery',
        contact: 'Contact',
        login: 'Login',
        dashboard: 'Dashboard',
        logout: 'Logout',
      },
      hero: {
        greeting: "Hello, I'm",
        name: 'Mohan Yadav',
        title: 'Full Stack Developer',
        subtitle: 'AI Developer · Digital Solution Provider',
        description: 'Building modern websites, AI applications, automation systems, educational platforms and digital solutions.',
        startProject: 'Start Project',
        exploreServices: 'Explore Services',
        chatAI: 'Chat With AI',
        viewProjects: 'View Projects',
      },
      stats: {
        projects: 'Projects',
        clients: 'Clients',
        blogs: 'Blogs',
        aiTools: 'AI Tools',
        certificates: 'Certificates',
      },
      footer: {
        rights: 'All rights reserved.',
        location: 'Butwal, Nepal',
      },
    },
  },
  ne: {
    translation: {
      nav: {
        home: 'गृहपृष्ठ',
        about: 'बारेमा',
        services: 'सेवाहरू',
        projects: 'परियोजनाहरू',
        ai: 'यादव AI',
        tools: 'उपकरणहरू',
        blog: 'ब्लग',
        notes: 'नोटहरू',
        gallery: 'ग्यालेरी',
        contact: 'सम्पर्क',
        login: 'लगइन',
        dashboard: 'ड्यासबोर्ड',
        logout: 'लगआउट',
      },
      hero: {
        greeting: 'नमस्ते, म',
        name: 'मोहन यादव',
        title: 'फुल स्ट्याक डेभलपर',
        subtitle: 'AI डेभलपर · डिजिटल समाधान प्रदायक',
        description: 'आधुनिक वेबसाइट, AI अनुप्रयोग, स्वचालन प्रणाली, शैक्षिक प्लेटफर्म र डिजिटल समाधान निर्माण।',
        startProject: 'परियोजना सुरु',
        exploreServices: 'सेवाहरू हेर्नुहोस्',
        chatAI: 'AI संग कुरा',
        viewProjects: 'परियोजनाहरू हेर्नुहोस्',
      },
      stats: {
        projects: 'परियोजनाहरू',
        clients: 'ग्राहकहरू',
        blogs: 'ब्लगहरू',
        aiTools: 'AI उपकरणहरू',
        certificates: 'प्रमाणपत्रहरू',
      },
      footer: {
        rights: 'सर्वाधिकार सुरक्षित।',
        location: 'बुटवल, नेपाल',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
