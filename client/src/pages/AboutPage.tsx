import { motion } from 'framer-motion';
import { GraduationCap, Code, Shield, Cpu } from 'lucide-react';

const skills = {
  Frontend: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'TypeScript'],
  Backend: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Socket.io'],
  Other: ['AI Development', 'UI/UX Design', 'Cybersecurity', 'IoT', 'Robotics'],
};

const timeline = [
  { year: '2022', title: 'BSc CSIT', org: 'Butwal Multiple Campus', type: 'Education' },
  { year: '2023', title: 'Full Stack Development', org: 'Self-taught & Projects', type: 'Training' },
  { year: '2024', title: 'E-commerce Platform', org: 'MERN Stack Project', type: 'Project' },
  { year: '2025', title: 'AI Integration', org: 'OpenAI & Gemini APIs', type: 'Achievement' },
  { year: '2026', title: 'Digital Solutions Platform', org: 'Mohan Yadav Digital Solutions', type: 'Project' },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="section-title">About Me</h1>
        <p className="section-subtitle mx-auto">Full Stack Developer passionate about building digital solutions.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 mb-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card lg:col-span-1 text-center">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-6">
            <span className="text-4xl font-bold text-white">MY</span>
          </div>
          <h2 className="text-2xl font-display font-bold mb-1">Mohan Yadav</h2>
          <p className="text-primary-600 dark:text-primary-400 mb-4">Full Stack Developer</p>
          <div className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <p className="flex items-center justify-center gap-2"><GraduationCap className="w-4 h-4" /> BSc CSIT — Butwal Multiple Campus</p>
            <p>📍 Butwal, Nepal</p>
            <p>✉️ ymohan5000@gmail.com</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Who I Am</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            I'm a passionate Full Stack Developer and AI enthusiast from Butwal, Nepal. With a background in
            Computer Science and Information Technology, I specialize in building modern web applications,
            AI-powered tools, and digital solutions that solve real-world problems.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Beyond development, I'm actively involved in social work through community programs focused on
            child welfare, digital education, and drug awareness in Kapilvastu district.
          </p>
        </motion.div>
      </div>

      <div className="mb-20">
        <h2 className="section-title text-center mb-12">Skills</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(skills).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-2 mb-4">
                {category === 'Frontend' && <Code className="w-5 h-5 text-primary-500" />}
                {category === 'Backend' && <Cpu className="w-5 h-5 text-primary-500" />}
                {category === 'Other' && <Shield className="w-5 h-5 text-primary-500" />}
                <h3 className="font-semibold">{category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title text-center mb-12">Timeline</h2>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200 dark:bg-primary-800" />
          {timeline.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-20 pb-10"
            >
              <div className="absolute left-6 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-gray-950" />
              <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">{item.year}</span>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.org}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800">{item.type}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
