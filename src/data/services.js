/**
 * =========================================================================
 * SERVICES DATA
 * =========================================================================
 * Add, remove, or modify the services you offer.
 * Each service item includes an icon key, title, short description, and key deliverables.
 */

export const servicesData = [
  {
    id: "saas-development",
    icon: "saas", // mapped to SVG icon in icons.js
    title: "SaaS Development",
    tagline: "Subscription & Multi-tenant Platforms",
    description: "Build scalable subscription-based software products with modern architecture, automated billing, robust auth, and intuitive user experiences.",
    deliverables: [
      "Multi-tenant Architecture",
      "Stripe / Payment Billing Integrations",
      "Role-based Access & Auth",
      "Real-time Dashboards & Analytics"
    ]
  },
  {
    id: "cms-development",
    icon: "cms",
    title: "CMS Development",
    tagline: "Headless & Custom Content Solutions",
    description: "Custom content management systems and headless integrations that make it easy for businesses to manage, localize, and scale their digital presence.",
    deliverables: [
      "Headless CMS Architectures (Strapi, Sanity, Payload)",
      "Custom Admin Dashboards",
      "Structured Publishing Workflows",
      "Omnichannel Content APIs"
    ]
  },
  {
    id: "custom-software",
    icon: "code",
    title: "Custom Software",
    tagline: "Tailored Enterprise Systems",
    description: "Business-specific software engineered around your unique internal workflows, legacy integrations, and complex operational requirements.",
    deliverables: [
      "Custom Workflow Automation",
      "Enterprise Database Architectures",
      "Third-party API & ERP Integrations",
      "Secure Internal Business Tools"
    ]
  },
  {
    id: "web-app-development",
    icon: "web",
    title: "Web Application Development",
    tagline: "High-Performance Modern Web Apps",
    description: "Fast, responsive, and scalable web applications built with modern frontend frameworks and robust backend services for real-world business demands.",
    deliverables: [
      "Single Page (SPA) & Progressive Web Apps (PWA)",
      "High-speed Responsive Interfaces",
      "State Management & Offline Support",
      "Automated CI/CD Deployment Pipelines"
    ]
  },
  {
    id: "ui-ux-design",
    icon: "design",
    title: "UI/UX Design",
    tagline: "User-Centered Product Design",
    description: "Clean, accessible, and intuitive interfaces designed to maximize usability, customer satisfaction, conversion rates, and product adoption.",
    deliverables: [
      "Wireframing & Interactive Prototyping",
      "Design Systems & Component Libraries",
      "User Journey & Workflow Mapping",
      "Accessibility & Usability Audits"
    ]
  },
  {
    id: "maintenance-support",
    icon: "support",
    title: "Software Maintenance & Support",
    tagline: "Reliability, Security & Evolution",
    description: "Ongoing technical improvements, infrastructure monitoring, performance optimization, vulnerability patching, and continuous feature support.",
    deliverables: [
      "Proactive Uptime & Error Monitoring",
      "Security Audits & Dependency Updates",
      "Database & Query Optimization",
      "Dedicated Technical SLA Support"
    ]
  }
];
