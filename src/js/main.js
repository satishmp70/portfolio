/**
 * =========================================================================
 * MAIN APPLICATION BOOTSTRAPPER
 * =========================================================================
 * Dynamically renders the entire portfolio website from data/siteData.json
 */

import { getSiteData } from './dataLoader.js';
import { getIcon } from './icons.js';
import { setupProjectFilter } from './projectFilter.js';
import { initCaseStudyModal, openCaseStudyModal } from './caseStudyModal.js';
import { setupContactForm } from './contact.js';
import { setupEstimator } from './estimator.js';

let appSiteData = null;

async function init() {
  appSiteData = await getSiteData();
  if (!appSiteData) {
    console.error('Failed to load site data.');
    return;
  }

  // Update Page Title and Meta
  document.title = `${appSiteData.company.name} — ${appSiteData.company.tagline}`;

  // Initialize UI components
  renderNavigation();
  renderHero();
  renderCapabilities();
  renderServices();
  renderProjectFilters();
  renderProjects('All');
  renderWhyChooseUs();
  renderProcess();
  renderTechnologies();
  renderAbout();
  renderStats();
  renderTestimonials();
  renderCtaBanner();
  renderContact();
  renderFooter();

  // Setup interactive components & events
  setupEstimator();
  initCaseStudyModal();
  setupContactForm(appSiteData.company);
  setupNavigationEvents();
  setupScrollObserver();
  setupCardGlow();
}

/** --- Render Navigation --- */
function renderNavigation() {
  const brandEl = document.getElementById('navbarBrand');
  const linksEl = document.getElementById('navbarLinks');
  const mobileLinksEl = document.getElementById('mobileNavLinks');
  const ctaBtn = document.getElementById('navbarCta');

  if (brandEl) {
    brandEl.innerHTML = `
      <div class="brand-icon">DS</div>
      <div class="brand-logo-content">
        <span class="brand-title">${appSiteData.navigation.brand.name}</span>
        <span class="brand-badge">${appSiteData.navigation.brand.badge}</span>
      </div>
    `;
  }

  if (linksEl && appSiteData.navigation.links) {
    linksEl.innerHTML = appSiteData.navigation.links.map(l => `
      <li><a href="${l.href}" class="nav-link">${l.label}</a></li>
    `).join('');
  }

  if (mobileLinksEl && appSiteData.navigation.links) {
    mobileLinksEl.innerHTML = appSiteData.navigation.links.map(l => `
      <li><a href="${l.href}" class="mobile-nav-link">${l.label}</a></li>
    `).join('');
  }

  if (ctaBtn && appSiteData.navigation.ctaButton) {
    ctaBtn.textContent = appSiteData.navigation.ctaButton.label;
    ctaBtn.setAttribute('href', appSiteData.navigation.ctaButton.href);
  }
}

/** --- Render Hero --- */
function renderHero() {
  const heroBadge = document.getElementById('heroBadge');
  const heroHeadline = document.getElementById('heroHeadline');
  const heroSubtext = document.getElementById('heroSubtext');
  const heroCtaPrimary = document.getElementById('heroCtaPrimary');
  const heroCtaSecondary = document.getElementById('heroCtaSecondary');
  const heroPills = document.getElementById('heroPills');

  if (heroBadge) heroBadge.textContent = appSiteData.hero.badge;
  if (heroHeadline) {
    heroHeadline.innerHTML = `${appSiteData.hero.headline.replace('High-Growth Enterprises', '<span class="hero-gradient-text">High-Growth Enterprises</span>')}`;
  }
  if (heroSubtext) heroSubtext.textContent = appSiteData.hero.subtext;
  
  if (heroCtaPrimary) {
    heroCtaPrimary.innerHTML = `${appSiteData.hero.ctaPrimary.label} ${getIcon('arrowRight')}`;
    heroCtaPrimary.setAttribute('href', appSiteData.hero.ctaPrimary.href);
  }
  if (heroCtaSecondary) {
    heroCtaSecondary.textContent = appSiteData.hero.ctaSecondary.label;
    heroCtaSecondary.setAttribute('href', appSiteData.hero.ctaSecondary.href);
  }

  if (heroPills && appSiteData.hero.trustPills) {
    heroPills.innerHTML = appSiteData.hero.trustPills.map(p => `
      <span class="hero-pill">${p}</span>
    `).join('');
  }
}

