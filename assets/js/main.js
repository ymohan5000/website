/*
  Shared JS for every page: theme toggle, mobile nav, scroll effects, and the
  render/search/filter/lightbox/copy/form behavior used by the data-driven pages.
  Each page loads the relevant data/*.js file(s) as plain globals before this file.
*/
document.addEventListener('DOMContentLoaded', function () {

  // ---------- Footer year ----------
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Theme toggle (class lives on <html>; see the inline no-flash script in <head>) ----------
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    var themeIcon = themeToggle.querySelector('i');
    var syncIcon = function () {
      var isDark = document.documentElement.classList.contains('dark-mode');
      if (themeIcon) {
        themeIcon.classList.toggle('fa-moon', !isDark);
        themeIcon.classList.toggle('fa-sun', isDark);
      }
    };
    syncIcon();
    themeToggle.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');
      syncIcon();
    });
  }

  // ---------- Mobile nav ----------
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(function (item) {
      item.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ---------- Header scroll state ----------
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ---------- Hero typewriter (index.html only) ----------
  var typewriter = document.querySelector('.typewriter .typed-text');
  var cursor = document.querySelector('.typewriter .cursor');
  if (typewriter && cursor) {
    var words = ['Full Stack Web Developer', 'UI/UX Enthusiast', 'CSIT Student'];
    var wordIndex = 0, charIndex = 0, isDeleting = false;
    (function type() {
      var currentWord = words[wordIndex];
      typewriter.textContent = currentWord.substring(0, charIndex);
      cursor.classList.add('blink');
      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(type, 100);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 50);
      } else {
        isDeleting = !isDeleting;
        cursor.classList.remove('blink');
        if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 1000);
      }
    })();
  }

  // ---------- Scroll reveal ----------
  var revealTargets = document.querySelectorAll('.section-animate, [data-reveal]');
  if (revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  // ---------- Skill bars (index.html only) ----------
  var skillBars = document.querySelectorAll('.progress-bar');
  if (skillBars.length) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-level') + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    skillBars.forEach(function (bar) { skillObserver.observe(bar); });
  }

  // ---------- In-page smooth scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        window.scrollTo({ top: targetEl.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  // =====================================================================
  // Data-driven pages
  // =====================================================================

  var esc = function (str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // ---- Generic search + category filter wiring ----
  function setupFilters(opts) {
    // opts: { data, render, searchInput, filterButtons, getCategory, matchesSearch }
    var state = { query: '', category: 'all' };
    function apply() {
      var filtered = opts.data.filter(function (item) {
        var matchesCategory = state.category === 'all' || opts.getCategory(item) === state.category;
        var matchesQuery = !state.query || opts.matchesSearch(item, state.query);
        return matchesCategory && matchesQuery;
      });
      opts.render(filtered);
    }
    if (opts.searchInput) {
      opts.searchInput.addEventListener('input', function () {
        state.query = this.value.trim().toLowerCase();
        apply();
      });
    }
    if (opts.filterButtons && opts.filterButtons.length) {
      opts.filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          opts.filterButtons.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          state.category = btn.getAttribute('data-filter');
          apply();
        });
      });
    }
    apply();
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // ---- Home page stats (counts real data, no hardcoded numbers) ----
  var statProjects = document.getElementById('stat-projects');
  if (statProjects && typeof PROJECTS !== 'undefined') statProjects.textContent = PROJECTS.length;
  var statPosts = document.getElementById('stat-posts');
  if (statPosts && typeof BLOG_POSTS !== 'undefined') statPosts.textContent = BLOG_POSTS.length;
  var statGallery = document.getElementById('stat-gallery');
  if (statGallery && typeof GALLERY_ITEMS !== 'undefined') statGallery.textContent = GALLERY_ITEMS.length;

  // ---- Featured projects (index.html only — first 3 from PROJECTS) ----
  var featuredGrid = document.getElementById('featured-projects-grid');
  if (featuredGrid && typeof PROJECTS !== 'undefined') {
    featuredGrid.innerHTML = PROJECTS.slice(0, 3).map(function (p) {
      return (
        '<div class="project-card">' +
          '<div class="project-image">' +
            '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" />' +
            '<div class="project-links">' +
              (p.demo ? '<a href="' + esc(p.demo) + '" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="View Live"><i class="fas fa-eye"></i></a>' : '') +
              (p.code ? '<a href="' + esc(p.code) + '" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="View Code"><i class="fab fa-github"></i></a>' : '') +
            '</div>' +
            '<span class="project-badge">' + esc(p.badge || p.category) + '</span>' +
          '</div>' +
          '<div class="project-content">' +
            '<h3>' + esc(p.name) + '</h3>' +
            '<p>' + esc(p.desc) + '</p>' +
            '<div class="project-tags">' + p.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  // ---- Projects ----
  var projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid && typeof PROJECTS !== 'undefined') {
    var renderProjects = function (list) {
      if (!list.length) {
        projectsGrid.innerHTML = '<p class="empty-state">No projects match your search.</p>';
        return;
      }
      projectsGrid.innerHTML = list.map(function (p) {
        return (
          '<div class="project-card" data-category="' + esc(p.category) + '">' +
            '<div class="project-image">' +
              '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" />' +
              '<div class="project-links">' +
                (p.demo ? '<a href="' + esc(p.demo) + '" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="View Live"><i class="fas fa-eye"></i></a>' : '') +
                (p.code ? '<a href="' + esc(p.code) + '" target="_blank" rel="noopener noreferrer" class="btn-icon" aria-label="View Code"><i class="fab fa-github"></i></a>' : '') +
              '</div>' +
              '<span class="project-badge">' + esc(p.badge || p.category) + '</span>' +
            '</div>' +
            '<div class="project-content">' +
              '<h3>' + esc(p.name) + '</h3>' +
              '<p>' + esc(p.desc) + '</p>' +
              '<div class="project-tags">' + p.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
              '<div class="project-meta"><span>' + esc(p.role) + '</span>' + (p.year ? '<span>' + esc(p.year) + '</span>' : '') + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    };
    setupFilters({
      data: PROJECTS,
      render: renderProjects,
      searchInput: document.getElementById('project-search'),
      filterButtons: document.querySelectorAll('#project-filters [data-filter]'),
      getCategory: function (p) { return p.category; },
      matchesSearch: function (p, q) {
        return (p.name + ' ' + p.desc + ' ' + p.tags.join(' ')).toLowerCase().indexOf(q) !== -1;
      },
    });
  }

  // ---- Blog ----
  var blogGrid = document.getElementById('blog-grid');
  if (blogGrid && typeof BLOG_POSTS !== 'undefined') {
    var byDateDesc = BLOG_POSTS.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    var renderBlog = function (list) {
      if (!list.length) {
        blogGrid.innerHTML = '<p class="empty-state">No posts match your search.</p>';
        return;
      }
      blogGrid.innerHTML = list.map(function (post) {
        return (
          '<a class="blog-card" href="blog/' + esc(post.slug) + '.html">' +
            '<div class="blog-cover" style="background:linear-gradient(135deg,' + esc(post.tone) + ' 0%, var(--dark-color) 150%)"><i class="' + esc(post.icon) + '"></i></div>' +
            '<div class="blog-content">' +
              '<span class="blog-cat">' + esc(post.cat) + '</span>' +
              '<h3>' + esc(post.title) + '</h3>' +
              '<p>' + esc(post.excerpt) + '</p>' +
              '<div class="blog-meta"><span>' + esc(formatDate(post.date)) + '</span><span>' + post.read + ' min read</span></div>' +
            '</div>' +
          '</a>'
        );
      }).join('');
    };
    setupFilters({
      data: byDateDesc,
      render: renderBlog,
      searchInput: document.getElementById('blog-search'),
      filterButtons: document.querySelectorAll('#blog-filters [data-filter]'),
      getCategory: function (p) { return p.cat; },
      matchesSearch: function (p, q) {
        return (p.title + ' ' + p.excerpt + ' ' + p.cat).toLowerCase().indexOf(q) !== -1;
      },
    });

    var recentList = document.getElementById('recent-posts');
    if (recentList) {
      recentList.innerHTML = byDateDesc.slice(0, 5).map(function (post) {
        return '<li><a href="blog/' + esc(post.slug) + '.html">' + esc(post.title) + '</a><span>' + esc(formatDate(post.date)) + '</span></li>';
      }).join('');
    }
  }

  // ---- Gallery ----
  var galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid && typeof GALLERY_ITEMS !== 'undefined') {
    var renderGallery = function (list) {
      if (!list.length) {
        galleryGrid.innerHTML = '<p class="empty-state">No images match this filter.</p>';
        return;
      }
      galleryGrid.innerHTML = list.map(function (item, i) {
        return (
          '<figure class="gallery-item" data-index="' + i + '" data-category="' + esc(item.category) + '">' +
            '<img src="' + esc(item.src) + '" alt="' + esc(item.caption) + '" loading="lazy" />' +
            '<figcaption>' + esc(item.caption) + '</figcaption>' +
          '</figure>'
        );
      }).join('');
      wireLightbox(list);
    };
    setupFilters({
      data: GALLERY_ITEMS,
      render: renderGallery,
      searchInput: null,
      filterButtons: document.querySelectorAll('#gallery-filters [data-filter]'),
      getCategory: function (item) { return item.category; },
      matchesSearch: function () { return true; },
    });
  }

  function wireLightbox(list) {
    var overlay = document.getElementById('lightbox');
    if (!overlay) return;
    var img = overlay.querySelector('img');
    var caption = overlay.querySelector('.lightbox-caption');
    galleryGrid.querySelectorAll('.gallery-item').forEach(function (fig) {
      fig.addEventListener('click', function () {
        var item = list[Number(fig.getAttribute('data-index'))];
        img.src = item.src;
        img.alt = item.caption;
        caption.textContent = item.caption;
        overlay.classList.add('open');
      });
    });
    var close = function () { overlay.classList.remove('open'); };
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    var closeBtn = overlay.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // ---- Notes ----
  var notesGrid = document.getElementById('notes-grid');
  if (notesGrid && typeof NOTES !== 'undefined') {
    var renderNotes = function (list) {
      if (!list.length) {
        notesGrid.innerHTML = '<p class="empty-state">No notes match your search.</p>';
        return;
      }
      notesGrid.innerHTML = list.map(function (note) {
        return (
          '<article class="note-card">' +
            '<div class="note-header"><span class="note-cat">' + esc(note.cat) + '</span><h3>' + esc(note.title) + '</h3><p>' + esc(note.summary) + '</p></div>' +
            note.snippets.map(function (s) {
              return (
                '<div class="snippet">' +
                  '<div class="snippet-header"><span>' + esc(s.label) + '</span><button class="copy-btn" type="button">Copy</button></div>' +
                  '<pre><code>' + esc(s.code) + '</code></pre>' +
                '</div>'
              );
            }).join('') +
          '</article>'
        );
      }).join('');
      wireCopyButtons();
    };
    setupFilters({
      data: NOTES,
      render: renderNotes,
      searchInput: document.getElementById('notes-search'),
      filterButtons: document.querySelectorAll('#notes-filters [data-filter]'),
      getCategory: function (n) { return n.cat; },
      matchesSearch: function (n, q) {
        return (n.title + ' ' + n.summary + ' ' + n.cat).toLowerCase().indexOf(q) !== -1;
      },
    });
  }

  function wireCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.closest('.snippet').querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(function () {
          var original = btn.textContent;
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = original;
            btn.classList.remove('copied');
          }, 1500);
        });
      });
    });
  }

  // ---- Resources ----
  var resourcesGrid = document.getElementById('resources-grid');
  if (resourcesGrid && typeof RESOURCES !== 'undefined') {
    resourcesGrid.innerHTML = RESOURCES.map(function (group) {
      return (
        '<div class="resource-group">' +
          '<h3>' + esc(group.group) + '</h3>' +
          '<div class="resource-list">' +
            group.items.map(function (item) {
              return (
                '<a class="resource-card" href="' + esc(item.url) + '" target="_blank" rel="noopener noreferrer">' +
                  '<i class="' + esc(item.icon) + '"></i>' +
                  '<div><h4>' + esc(item.name) + '</h4><p>' + esc(item.desc) + '</p></div>' +
                '</a>'
              );
            }).join('') +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  // ---- Contact form (Formspree) ----
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var statusEl = document.getElementById('form-status');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = contactForm.getAttribute('action');
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (!action || action.indexOf('FORMSPREE_ENDPOINT_HERE') !== -1) {
        if (statusEl) {
          statusEl.textContent = 'Form isn’t connected yet — please email or WhatsApp me directly using the details on this page.';
          statusEl.className = 'form-status error';
        }
        return;
      }
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';
      fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      }).then(function (res) {
        if (res.ok) {
          if (statusEl) {
            statusEl.textContent = 'Thanks! Your message has been sent — I’ll get back to you soon.';
            statusEl.className = 'form-status success';
          }
          contactForm.reset();
        } else {
          if (statusEl) {
            statusEl.textContent = 'Something went wrong sending your message. Please try emailing me directly.';
            statusEl.className = 'form-status error';
          }
        }
      }).catch(function () {
        if (statusEl) {
          statusEl.textContent = 'Something went wrong sending your message. Please try emailing me directly.';
          statusEl.className = 'form-status error';
        }
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
      });
    });
  }

  document.body.classList.add('loaded');
});
