import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User, Blog, Project, Service, Note, Gallery } from '../models/index.js';
const SERVICES = [
    {
        slug: 'website-development',
        title: 'Website Development',
        category: 'Development',
        description: 'Professional websites and web applications built with modern technologies.',
        features: ['Portfolio website', 'Business website', 'E-commerce website', 'SaaS application', 'Custom web application'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        icon: 'Globe',
        order: 1,
    },
    {
        slug: 'ai-development',
        title: 'AI Development',
        category: 'AI',
        description: 'Intelligent AI solutions for automation, chatbots, and content generation.',
        features: ['AI chatbot', 'AI assistant', 'AI automation', 'AI content generator', 'AI document analyzer'],
        technologies: ['OpenAI', 'Gemini', 'Python', 'Node.js'],
        icon: 'Brain',
        order: 2,
    },
    {
        slug: 'cv-resume-service',
        title: 'CV & Resume Service',
        category: 'Career',
        description: 'Professional CV and resume writing services optimized for ATS systems.',
        features: ['Professional CV', 'ATS Resume', 'Cover letter', 'LinkedIn profile improvement'],
        technologies: [],
        icon: 'FileText',
        order: 3,
    },
    {
        slug: 'software-installation',
        title: 'Software Installation',
        category: 'IT Support',
        description: 'Complete software setup and system optimization services.',
        features: ['Windows installation', 'Linux installation', 'Software setup', 'Driver installation', 'System optimization'],
        technologies: [],
        icon: 'Download',
        order: 4,
    },
    {
        slug: 'hardware-maintenance',
        title: 'Hardware Maintenance',
        category: 'IT Support',
        description: 'Computer and laptop repair, network setup, and hardware troubleshooting.',
        features: ['Computer repair', 'Laptop repair', 'Network setup', 'Hardware troubleshooting'],
        technologies: [],
        icon: 'Wrench',
        order: 5,
    },
    {
        slug: 'education-training',
        title: 'Education & Training',
        category: 'Education',
        description: 'Programming, web development, and academic tutoring services.',
        features: ['School subjects (Class 1-10)', 'Programming', 'Web Development', 'Database', 'AI', 'Loksewa Preparation'],
        technologies: [],
        icon: 'GraduationCap',
        order: 6,
    },
    {
        slug: 'iot-robotics',
        title: 'IoT & Robotics',
        category: 'Hardware',
        description: 'Arduino projects, IoT training, and automation systems.',
        features: ['Arduino projects', 'IoT training', 'Robotics projects', 'Automation systems'],
        technologies: ['Arduino', 'Raspberry Pi', 'Python'],
        icon: 'Cpu',
        order: 7,
    },
    {
        slug: 'cybersecurity',
        title: 'Cybersecurity',
        category: 'Security',
        description: 'Cyber awareness training and security fundamentals.',
        features: ['Cyber awareness', 'Ethical hacking basics', 'Security training', 'Network security'],
        technologies: [],
        icon: 'Shield',
        order: 8,
    },
    {
        slug: 'social-work',
        title: 'Social Work',
        category: 'Community',
        description: 'Community programs through Kapilvastu Nagar Bal Sanjal and related initiatives.',
        features: ['Child marriage control', 'Drug awareness', 'Child-friendly programs', 'Digital education'],
        technologies: [],
        icon: 'Heart',
        order: 9,
    },
];
const PROJECTS = [
    {
        slug: 'e-notes',
        name: 'E-NOTE Web App',
        category: 'Web Applications',
        demo: 'https://ymohan5000.github.io/ymohan5000/',
        code: 'https://github.com/ymohan5000/ymohan5000',
        badge: 'Notes Platform',
        role: 'Developer',
        tags: ['HTML', 'CSS', 'Study Resource'],
        description: 'Enotes provides concise computer engineering study notes covering topics like C, HTML, CSS, and networking.',
        features: ['Study notes', 'Multiple subjects', 'Easy navigation'],
        technologies: ['HTML', 'CSS', 'JavaScript'],
        featured: true,
        order: 1,
    },
    {
        slug: 'ecommerce-website',
        name: 'E-commerce Website',
        category: 'Web Applications',
        demo: 'https://ojtproject-pbhn.vercel.app/',
        badge: 'Full Stack',
        role: 'Full Stack Developer',
        tags: ['MERN Stack', 'Web Development', 'Database'],
        description: 'A full-stack e-commerce web application with product browsing, cart management, and order placement.',
        features: ['Product catalog', 'Shopping cart', 'Order management', 'User authentication'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        featured: true,
        order: 2,
    },
    {
        slug: 'personal-portfolio',
        name: 'Personal Portfolio',
        category: 'UI/UX Projects',
        demo: 'https://yadavmohan.info.np/',
        code: 'https://github.com/ymohan5000/website',
        badge: 'Development',
        role: 'Full Stack Developer',
        tags: ['HTML/CSS', 'JavaScript', 'Responsive Design'],
        description: 'Responsive multi-page portfolio with dark/light mode, project/blog/gallery systems.',
        features: ['Dark/Light mode', 'Project showcase', 'Blog system', 'Gallery'],
        technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
        featured: true,
        order: 3,
    },
    {
        slug: 'image-search-engine',
        name: 'Image Search Engine',
        category: 'Web Applications',
        demo: 'https://image-search-engine-ym.netlify.app/',
        code: 'https://github.com/ymohan5000/image-search-engine',
        badge: 'API Integration',
        role: 'Developer',
        tags: ['JavaScript', 'API', 'Search'],
        description: 'Image search engine using external APIs with responsive UI.',
        features: ['Image search', 'API integration', 'Responsive design'],
        technologies: ['JavaScript', 'HTML', 'CSS'],
        featured: false,
        order: 4,
    },
];
const BLOGS = [
    { slug: 'getting-started-with-css-flexbox', title: 'Getting Started with CSS Flexbox', category: 'Web Development', tags: ['CSS', 'Flexbox', 'Layout'], tone: '#2E6BE6', excerpt: 'A practical introduction to the Flexbox layout model.', content: '# Getting Started with CSS Flexbox\n\nFlexbox is a one-dimensional layout method for arranging items in rows or columns...', readingTime: 5, published: true },
    { slug: 'git-basics-every-developer-should-know', title: 'Git Basics Every Developer Should Know', category: 'Programming', tags: ['Git', 'Version Control'], tone: '#E3294C', excerpt: 'Core Git commands and workflow every developer needs.', content: '# Git Basics\n\nGit is essential for every developer...', readingTime: 6, published: true },
    { slug: 'responsive-design-tips-for-beginners', title: 'Responsive Design Tips for Beginners', category: 'Web Development', tags: ['Responsive', 'CSS', 'Mobile'], tone: '#1EAA6B', excerpt: 'Simple habits for building layouts that work across devices.', content: '# Responsive Design Tips\n\nBuilding responsive websites is essential...', readingTime: 5, published: true },
    { slug: 'introduction-to-react-hooks', title: 'Introduction to React Hooks', category: 'Programming', tags: ['React', 'JavaScript', 'Hooks'], tone: '#61DAFB', excerpt: 'Understanding useState, useEffect, and custom hooks in React.', content: '# React Hooks\n\nHooks revolutionized React development...', readingTime: 8, published: true },
    { slug: 'mongodb-basics-for-beginners', title: 'MongoDB Basics for Beginners', category: 'Programming', tags: ['MongoDB', 'Database', 'NoSQL'], tone: '#4DB33D', excerpt: 'Getting started with MongoDB and Mongoose in Node.js.', content: '# MongoDB Basics\n\nMongoDB is a popular NoSQL database...', readingTime: 7, published: true },
    { slug: 'ai-in-web-development', title: 'AI in Web Development', category: 'AI', tags: ['AI', 'Web Development', 'Automation'], tone: '#7C3AED', excerpt: 'How AI is transforming modern web development workflows.', content: '# AI in Web Development\n\nArtificial intelligence is changing how we build websites...', readingTime: 6, published: true },
    { slug: 'cybersecurity-fundamentals', title: 'Cybersecurity Fundamentals', category: 'Cybersecurity', tags: ['Security', 'Cyber', 'Best Practices'], tone: '#EF4444', excerpt: 'Essential cybersecurity concepts every developer should know.', content: '# Cybersecurity Fundamentals\n\nSecurity is not optional...', readingTime: 7, published: true },
    { slug: 'nodejs-express-api-guide', title: 'Node.js Express API Guide', category: 'Programming', tags: ['Node.js', 'Express', 'API'], tone: '#68A063', excerpt: 'Building RESTful APIs with Node.js and Express.', content: '# Express API Guide\n\nExpress.js makes building APIs straightforward...', readingTime: 10, published: true },
    { slug: 'tailwind-css-best-practices', title: 'Tailwind CSS Best Practices', category: 'Web Development', tags: ['Tailwind', 'CSS', 'UI'], tone: '#06B6D4', excerpt: 'Tips for writing maintainable Tailwind CSS code.', content: '# Tailwind Best Practices\n\nTailwind CSS enables rapid UI development...', readingTime: 6, published: true },
    { slug: 'typescript-for-javascript-developers', title: 'TypeScript for JavaScript Developers', category: 'Programming', tags: ['TypeScript', 'JavaScript'], tone: '#3178C6', excerpt: 'Why and how to adopt TypeScript in your projects.', content: '# TypeScript Guide\n\nTypeScript adds type safety to JavaScript...', readingTime: 8, published: true },
    { slug: 'iot-with-arduino-basics', title: 'IoT with Arduino Basics', category: 'IoT', tags: ['Arduino', 'IoT', 'Hardware'], tone: '#F59E0B', excerpt: 'Getting started with Arduino for IoT projects.', content: '# Arduino IoT Basics\n\nArduino makes IoT accessible...', readingTime: 7, published: true },
    { slug: 'deploying-react-apps-to-vercel', title: 'Deploying React Apps to Vercel', category: 'Web Development', tags: ['React', 'Vercel', 'Deployment'], tone: '#000000', excerpt: 'Step-by-step guide to deploying React applications.', content: '# Deploying to Vercel\n\nVercel makes deployment seamless...', readingTime: 5, published: true },
    { slug: 'javascript-async-await-explained', title: 'JavaScript Async/Await Explained', category: 'Programming', tags: ['JavaScript', 'Async', 'Promises'], tone: '#F7DF1E', excerpt: 'Understanding asynchronous JavaScript with async/await.', content: '# Async/Await\n\nAsynchronous programming is crucial...', readingTime: 7, published: true },
    { slug: 'building-chatbots-with-openai', title: 'Building Chatbots with OpenAI', category: 'AI', tags: ['OpenAI', 'Chatbot', 'AI'], tone: '#10A37F', excerpt: 'Create intelligent chatbots using the OpenAI API.', content: '# OpenAI Chatbots\n\nBuilding AI chatbots has never been easier...', readingTime: 9, published: true },
    { slug: 'html5-semantic-elements', title: 'HTML5 Semantic Elements', category: 'Web Development', tags: ['HTML', 'Semantic', 'Accessibility'], tone: '#E44D26', excerpt: 'Using semantic HTML for better SEO and accessibility.', content: '# Semantic HTML\n\nSemantic elements improve your website...', readingTime: 5, published: true },
    { slug: 'css-grid-layout-guide', title: 'CSS Grid Layout Guide', category: 'Web Development', tags: ['CSS', 'Grid', 'Layout'], tone: '#FF6B6B', excerpt: 'Master CSS Grid for complex two-dimensional layouts.', content: '# CSS Grid\n\nGrid is perfect for complex layouts...', readingTime: 8, published: true },
    { slug: 'rest-api-design-principles', title: 'REST API Design Principles', category: 'Programming', tags: ['API', 'REST', 'Backend'], tone: '#6366F1', excerpt: 'Best practices for designing clean REST APIs.', content: '# REST API Design\n\nGood API design matters...', readingTime: 9, published: true },
    { slug: 'jwt-authentication-explained', title: 'JWT Authentication Explained', category: 'Cybersecurity', tags: ['JWT', 'Auth', 'Security'], tone: '#8B5CF6', excerpt: 'How JSON Web Tokens work for authentication.', content: '# JWT Authentication\n\nJWT is widely used for auth...', readingTime: 7, published: true },
    { slug: 'docker-for-developers', title: 'Docker for Developers', category: 'Software', tags: ['Docker', 'DevOps', 'Containers'], tone: '#2496ED', excerpt: 'Containerization basics with Docker for web developers.', content: '# Docker Basics\n\nDocker simplifies deployment...', readingTime: 8, published: true },
    { slug: 'python-automation-scripts', title: 'Python Automation Scripts', category: 'Programming', tags: ['Python', 'Automation', 'Scripting'], tone: '#3776AB', excerpt: 'Automate repetitive tasks with Python scripts.', content: '# Python Automation\n\nPython excels at automation...', readingTime: 6, published: true },
    { slug: 'network-security-basics', title: 'Network Security Basics', category: 'Cybersecurity', tags: ['Network', 'Security', 'Firewall'], tone: '#DC2626', excerpt: 'Fundamental network security concepts and practices.', content: '# Network Security\n\nProtecting your network is critical...', readingTime: 7, published: true },
    { slug: 'react-router-v6-guide', title: 'React Router v6 Guide', category: 'Programming', tags: ['React', 'Router', 'SPA'], tone: '#CA4245', excerpt: 'Navigation and routing in React applications.', content: '# React Router v6\n\nClient-side routing made easy...', readingTime: 7, published: true },
    { slug: 'cloudinary-image-management', title: 'Cloudinary Image Management', category: 'Web Development', tags: ['Cloudinary', 'Images', 'CDN'], tone: '#3448C5', excerpt: 'Managing and optimizing images with Cloudinary.', content: '# Cloudinary\n\nCloudinary handles image optimization...', readingTime: 5, published: true },
    { slug: 'robotics-with-raspberry-pi', title: 'Robotics with Raspberry Pi', category: 'Robotics', tags: ['Raspberry Pi', 'Robotics', 'Python'], tone: '#C51A4A', excerpt: 'Building robotics projects with Raspberry Pi.', content: '# Raspberry Pi Robotics\n\nRaspberry Pi is versatile for robotics...', readingTime: 8, published: true },
    { slug: 'freelancing-as-a-developer', title: 'Freelancing as a Developer', category: 'Career', tags: ['Freelance', 'Career', 'Business'], tone: '#059669', excerpt: 'Tips for starting and growing your freelance dev career.', content: '# Freelancing Tips\n\nFreelancing offers freedom and challenge...', readingTime: 6, published: true },
    { slug: 'web-accessibility-wcag-guide', title: 'Web Accessibility WCAG Guide', category: 'Web Development', tags: ['Accessibility', 'WCAG', 'A11y'], tone: '#0EA5E9', excerpt: 'Making your websites accessible to everyone.', content: '# Web Accessibility\n\nAccessibility benefits all users...', readingTime: 8, published: true },
    { slug: 'graphql-vs-rest', title: 'GraphQL vs REST', category: 'Programming', tags: ['GraphQL', 'REST', 'API'], tone: '#E535AB', excerpt: 'Comparing GraphQL and REST for API design.', content: '# GraphQL vs REST\n\nBoth have their place...', readingTime: 7, published: true },
    { slug: 'linux-command-line-basics', title: 'Linux Command Line Basics', category: 'Software', tags: ['Linux', 'CLI', 'Terminal'], tone: '#FCC624', excerpt: 'Essential Linux commands for developers.', content: '# Linux CLI\n\nThe command line is a developer superpower...', readingTime: 6, published: true },
    { slug: 'machine-learning-intro', title: 'Machine Learning Introduction', category: 'AI', tags: ['ML', 'AI', 'Data Science'], tone: '#FF6F00', excerpt: 'A gentle introduction to machine learning concepts.', content: '# Machine Learning\n\nML is transforming industries...', readingTime: 9, published: true },
    { slug: 'website-performance-optimization', title: 'Website Performance Optimization', category: 'Web Development', tags: ['Performance', 'Lighthouse', 'Speed'], tone: '#14B8A6', excerpt: 'Techniques to achieve 95+ Lighthouse scores.', content: '# Performance Optimization\n\nSpeed matters for UX and SEO...', readingTime: 8, published: true },
];
async function seed() {
    await connectDB();
    console.log('Seeding database...');
    const adminEmail = process.env.ADMIN_EMAIL || 'ymohan5000@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123!';
    const hashed = await bcrypt.hash(adminPassword, 12);
    await User.findOneAndUpdate({ email: adminEmail }, { name: 'Mohan Yadav', email: adminEmail, password: hashed, role: 'admin' }, { upsert: true });
    console.log('Admin user created');
    await Service.deleteMany({});
    await Service.insertMany(SERVICES);
    console.log(`${SERVICES.length} services seeded`);
    await Project.deleteMany({});
    await Project.insertMany(PROJECTS);
    console.log(`${PROJECTS.length} projects seeded`);
    await Blog.deleteMany({});
    await Blog.insertMany(BLOGS);
    console.log(`${BLOGS.length} blogs seeded`);
    await Note.deleteMany({});
    await Note.insertMany([
        { title: 'C Programming Notes', description: 'Complete C programming study notes', category: 'Programming', subject: 'Computer Science', published: true },
        { title: 'HTML & CSS Fundamentals', description: 'Web development basics notes', category: 'Programming', subject: 'Web Development', published: true },
        { title: 'Database Management Systems', description: 'DBMS concepts and SQL notes', category: 'Computer Science', subject: 'Database', published: true },
        { title: 'Mathematics Class 10', description: 'Class 10 mathematics complete notes', category: 'Mathematics', subject: 'School', published: true },
        { title: 'Loksewa General Knowledge', description: 'Loksewa preparation GK notes', category: 'Loksewa', subject: 'General Knowledge', published: true },
    ]);
    console.log('Notes seeded');
    await Gallery.deleteMany({});
    console.log('Gallery cleared (upload images via admin)');
    console.log('Seed complete!');
    await mongoose.disconnect();
}
seed().catch(console.error);
