# Thinkvistar — SEO audit, changes & content plan

Date: 28 September 2026 · Domain: https://thinkvistar.com (moved from vistarsolution.com)

Nothing here guarantees rankings. The goal is a site that is crawlable, fast, trustworthy and genuinely useful, so it can compete fairly.

---

## 1. Audit findings (before)

| Area | Finding | Severity |
| --- | --- | --- |
| Crawlability | Navigation, services, projects, stats, testimonials, footer links and the full privacy/terms text were injected by JavaScript. The HTML had empty containers. | High |
| Trust / E-E-A-T | Testimonials from invented people ("Dr. Arthur Sterling", etc.), stats with no basis (99.99% uptime, 12M+ events/day, 4.9/5 rating) and case studies for fictional US/UK enterprises, on a site that says it was founded in 2026. This risks Google's spam and review policies and misleads buyers. | High |
| Domain | Canonicals, sitemap, robots and schema all pointed at vistarsolution.com after the rebrand. | High |
| Contact form | The PHP endpoint only accepted submissions from vistarsolution.com, so the form would fail on thinkvistar.com. | High |
| Orphan page | /industries/ had an old, inconsistent header, no footer links, and nothing in the navigation linked to it. | Medium |
| Social previews | og:image was an SVG, which Facebook, LinkedIn and X don't render. Several pages had no og:image. | Medium |
| Favicon | favicon.svg showed "DS", from a previous brand. | Medium |
| Headings | The homepage H1 ("Software built to scale with your business") had no topic keywords. Titles were generic ("What we provide.", "Tools we build with."). Card headings skipped levels. | Medium |
| Thin content | Services had one line per service. No timelines, pricing model, engagement models or FAQs, which are the questions buyers search for. | Medium |
| Case-study URLs | One URL with `?id=` for every case study, all sharing one canonical: duplicate, thin, JS-only pages. | Medium |
| Performance | Google Fonts (2 extra origins, render-blocking CSS). A wasted request to a non-existent /data/siteData.json on every page. A 160 KB PNG logo shown at ~175 px. 80 KB client logos shown at 48 px. No caching or compression rules. | Medium |
| Technical | No custom 404 page, no HTTPS/host redirects, no `<main>` landmark on inner pages, /index.html duplicates reachable. | Low–Medium |
| Local SEO | No full postal address, no LocalBusiness schema, inconsistent location text. | Medium |
| Security | `public/api/config.php` (SMTP password) was committed in git history (commit f1d456d, pushed to GitHub). | High |

## 2. What was changed

**Architecture.** The original source had been deleted, so the deployable root was rebuilt from a new `_src/` folder (see README.md). One command rebuilds every page from a shared layout, fingerprints the assets and **pre-renders all JavaScript content into the HTML**. The design, URLs and features (estimator, contact form, blueprint pages) are unchanged.

**Honesty and trust**
- Fake testimonials removed. The section stays hidden until real ones exist.
- Stats replaced with commitments backed by the Terms: 24-hour reply, weekly demos, 100% code/IP ownership on payment, 30-day warranty.
- The four case studies are relabelled as **Solution blueprints**, with a visible "SAMPLE BLUEPRINT" tag and notice. Invented results became "design targets", and fictional client locations were removed.
- Real clients (Viora Healthcare, Viva Homecare, The Walk) are shown on the homepage, About and Work pages.

**On-page.** Every indexable page has a unique title (≤ 62 characters), a unique description (≤ 160), exactly one descriptive H1, a logical H2/H3 outline and breadcrumbs. Topics per page (no cannibalisation):

| Page | Primary topic | Title |
| --- | --- | --- |
| / | custom software & SaaS development company | Custom Software & SaaS Development Company \| Thinkvistar |
| /services/ | software development services, timelines, pricing | Software Development Services: SaaS, Web & AI \| Thinkvistar |
| /industries/ | industry software (healthcare, fintech, …) | Industry Software: Healthcare, Fintech, Retail \| Thinkvistar |
| /tech-stack/ | technology stack | Tech Stack: React, Next.js, Node.js & AWS \| Thinkvistar |
| /projects/ | clients & solution blueprints | Our Work: Clients & Solution Blueprints \| Thinkvistar |
| /about/ | company, location, process | About Thinkvistar — Senior-Led Software Studio near Mumbai |
| /estimator/ | project timeline estimation | Software Project Timeline Estimator \| Thinkvistar |
| /contact/ | contact / consultation | Contact Us & Book a Consultation \| Thinkvistar |

