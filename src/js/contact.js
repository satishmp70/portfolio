/**
 * =========================================================================
 * CONTACT & CONSULTATION LEAD CAPTURE HANDLER
 * =========================================================================
 * Handles two form variants:
 *  1. Homepage widget  (#projectInquiryForm: clientName, clientCompany, clientEmail,
 *                       projectType, projectBudget, projectDetails, #formStatusMessage)
 *  2. Contact page     (#contactForm: clientName, clientCompany, clientEmail, clientPhone,
 *                       projectScope, projectTimeline, projectOverview, #formStatus + error spans)
 * Also prefills the contact page form when arriving from the estimator
 * (?scope=<blueprint>&scale=<tier>).
 */

function fieldError(inputEl, message) {
  const errorEl = document.getElementById(`${inputEl.id}Error`);
  if (errorEl) {
    errorEl.textContent = message || '';
  }
  if (message) {
    inputEl.classList.add('is-invalid');
  } else {
    inputEl.classList.remove('is-invalid');
  }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function showStatus(statusEl, kind, html) {
  if (!statusEl) return;
  statusEl.className = `form-status ${kind}`;
  statusEl.style.display = 'block';
  statusEl.innerHTML = html;
}

function dispatchMailto(companyEmail, subject, body, statusEl) {
  const mailtoHref = `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  showStatus(
    statusEl,
    'success',
    `Preparing consultation request... If your mail client does not launch automatically, <a href="${mailtoHref}" style="text-decoration: underline; color: var(--accent-cyan);">click here to dispatch directly</a>.`
  );

  setTimeout(() => {
    window.location.href = mailtoHref;
  }, 500);
}

/** --- Homepage inquiry form (#projectInquiryForm) --- */
function setupInquiryForm(companyData) {
  const form = document.getElementById('projectInquiryForm');
  const statusEl = document.getElementById('formStatusMessage');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#clientName')?.value.trim();
    const company = form.querySelector('#clientCompany')?.value.trim() || 'Not specified';
    const email = form.querySelector('#clientEmail')?.value.trim();
    const projectType = form.querySelector('#projectType')?.value;
    const timeline = form.querySelector('#projectBudget')?.value;
    const message = form.querySelector('#projectDetails')?.value.trim();

    if (!name || !email || !message || !isEmail(email)) {
      showStatus(statusEl, 'error', 'Please fill out all required fields with a valid email (Name, Email, and Project Brief).');
      return;
    }

    const companyEmail = companyData?.contact?.email || 'hello@diyaseva.com';
    const subject = `Consultation Request: ${company} (${name}) — [${projectType || 'General'}]`;
    const body =
      `Name: ${name}\n` +
      `Company: ${company}\n` +
      `Work Email: ${email}\n` +
      `Project Scope: ${projectType || 'Not specified'}\n` +
      `Target Timeline: ${timeline || 'Flexible'}\n\n` +
      `Project Brief & Requirements:\n${message}\n`;

    dispatchMailto(companyEmail, subject, body, statusEl);
  });
}

/** --- Contact page form (#contactForm) with inline validation --- */
function setupContactPageForm(companyData) {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (!form) return;

  // Prefill from estimator referral query params
  const params = new URLSearchParams(window.location.search);
  const scopeRef = params.get('scope');
  if (scopeRef) {
    const scopeSelect = form.querySelector('#projectScope');
    if (scopeSelect) {
      const ref = scopeRef.toLowerCase();
      const scopeMap = [
        ['saas', 'Custom SaaS Platform Development'],
        ['cms', 'Headless CMS Architecture & Migration'],
        ['healthcare', 'Healthcare / FinTech Regulated System'],
        ['fintech', 'Healthcare / FinTech Regulated System'],
        ['ledger', 'High-Throughput Web Application'],
        ['api', 'High-Throughput Web Application'],
        ['modernization', 'Legacy Enterprise Modernization'],
        ['ai', 'Dedicated Senior Engineering Squad']
      ];
      const matched = scopeMap.find(([key]) => ref.includes(key));
      if (matched) {
        scopeSelect.value = matched[1];
      }
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('#clientName');
    const companyInput = form.querySelector('#clientCompany');
    const emailInput = form.querySelector('#clientEmail');
    const scopeSelect = form.querySelector('#projectScope');
    const overviewInput = form.querySelector('#projectOverview');

    let valid = true;

    if (!nameInput.value.trim()) {
      fieldError(nameInput, 'Please enter your full name.');
      valid = false;
    } else {
      fieldError(nameInput, '');
    }

    if (!companyInput.value.trim()) {
      fieldError(companyInput, 'Please enter your company or organization.');
      valid = false;
    } else {
      fieldError(companyInput, '');
    }

    if (!emailInput.value.trim()) {
      fieldError(emailInput, 'Please enter your work email.');
      valid = false;
    } else if (!isEmail(emailInput.value.trim())) {
      fieldError(emailInput, 'Please enter a valid email address.');
      valid = false;
    } else {
      fieldError(emailInput, '');
    }

    if (scopeSelect && !scopeSelect.value) {
      fieldError(scopeSelect, 'Please select a primary engagement scope.');
      valid = false;
    } else if (scopeSelect) {
      fieldError(scopeSelect, '');
    }

    if (!overviewInput.value.trim()) {
      fieldError(overviewInput, 'Please provide a short project overview.');
      valid = false;
    } else {
      fieldError(overviewInput, '');
    }

    if (!valid) {
      showStatus(statusEl, 'error', 'Please correct the highlighted fields and resubmit.');
      return;
    }

    const companyEmail = companyData?.contact?.email || 'hello@diyaseva.com';
    const subject = `Consultation Request: ${companyInput.value.trim()} (${nameInput.value.trim()})`;
    const body =
      `Name: ${nameInput.value.trim()}\n` +
      `Company: ${companyInput.value.trim()}\n` +
      `Work Email: ${emailInput.value.trim()}\n` +
      `Phone / WhatsApp: ${form.querySelector('#clientPhone')?.value.trim() || 'Not provided'}\n` +
      `Engagement Scope: ${scopeSelect?.value || 'Not specified'}\n` +
      `Target Timeline: ${form.querySelector('#projectTimeline')?.value || 'Flexible'}\n\n` +
      `Project Overview & Requirements:\n${overviewInput.value.trim()}\n`;

    dispatchMailto(companyEmail, subject, body, statusEl);
  });
}

export function setupContactForm(companyData) {
  setupInquiryForm(companyData);
  setupContactPageForm(companyData);
}
