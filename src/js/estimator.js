/**
 * =========================================================================
 * INTERACTIVE ARCHITECTURE & SCOPE ESTIMATOR
 * =========================================================================
 * Supports two markup variants:
 *  1. Homepage widget  (#estSummaryTitle, #estDeliveryTime, #estSlaTier, #estTechStack, #estPrefillBtn)
 *  2. Estimator page   (#estOutputTitle, #estOutputDesc, #estOutputStack, #estOutputInfra,
 *                       #estOutputSecurity, #estOutputDuration, #estOutputSla, #estConsultBtn)
 */

export function setupEstimator() {
  const typeButtons = document.querySelectorAll('#estTypeOptions .est-option-btn');
  const scaleButtons = document.querySelectorAll('#estScaleOptions .est-option-btn');
  const featureChecks = document.querySelectorAll('#estFeatureChecks input[type="checkbox"]');

  // Homepage output targets
  const titleEl = document.getElementById('estSummaryTitle');
  const deliveryTimeEl = document.getElementById('estDeliveryTime');
  const slaTierEl = document.getElementById('estSlaTier');
  const techStackEl = document.getElementById('estTechStack');
  const prefillBtn = document.getElementById('estPrefillBtn');

  // Estimator page output targets
  const outTitleEl = document.getElementById('estOutputTitle');
  const outDescEl = document.getElementById('estOutputDesc');
  const outStackEl = document.getElementById('estOutputStack');
  const outInfraEl = document.getElementById('estOutputInfra');
  const outSecurityEl = document.getElementById('estOutputSecurity');
  const outDurationEl = document.getElementById('estOutputDuration');
  const outSlaEl = document.getElementById('estOutputSla');

  if (!typeButtons.length || (!titleEl && !outTitleEl)) return;

  const isEstimatorPage = Boolean(outTitleEl);

  let state = {
    type: 'saas',
    scale: 'mvp',
    security: 'standard',
    cloud: 'vercel-aws',
    timeline: 'standard',
    features: ['auth', 'billing', 'realtime']
  };

  const typeBlueprints = {
    saas: {
      title: 'Multi-Tenant SaaS Engine',
      desc: 'Engineered with isolated tenant schemas, automated subscription billing, and sub-100ms API response times.',
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
      desc: 'API-first content infrastructure with multilingual publishing workflows and sub-40ms global edge delivery.',
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
      desc: 'Purpose-built business software with workflow automation, dispatch logic, and operational dashboards.',
      baseWeeks: [5, 7],
      baseTech: ['Vue 3 / React', 'Python FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
      scaleTech: {
        mvp: ['Docker Compose', 'Leaflet GIS'],
        scale: ['Celery Workers', 'WebSocket Fleet Live', 'PostGIS'],
        enterprise: ['Microservice Cluster', 'Zero-Downtime HA', 'Air-Gapped Option']
      }
    },
    modernization: {
      title: 'Legacy Modernization Program',
      desc: 'Monolith-to-microservices refactoring with zero-downtime data migration and cloud containerization.',
      baseWeeks: [6, 8],
      baseTech: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions CI/CD'],
      scaleTech: {
        mvp: ['Docker Compose', 'Blue/Green Deploys'],
        scale: ['Kubernetes', 'API Gateway', 'Read Replicas'],
        enterprise: ['Service Mesh', 'Multi-Region HA', 'Observability Stack']
      }
    },
    ai: {
      title: 'AI & Automation Platform',
      desc: 'Custom LLM pipelines, vector search, and intelligent document automation integrated into your stack.',
      baseWeeks: [5, 7],
      baseTech: ['TypeScript', 'Python FastAPI', 'Vector DB', 'Redis', 'Docker'],
      scaleTech: {
        mvp: ['OpenAI / Claude APIs', 'pgvector'],
        scale: ['Kafka Queues', 'GPU Inference Workers'],
        enterprise: ['Private Model Hosting', 'RAG Pipeline Mesh', 'Audit Logging']
      }
    },
    api: {
      title: 'High-Throughput Ledger API',
      desc: 'Event-driven microservices engineered for high-concurrency transactions and immutable audit trails.',
      baseWeeks: [4, 6],
      baseTech: ['Go (Golang)', 'TypeScript', 'PostgreSQL', 'Apache Kafka', 'Redis'],
      scaleTech: {
        mvp: ['Docker', 'REST + WebSockets'],
        scale: ['gRPC Microservices', 'Read Replicas', 'TimescaleDB'],
        enterprise: ['Kubernetes Cluster', 'Double-Entry Cryptographic Proof', 'Multi-AZ HA']
      }
    }
  };

  const securityTiers = {
    standard: { label: 'Standard OWASP Top 10 Hardened + TLS 1.3', weeks: 0 },
    soc2: { label: 'SOC 2 & GDPR Ready (Audit Trails, Key Rotation)', weeks: 1 },
    hipaa: { label: 'HIPAA / PCI-DSS Level 1 (E2E Encryption & BAA)', weeks: 2 }
  };

  const cloudBlueprints = {
    'vercel-aws': 'Vercel Edge Network + AWS Lambda + Supabase / RDS',
    'aws-k8s': 'AWS / EKS Kubernetes Cluster + Private VPC Mesh + RDS',
    gcp: 'Google Cloud Run + BigQuery Event Pipelines + Cloud SQL'
  };

  const scaleSla = {
    mvp: '99.9% Uptime',
    scale: '99.95% High-Availability SLA',
    enterprise: '99.99% Mission-Critical SLA'
  };

  const scalePageSla = {
    mvp: '99.9% Production Uptime',
    scale: '99.95% Production Uptime',
    enterprise: '99.99% Mission-Critical Uptime'
  };

  const scaleLabels = {
    mvp: 'Early Growth',
    scale: 'Scaling Enterprise',
    enterprise: 'High Concurrency'
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

    // Extra feature weeks (homepage variant)
    const activeFeatsCount = state.features.length;
    if (activeFeatsCount > 3) {
      minWeeks += 1;
      maxWeeks += 2;
    }

    // Security & timeline adjustments (estimator page variant)
    if (isEstimatorPage) {
      minWeeks += securityTiers[state.security]?.weeks || 0;
      maxWeeks += securityTiers[state.security]?.weeks || 0;
      if (state.timeline === 'fasttrack') {
        minWeeks = Math.max(2, minWeeks - 2);
        maxWeeks = Math.max(4, maxWeeks - 3);
      }
    }

    // Tech Stack List
    const currentScaleTech = blueprint.scaleTech[state.scale] || [];
    const combinedTech = Array.from(new Set([...blueprint.baseTech, ...currentScaleTech]));

    if (isEstimatorPage) {
      // ---- Estimator page rendering ----
      outTitleEl.textContent = blueprint.title;
      if (outDescEl) outDescEl.textContent = blueprint.desc;
      if (outStackEl) outStackEl.textContent = combinedTech.join(', ');
      if (outInfraEl) outInfraEl.textContent = cloudBlueprints[state.cloud] || cloudBlueprints['vercel-aws'];
      if (outSecurityEl) outSecurityEl.textContent = securityTiers[state.security]?.label || securityTiers.standard.label;
      if (outDurationEl) outDurationEl.textContent = `${minWeeks} – ${maxWeeks} Weeks (${state.timeline === 'fasttrack' ? 'Accelerated Sprint' : 'Staged Delivery'})`;
      if (outSlaEl) outSlaEl.textContent = scalePageSla[state.scale] || scalePageSla.mvp;
    } else {
      // ---- Homepage widget rendering ----
      const sla = scaleSla[state.scale] || scaleSla.mvp;
      titleEl.textContent = `${blueprint.title} (${scaleLabels[state.scale] || state.scale.toUpperCase()})`;
      if (deliveryTimeEl) deliveryTimeEl.textContent = `${minWeeks} - ${maxWeeks} Weeks (Staged)`;
      if (slaTierEl) slaTierEl.textContent = sla;
      if (techStackEl) {
        techStackEl.innerHTML = combinedTech.map(t => `<span class="tech-tag">${t}</span>`).join('');
      }
    }

    // Prefill contact form (homepage widget)
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
          const typeMap = {
            saas: 'Custom SaaS Development',
            cms: 'Headless CMS Architecture',
            custom: 'Legacy System Modernization',
            modernization: 'Legacy System Modernization',
            ai: 'AI & Automation Integration',
            api: 'High-Performance Web App'
          };
          projectTypeSelect.value = typeMap[state.type] || 'Custom SaaS Development';
        }

        if (projectDetailsTextarea) {
          projectDetailsTextarea.value = `Hello Vistarsolution Team,\n\nWe would like to book a technical consultation for building a ${blueprint.title} with the following target specifications:\n- Concurrency / Scale: ${state.scale.toUpperCase()}\n- Selected Capabilities: ${state.features.join(', ')}\n- Recommended Stack: ${combinedTech.join(', ')}\n- Estimated Timeline: ${minWeeks}-${maxWeeks} Weeks\n\nPlease let us know your availability for an initial architecture discussion.`;
        }
      };
    }

    // Consultation link (estimator page) — append configuration to the contact page URL
    const consultBtn = document.getElementById('estConsultBtn');
    if (consultBtn) {
      consultBtn.href = `/contact/?scope=${encodeURIComponent(blueprint.title)}&scale=${encodeURIComponent(state.scale)}`;
    }
  }

  function bindOptionGroup(selector, attr, key) {
    const buttons = document.querySelectorAll(`${selector} .est-option-btn`);
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        buttons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state[key] = e.currentTarget.getAttribute(attr);
        updateEstimator();
      });
    });
  }

  // Bind Type / Scale / Security / Cloud / Timeline option groups
  bindOptionGroup('#estTypeOptions', 'data-type', 'type');
  bindOptionGroup('#estScaleOptions', 'data-scale', 'scale');
  bindOptionGroup('#estSecurityOptions', 'data-security', 'security');
  bindOptionGroup('#estCloudOptions', 'data-cloud', 'cloud');
  bindOptionGroup('#estTimelineOptions', 'data-timeline', 'timeline');

  // Bind Feature Checkboxes (homepage widget)
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
