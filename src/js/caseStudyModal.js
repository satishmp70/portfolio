/**
 * =========================================================================
 * CASE STUDY MODAL VIEWER
 * =========================================================================
 * Interactive overlay modal that dynamically displays full case study details
 * with keyboard accessibility (Escape to close) and backdrop dismissal.
 */

import { getIcon } from './icons.js';

let modalBackdrop = null;
let lastFocusedElement = null;

export function initCaseStudyModal() {
  modalBackdrop = document.getElementById('caseStudyModal');
  if (!modalBackdrop) return;

  // Close button listener
  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCaseStudyModal);
  }

  // Backdrop click listener
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeCaseStudyModal();
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeCaseStudyModal();
    }
  });
}

export function openCaseStudyModal(project) {
  if (!modalBackdrop || !project) return;
  lastFocusedElement = document.activeElement;

  const modalContainer = modalBackdrop.querySelector('#modalDynamicContent');
  if (!modalContainer) return;

  const cs = project.caseStudy || {};
  const metrics = cs.results || [];
  const features = cs.keyFeatures || [];
  const processSteps = cs.developmentProcess || [];
  const technologies = project.technologies || [];

  modalContainer.innerHTML = `
    <div class="case-study-header">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
        <span class="project-badge" style="position: static;">${project.category}</span>
        ${project.isPlaceholder ? '<span style="font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);">SAMPLE PROJECT</span>' : ''}
        <span style="font-size: 0.82rem; color: var(--text-subtle);">${project.clientType || ''}</span>
      </div>
      
      <h2 style="font-size: 1.8rem; margin-bottom: 12px;">${project.title}</h2>
      <p style="font-size: 1.1rem; color: var(--accent-cyan); font-weight: 500; margin-bottom: 24px;">${cs.headline || project.description}</p>
    </div>

    <img src="${project.image}" alt="${project.title} Screenshot" class="case-study-hero-img" loading="lazy" />

    ${metrics.length > 0 ? `
      <div class="case-study-section">
        <h4 class="case-study-section-title">${getIcon('target')} Project Impact & Key Results</h4>
        <div class="metrics-grid">
          ${metrics.map(m => `
            <div class="metric-card">
              <div class="metric-value">${m.metric}</div>
              <div class="metric-label">${m.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div class="case-study-section" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
      <div style="background: var(--bg-tertiary); padding: 20px; border-radius: var(--radius-md); border-left: 3px solid #ef4444;">
        <h4 style="color: #f87171; margin-bottom: 8px; font-size: 1.05rem;">The Challenge</h4>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 0;">${cs.challenge || 'No challenge description provided.'}</p>
      </div>
      
      <div style="background: var(--bg-tertiary); padding: 20px; border-radius: var(--radius-md); border-left: 3px solid var(--accent-emerald);">
        <h4 style="color: #34d399; margin-bottom: 8px; font-size: 1.05rem;">The Solution</h4>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 0;">${cs.solution || 'No solution description provided.'}</p>
      </div>
    </div>

    ${features.length > 0 ? `
      <div class="case-study-section">
        <h4 class="case-study-section-title">${getIcon('check')} Key Engineered Features</h4>
        <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px; margin-top: 12px;">
          ${features.map(f => `
            <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.9rem; color: var(--text-secondary);">
              <span style="color: var(--accent-cyan); margin-top: 2px;">${getIcon('check')}</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}

    ${processSteps.length > 0 ? `
      <div class="case-study-section">
        <h4 class="case-study-section-title">${getIcon('layers')} Engineering & Delivery Roadmap</h4>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
          ${processSteps.map(step => `
            <div style="padding: 14px 18px; background: var(--bg-tertiary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem; margin-bottom: 4px;">${step.phase}</div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">${step.detail}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div class="case-study-section">
      <h4 class="case-study-section-title">${getIcon('cpu')} Technology Stack & Infrastructure</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
        ${technologies.map(tech => `<span class="tech-tag" style="font-size: 0.85rem; padding: 5px 12px;">${tech}</span>`).join('')}
      </div>
      ${cs.architectureNotes ? `<p style="font-size: 0.88rem; color: var(--text-subtle); margin-top: 12px; font-style: italic;">Note: ${cs.architectureNotes}</p>` : ''}
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 16px;">
      <a href="${project.url || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        ${getIcon('externalLink')} Visit Live Project Demo
      </a>
      <a href="case-study.html?id=${project.id}" class="btn btn-secondary">
        Open as Standalone Page ${getIcon('arrowRight')}
      </a>
    </div>
  `;

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

export function closeCaseStudyModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}
