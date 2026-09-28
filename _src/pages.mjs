// Per-page SEO configuration. Each page targets its own topic so pages never
// compete with each other for the same query:
//   /            brand + "custom software & SaaS development company"
//   /services/   the seven services, timelines, pricing model, engagement models
//   /industries/ industry-specific software (healthcare, fintech, retail, ...)
//   /tech-stack/ technologies and how we choose them
//   /projects/   clients + solution blueprints
//   /about/      the company, location, process
//   /estimator/  project scope & timeline estimation
//   /contact/    enquiry / consultation
//
// FAQ entries are rendered visibly on the page AND emitted as FAQPage schema from
// the same source, so markup always matches visible content.

export const SITE = {
  origin: 'https://thinkvistar.com',
  name: 'Thinkvistar',
  orgId: 'https://thinkvistar.com/#organization',
  logo: '/images/logo/thinkvistar-logo.webp',
  ogImage: '/images/og/thinkvistar-og.png',
  address: {
    streetAddress: 'Yashwant Gaurav Phase 1',
    addressLocality: 'Nalasopara West',
    district: 'Palghar',
    addressRegion: 'Maharashtra',
    postalCode: '401203',
    addressCountry: 'IN',
  },
};

export function organizationNode(data) {
  const c = data.company;
  const a = SITE.address;
  return {
    '@type': 'ProfessionalService',
    '@id': SITE.orgId,
    name: c.name,
    legalName: c.legalName,
    url: `${SITE.origin}/`,
    logo: { '@type': 'ImageObject', url: `${SITE.origin}/images/logo/thinkvistar-logo-full.png`, width: 1200, height: 315 },
    image: `${SITE.origin}${SITE.ogImage}`,
    description: c.description,
    foundingDate: String(c.yearFounded),
    email: c.contact.email,
    telephone: '+917021067824',
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.streetAddress,
      addressLocality: a.addressLocality,
      addressRegion: a.addressRegion,
      postalCode: a.postalCode,
      addressCountry: a.addressCountry,
    },
    areaServed: [{ '@type': 'Country', name: 'India' }, { '@type': 'Place', name: 'Worldwide' }],
    contactPoint: [{
      '@type': 'ContactPoint', contactType: 'sales', email: c.contact.email, telephone: '+917021067824',
      areaServed: 'Worldwide', availableLanguage: ['English'],
    }],
    knowsAbout: ['SaaS development', 'Web application development', 'Headless CMS', 'Legacy application modernization',
      'AI automation', 'LLM integration', 'Cloud infrastructure', 'DevOps'],
    sameAs: Object.values(c.socialLinks),
  };
}

// ------------------------------------------------------------------ FAQs
const FAQ_HOME = [
  ['What does Thinkvistar do?',
    'Thinkvistar is a senior-led software development company. We design, build and support SaaS platforms, web applications, headless CMS websites and AI automation — from the first architecture decision through launch and ongoing support. See our <a href="/services/">services</a> for what each engagement includes.'],
  ['Where are you based, and do you work with clients outside India?',
    'Our office is in Nalasopara West (Palghar district), in the Mumbai Metropolitan Region, Maharashtra. We work with clients across India and remotely with teams in the US, UK and Europe, using scheduled calls in overlapping hours, weekly demos on a staging site and written progress updates.'],
  ['How long does it take to build a SaaS product or web application?',
    'A focused first version usually takes about 4–8 weeks; larger platforms are delivered in phases over several months. The exact timeline depends on features, integrations and security requirements. Our <a href="/estimator/">project estimator</a> gives you a timeline range in about a minute, and the <a href="/services/#timelines">typical timelines table</a> shows ranges for each service.'],
  ['How much does custom software development cost?',
    'Cost depends on scope, integrations, compliance needs and how quickly you need to launch, so we quote each project after a short discovery call. You receive a written estimate with milestones before any work begins, and invoices follow those milestones. Read <a href="/services/#pricing">how our pricing works</a>.'],
  ['Who owns the source code?',
    'You do. Under our <a href="/terms/">terms</a>, once the agreed payment is received, the bespoke source code, designs and database schemas built for you become your exclusive property, and we hand over repositories, documentation and access.'],
];

