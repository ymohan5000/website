document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
   
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
  
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
   
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
    
    
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
   
    const typewriter = document.querySelector('.typewriter .typed-text');
    const cursor = document.querySelector('.typewriter .cursor');
    const words = ['UI/UX Designer', 'Web Developer', 'CSIT Student'];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;
    
    function type() {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        
        typewriter.textContent = currentChar;
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
            
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            
            setTimeout(type, 1000);
        }
    }
    

    setTimeout(type, 1000);
    
   
    const skillBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-level');
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.5});
    
    skillBars.forEach(bar => observer.observe(bar));
    

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            alert(`Thank you for your message, ${name}! I will get back to you soon.`);
            
           
            contactForm.reset();
        });
    }
    

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    document.body.classList.add('loaded');
});

// Custom scroll animations for elements
function animateOnScroll() {
    const elements = document.querySelectorAll('.section-animate');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if(elementPosition < screenPosition) {
        element.classList.add('animate');
      }
    });
  }
  
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
  
  // Parallax effect for hero section
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if(hero) {
      hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    }
    
    if(heroContent) {
      heroContent.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }
  });