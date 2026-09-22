import{g as v}from"./dataLoader-DErINc11.js";import{g as c}from"./icons-B18VjFVw.js";async function p(){const a=await v();if(!a)return;const l=document.getElementById("csCompanyName"),o=document.getElementById("csFooterCopyright");l&&(l.textContent=a.company.shortName||a.company.name),o&&(o.textContent=`© ${new Date().getFullYear()} ${a.company.legalName||a.company.name}. All rights reserved.`);const h=new URLSearchParams(window.location.search).get("id"),e=a.projects.find(t=>t.id===h),n=document.getElementById("caseStudyContainer");if(!n)return;if(!e){document.title=`Case Study Not Found — ${a.company.name}`,n.innerHTML=`
          <div class="not-found">
            <h2>Case Study Not Found</h2>
            <p>The requested case study could not be located.</p>
            <a href="/projects/" class="btn btn-primary">Return to Projects</a>
          </div>
        `;return}document.title=`${e.title} — Case Study | ${a.company.name}`;const s=e.caseStudy||{},r=s.results||[],d=s.keyFeatures||[],u=s.developmentProcess||[],m=e.technologies||[],i=/^https?:\/\//.test(e.url||"")?e.url:"";n.innerHTML=`
        <div class="case-study-header">
          <div class="case-study-meta">
            <span class="project-badge">${e.category}</span>
            ${e.isPlaceholder?'<span class="sample-tag">SAMPLE PROJECT</span>':""}
            <small>${e.clientType||""}</small>
            ${i?`<a href="${i}" target="_blank" rel="noopener noreferrer" class="link-arrow">Visit live site ${c("externalLink")}</a>`:""}
          </div>
          <h1 class="page-title">${e.title}</h1>
          <p class="case-study-lead">${s.headline||e.description}</p>
        </div>

        <img src="${e.image}" alt="${e.title}" class="case-study-hero-img" />

        ${r.length?`
          <div class="case-study-section">
            <h3 class="case-study-section-title">${c("target")} Measurable Production Impact</h3>
            <div class="metrics-grid">
              ${r.map(t=>`
                <div class="metric-card">
                  <div class="metric-value">${t.metric}</div>
                  <div class="metric-label">${t.label}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}

        ${s.overview?`
          <div class="case-study-section">
            <h3 class="case-study-section-title">${c("layers")} Overview</h3>
            <p>${s.overview}</p>
          </div>
        `:""}

        <div class="case-study-section challenge-solution">
          <div class="cs-block challenge">
            <h4>Technical Challenge &amp; Constraints</h4>
            <p>${s.challenge||"High-throughput scaling and complex enterprise state requirements."}</p>
          </div>
          <div class="cs-block solution">
            <h4>Architectural Solution</h4>
            <p>${s.solution||"Engineered modular microservices with distributed caching and multi-tenant security isolation."}</p>
          </div>
        </div>

        ${d.length?`
          <div class="case-study-section">
            <h3 class="case-study-section-title">${c("check")} Key Engineering Features</h3>
            <ul class="feature-list boxed">
              ${d.map(t=>`<li>${c("check")}<span>${t}</span></li>`).join("")}
            </ul>
          </div>
        `:""}

        ${u.length?`
          <div class="case-study-section">
            <h3 class="case-study-section-title">${c("layers")} Delivery Roadmap</h3>
            <ul class="roadmap-list">
              ${u.map(t=>`
                <li>
                  <strong>${t.phase}</strong>
                  <span>${t.detail}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        `:""}

        <div class="case-study-section">
          <h3 class="case-study-section-title">${c("cpu")} Technology Foundation</h3>
          <div class="tag-list">
            ${m.map(t=>`<span class="tech-tag">${t}</span>`).join("")}
          </div>
          ${s.architectureNotes?`<p class="arch-note">${s.architectureNotes}</p>`:""}
        </div>

        <div class="cta-card">
          <div class="cta-inner">
<div class="cta-content">
            <h2 class="cta-headline">Need an architecture like this?</h2>
            <p class="cta-subtext">Let's discuss how we can adapt this blueprint for your organization.</p>
          </div>
          <div class="cta-action">
            ${i?`<a href="${i}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-lg">Visit live site ${c("externalLink")}</a>`:""}
            <a href="/contact/" class="btn btn-white btn-lg">Book a Consultation</a>
          </div>
          </div>
        </div>
      `}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p();