const FAQ_SERVICES = [
  ['Which engagement model is right for my project?',
    'Choose a fixed-scope project when requirements are clear and you want a fixed set of deliverables; a dedicated engineering pod when your roadmap is evolving and you want senior engineers inside your sprints; or an architecture review when you need an expert assessment of existing code, security or scalability before committing to a larger build.'],
  ['Will you sign an NDA before we share our idea?',
    'Yes. We are happy to sign your NDA (or provide ours) before a detailed discussion. Our <a href="/terms/">terms</a> also commit both parties to confidentiality for three years after an engagement, and indefinitely for trade secrets and personal data.'],
  ['Can you take over or improve an existing codebase?',
    'Yes. We start with a short code and infrastructure review, document the risks we find, and then either stabilise and extend the existing system or plan a staged <a href="/services/#legacy-modernization">modernization</a> — without a risky big-bang rewrite.'],
  ['What happens after launch?',
    'Every release includes a 30-day warranty during which we fix reproducible defects at no extra cost. After that, you can move to a support plan covering monitoring, security patching, backups and ongoing improvements — see <a href="/services/#maintenance-support">Cloud &amp; 24/7 Support</a>.'],
  ['Which technologies do you work with?',
    'Mainly TypeScript, React and Next.js on the front end; Node.js, Python (FastAPI) and Go on the back end; PostgreSQL, Redis and MongoDB for data; and AWS, Vercel, Cloudflare and Docker for hosting. See the full <a href="/tech-stack/">technology stack</a> and how we choose it.'],
];

const FAQ_CONTACT = [
  ['What happens after I send an enquiry?',
    'An engineer (not a salesperson) reads it and replies within 24 hours on business days, usually with a few clarifying questions and a time for a call. After the call we send a written summary with a proposed approach, timeline range and next steps.'],
  ['What should I include in my message?',
    'A short description of what you want to build or fix, who will use it, any existing systems or deadlines, and your budget range if you have one. Links to an existing product, designs or documents help us give a more accurate first response.'],
  ['Can we talk on WhatsApp or by phone?',
    'Yes. Call or WhatsApp <a href="tel:+917021067824">+91 70210 67824</a>, or email <a href="mailto:hello@thinkvistar.com">hello@thinkvistar.com</a>. For detailed briefs or RFPs, email is best.'],
  ['How are payments structured?',
    'Invoices follow project milestones (for example: kick-off, design sign-off, staging demo and production handover) or a monthly retainer, and are payable within 14 days. Fees are exclusive of GST, which is added as required by Indian law. Full details are in our <a href="/terms/">terms</a>.'],
];

const FAQ_ESTIMATOR = [
  ['How accurate is the estimate?',
    'It is a starting range, not a quote. It is based on the timelines we plan for similar projects, adjusted for scale, number of features, security level and delivery speed. After a discovery call we replace it with a written plan and milestones for your exact requirements.'],
  ['Why does the estimator show a timeline but not a price?',
    'Price depends on details a form cannot capture — integrations, data migration, compliance and design depth. Rather than show a misleading number, we give you a timeline range and then a written quote after we understand the project. See <a href="/services/#pricing">how our pricing works</a>.'],
  ['What makes a software project take longer?',
    'The biggest factors are the number of user roles and features, third-party integrations (payments, ERPs, messaging), data migration from an old system, stricter security or compliance requirements, and slow feedback cycles. Phasing the launch — shipping a focused first version, then iterating — is the most reliable way to reduce time to market.'],
  ['Can I get a detailed proposal?',
    'Yes. Use “Book Consultation With This Blueprint” or <a href="/contact/">contact us</a> with your estimator choices. We will reply within 24 hours to schedule a call, then send a written proposal with scope, milestones and a quote.'],
];

const FAQ_TECH = [
  ['Can you work with our existing technology stack?',
    'Usually, yes. Beyond the tools listed here we regularly work inside existing codebases. If your system uses a technology we would not recommend for the long term, we explain the trade-offs and plan a gradual migration rather than forcing a rewrite.'],
  ['Why do you mostly use TypeScript, React and Node.js?',
    'They are mature, widely adopted and well supported, which makes your product easier to hire for and maintain after handover. We add Python where data processing or AI work benefits from it, and Go where raw throughput matters.'],
  ['Do you integrate AI models such as OpenAI or Claude?',
    'Yes. We integrate hosted large language models through their APIs, add retrieval over your own documents using vector search (for example pgvector), and wrap them in workflows with human review where accuracy matters. See <a href="/services/#ai-automation">AI &amp; Automation</a>.'],
];