**Content added** (from search-intent research: buyers look for timelines, cost, engagement models, IP ownership, NDAs and time zones, and competitors rarely answer these)
- Services: fuller copy per service, with "Best for" and "Typical timeline"; a timelines table matching the estimator's logic; how pricing works and the factors that affect cost; three engagement models; and 5 FAQs.
- Industries: six detailed sectors with typical projects, plus a "how we handle regulated data" section (DPDP Act, HIPAA).
- About: a location section and a "who we work with" section. Contact: full address, map link, remote-working details, 4 FAQs. Estimator: how the estimate is calculated, 4 FAQs. Tech stack: 3 FAQs. Homepage: 5 FAQs.
- FAQ answers quote your actual Terms (IP clause, 30-day warranty, milestone invoicing, confidentiality).

**Internal linking.** Industries is now in the footer and linked from the homepage and services. Footer service links go to each service's section (`/services/#…`). Contextual links connect services ↔ estimator ↔ pricing ↔ terms ↔ industries ↔ blueprints. Every indexable page has 11+ internal inbound links.

**Technical**
- `.htaccess`: HTTPS and non-www redirects, 301 from vistarsolution.com, /index.html → /, custom 404 page, gzip, 1-year immutable caching for fingerprinted assets, security headers, and `_src/`, `vendor/` and `.md` files blocked from the web.
- `robots.txt` and `sitemap.xml` point to thinkvistar.com. The sitemap lists 10 indexable URLs.
- Canonical tags on all indexable pages. `/case-study/` and `404.html` are `noindex, follow`.
- `<main>` landmark, skip link, semantic breadcrumbs and correct heading levels on every page.
- Contact form now accepts thinkvistar.com.

**Structured data** (JSON-LD, generated from the same data as the visible page): ProfessionalService (LocalBusiness) with address, contact point, areaServed and sameAs; WebSite; WebPage/AboutPage/ContactPage/CollectionPage; BreadcrumbList; Service ×6; FAQPage on the 5 pages with visible FAQs; WebApplication for the estimator. There are no Review or AggregateRating markups, because there are no genuine reviews yet.

**Images & performance**
- Logo is now a 34 KB WebP (was 160 KB PNG). Client logos are 5–8 KB WebP (were 51–83 KB PNG). There's a 1200×630 PNG share image and a new favicon set (ico, png, apple-touch) from the "V" mark.
- Explicit width/height on all images, `fetchpriority="high"` on the hero image, lazy loading below the fold.
- Inter font is self-hosted and preloaded, removing Google Fonts. Module preloading removes the JS waterfall, and the wasted /data/siteData.json request is gone.
- Measured locally (mobile viewport, 4× CPU slowdown, throttled network): LCP 1.2–1.9 s, CLS 0.000, ~110–150 KB transferred per page. These are lab numbers; check real-user data in Search Console after launch.

## 3. Final audit (after)

- 10 indexable pages: all titles and descriptions unique; exactly one H1 each; no heading-level skips; canonicals self-referencing on thinkvistar.com.
- 0 broken internal links; 0 orphan pages; all images have alt text and dimensions.
- All JSON-LD parses. FAQPage content matches the visible FAQ text (same source).
- 0 console errors and 0 failed requests on desktop (1366 px) and mobile (390 px), with no horizontal overflow (`_src/check.mjs`).
- No remaining references to vistarsolution.com in the pages (it stays only in `.htaccess` redirects and the contact-form allow-list).
- Not verified: indexing status. Nothing can be checked in Google until the domain is live and added to Search Console.

## 4. Needs your action

