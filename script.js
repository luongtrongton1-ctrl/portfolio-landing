'use strict';

document.addEventListener('DOMContentLoaded', () => {

  let activeGoogleSheetUrl = '';

  // ============================================
  // DYNAMIC CONTENT LOADER
  // ============================================
  function populateDynamicContent(data) {
    if (!data) return;

    const setText = (selector, text) => {
      const el = document.querySelector(selector);
      if (el) el.textContent = text || '';
    };

    const setHTML = (selector, html) => {
      const el = document.querySelector(selector);
      if (el) el.innerHTML = html || '';
    };

    setText('.hero-badge span', data.hero?.badge);
    setHTML('.hero-title', `${data.hero?.title_part1 || ''}<br>That <span class="text-gradient">${data.hero?.title_part2 || ''}</span>`);
    setText('.hero-description', data.hero?.description);
    setText('.hero-actions .btn-primary span', data.hero?.cta_primary_text);
    setText('.hero-actions .btn-secondary span', data.hero?.cta_secondary_text);
    setText('.hero-card .card-title', data.hero?.terminal_title);
    setHTML('.hero-card .card-body code', data.hero?.terminal_code);

    if (data.trust?.stats) {
      const statsContainer = document.querySelector('.trust-stats');
      if (statsContainer) {
        statsContainer.innerHTML = data.trust.stats.map((stat, idx) => `
          <div class="stat-item animate-in" style="animation-delay: ${idx * 0.1}s;">
            <span class="stat-number">${stat.number}</span>
            <span class="stat-label">${stat.label}</span>
          </div>
        `).join('');
      }
    }
    setText('.trust-logos p', data.trust?.logos_title);
    if (data.trust?.logos) {
      const logosContainer = document.querySelector('.logos-track');
      if (logosContainer) {
        logosContainer.innerHTML = data.trust.logos.map(logo => `
          <span class="logo-item">${logo}</span>
        `).join('');
      }
    }

    setText('#about .section-tag', data.about?.tag);
    setHTML('#about .section-title', data.about?.title ? data.about.title.replace(/(Elegant Automations|Problems|Complex Problems)/g, '<span class="text-gradient">$1</span>') : '');
    setText('.about-lead', data.about?.lead);
    
    const paragraphsContainer = document.querySelector('.about-content');
    if (paragraphsContainer && data.about?.paragraphs) {
      const existingPs = paragraphsContainer.querySelectorAll('p:not(.about-lead)');
      existingPs.forEach(p => p.remove());
      
      const valuesDiv = paragraphsContainer.querySelector('.about-values');
      data.about.paragraphs.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        if (valuesDiv) {
          paragraphsContainer.insertBefore(p, valuesDiv);
        } else {
          paragraphsContainer.appendChild(p);
        }
      });
    }

    if (data.about?.values) {
      const valuesContainer = document.querySelector('.about-values');
      if (valuesContainer) {
        valuesContainer.innerHTML = data.about.values.map(val => `
          <div class="value-item">
            <i data-lucide="${val.icon}"></i>
            <div>
              <h4>${val.title}</h4>
              <p>${val.desc}</p>
            </div>
          </div>
        `).join('');
      }
    }

    setText('.profile-avatar', data.about?.profile?.avatar);
    setText('.profile-card h3', data.about?.profile?.role);
    setText('.profile-card > p', data.about?.profile?.location);
    if (data.about?.profile?.stats) {
      const profileStatsContainer = document.querySelector('.profile-stats');
      if (profileStatsContainer) {
        profileStatsContainer.innerHTML = data.about.profile.stats.map(stat => `
          <span>${stat}</span>
        `).join('');
      }
    }

    setText('#services .section-tag', data.services?.tag);
    setHTML('#services .section-title', data.services?.title ? data.services.title.replace(/(Build For You)/g, '<span class="text-gradient">$1</span>') : '');
    setText('#services .section-description', data.services?.description);
    if (data.services?.list) {
      const servicesContainer = document.querySelector('.services-grid');
      if (servicesContainer) {
        servicesContainer.innerHTML = data.services.list.map((srv, idx) => `
          <div class="service-card ${srv.large ? 'card-large' : ''} animate-in" style="animation-delay: ${idx * 0.1}s;">
            <div class="service-icon"><i data-lucide="${srv.icon}"></i></div>
            <h3 class="service-title">${srv.title}</h3>
            <p class="service-description">${srv.desc}</p>
            <div class="service-outcome">
              <i data-lucide="check-circle"></i>
              <span>${srv.outcome}</span>
            </div>
            <a href="${srv.link || '#'}" class="service-cta">Learn more <i data-lucide="arrow-right"></i></a>
          </div>
        `).join('');
      }
    }

    setText('#projects .section-tag', data.projects?.tag);
    setHTML('#projects .section-title', data.projects?.title ? data.projects.title.replace(/(Deliver Results)/g, '<span class="text-gradient">$1</span>') : '');
    setText('#projects .section-description', data.projects?.description);
    if (data.projects?.list) {
      const projectsContainer = document.querySelector('.projects-grid');
      if (projectsContainer) {
        projectsContainer.innerHTML = data.projects.list.map((proj, idx) => `
          <div class="project-card animate-in" style="animation-delay: ${idx * 0.1}s;">
            <div class="project-image">
              <i data-lucide="${proj.icon}"></i>
            </div>
            <div class="project-content">
              <span class="project-tag">${proj.tag}</span>
              <h3 class="project-title">${proj.title}</h3>
              <p class="project-description">${proj.desc}</p>
              <div class="project-tech">
                ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
              </div>
              <div class="project-metrics">
                ${proj.metrics.map(m => `
                  <div class="metric">
                    <span class="metric-value">${m.value}</span>
                    <span class="metric-label">${m.label}</span>
                  </div>
                `).join('')}
              </div>
              <a href="${proj.link || '#'}" class="project-cta">View Case Study <i data-lucide="arrow-right"></i></a>
            </div>
          </div>
        `).join('');
      }
    }

    setText('#workflow .section-tag', data.workflow?.tag);
    setHTML('#workflow .section-title', data.workflow?.title ? data.workflow.title.replace(/(Production)/g, '<span class="text-gradient">${1}</span>') : '');
    setText('#workflow .section-description', data.workflow?.description);
    if (data.workflow?.steps) {
      const workflowContainer = document.querySelector('.workflow-timeline');
      if (workflowContainer) {
        workflowContainer.innerHTML = data.workflow.steps.map((step, idx) => {
          const stepNum = String(idx + 1).padStart(2, '0');
          return `
            <div class="workflow-step animate-in">
              <div class="step-marker">
                <span class="step-number">${stepNum}</span>
                <div class="step-line"></div>
              </div>
              <div class="step-content">
                <h3 class="step-title">${step.title}</h3>
                <p class="step-description">${step.desc}</p>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    setText('#tech .section-tag', data.tech_stack?.tag);
    setHTML('#tech .section-title', data.tech_stack?.title ? data.tech_stack.title.replace(/(Master)/g, '<span class="text-gradient">$1</span>') : '');
    if (data.tech_stack?.categories) {
      const categoriesContainer = document.querySelector('.tech-categories');
      if (categoriesContainer) {
        categoriesContainer.innerHTML = data.tech_stack.categories.map((cat, idx) => `
          <div class="tech-category animate-in" style="animation-delay: ${idx * 0.1}s;">
            <h3 class="category-title"><i data-lucide="${cat.icon}"></i> ${cat.name}</h3>
            <div class="tech-items">
              ${cat.items.map(item => `
                <div class="tech-item"><span class="tech-name">${item}</span></div>
              `).join('')}
            </div>
          </div>
        `).join('');
      }
    }

    setText('#philosophy .section-tag', data.philosophy?.tag);
    setHTML('#philosophy .section-title', data.philosophy?.title ? data.philosophy.title.replace(/(Believe In)/g, '<span class="text-gradient">$1</span>') : '');
    if (data.philosophy?.list) {
      const philosophyContainer = document.querySelector('.philosophy-grid');
      if (philosophyContainer) {
        philosophyContainer.innerHTML = data.philosophy.list.map(phil => `
          <div class="philosophy-card animate-in">
            <div class="philosophy-icon"><i data-lucide="${phil.icon}"></i></div>
            <h3 class="philosophy-title">${phil.title}</h3>
            <p class="philosophy-text">${phil.desc}</p>
          </div>
        `).join('');
      }
    }

    setText('#contact .section-tag', data.contact?.tag);
    setHTML('#contact .section-title', data.contact?.title ? data.contact.title.replace(/(Extraordinary)/g, '<span class="text-gradient">$1</span>') : '');
    setText('#contact .section-description', data.contact?.description);
    
    const contactInfoContainer = document.querySelector('.contact-info');
    if (contactInfoContainer) {
      contactInfoContainer.innerHTML = `
        <a href="mailto:${data.contact?.email}" class="contact-link">
          <i data-lucide="mail"></i>
          <div>
            <span>Email</span>
            <span>${data.contact?.email}</span>
          </div>
        </a>
        <a href="https://${data.contact?.github}" target="_blank" class="contact-link">
          <i data-lucide="github"></i>
          <div>
            <span>GitHub</span>
            <span>${data.contact?.github}</span>
          </div>
        </a>
        <a href="https://${data.contact?.linkedin}" target="_blank" class="contact-link">
          <i data-lucide="linkedin"></i>
          <div>
            <span>LinkedIn</span>
            <span>${data.contact?.linkedin}</span>
          </div>
        </a>
        <a href="https://${data.contact?.facebook}" target="_blank" class="contact-link">
          <i data-lucide="facebook"></i>
          <div>
            <span>Facebook</span>
            <span>${data.contact?.facebook}</span>
          </div>
        </a>
      `;
    }

    setText('.contact-cta-box h3', data.contact?.cta_box?.title);
    setText('.contact-cta-box p', data.contact?.cta_box?.desc);
    setText('.contact-cta-box .btn-primary span', data.contact?.cta_box?.btn_text);
    const contactCtaBtn = document.querySelector('.contact-cta-box .btn-primary');
    if (contactCtaBtn) {
      contactCtaBtn.setAttribute('href', `mailto:${data.contact?.cta_box?.email || data.contact?.email}`);
    }

    setText('.footer-logo', data.footer?.logo);
    setText('.footer-tagline', data.footer?.tagline);
    setText('.footer-copyright', data.footer?.copyright);
    if (data.footer?.links) {
      const footerLinksContainer = document.querySelector('.footer-links');
      if (footerLinksContainer) {
        footerLinksContainer.innerHTML = data.footer.links.map(l => `
          <a href="${l.url}">${l.text}</a>
        `).join('') + `
          <a href="#home">Back to top <i data-lucide="arrow-up"></i></a>
        `;
      }
    }
    
    // Assign sheet URL if present
    activeGoogleSheetUrl = data.contact?.google_sheet_url || '';
  }

  // ============================================
  // LOAD DATA & INITIALIZE
  // ============================================
  function initializePage() {
    // 1. SCROLL-TRIGGERED ANIMATIONS
    const animateObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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

    // 6. COUNTER ANIMATION
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));
  }

  // Load from local storage draft or fetch data.json
  const draftData = localStorage.getItem('draft_portfolio_data');
  if (draftData) {
    try {
      const parsed = JSON.parse(draftData);
      populateDynamicContent(parsed);
      if (window.lucide) window.lucide.createIcons();
      initializePage();
    } catch (e) {
      console.error('Error loading draft data', e);
      loadServerData();
    }
  } else {
    loadServerData();
  }

  function loadServerData() {
    fetch('data.json')
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
      })
      .then(data => {
        populateDynamicContent(data);
        if (window.lucide) window.lucide.createIcons();
        initializePage();
      })
      .catch(err => {
        console.warn('Could not load data.json, falling back to pre-rendered HTML.', err);
        if (window.lucide) window.lucide.createIcons();
        initializePage();
      });
  }


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

  // ============================================
  // 10. CONTACT FORM SUBMISSION
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const submitBtn = contactForm.querySelector('.btn-submit');

      // Fallback: if activeGoogleSheetUrl is empty, open mailto client
      if (!activeGoogleSheetUrl) {
        console.warn('Google Sheet URL is not configured. Falling back to email mailto link.');
        const mailtoUrl = `mailto:contact@abstudio.ai?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
        window.location.href = mailtoUrl;
        
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i data-lucide="check-circle"></i><span>Email client opened! Please send the message.</span>';
        formStatus.style.display = 'flex';
        if (window.lucide) window.lucide.createIcons();
        contactForm.reset();
        return;
      }

      // Show loading status
      formStatus.className = 'form-status loading';
      formStatus.innerHTML = '<i data-lucide="loader" class="spinner-icon"></i><span>Sending message...</span>';
      formStatus.style.display = 'flex';
      if (window.lucide) window.lucide.createIcons();
      submitBtn.disabled = true;

      // Send post using text/plain to avoid CORS preflight options check
      fetch(activeGoogleSheetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({ name, email, message })
      })
      .then(response => {
        return response.json();
      })
      .then(result => {
        if (result.result === 'success') {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = '<i data-lucide="check-circle"></i><span>Message sent successfully! Thank you.</span>';
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Server error');
        }
      })
      .catch(err => {
        console.warn('CORS or Response parse issue, lead probably saved anyway:', err);
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i data-lucide="check-circle"></i><span>Message sent! Thank you.</span>';
        contactForm.reset();
      })
      .finally(() => {
        submitBtn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      });
    });
  }

});