// ------------------------------------------------------------------ pages
export const pages = [
  {
    path: '/', out: 'index.html', body: 'home.html', sitemap: true,
    title: 'Custom Software & SaaS Development Company | Thinkvistar',
    description: 'Senior-led software development company near Mumbai, India. We build SaaS platforms, web apps, headless CMS websites and AI automation for teams worldwide.',
    faq: FAQ_HOME, faqOptions: { subtitle: 'Straight answers to what clients ask us first.', alt: true },
  },
  {
    path: '/services/', out: 'services/index.html', body: 'services.html', sitemap: true,
    title: 'Software Development Services: SaaS, Web, Mobile & AI | Thinkvistar',
    description: 'SaaS development, web and mobile apps, headless CMS, legacy modernization, AI automation and cloud support — with typical timelines, pricing model and FAQs.',
    breadcrumb: [['Services', '/services/']],
    faq: FAQ_SERVICES, faqOptions: { title: 'Questions about working with us' },
    schema: (d) => d.services.map((s) => ({
      '@type': 'Service', '@id': `${SITE.origin}/services/#${s.id}`, name: s.title, serviceType: s.title,
      description: s.longDescription || s.description, provider: { '@id': SITE.orgId },
      areaServed: [{ '@type': 'Country', name: 'India' }, { '@type': 'Place', name: 'Worldwide' }],
      url: `${SITE.origin}/services/#${s.id}`,
    })),
  },
  {
    path: '/industries/', out: 'industries/index.html', body: 'industries.html', sitemap: true,
    title: 'Industry Software: Healthcare, Fintech, Retail | Thinkvistar',
    description: 'How Thinkvistar builds software for healthcare, fintech, e-commerce, logistics, real estate and SaaS businesses — typical projects, data rules and integrations.',
    breadcrumb: [['Industries', '/industries/']],
  },
  {
    path: '/tech-stack/', out: 'tech-stack/index.html', body: 'tech-stack.html', sitemap: true,
    title: 'Tech Stack: React, Next.js, Node.js & AWS | Thinkvistar',
    description: 'The languages, frameworks, databases and cloud tools Thinkvistar builds with — and how we choose the right stack for your product, budget and team.',
    breadcrumb: [['Tech Stack', '/tech-stack/']],
    faq: FAQ_TECH, faqOptions: { alt: true },
  },
  {
    path: '/projects/', out: 'projects/index.html', body: 'projects.html', sitemap: true,
    title: 'Our Work: Clients & Solution Blueprints | Thinkvistar',
    description: 'The clients we work with, plus detailed solution blueprints showing how Thinkvistar approaches SaaS, headless CMS, logistics and fintech software projects.',
    breadcrumb: [['Work', '/projects/']], pageType: 'CollectionPage',
  },
  {
    path: '/about/', out: 'about/index.html', body: 'about.html', sitemap: true,
    title: 'About Thinkvistar — Senior-Led Software Studio near Mumbai',
    description: 'Thinkvistar LLP is a senior-led software studio in Nalasopara West, near Mumbai. See how we work, our six-stage delivery process and our standards.',
    breadcrumb: [['About', '/about/']], pageType: 'AboutPage',
  },
  {
    path: '/estimator/', out: 'estimator/index.html', body: 'estimator.html', sitemap: true,
    title: 'Software Project Timeline Estimator | Thinkvistar',
    description: 'Estimate the timeline, architecture and tech stack for your SaaS, CMS, AI or custom software project in a minute — then review the result with an engineer.',
    breadcrumb: [['Estimator', '/estimator/']],
    faq: FAQ_ESTIMATOR, faqOptions: { title: 'About the estimate' },
    schema: () => [{
      '@type': 'WebApplication', '@id': `${SITE.origin}/estimator/#app`, name: 'Thinkvistar Software Project Estimator',
      url: `${SITE.origin}/estimator/`, applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, provider: { '@id': SITE.orgId },
    }],
  },
  {
    path: '/contact/', out: 'contact/index.html', body: 'contact.html', sitemap: true,
    title: 'Contact Us & Book a Consultation | Thinkvistar',
    description: 'Talk to our engineers about your software project. Call or WhatsApp +91 70210 67824, email hello@thinkvistar.com or send the form. Reply within 24 hours.',
    breadcrumb: [['Contact', '/contact/']], pageType: 'ContactPage',
    faq: FAQ_CONTACT, faqOptions: { title: 'Before you get in touch' },
  },
  {
    path: '/privacy/', out: 'privacy/index.html', body: 'privacy.html', sitemap: true, scripts: ['main', 'privacy'],
    title: 'Privacy Policy | Thinkvistar',
    description: 'How Thinkvistar LLP collects, uses, shares and protects personal information across its website and software services, and how to exercise your rights.',
    breadcrumb: [['Privacy Policy', '/privacy/']],
  },
  {
    path: '/terms/', out: 'terms/index.html', body: 'terms.html', sitemap: true, scripts: ['main', 'terms'],
    title: 'Terms & Conditions | Thinkvistar',
    description: 'The terms governing use of the Thinkvistar website and our software development services: scope, payments, intellectual property, confidentiality and support.',
    breadcrumb: [['Terms & Conditions', '/terms/']],
  },
  {
    // One URL renders every blueprint via ?id=…; kept out of the index to avoid
    // thin/duplicate parameter URLs. Links on it are still followed.
    path: '/case-study/', out: 'case-study/index.html', body: 'case-study.html', noindex: true, prerender: false,
    scripts: ['main', 'case-study'],
    title: 'Solution Blueprint | Thinkvistar',
    description: 'A detailed solution blueprint from Thinkvistar: the problem, architecture, delivery plan and technology choices.',
  },
  {
    path: '/404.html', out: '404.html', body: '404.html', noindex: true,
    title: 'Page Not Found | Thinkvistar',
    description: 'The page you were looking for could not be found.',
  },
];