1. **Rotate the SMTP mailbox password** (it is in public git history). Then consider purging `public/api/config.php` from history.
2. Point thinkvistar.com at the hosting, enable SSL, then enable the HSTS line in `.htaccess`. Set up Search Console, the sitemap and Change of Address (see DEPLOYMENT.md).
3. **Confirm the postal code 401203** and the address format; they appear in the footer, contact page and schema.
4. Review the FAQ answers, especially "we're happy to sign your NDA", response times and the timeline ranges. They are commitments.
5. Create a **Google Business Profile** with the same name, address and phone number, and ask your three clients for genuine Google reviews.
6. Biggest trust wins still missing: **real case studies** for Viora Healthcare, Viva Homecare and The Walk (what you built, and outcomes they agree to publish), **founder/team bios** with LinkedIn links, and real testimonials. Add them to `_src/site-data.json` (`projects` with `isPlaceholder: false`, `testimonials.items`).
7. Optional: publish your own **price ranges** on /services/#pricing. Competitors rarely do, and buyers search for it heavily. Only you can set them.
8. Update the Facebook link in `site-data.json` if there is a Thinkvistar page.

## 5. Content plan (new pages worth creating)

Each needs real expertise to be useful. Build one at a time, starting from the top. Suggested: a `/blog/` (or `/guides/`) section with Article + BreadcrumbList schema, and link each post from the related service section.

| # | Topic & intent | Title / H1 | URL | Main questions | Links to | Schema |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Cost of custom software in India (informational → commercial) | How Much Does a Custom Web App Cost in India in 2026? | /guides/web-app-development-cost-india/ | Cost ranges by complexity; what drives cost; fixed vs T&M; hidden costs (hosting, support) | /services/#pricing, /estimator/ | Article, FAQPage |
| 2 | SaaS MVP cost & timeline (commercial) | SaaS MVP Development: Cost, Timeline and What to Build First | /guides/saas-mvp-cost-timeline/ | Which features belong in an MVP; weeks per feature; build vs no-code | /services/#custom-saas, /estimator/ | Article |
| 3 | Engagement models (informational, high question volume) | Fixed Price vs Time & Materials vs Dedicated Team | /guides/software-engagement-models/ | Pros and cons; which suits which project; how change requests work | /services/#engagement, /contact/ | Article, FAQPage |
| 4 | IP & NDAs with an Indian partner (trust, international buyers) | Who Owns the Code When You Outsource to India? | /guides/ip-ownership-outsourcing-india/ | IP assignment clauses; NDAs under Indian law; escrow and repositories | /terms/, /services/ | Article |
| 5 | Working across time zones (international buyers) | Working with an Indian Development Team from the US, UK or EU | /guides/working-with-indian-development-team/ | Overlap hours; communication cadence; demos; payments and GST | /about/, /contact/ | Article |
| 6 | Strapi vs Contentful (informational, lower competition) | Strapi vs Contentful: Which Headless CMS Fits Your Budget? | /guides/strapi-vs-contentful/ | Hosting costs; editor experience; self-hosting; migration effort | /services/#headless-cms | Article |
| 7 | WordPress → headless migration | Migrating from WordPress to a Headless CMS Without Losing SEO | /guides/wordpress-to-headless-cms-migration/ | Redirect mapping; content migration; timeline; when not to migrate | /services/#headless-cms, CMS blueprint | Article |
| 8 | Healthcare clinic websites (uses your real client experience) | Websites and Booking Systems for Clinics and Home-Care Providers | /guides/healthcare-clinic-website-booking/ | Booking flows; patient data under the DPDP Act; local SEO for clinics | /industries/#healthcare, /projects/ | Article |
| 9 | Practical AI automation (commercial, fast-growing) | 5 AI Automation Workflows That Work for Small Businesses | /guides/ai-automation-small-business/ | Document extraction; support assistants; costs; accuracy and human review | /services/#ai-automation | Article |
| 10 | Legacy modernization for SMEs | Modernising a Legacy Business System Without a Big-Bang Rewrite | /guides/legacy-system-modernization-smb/ | Strangler pattern; risk; phased budget; data migration | /services/#legacy-modernization | Article |
| 11 | Local (only if you'll serve clients in person) | Software Development Company in Vasai-Virar & Palghar | /software-development-vasai-virar/ | Who you serve locally; in-person meetings; local clients; directions | /about/#location, /contact/ | WebPage + existing LocalBusiness |
| 12 | Post-launch support buyers' checklist | What a Software Support & Maintenance Plan Should Include | /guides/software-maintenance-plan-checklist/ | SLAs; response times; what's covered; typical monthly costs | /services/#maintenance-support | Article |

Don't create one page per city. Page 11 is justified only because it's your actual location.

When real client projects exist, give each its own static URL (for example `/projects/viora-healthcare/`), indexable and with Article schema, instead of the `?id=` blueprint page.
