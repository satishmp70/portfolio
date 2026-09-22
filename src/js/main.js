/**
 * =========================================================================
 * MAIN APPLICATION BOOTSTRAPPER
 * =========================================================================
 * Dynamically renders the entire portfolio website from data/siteData.json
 */

import { getSiteData } from './dataLoader.js';
import { getIcon } from './icons.js';
import { setupContactForm } from './contact.js';
import { setupEstimator } from './estimator.js';

let appSiteData = null;
let revealObserver = null;

/** --- Observe dynamically rendered .reveal elements so they never stay hidden --- */
function observeReveals(scope = document) {
  if (!revealObserver) return;
  scope.querySelectorAll('.reveal:not(.active)').forEach(el => revealObserver.observe(el));
}

/**
 * Containers can limit how many items they show via data-limit="3"
 * (homepage teasers) — subpages omit it and get the full list.
 */
function limitItems(container, items) {
  const limit = parseInt(container.dataset.limit, 10);
  return Number.isFinite(limit) && limit > 0 ? items.slice(0, limit) : items;
}

/** Compact cards on the homepage, detailed cards on subpages (data-variant="detailed") */
function isDetailed(container) {
  return container.dataset.variant === 'detailed';
}

async function init() {
  appSiteData = await getSiteData();
  if (!appSiteData) {
    console.error('Failed to load site data.');
    return;
  }

  // Only the homepage takes its title from data; subpages keep their own unique <title>
  const isHomepage = /^\/(index\.html)?$/.test(window.location.pathname);
  if (isHomepage) {
    document.title = `${appSiteData.company.name} — ${appSiteData.company.tagline}`;
  }

  // Initialize UI components
  renderTopBar();
  renderNavigation();
  renderHero();
  renderCapabilities();
  renderServices();
  renderIndustries();
  renderClients();
  renderProjectFilters();
  renderProjects('All');
  renderWhyChooseUs();
  renderProcess();
  renderTechMarquee();
  renderTechnologies();
  renderAbout();
  renderStats();
  renderTestimonials();
  renderCtaBanner();
  renderContact();
  renderFooter();

  // Setup interactive components & events
  setupEstimator();
  setupContactForm(appSiteData.company);
  setupNavigationEvents();
  setupScrollObserver();
}

/** --- Route Active Matcher Helper --- */
function isLinkActive(href) {
  const rawPath = window.location.pathname.replace(/\/index\.html$/, '/');
  const path = rawPath.endsWith('/') ? rawPath : rawPath + '/';
  const hash = window.location.hash;

  // Handle hash anchors (e.g. "/#estimator" or "#estimator")
  if (href.includes('#')) {
    const parts = href.split('#');
    const targetPath = parts[0] ? (parts[0].endsWith('/') ? parts[0] : parts[0] + '/') : '/';
    const targetHash = '#' + parts[1];
    return path === targetPath && hash === targetHash;
  }

  // Handle root home link
  const normHref = href.endsWith('/') ? href : href + '/';
  if (normHref === '/') {
    return (path === '/' || path === '') && (!hash || hash === '#home');
  }

  // Handle subpage directory matching (e.g. "/services/")
  return path === normHref || path.startsWith(normHref);
}

/** --- Render top utility bar (email / phone / location / socials) --- */
function renderTopBar() {
  const comp = appSiteData.company || {};
  const contact = comp.contact || {};
  const emailEl = document.getElementById('topBarEmail');
  const phoneEl = document.getElementById('topBarPhone');
  const locEl = document.getElementById('topBarLocation');
  const socialsEl = document.getElementById('topBarSocials');

  if (emailEl && contact.email) {
    emailEl.href = `mailto:${contact.email}`;
    emailEl.querySelector('span').textContent = contact.email;
  }
  if (phoneEl && contact.phone) {
    phoneEl.href = `tel:${(contact.whatsapp || contact.phone).replace(/[^0-9+]/g, '')}`;
    phoneEl.querySelector('span').textContent = contact.phone;
  }
  if (locEl && contact.location) {
    // Keep the top bar short: show the part before any parenthetical
    locEl.querySelector('span').textContent = contact.location.split('(')[0].trim();
  }
  if (socialsEl && comp.socialLinks) {
    const soc = comp.socialLinks;
    socialsEl.innerHTML = [
      soc.linkedin ? `<a href="${soc.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${getIcon('linkedin')}</a>` : '',
      soc.x ? `<a href="${soc.x}" target="_blank" rel="noopener noreferrer" aria-label="X">${getIcon('x')}</a>` : '',
      soc.facebook ? `<a href="${soc.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${getIcon('facebook')}</a>` : '',
      soc.instagram ? `<a href="${soc.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${getIcon('instagram')}</a>` : ''
    ].join('');
  }
}

