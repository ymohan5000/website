/*
  Developer notes / cheat sheets for notes.html (search, copy-to-clipboard).
  Categories used: HTML Notes, CSS Notes, JavaScript Notes, React Notes,
  Backend Notes, Git Commands, Linux Commands.

  Each note has one or more `snippets` — each rendered as a labeled, copyable code block.
*/
const NOTES = [
  {
    slug: "html-tags-cheat-sheet",
    title: "HTML Tags Cheat Sheet",
    cat: "HTML Notes",
    summary: "The semantic tags you reach for most often when structuring a page.",
    snippets: [
      {
        label: "Page structure",
        lang: "html",
        code: "<header></header>\n<nav></nav>\n<main></main>\n<section></section>\n<article></article>\n<aside></aside>\n<footer></footer>",
      },
      {
        label: "Forms",
        lang: "html",
        code: "<form action=\"/submit\" method=\"post\">\n  <label for=\"email\">Email</label>\n  <input type=\"email\" id=\"email\" name=\"email\" required />\n  <button type=\"submit\">Send</button>\n</form>",
      },
    ],
  },
  {
    slug: "git-commands",
    title: "Git Commands",
    cat: "Git Commands",
    summary: "The everyday Git workflow: status, staging, committing, branching, syncing.",
    snippets: [
      {
        label: "Daily workflow",
        lang: "bash",
        code: "git status\ngit add <file>\ngit commit -m \"message\"\ngit push origin <branch>",
      },
      {
        label: "Branching",
        lang: "bash",
        code: "git branch <name>\ngit checkout <name>\n# or, in one step:\ngit checkout -b <name>\ngit merge <name>",
      },
      {
        label: "Undo things",
        lang: "bash",
        code: "git restore <file>          # discard unstaged changes\ngit restore --staged <file> # unstage a file\ngit revert <commit>         # undo a commit safely (new commit)",
      },
    ],
  },
  {
    slug: "css-flexbox",
    title: "CSS Flexbox Cheat Sheet",
    cat: "CSS Notes",
    summary: "Container and item properties for one-dimensional layouts.",
    snippets: [
      {
        label: "Container",
        lang: "css",
        code: ".container {\n  display: flex;\n  flex-direction: row; /* row | column */\n  justify-content: center; /* main axis */\n  align-items: center; /* cross axis */\n  gap: 1rem;\n}",
      },
      {
        label: "Item",
        lang: "css",
        code: ".item {\n  flex: 1; /* grow, shrink, basis */\n  align-self: flex-start;\n}",
      },
    ],
  },

  // --- Example entry — copy this shape for your next note ---
  // {
  //   slug: "your-note-slug",
  //   title: "Note Title",
  //   cat: "JavaScript Notes", // HTML Notes | CSS Notes | JavaScript Notes | React Notes | Backend Notes | Git Commands | Linux Commands
  //   summary: "One line describing what this note covers.",
  //   snippets: [
  //     { label: "Example", lang: "js", code: "console.log('hello');" },
  //   ],
  // },
];
