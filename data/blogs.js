/*
  Blog post metadata for blog.html (cards, search, category filter, recent posts).
  The full article body lives in blog/<slug>.html — this file only holds the card summary.

  Categories used across the site: HTML, CSS, JavaScript, React, Node.js, Backend,
  Deployment, Git & GitHub, Career, Web Design, Programming Tips, Technology.

  `tone` is a hex color used to render a generated gradient cover (no image file needed).
  To add a post: write blog/<slug>.html (copy an existing one), then add an entry here.
*/
const BLOG_POSTS = [
  {
    slug: "getting-started-with-css-flexbox",
    title: "Getting Started with CSS Flexbox",
    cat: "CSS",
    date: "2026-03-10",
    read: 5,
    tone: "#2E6BE6",
    icon: "fa-solid fa-table-cells",
    excerpt: "A practical introduction to the Flexbox layout model — containers, items, and the properties that solve real alignment problems.",
  },
  {
    slug: "git-basics-every-developer-should-know",
    title: "Git Basics Every Developer Should Know",
    cat: "Git & GitHub",
    date: "2026-04-02",
    read: 6,
    tone: "#E3294C",
    icon: "fa-brands fa-git-alt",
    excerpt: "The core Git commands and workflow every developer reaches for daily — init, branch, commit, merge, and how to undo mistakes safely.",
  },
  {
    slug: "responsive-design-tips-for-beginners",
    title: "Responsive Design Tips for Beginners",
    cat: "Web Design",
    date: "2026-05-18",
    read: 5,
    tone: "#1EAA6B",
    icon: "fa-solid fa-mobile-screen",
    excerpt: "Simple, high-impact habits for building layouts that hold up across phones, tablets, and desktops — without a framework.",
  },

  // --- Example entry — write blog/your-slug.html first, then add its metadata here ---
  // {
  //   slug: "your-post-slug",
  //   title: "Post Title",
  //   cat: "JavaScript", // must match one of the categories listed above
  //   date: "2026-08-01",
  //   read: 5,
  //   tone: "#7C3AED",
  //   icon: "fa-brands fa-js",
  //   excerpt: "One or two sentences shown on the card.",
  // },
];
