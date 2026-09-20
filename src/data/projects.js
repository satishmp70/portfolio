/**
 * =========================================================================
 * PROJECTS & CASE STUDIES DATA
 * =========================================================================
 * This is the central repository for your portfolio projects.
 * 
 * HOW TO ADD A NEW PROJECT:
 * Simply copy one of the project objects below, paste it into the array, and fill
 * in your project details.
 * 
 * Each project automatically supports:
 *  - Project Card display in the main portfolio grid
 *  - Category filtering (SaaS, CMS, Web App, Custom Software)
 *  - Interactive Case Study Modal popup
 *  - Dedicated Case Study standalone page (case-study.html?id=YOUR_SLUG)
 * 
 * All sample projects below are clearly marked as [SAMPLE / PLACEHOLDER] content.
 */

export const projectCategories = [
  "All",
  "SaaS",
  "CMS",
  "Web App",
  "Custom Software"
];

export const projectsData = [
  {
    id: "cloudmetrics-saas-platform",
    isPlaceholder: true, // Marked clearly as sample/placeholder
    badge: "Sample SaaS Project",
    title: "[Sample] CloudMetrics — B2B Telemetry & Billing Platform",
    category: "SaaS",
    clientType: "Fintech & Cloud Infrastructure [Sample]",
    description: "A subscription-based analytics and automated multi-tenant billing engine designed to process cloud utilization events in real-time.",
    image: "/src/assets/images/projects/project-saas.svg",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Docker"],
    url: "https://example.com/project-demo", // Link to live site or demo
    caseStudyUrl: "case-study.html?id=cloudmetrics-saas-platform",
    featured: true,

    // --- Full Case Study Details ---
    caseStudy: {
      headline: "Scalable Real-Time Telemetry and Automated Usage Billing for B2B Cloud Providers",
      overview: "CloudMetrics was conceived as a high-throughput monitoring platform that ingests server usage metrics, aggregates billing thresholds, and automates invoicing for over 250 enterprise tenants.",
      clientOverview: "Enterprise Cloud Infrastructure Vendor (Sample B2B Client Profile)",
      
      challenge: "The client was experiencing slow manual billing calculations, data synchronization lags between microservices, and poor dashboard load times when handling millions of daily metric events.",
      
      solution: "We architected an asynchronous event-driven pipeline using message queues, optimized PostgreSQL schema indexing with time-partitioning, and built a lightning-fast React dashboard with real-time WebSocket feeds.",
      
      keyFeatures: [
        "Real-time utilization telemetry streaming via WebSockets",
        "Automated tier-based invoicing and Stripe Billing webhook reconciliation",
        "Fine-grained multi-tenant role-based permissions (RBAC)",
        "Customizable dashboard widgets with instant data export (CSV/PDF)"
      ],
      
      developmentProcess: [
        { phase: "01 Discovery & Schema Design", detail: "Analyzed existing telemetry payloads and designed time-series database models." },
        { phase: "02 Architecture & API Engineering", detail: "Developed RESTful & WebSocket ingestion microservices with strict rate-limiting." },
        { phase: "03 Frontend Dashboard Build", detail: "Constructed accessible UI with virtualized data tables and responsive charts." },
        { phase: "04 Load Testing & Deployment", detail: "Conducted stress tests up to 10k events/sec and deployed to containerized cloud nodes." }
      ],
      
      architectureNotes: "Decoupled frontend SPA hosted on CDN edge, communicating with Node.js microservices backed by Redis cache and PostgreSQL.",
      
      results: [
        { metric: "< 150ms", label: "Dashboard Query Response Time [Sample]" },
        { metric: "99.98%", label: "System Uptime Across Tenancies [Sample]" },
        { metric: "100%", label: "Automated Invoice Reconciliation [Sample]" }
      ]
    }
  },

  {
    id: "omnipress-headless-cms",
    isPlaceholder: true,
    badge: "Sample CMS Project",
    title: "[Sample] OmniPress — Enterprise Multi-Region Headless CMS",
    category: "CMS",
    clientType: "Digital Publishing & Media [Sample]",
    description: "A headless content architecture enabling multilingual publishing across 8 global web properties with unified editorial workflows.",
    image: "/src/assets/images/projects/project-cms.svg",
    technologies: ["Next.js", "TypeScript", "Strapi CMS", "GraphQL", "Tailwind CSS", "AWS S3"],
    url: "https://example.com/project-demo",
    caseStudyUrl: "case-study.html?id=omnipress-headless-cms",
    featured: true,

    // --- Full Case Study Details ---
    caseStudy: {
      headline: "Unified Multilingual Content Infrastructure for Global Media Network",
      overview: "OmniPress unifies editorial operations for a global digital media organization, allowing non-technical editors to draft, preview, schedule, and distribute content across localized international frontends seamlessly.",
      clientOverview: "Global Media & Digital Publishing Network (Sample Client Profile)",
      
      challenge: "Content teams struggled with fragmented legacy CMS instances, slow staging preview generation, and inconsistent branding across different country-specific domains.",
      
      solution: "Engineered a headless CMS core using Strapi with customized editorial roles, paired with Next.js dynamic static generation (ISR), ensuring instantaneous content updates and sub-second page loads worldwide.",
      
      keyFeatures: [
        "Headless structured content modeling with rich block editor",
        "Instant live preview environments for staging approval",
        "Automated SEO schema generation and OpenGraph asset creation",
        "Multilingual translation workflow with version history & rollback"
      ],
      
      developmentProcess: [
        { phase: "01 Content Strategy & Modeling", detail: "Mapped taxonomy, content types, and editorial authorization tiers." },
        { phase: "02 Headless CMS Setup", detail: "Configured API schemas, webhooks, and media asset storage on AWS S3." },
        { phase: "03 Frontend Rendering", detail: "Built Next.js frontend with incremental static regeneration and edge caching." },
        { phase: "04 Editor Training & Launch", detail: "Onboarded publishing staff and migrated legacy archive records." }
      ],
      
      architectureNotes: "Centralized Headless CMS API with GraphQL endpoints powering multiple decoupled frontend clients through Cloudflare edge caching.",
      
      results: [
        { metric: "98+", label: "Google PageSpeed Core Web Vitals Score [Sample]" },
        { metric: "70%", label: "Reduction in Content Publishing Cycle Time [Sample]" },
        { metric: "8 Regions", label: "Single Unified Content Repository [Sample]" }
      ]
    }
  },

  {
    id: "logiops-custom-software",
    isPlaceholder: true,
    badge: "Sample Custom Software",
    title: "[Sample] LogiOps — Warehouse Fleet & Dispatch Automation",
    category: "Custom Software",
    clientType: "Logistics & Supply Chain [Sample]",
    description: "A tailored enterprise operations portal streamlining route dispatch, warehouse inventory scanning, and driver status tracking.",
    image: "/src/assets/images/projects/project-custom.svg",
    technologies: ["Vue.js", "Python", "FastAPI", "PostgreSQL", "Redis", "WebSockets"],
    url: "https://example.com/project-demo",
    caseStudyUrl: "case-study.html?id=logiops-custom-software",
    featured: true,

    // --- Full Case Study Details ---
    caseStudy: {
      headline: "Custom Workflow Automation for High-Volume Fleet Routing and Inventory Management",
      overview: "LogiOps replaced error-prone spreadsheet coordination with a purpose-built real-time dispatch dashboard, barcode scanner integration, and automated route generation system.",
      clientOverview: "Regional Freight & Supply Chain Operator (Sample Client Profile)",
      
      challenge: "Dispatchers were manually assigning cargo runs across 80+ vehicles while warehouse teams suffered inventory discrepancies due to delayed manual logging.",
      
      solution: "Developed a custom web portal with live GPS map integration, barcode-assisted check-in modals, and automated vehicle load calculation algorithms.",
      
      keyFeatures: [
        "Live fleet dispatch map with route status tracking",
        "Barcode & QR scanning interface for fast warehouse check-in",
        "Automatic vehicle payload and weight capacity validation",
        "Driver notification module with offline-ready web application"
      ],
      
      developmentProcess: [
        { phase: "01 Operational Workflow Analysis", detail: "Interviewed dispatchers and floor managers to identify bottlenecks." },
        { phase: "02 Database & Route Logic", detail: "Engineered high-performance relational models and routing math in Python." },
        { phase: "03 UI/UX Dashboard Prototyping", detail: "Designed high-contrast, touch-friendly UI for warehouse tablet devices." },
        { phase: "04 Staged Pilot & Rollout", detail: "Executed a 2-week dual-run validation before full fleet deployment." }
      ],
      
      architectureNotes: "FastAPI asynchronous backend connected to PostgreSQL, serving a responsive Vue.js frontend with WebSocket live coordinates.",
      
      results: [
        { metric: "45 min", label: "Daily Dispatch Planning Time Saved [Sample]" },
        { metric: "99.4%", label: "Inventory Scanning Accuracy [Sample]" },
        { metric: "Zero", label: "Hardware Lock-in (Runs on standard tablets) [Sample]" }
      ]
    }
  }
];
