/*
  Project data for projects.html and the "Featured Projects" section on index.html.
  Loaded as a plain global (no build step, no ES modules) — see assets/js/main.js.

  To add a new project, copy the shape below and append to PROJECTS.
  Only fill in `code` if you have a real GitHub repo for it — leave it null otherwise.
*/
const PROJECTS = [
  {
    slug: "e-notes",
    name: "E-NOTE Web App",
    category: "Web Applications",
    image: "assets/img/enotes.jpg",
    demo: "https://ymohan5000.github.io/ymohan5000/",
    code: "https://github.com/ymohan5000/ymohan5000",
    badge: "Notes Platform",
    year: null,
    role: "Developer",
    tags: ["HTML", "CSS", "Study Resource"],
    desc: "Enotes provides concise computer engineering study notes covering topics like C, HTML, CSS, and networking to help learners quickly review key concepts. It's part of an online notes collection designed to support students and developers with easy-to-read educational resources.",
  },
  {
    slug: "ecommerce-website",
    name: "E-commerce Website",
    category: "Web Applications",
    image: "assets/img/ecom.jpg",
    demo: "https://ojtproject-pbhn.vercel.app/",
    code: null,
    badge: "Full Stack",
    year: null,
    role: "Full Stack Developer",
    tags: ["MERN Stack", "Web Development", "Database"],
    desc: "A full-stack e-commerce web application that allows users to browse products, manage carts, and place orders.",
  },
  {
    slug: "personal-portfolio",
    name: "Personal Portfolio",
    category: "UI/UX Projects",
    image: "assets/img/portfolio.jpg",
    demo: "https://yadavmohan.info.np/",
    code: "https://github.com/ymohan5000/website",
    badge: "Development",
    year: null,
    role: "Full Stack Developer",
    tags: ["HTML/CSS", "JavaScript", "Responsive Design"],
    desc: "This portfolio site itself — a responsive, multi-page site with dark/light mode, project/blog/gallery systems, and interactive elements, built with plain HTML, CSS and JavaScript.",
  },
  {
    slug: "image-search-engine",
    name: "Image Search Engine",
    category: "JavaScript Projects",
    image: "assets/img/ese.jpg",
    demo: "https://ymohan5000.github.io/image-search-engine/",
    code: "https://github.com/ymohan5000/image-search-engine",
    badge: "Web App",
    year: null,
    role: "Developer",
    tags: ["JavaScript", "API Integration", "Search UI"],
    desc: "A web-based tool that lets you enter queries and browse related images in a searchable interface — a simple image lookup experience similar to other image search tools available online.",
  },
  {
    slug: "nepal-weather-app",
    name: "Digital Weather App",
    category: "JavaScript Projects",
    image: "assets/img/weatehrapp.jpg",
    demo: "https://ymohan5000.github.io/nepal-weather-app/",
    code: "https://github.com/ymohan5000/nepal-weather-app",
    badge: "Weather App",
    year: null,
    role: "Developer",
    tags: ["JavaScript", "Weather API", "Responsive Design"],
    desc: "A simple web-based weather app that shows current temperature and conditions for Nepal using live data.",
  },
  {
    slug: "calculator-ui",
    name: "Calculator UI",
    category: "Tools and Utilities",
    image: "assets/img/call.jpg",
    demo: "https://ymohan5000.github.io/calculator/",
    code: "https://github.com/ymohan5000/calculator",
    badge: "Utility",
    year: null,
    role: "Developer",
    tags: ["JavaScript", "HTML/CSS", "Calculator"],
    desc: "A simple, responsive calculator web app supporting everyday arithmetic operations behind a clean, user-friendly interface.",
  },

  // --- Example entry — copy this shape for your next project, then delete this comment ---
  // {
  //   slug: "my-new-project",
  //   name: "My New Project",
  //   category: "Web Applications", // Web Applications | Management Systems | React Projects | JavaScript Projects | Backend Projects | UI/UX Projects | Tools and Utilities
  //   image: "assets/img/my-new-project.jpg",
  //   demo: "https://example.com/",
  //   code: "https://github.com/ymohan5000/my-new-project", // or null
  //   badge: "Web App",
  //   year: "2026",
  //   role: "Full Stack Developer",
  //   tags: ["React", "Node.js"],
  //   desc: "Full description shown on projects.html.",
  // },
];