/** --- Render Capabilities Ticker --- */
function renderCapabilities() {
  const container = document.getElementById('capabilitiesContainer');
  if (!container || !appSiteData.company.capabilities) return;

  // Duplicate list to allow smooth continuous ticker effect
  const list = [...appSiteData.company.capabilities, ...appSiteData.company.capabilities];
  container.innerHTML = list.map(cap => `
    <div class="capability-item">
      <div class="capability-bullet"></div>
      <span>${cap}</span>
    </div>
  `).join('');
}

/** --- Render Services --- */
function renderServices() {
  const container = document.getElementById('servicesContainer');
  if (!container || !appSiteData.services) return;

  container.innerHTML = appSiteData.services.map((s, idx) => `
    <div class="glass-card service-card reveal delay-${(idx % 3) + 1}">
      <div>
        <div class="service-icon-box">${getIcon(s.icon)}</div>
        <div class="service-tagline">${s.tagline}</div>
        <h3 class="service-title">${s.title}</h3>
        <p class="service-description">${s.description}</p>
      </div>

      <ul class="service-deliverables">
        ${(s.deliverables || []).map(d => `
          <li class="service-deliverable-item">
            ${getIcon('check')}
            <span>${d}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

/** --- Render Project Category Filters --- */
function renderProjectFilters() {
  const filterContainer = document.getElementById('projectFilterContainer');
  if (!filterContainer) return;

  const categories = appSiteData.projectCategories || ['All', 'SaaS', 'CMS', 'Web App', 'Custom Software'];
  filterContainer.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>
  `).join('');

  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedCategory = e.currentTarget.getAttribute('data-category');
      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      renderProjects(selectedCategory);
    });
  });
}

/** --- Render Projects --- */
function renderProjects(category = 'All') {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  const filtered = (category === 'All')
    ? appSiteData.projects
    : appSiteData.projects.filter(p => p.category.toLowerCase() === category.toLowerCase());

  container.innerHTML = filtered.map((p, idx) => `
    <div class="project-card reveal delay-${(idx % 3) + 1}">
      <div class="project-image-wrapper">
        <img src="${p.image}" alt="${p.title}" class="project-image" loading="lazy" />
        <div class="project-badge">${p.badge || p.category}</div>
      </div>
      
      <div class="project-body">
        <div class="project-client-type">${p.clientType || ''}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-description">${p.description}</p>

        <div class="project-tech-tags">
          ${(p.technologies || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <div class="project-actions">
          <button class="btn btn-secondary btn-sm js-view-case-study" data-project-id="${p.id}">
            Technical Architecture
          </button>
          <a href="${p.caseStudyUrl || '#'}" class="btn btn-primary btn-sm" style="margin-left: auto;">
            Case Study ${getIcon('arrowRight')}
          </a>
        </div>
      </div>
    </div>
  `).join('');

  // Bind Case Study button listeners
  container.querySelectorAll('.js-view-case-study').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pid = e.currentTarget.getAttribute('data-project-id');
      const targetProject = appSiteData.projects.find(proj => proj.id === pid);
      if (targetProject) {
        openCaseStudyModal(targetProject);
      }
    });
  });
}

/** --- Render Why Choose Us --- */
function renderWhyChooseUs() {
  const container = document.getElementById('whyUsContainer');
  if (!container || !appSiteData.whyChooseUs) return;

  container.innerHTML = appSiteData.whyChooseUs.map((w, idx) => `
    <div class="glass-card why-card reveal delay-${(idx % 3) + 1}">
      <div class="why-icon-wrap">${getIcon(w.icon)}</div>
      <div class="why-content">
        <h4>${w.title}</h4>
        <p>${w.description}</p>
      </div>
    </div>
  `).join('');
}

/** --- Render 6-Step Process --- */
function renderProcess() {
  const container = document.getElementById('processContainer');
  if (!container || !appSiteData.process) return;

  container.innerHTML = appSiteData.process.map((pr, idx) => `
    <div class="process-card reveal delay-${(idx % 3) + 1}">
      <div class="process-step-number">${pr.step}</div>
      <div class="process-phase">${pr.phase}</div>
      <h3 class="process-title">${pr.title}</h3>
      <p class="process-summary">${pr.summary}</p>

      <ul class="process-deliverables">
        ${(pr.deliverables || []).map(d => `
          <li class="process-deliverable-item">${d}</li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

/** --- Render Technologies --- */
function renderTechnologies() {
  const container = document.getElementById('technologiesContainer');
  if (!container || !appSiteData.technologies) return;

  container.innerHTML = appSiteData.technologies.map((t, idx) => `
    <div class="tech-category-card reveal delay-${(idx % 2) + 1}">
      <h3 class="tech-cat-title">${t.category}</h3>
      <p class="tech-cat-desc">${t.description}</p>
      <div class="tech-pill-list">
        ${(t.skills || []).map(s => `
          <div class="tech-skill-pill">
            <span class="tech-level-dot"></span>
            <span>${s.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/** --- Render About --- */
function renderAbout() {
  const aboutHeadline = document.getElementById('aboutHeadline');
  const aboutLead = document.getElementById('aboutLead');
  const aboutParagraphs = document.getElementById('aboutParagraphs');
  const aboutHighlights = document.getElementById('aboutHighlights');

  if (!appSiteData.about) return;

  if (aboutHeadline) aboutHeadline.textContent = appSiteData.about.headline;
  if (aboutLead) aboutLead.textContent = appSiteData.about.lead;
  if (aboutParagraphs) {
    aboutParagraphs.innerHTML = (appSiteData.about.paragraphs || []).map(p => `<p>${p}</p>`).join('');
  }
  if (aboutHighlights) {
    aboutHighlights.innerHTML = (appSiteData.about.highlights || []).map(h => `
      <div class="about-highlight-card">
        <h4>${h.title}</h4>
        <p>${h.description}</p>
      </div>
    `).join('');
  }
}

/** --- Render Stats --- */
function renderStats() {
  const container = document.getElementById('statsContainer');
  if (!container || !appSiteData.company.stats) return;

  container.innerHTML = appSiteData.company.stats.map((st, idx) => `
    <div class="stat-card reveal delay-${(idx % 4) + 1}">
      <div class="stat-value">${st.value}</div>
      <div class="stat-label">${st.label}</div>
      <div class="stat-desc">${st.description}</div>
    </div>
  `).join('');
}

/** --- Render Testimonials --- */
function renderTestimonials() {
  const section = document.getElementById('testimonialsSection');
  const container = document.getElementById('testimonialsContainer');
  if (!section || !container || !appSiteData.testimonials) return;

  if (!appSiteData.testimonials.showSection) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  container.innerHTML = (appSiteData.testimonials.items || []).map((tm, idx) => {
    // Generate avatar initials
    const initials = tm.authorName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('');
    return `
      <div class="testimonial-card reveal delay-${(idx % 3) + 1}">
        <div class="star-rating">
          ${Array(tm.rating || 5).fill(getIcon('star')).join('')}
        </div>
        <div class="testimonial-quote">“${tm.quote}”</div>
        <div class="testimonial-author">
          <div class="author-avatar">${initials}</div>
          <div>
            <div class="author-name">${tm.authorName}</div>
            <div class="author-role">${tm.authorRole} • ${tm.company}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/** --- Render CTA Banner --- */
function renderCtaBanner() {
  const ctaHeadline = document.getElementById('ctaHeadline');
  const ctaSubtext = document.getElementById('ctaSubtext');
  const ctaButton = document.getElementById('ctaButton');

  if (!appSiteData.cta) return;

  if (ctaHeadline) ctaHeadline.textContent = appSiteData.cta.headline;
  if (ctaSubtext) ctaSubtext.textContent = appSiteData.cta.subtext;
  if (ctaButton) {
    ctaButton.innerHTML = `${appSiteData.cta.buttonText} ${getIcon('arrowRight')}`;
    ctaButton.setAttribute('href', appSiteData.cta.buttonHref);
  }
}

/** --- Render Contact --- */
function renderContact() {
  const channelsContainer = document.getElementById('contactChannelsContainer');
  if (!channelsContainer || !appSiteData.contact) return;

  const ch = appSiteData.contact.channels || {};
  const comp = appSiteData.company.contact || {};

  channelsContainer.innerHTML = `
    <!-- Email Channel -->
    <div class="contact-card">
      <div class="contact-icon-wrap">${getIcon('email')}</div>
      <div class="contact-details">
        <h4>${ch.email?.label || 'Email Us'}</h4>
        <a href="mailto:${comp.email}" class="contact-link">${comp.email}</a>
        <div class="contact-hint">${ch.email?.hint || 'Direct consultation and RFP submissions'}</div>
      </div>
    </div>

    <!-- WhatsApp Channel -->
    <div class="contact-card">
      <div class="contact-icon-wrap">${getIcon('whatsapp')}</div>
      <div class="contact-details">
        <h4>${ch.whatsapp?.label || 'WhatsApp'}</h4>
        <a href="https://wa.me/${(comp.whatsapp || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(appSiteData.company?.shortName || 'Diyaseva')},%20I'd%20like%20to%20discuss%20a%20project%20inquiry." target="_blank" rel="noopener noreferrer" class="contact-link">
          ${comp.phone || comp.whatsapp}
        </a>
        <div class="contact-hint">${ch.whatsapp?.hint || 'Instant chat & project scoping'}</div>
      </div>
    </div>

    <!-- Location Channel -->
    <div class="contact-card">
      <div class="contact-icon-wrap">${getIcon('mapPin')}</div>
      <div class="contact-details">
        <h4>${ch.location?.label || 'Location'}</h4>
        <div class="contact-link" style="cursor: default;">${comp.location}</div>
        <div class="contact-hint">${ch.location?.hint || 'Available for global timezones'}</div>
      </div>
    </div>
  `;
}

/** --- Render Footer --- */
function renderFooter() {
  const brandName = document.getElementById('footerBrandName');
  const bio = document.getElementById('footerBio');
  const quickLinks = document.getElementById('footerQuickLinks');
  const servicesLinks = document.getElementById('footerServicesLinks');
  const legalLinks = document.getElementById('footerLegalLinks');
  const socialLinks = document.getElementById('footerSocialLinks');
  const copyright = document.getElementById('footerCopyright');

  if (brandName) brandName.textContent = appSiteData.company.name;
  if (bio) bio.textContent = appSiteData.footer.about;

  if (quickLinks && appSiteData.footer.quickLinks) {
    quickLinks.innerHTML = appSiteData.footer.quickLinks.map(l => `
      <li><a href="${l.href}" class="footer-link">${l.label}</a></li>
    `).join('');
  }

  if (servicesLinks && appSiteData.services) {
    servicesLinks.innerHTML = appSiteData.services.map(s => `
      <li><a href="index.html#services" class="footer-link">${s.title}</a></li>
    `).join('');
  }

  if (legalLinks && appSiteData.footer.legalLinks) {
    legalLinks.innerHTML = appSiteData.footer.legalLinks.map(l => `
      <li><a href="${l.href}" class="footer-link">${l.label}</a></li>
    `).join('');
  }

  if (socialLinks && appSiteData.company.socialLinks) {
    const soc = appSiteData.company.socialLinks;
    socialLinks.innerHTML = `
      ${soc.github ? `<a href="${soc.github}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="GitHub">${getIcon('github')}</a>` : ''}
      ${soc.linkedin ? `<a href="${soc.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn">${getIcon('linkedin')}</a>` : ''}
      ${soc.twitter ? `<a href="${soc.twitter}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Twitter">${getIcon('twitter')}</a>` : ''}
    `;
  }

  if (copyright) {
    const currentYear = new Date().getFullYear();
    copyright.textContent = `© ${currentYear} ${appSiteData.company.name}. All rights reserved.`;
  }
}

/** --- Spotlight Card Glow On Mouse Move --- */
function setupCardGlow() {
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.glass-card, .project-card, .estimator-wrapper').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/** --- Setup Sticky Navigation and Mobile Menu --- */
function setupNavigationEvents() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.innerHTML = getIcon('hamburger');
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      hamburgerBtn.innerHTML = isOpen ? getIcon('close') : getIcon('hamburger');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu on link click
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        mobileDrawer.classList.remove('open');
        hamburgerBtn.innerHTML = getIcon('hamburger');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/** --- Scroll Reveal Intersection Observer --- */
function setupScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Bootstrap on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
