'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. SCROLL-TRIGGERED ANIMATIONS
  // ============================================
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add stagger delay based on sibling index
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = parent.querySelectorAll(':scope > .animate-in');
          const siblingIndex = Array.from(siblings).indexOf(entry.target);
          if (siblingIndex > 0) {
            entry.target.style.transitionDelay = `${siblingIndex * 100}ms`;
          }
        }
        entry.target.classList.add('visible');
        animateObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.animate-in').forEach(el => animateObserver.observe(el));

  // ============================================
  // 2. NAVBAR SCROLL BEHAVIOR
  // ============================================
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ============================================
  // 3. ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ============================================
  // 4. MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksContainer = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileMenuBtn.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
      
      // Toggle icon visibility
      const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
      const closeIcon = mobileMenuBtn.querySelector('.close-icon');
      if (menuIcon && closeIcon) {
        menuIcon.style.display = isActive ? 'none' : 'block';
        closeIcon.style.display = isActive ? 'block' : 'none';
      }

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinksContainer.classList.remove('active');
        
        const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
        const closeIcon = mobileMenuBtn.querySelector('.close-icon');
        if (menuIcon && closeIcon) {
          menuIcon.style.display = 'block';
          closeIcon.style.display = 'none';
        }
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // 5. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // 6. COUNTER ANIMATION
  // ============================================
  function animateCounter(element) {
    const text = element.textContent.trim();
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasK = text.includes('K');

    let target;
    if (hasK) {
      target = parseFloat(text.replace(/[^0-9.]/g, ''));
    } else {
      target = parseInt(text.replace(/[^0-9]/g, ''), 10);
    }

    if (isNaN(target) || target === 0) return;

    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);

      let current;
      if (hasK) {
        current = (target * eased).toFixed(1);
        element.textContent = current + 'K' + (hasPlus ? '+' : '');
      } else {
        current = Math.floor(target * eased);
        element.textContent = current + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

  // ============================================
  // 7. SCROLL INDICATOR FADE OUT
  // ============================================
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (scrollIndicator) {
    function handleScrollIndicator() {
      if (window.scrollY > 200) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '0.5';
        scrollIndicator.style.pointerEvents = 'auto';
      }
    }

    window.addEventListener('scroll', handleScrollIndicator, { passive: true });
  }

  // ============================================
  // 8. BACK TO TOP
  // ============================================
  const backToTopLinks = document.querySelectorAll('a[href="#home"]');
  backToTopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // ============================================
  // 9. HERO BADGE ICON ANIMATION
  // ============================================
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    const icon = heroBadge.querySelector('svg');
    if (icon) {
      setInterval(() => {
        icon.style.transform = 'rotate(15deg) scale(1.1)';
        setTimeout(() => {
          icon.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
      }, 3000);
    }
  }

});
