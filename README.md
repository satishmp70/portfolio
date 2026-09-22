# Premium B2B Technology Company Static Portfolio

A modern, high-performance, fully **STATIC** portfolio website built for software development agencies, SaaS studios, and technology solution providers.

---

## 🌟 Key Architecture & How It Works

This website is **100% static** (no backend server, no database, no authentication required).

All content across the entire website is driven by a single centralized JSON file:
📁 **`data/siteData.json`**

> 💡 **`data/siteData.json` acts as your site's database.**  
> Whenever you edit this file, your main homepage, project cards, case study pages, terms and conditions, privacy policy, and footer are updated automatically!

---

## 🚀 Quick Start (Running Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production (Deploy Anywhere)
```bash
npm run build
```
This generates a production-ready, minified static build in the `dist/` directory.

---

## 🛠️ How to Customize Your Website in `data/siteData.json`

Open `data/siteData.json` in any code editor. The file is cleanly structured into the following sections:

### 1. Company Information & Branding
Change your company name, tagline, email, phone, and WhatsApp in the `"company"` section:
```json
"company": {
  "name": "Your Company Name",
  "legalName": "Your Company Name, LLC",
  "tagline": "Building Digital Products That Move Businesses Forward",
  "contact": {
    "email": "contact@yourcompany.com",
    "phone": "+1 (555) 019-2834",
    "whatsapp": "+15550192834",
    "location": "San Francisco, CA / Remote Worldwide"
  }
}
```

### 2. Adding a New Project / Case Study
To add a new project to your portfolio, append a new object to the `"projects"` array in `data/siteData.json`:

```json
{
  "id": "my-new-project-slug",
  "isPlaceholder": false,
  "badge": "SaaS Platform",
  "title": "FinFlow",
  "category": "SaaS",
  "clientType": "Fintech & Banking",
  "description": "Automated billing engine processing 500k+ invoices a month.",
  "image": "/images/projects/my-project-screenshot.png",
  "technologies": ["React", "Node.js", "PostgreSQL", "Docker"],   // shown on the case study page only
  "url": "https://my-live-project-demo.com",
  "caseStudyUrl": "/case-study/?id=my-new-project-slug",
  "featured": true,                                                // featured projects appear on the homepage
  "caseStudy": {
    "headline": "Streamlining Global Invoicing for 10,000+ Active Subscriptions",
    "overview": "Detailed overview of what was built and why.",
    "challenge": "What bottleneck or problem the client was facing.",
    "solution": "How our architectural approach solved the problem.",
    "keyFeatures": [
      "Real-time payment webhook reconciliation",
      "Multi-currency support with automated tax calculation"
    ],
    "developmentProcess": [
      { "phase": "01 Discovery", "detail": "Analyzed existing payment bottlenecks." },
      { "phase": "02 Build", "detail": "Engineered microservices and frontend dashboard." }
    ],
    "results": [
      { "metric": "< 100ms", "label": "API Response Latency" },
      { "metric": "99.99%", "label": "Uptime Across Peak Loads" }
    ]
  }
}
```

### 3. Adding Project Images
Place your screenshot, mockup, or graphic into:
📁 `public/images/projects/`  
Then reference its path in `siteData.json` (e.g. `"/images/projects/my-screenshot.png"`).

### 4. Customizing Services
Edit the `"services"` array in `data/siteData.json` to change service names, descriptions, or deliverables. The homepage shows a compact card (icon, title, description); the Services page adds the deliverables list.

### 5. Managing Testimonials
In `data/siteData.json`:
- Set `"testimonials.showSection": true` (or `false` if you want to hide testimonials until you receive client reviews).
- Update the `"testimonials.items"` list with client reviews.

### 6. Updating Terms & Conditions / Privacy Policy
Edit `"termsAndConditions"` and `"privacyPolicy"` sections in `data/siteData.json`. All headers, clauses, and last-updated timestamps will automatically render on `/terms/` and `/privacy/`.

---

## 📂 Project Structure

```
portfolio/
├── data/
│   └── siteData.json           # ⭐ SINGLE DATABASE FOR ALL SITE CONTENT
├── index.html                  # Homepage
├── services/index.html         # Services & industries
├── tech-stack/index.html       # Technology stack page
├── projects/index.html         # Selected work
├── estimator/index.html        # Interactive scope estimator
├── about/index.html            # About, process, testimonials
├── contact/index.html          # Consultation form
├── case-study/index.html       # Standalone case study (?id=project-id)
├── terms/index.html            # Terms & Conditions
├── privacy/index.html          # Privacy Policy
├── public/
│   └── images/                 # Static images (served from /images/...)
├── robots.txt
├── sitemap.xml
├── package.json                # Dev & build scripts (Vite)
├── vite.config.js              # Multi-page bundler configuration
└── src/
    ├── css/
    │   └── style.css           # Design system (mobile-first, single accent colour)
    └── js/
        ├── dataLoader.js       # Central data loader
        ├── main.js             # Dynamic renderer, navigation, scroll reveal
        ├── estimator.js        # Scope estimator logic
        ├── contact.js          # Inquiry form validation & mailto dispatch
        └── icons.js            # Inline SVG icon dictionary
```

---

## 🌐 Free Static Deployment Guides

### Option A: Deploy on Vercel
1. Push your repository to GitHub.
2. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
3. Select your repository. Vercel will automatically detect Vite.
4. Click **Deploy**.

### Option B: Deploy on Netlify
1. Go to [Netlify.com](https://netlify.com) and click **Add new site > Import an existing project**.
2. Select your repository.
3. Build command: `npm run build` | Publish directory: `dist`.
4. Click **Deploy Site**.

### Option C: Deploy on GitHub Pages
1. In `vite.config.js`, set `base: '/<repository-name>/'` if deploying to a subpath.
2. Run `npm run build`.
3. Push the `dist/` directory to the `gh-pages` branch.

### Option D: Direct Apache / Nginx / S3 Hosting
Run `npm run build` and upload the contents of the `dist/` folder directly to your web server root or S3 bucket.