/** --- Render Navigation --- */
function renderNavigation() {
  const brandEl = document.getElementById('navbarBrand');
  const linksEl = document.getElementById('navbarLinks');
  const mobileLinksEl = document.getElementById('mobileNavLinks');
  const ctaBtn = document.getElementById('navbarCta');

  if (brandEl) {
    const logo = appSiteData.navigation.brand.logo || '/images/logo/logo.png';
    brandEl.innerHTML = `<img src="${logo}" alt="${appSiteData.company.name}" class="brand-logo-img" width="720" height="188" />`;
    brandEl.setAttribute('href', '/');
    brandEl.setAttribute('aria-label', `${appSiteData.company.name} Home`);
  }

  if (linksEl && appSiteData.navigation.links) {
    linksEl.innerHTML = appSiteData.navigation.links.map(l => {
      const active = isLinkActive(l.href);
      return `<li><a href="${l.href}" class="nav-link ${active ? 'active' : ''}">${l.label}</a></li>`;
    }).join('');
  }

  if (mobileLinksEl && appSiteData.navigation.links) {
    mobileLinksEl.innerHTML = appSiteData.navigation.links.map(l => {
      const active = isLinkActive(l.href);
      return `<li><a href="${l.href}" class="mobile-nav-link ${active ? 'active' : ''}">${l.label}</a></li>`;
    }).join('');
  }

  if (ctaBtn && appSiteData.navigation.ctaButton) {
    ctaBtn.textContent = appSiteData.navigation.ctaButton.label;
    ctaBtn.setAttribute('href', appSiteData.navigation.ctaButton.href);
  }
}

/** --- Render Industries (we serve every sector: heading + chip list) --- */
function renderIndustries() {
  const container = document.getElementById('industriesContainer');
  const ind = appSiteData.industries;
  if (!container || !ind) return;

  const list = limitItems(container, ind.list || []);
  container.innerHTML = `
    <div class="industry-chips">
      ${list.map(name => `<span class="industry-chip">${getIcon('check')}<span>${name}</span></span>`).join('')}
      <span class="industry-chip industry-chip-more">+ any other industry</span>
    </div>
    ${ind.note ? `<p class="industry-note">${ind.note}</p>` : ''}
  `;
}

