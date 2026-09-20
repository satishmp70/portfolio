/**
 * =========================================================================
 * INTERACTIVE ARCHITECTURE & SCOPE ESTIMATOR
 * =========================================================================
 */

export function setupEstimator() {
  const typeButtons = document.querySelectorAll('#estTypeOptions .est-option-btn');
  const scaleButtons = document.querySelectorAll('#estScaleOptions .est-option-btn');
  const featureChecks = document.querySelectorAll('#estFeatureChecks input[type="checkbox"]');

  const titleEl = document.getElementById('estSummaryTitle');
  const deliveryTimeEl = document.getElementById('estDeliveryTime');
  const slaTierEl = document.getElementById('estSlaTier');
  const techStackEl = document.getElementById('estTechStack');
  const prefillBtn = document.getElementById('estPrefillBtn');

  if (!typeButtons.length || !titleEl) return;

  let state = {
    type: 'saas',
    scale: 'mvp',
    features: ['auth', 'billing', 'realtime']
  };

  const typeBlueprints = {
    saas: {
      title: 'Multi-Tenant SaaS Engine',
      baseWeeks: [4, 6],
      baseTech: ['React 18', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      scaleTech: {
        mvp: ['Vercel Edge', 'Supabase / Neon'],
        scale: ['TimescaleDB', 'Stripe Billing', 'AWS ECS'],
        enterprise: ['Kafka Stream', 'Kubernetes', 'Multi-Region DB', 'Datadog']
      }
    },
    cms: {
      title: 'Headless CMS & Global Mesh',
      baseWeeks: [3, 5],
      baseTech: ['Next.js 14', 'TypeScript', 'Strapi v5', 'GraphQL', 'AWS S3', 'Tailwind CSS'],
      scaleTech: {
        mvp: ['Cloudflare CDN', 'Next.js ISR'],
        scale: ['Multi-Region Edge', 'Automated SEO Graph'],
        enterprise: ['Enterprise Content Mesh', 'Role Rollback', 'AWS CloudFront WAF']
      }
    },
    custom: {
      title: 'Custom Operational System',
      baseWeeks: [5, 7],
      baseTech: ['Vue 3 / React', 'Python FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
      scaleTech: {
        mvp: ['Docker Compose', 'Leaflet GIS'],
        scale: ['Celery Workers', 'WebSocket Fleet Live', 'PostGIS'],
        enterprise: ['Microservice Cluster', 'Zero-Downtime HA', 'Air-Gapped Option']
      }
    },
    api: {
      title: 'High-Throughput Ledger API',
      baseWeeks: [4, 6],
      baseTech: ['Go (Golang)', 'TypeScript', 'PostgreSQL', 'Apache Kafka', 'Redis'],
      scaleTech: {
        mvp: ['Docker', 'REST + WebSockets'],
        scale: ['gRPC Microservices', 'Read Replicas', 'TimescaleDB'],
        enterprise: ['Kubernetes Cluster', 'Double-Entry Cryptographic Proof', 'Multi-AZ HA']
      }
    }
  };

  function updateEstimator() {
    const blueprint = typeBlueprints[state.type] || typeBlueprints.saas;

    // Calculate weeks
    let [minWeeks, maxWeeks] = blueprint.baseWeeks;
    if (state.scale === 'scale') {
      minWeeks += 2;
      maxWeeks += 3;
    } else if (state.scale === 'enterprise') {
      minWeeks += 4;
      maxWeeks += 6;
    }

    // Extra feature weeks
    const activeFeatsCount = state.features.length;
    if (activeFeatsCount > 3) {
      minWeeks += 1;
      maxWeeks += 2;
    }

    // SLA
    let sla = '99.9% Uptime';
    if (state.scale === 'enterprise') {
      sla = '99.99% Mission-Critical SLA';
    } else if (state.scale === 'scale') {
      sla = '99.95% High-Availability SLA';
    }

    // Tech Stack List
    const currentScaleTech = blueprint.scaleTech[state.scale] || [];
    const combinedTech = Array.from(new Set([...blueprint.baseTech, ...currentScaleTech]));

    // Render output
    titleEl.textContent = `${blueprint.title} (${state.scale.toUpperCase()})`;
    deliveryTimeEl.textContent = `${minWeeks} - ${maxWeeks} Weeks (Staged)`;
    slaTierEl.textContent = sla;

    techStackEl.innerHTML = combinedTech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    // Update Prefill link / click
    if (prefillBtn) {
      prefillBtn.onclick = (e) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }

        const projectTypeSelect = document.getElementById('projectType');
        const projectDetailsTextarea = document.getElementById('projectDetails');

        if (projectTypeSelect) {
          if (state.type === 'saas') projectTypeSelect.value = 'SaaS Platform';
          if (state.type === 'cms') projectTypeSelect.value = 'Headless CMS Mesh';
          if (state.type === 'custom') projectTypeSelect.value = 'Custom Enterprise App';
          if (state.type === 'api') projectTypeSelect.value = 'High-Performance Web App';
        }

        if (projectDetailsTextarea) {
          projectDetailsTextarea.value = `Hello Diyaseva Team,\n\nWe would like to submit a project inquiry for building a ${blueprint.title} with the following target specifications:\n- Concurrency / Scale: ${state.scale.toUpperCase()}\n- Selected Capabilities: ${state.features.join(', ')}\n- Recommended Stack: ${combinedTech.join(', ')}\n- Estimated Timeline: ${minWeeks}-${maxWeeks} Weeks\n\nPlease let us know your availability for an initial technical architecture discussion.`;
        }
      };
    }
  }

  // Bind Type Options
  typeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      typeButtons.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      state.type = target.getAttribute('data-type');
      updateEstimator();
    });
  });

  // Bind Scale Options
  scaleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      scaleButtons.forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      state.scale = target.getAttribute('data-scale');
      updateEstimator();
    });
  });

  // Bind Feature Checkboxes
  featureChecks.forEach(chk => {
    chk.addEventListener('change', () => {
      state.features = Array.from(featureChecks)
        .filter(c => c.checked)
        .map(c => c.getAttribute('data-feature'));
      updateEstimator();
    });
  });

  // Initial update
  updateEstimator();
}