/** --- Render Clients (name + logo only) --- */
function renderClients() {
  const container = document.getElementById('clientsContainer');
  const clients = appSiteData.clients;
  if (!container || !clients?.items?.length) return;

  const card = (c) => {
    const inner = `
      <img src="${c.logo}" alt="${c.name} logo" class="client-logo" loading="lazy" width="48" height="48" />
      <span class="client-text">
        <span class="client-name">${c.name}</span>
        ${c.industry ? `<span class="client-industry">${c.industry}</span>` : ''}
      </span>`;
    return c.url
      ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer" class="client-card">${inner}</a>`
      : `<div class="client-card">${inner}</div>`;
  };

  if (container.dataset.marquee !== 'true') {
    container.innerHTML = clients.items.map(card).join('');
    return;
  }

  // Continuous marquee: repeat the list until it comfortably exceeds one screen,
  // then duplicate that sequence so the -50% translate loops seamlessly.
  const repeats = Math.max(1, Math.ceil(8 / clients.items.length));
  const sequence = Array.from({ length: repeats }, () => clients.items).flat().map(card).join('');
  container.innerHTML = `<div class="clients-track">${sequence}${sequence}</div>`;
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
    const headline = appSiteData.hero.headline || '';
    // Wrap the final sentence in a gradient span; if there is only one sentence,
    // highlight the last two words instead so the emphasis is always visible.
    const lastDotIndex = headline.lastIndexOf('.');
    if (lastDotIndex > 0 && lastDotIndex < headline.length - 1) {
      heroHeadline.innerHTML = `${headline.slice(0, lastDotIndex + 1)} <span class="hero-gradient-text">${headline.slice(lastDotIndex + 1).trim()}</span>`;
    } else {
      const words = headline.trim().split(/\s+/);
      const tail = words.splice(-2).join(' ');
      heroHeadline.innerHTML = words.length
        ? `${words.join(' ')} <span class="hero-gradient-text">${tail}</span>`
        : `<span class="hero-gradient-text">${tail}</span>`;
    }
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

  const detailed = isDetailed(container);
  const items = limitItems(container, appSiteData.services);

  container.innerHTML = items.map((s, idx) => `
    <div class="card service-card reveal delay-${(idx % 3) + 1}" id="${detailed ? s.id : ''}">
      <div class="icon-tile">${getIcon(s.icon)}</div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-description">${s.description}</p>

      ${detailed && s.deliverables?.length ? `
        <div class="service-includes-label">What's included</div>
        <ul class="check-list">
          ${s.deliverables.map(d => `<li>${getIcon('check')}<span>${d}</span></li>`).join('')}
        </ul>
      ` : `
        <a href="/services/#${s.id}" class="link-arrow">Learn more ${getIcon('arrowRight')}</a>
      `}
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

  // data-featured="true" shows only featured projects (homepage teaser)
  let list = container.dataset.featured === 'true'
    ? appSiteData.projects.filter(p => p.featured)
    : appSiteData.projects;

  if (category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  list = limitItems(container, list);

  container.innerHTML = list.map((p, idx) => `
    <a href="${p.caseStudyUrl || '#'}" class="card project-card reveal delay-${(idx % 3) + 1}">
      <div class="project-image-wrapper">
        <img src="${p.image}" alt="${p.title}" class="project-image" loading="lazy" />
        <span class="project-badge">${p.badge || p.category}</span>
      </div>

      <div class="project-body">
        <div class="project-client-type">${p.clientType || ''}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-description">${p.description}</p>
        <span class="link-arrow">View case study ${getIcon('arrowRight')}</span>
      </div>
    </a>
  `).join('');

  // Ensure freshly rendered cards become visible (they may render after the initial observer pass)
  observeReveals(container);
}

/** --- Render Why Choose Us --- */
function renderWhyChooseUs() {
  const container = document.getElementById('whyUsContainer') || document.getElementById('whyChooseUsContainer');
  if (!container || !appSiteData.whyChooseUs) return;

  container.innerHTML = limitItems(container, appSiteData.whyChooseUs).map((w, idx) => `
    <div class="card why-card reveal delay-${(idx % 3) + 1}">
      <div class="icon-tile">${getIcon(w.icon)}</div>
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
    <div class="card process-card reveal delay-${(idx % 3) + 1}">
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

/**
 * Technology logo: `logo` = brand SVG in /images/tech/<slug>.svg (Simple Icons),
 * `icon` = inline icon from icons.js (used where no brand SVG exists, e.g. AWS).
 */
function techLogo(item) {
  if (item.logo) return `<img src="/images/tech/${item.logo}.svg" alt="" loading="lazy" width="20" height="20" />`;
  if (item.icon) return getIcon(item.icon);
  return '<span class="tech-level-dot"></span>';
}

/** --- Render Tech Marquee Slider --- */
function renderTechMarquee() {
  const marqueeTrack = document.getElementById('techMarqueeTrack');
  if (!marqueeTrack || !appSiteData.marqueeTechnologies) return;

  // Duplicate array for infinite seamless looping
  const techList = appSiteData.marqueeTechnologies;
  const combined = [...techList, ...techList];

  marqueeTrack.innerHTML = combined.map(item => `
    <div class="tech-marquee-item">
      <span class="tech-marquee-icon">${techLogo(item)}</span>
      <span class="tech-marquee-name">${item.name}</span>
      <span class="tech-marquee-cat">${item.category}</span>
    </div>
  `).join('');
}

/** --- Render Technologies --- */
function renderTechnologies() {
  const container = document.getElementById('technologiesContainer');
  if (!container || !appSiteData.technologies) return;

  container.innerHTML = appSiteData.technologies.map((t, idx) => `
    <div class="card tech-category-card reveal delay-${(idx % 2) + 1}">
      <h3 class="tech-cat-title">${t.category}</h3>
      <p class="tech-cat-desc">${t.description}</p>
      <div class="tech-pill-list">
        ${(t.skills || []).map(s => `
          <div class="tech-skill-pill">
            <span class="tech-skill-logo">${techLogo(s)}</span>
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
      <div class="card testimonial-card reveal delay-${(idx % 3) + 1}">
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
  // Subpages carry their own CTA copy in markup; only the homepage banner is data-driven
  if (!document.getElementById('ctaBannerSection')) return;
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
        ${comp.supportEmail ? `<a href="mailto:${comp.supportEmail}" class="contact-link">${comp.supportEmail}</a>` : ''}
        <div class="contact-hint">${ch.email?.hint || 'Direct consultation and RFP submissions'}</div>
      </div>
    </div>

    <!-- WhatsApp Channel -->
    <div class="contact-card">
      <div class="contact-icon-wrap">${getIcon('whatsapp')}</div>
      <div class="contact-details">
        <h4>${ch.whatsapp?.label || 'WhatsApp'}</h4>
        <a href="https://wa.me/${(comp.whatsapp || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(appSiteData.company?.shortName || 'Vistarsolution')},%20I'd%20like%20to%20discuss%20a%20project%20inquiry." target="_blank" rel="noopener noreferrer" class="contact-link">
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
  const socialLinks = document.getElementById('footerSocialLinks') || document.getElementById('footerSocials');
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
      <li><a href="/services/" class="footer-link">${s.title}</a></li>
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
      ${soc.linkedin ? `<a href="${soc.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn">${getIcon('linkedin')}</a>` : ''}
      ${soc.x ? `<a href="${soc.x}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="X">${getIcon('x')}</a>` : ''}
      ${soc.facebook ? `<a href="${soc.facebook}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook">${getIcon('facebook')}</a>` : ''}
      ${soc.instagram ? `<a href="${soc.instagram}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">${getIcon('instagram')}</a>` : ''}
    `;
  }

  if (copyright) {
    const currentYear = new Date().getFullYear();
    copyright.textContent = `© ${currentYear} ${appSiteData.company.legalName || appSiteData.company.name}. All rights reserved.`;
  }
}

/** --- Setup Sticky Navigation and Mobile Menu --- */
function setupNavigationEvents() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  // Header border/shadow once the page is scrolled
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (hamburgerBtn && mobileDrawer) {
    const setMenu = (open) => {
      mobileDrawer.classList.toggle('open', open);
      mobileDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      hamburgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburgerBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      hamburgerBtn.innerHTML = getIcon(open ? 'close' : 'hamburger');
      document.body.classList.toggle('no-scroll', open);
    };

    setMenu(false);

    hamburgerBtn.addEventListener('click', () => {
      setMenu(!mobileDrawer.classList.contains('open'));
    });

    // Close on link click
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) setMenu(false);
    });

    // Close if the viewport grows to desktop size while open
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    desktopQuery.addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
  }

  // Update active navigation state on hash navigation
  window.addEventListener('hashchange', renderNavigation);
}

/** --- Scroll Reveal Intersection Observer --- */
function setupScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  revealObserver = new IntersectionObserver((entries, obs) => {
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

  revealElements.forEach(el => revealObserver.observe(el));
}

// Bootstrap on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
