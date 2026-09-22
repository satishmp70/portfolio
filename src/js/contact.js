/**
 * =========================================================================
 * CONTACT & CONSULTATION LEAD CAPTURE HANDLER
 * =========================================================================
 * Handles two form variants:
 *  1. Homepage widget  (#projectInquiryForm: clientName, clientCompany, clientEmail,
 *                       projectType, projectBudget, projectDetails, #formStatusMessage)
 *  2. Contact page     (#contactForm: clientName, clientCompany, clientEmail, clientPhone,
 *                       projectScope, projectTimeline, projectOverview, #formStatus)
 *
 * Every field is validated with a typed rule (see RULES): the name only accepts
 * letters, the phone only digits/+/()/-, and so on. Disallowed characters are
 * stripped as the user types, fields are re-checked on blur, and inline error
 * messages appear under each field. Also prefills the contact page form when
 * arriving from the estimator (?scope=<blueprint>&scale=<tier>).
 */

/* ---------------------------------------------------------------------------
 * Field rules
 * ------------------------------------------------------------------------- */

// Letters from any script, plus space . ' - (names like "O'Brien", "Jean-Luc", "Dr. Rao")
const NAME_ALLOWED = /[^\p{L}\p{M}\s.'\-]/gu;
// Letters, digits, and the punctuation that appears in company names
const COMPANY_ALLOWED = /[^\p{L}\p{M}\p{N}\s.,'&()\-/]/gu;
// Digits, spaces and the phone punctuation: + ( ) - .
const PHONE_ALLOWED = /[^\d\s+().\-]/g;

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const RULES = {
  name: {
    sanitize: (v) => v.replace(NAME_ALLOWED, '').replace(/\s{2,}/g, ' '),
    validate: (v) => {
      if (!v) return 'Please enter your full name.';
      if (v.replace(/[^\p{L}]/gu, '').length < 2) return 'Name must contain at least 2 letters.';
      if (v.length > 60) return 'Name is too long (max 60 characters).';
      return '';
    }
  },
  company: {
    sanitize: (v) => v.replace(COMPANY_ALLOWED, '').replace(/\s{2,}/g, ' '),
    validate: (v) => {
      if (!v) return 'Please enter your company or organization.';
      if (!/\p{L}/u.test(v)) return 'Company name must contain letters.';
      if (v.length < 2) return 'Company name is too short.';
      if (v.length > 80) return 'Company name is too long (max 80 characters).';
      return '';
    }
  },
  email: {
    sanitize: (v) => v.replace(/\s/g, ''),
    validate: (v) => {
      if (!v) return 'Please enter your work email.';
      if (!EMAIL_RE.test(v)) return 'Please enter a valid email address (e.g. name@company.com).';
      if (v.length > 120) return 'Email address is too long.';
      return '';
    }
  },
  phone: {
    sanitize: (v) => v.replace(PHONE_ALLOWED, '').replace(/\s{2,}/g, ' '),
    validate: (v) => {
      if (!v) return 'Please enter your mobile number.';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number (7–15 digits).';
      if (v.indexOf('+') > 0) return 'A "+" is only allowed at the start of the number.';
      return '';
    }
  },
  select: {
    validate: (v) => (v ? '' : 'Please select an option.')
  },
  message: {
    validate: (v) => {
      if (!v) return 'Please tell us a little about your project.';
      if (v.length < 20) return 'Please add a bit more detail (at least 20 characters).';
      if (v.length > 2000) return 'Project brief is too long (max 2000 characters).';
      return '';
    }
  }
};

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

function isEmail(value) {
  return EMAIL_RE.test(value);
}

/** Show/clear the inline error for a field. Creates the error <span> if the markup lacks one. */
function fieldError(inputEl, message) {
  if (!inputEl) return;
  let errorEl = document.getElementById(`${inputEl.id}Error`);
  if (!errorEl && inputEl.parentElement) {
    errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.id = `${inputEl.id}Error`;
    inputEl.insertAdjacentElement('afterend', errorEl);
  }
  if (errorEl) errorEl.textContent = message || '';
  inputEl.classList.toggle('is-invalid', Boolean(message));
  inputEl.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function showStatus(statusEl, kind, html) {
  if (!statusEl) return;
  statusEl.className = `form-status ${kind}`;
  statusEl.style.display = 'block';
  statusEl.innerHTML = html;
}

function hideStatus(statusEl) {
  if (!statusEl) return;
  statusEl.className = 'form-status';
  statusEl.style.display = 'none';
  statusEl.innerHTML = '';
}

/**
 * Wire a field to a rule: strip disallowed characters while typing, validate on
 * blur, and clear the error as soon as the value becomes valid again.
 * Returns a function that validates the field and reports whether it passed.
 */
function bindField(inputEl, rule) {
  if (!inputEl || !rule) return () => true;

  const check = () => {
    const value = inputEl.value.trim();
    const message = rule.validate(value);
    fieldError(inputEl, message);
    return !message;
  };

  if (rule.sanitize) {
    inputEl.addEventListener('input', () => {
      const raw = inputEl.value;
      const cleaned = rule.sanitize(raw);
      if (cleaned !== raw) {
        // Keep the caret where the user was typing, shifted by how many characters were removed
        const pos = Math.max(0, (inputEl.selectionStart ?? raw.length) - (raw.length - cleaned.length));
        inputEl.value = cleaned;
        try { inputEl.setSelectionRange(pos, pos); } catch (_) { /* not supported on type="email" */ }
      }
      // Once a field has been flagged, re-check live so the error disappears when fixed
      if (inputEl.classList.contains('is-invalid')) check();
    });
  } else {
    inputEl.addEventListener('input', () => {
      if (inputEl.classList.contains('is-invalid')) check();
    });
  }

  inputEl.addEventListener('blur', (e) => {
    // Focus moving to the submit button: let submit validate instead. Showing an
    // error here would push the button down mid-click and swallow the click.
    if (e.relatedTarget?.matches?.('button[type="submit"]')) return;
    // Don't nag about an untouched optional field
    if (rule.optional && !inputEl.value.trim()) { fieldError(inputEl, ''); return; }
    check();
  });

  if (inputEl.tagName === 'SELECT') inputEl.addEventListener('change', check);

  return check;
}

/** Bind every field in the map and return a validator for the whole form. */
function bindForm(form, fieldMap) {
  const checks = Object.entries(fieldMap)
    .map(([id, rule]) => bindField(form.querySelector(`#${id}`), rule));

  return () => {
    // Run every check so all errors show at once, then report overall validity
    const results = checks.map(fn => fn());
    const valid = results.every(Boolean);
    if (!valid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
    }
    return valid;
  };
}

/* ---------------------------------------------------------------------------
 * Lead delivery
 *
 * The whole form is posted to the PHP handler at /api/contact.php, which mails
 * the submission to the company inbox as an HTML table and sets the sender's
 * address as Reply-To. Posting the form element itself (rather than a hand-
 * written payload) means any field added to the markup is included
 * automatically — the handler derives its own labels.
 *
 * If the endpoint is unreachable — for example while previewing the site on a
 * host without PHP — the handler degrades to a mailto: draft carrying the same
 * rows as a monospaced ASCII table, so the form never dead-ends.
 * ------------------------------------------------------------------------- */

const DEFAULT_FORM_ENDPOINT = '/api/contact.php';

/** Render rows as a fixed-width ASCII table for the plain-text mailto fallback. */
function rowsToTextTable(rows) {
  const labelWidth = Math.max(...rows.map(([label]) => label.length));
  const divider = `+${'-'.repeat(labelWidth + 2)}+${'-'.repeat(60)}+`;

  const body = rows.map(([label, value]) => {
    // Wrap long values (project briefs) so the right-hand column stays aligned
    const lines = String(value || '—').match(/.{1,58}(\s|$)/g) || ['—'];
    return lines
      .map((line, i) => `| ${(i === 0 ? label : '').padEnd(labelWidth)} | ${line.trim().padEnd(58)} |`)
      .join('\n');
  });

  return [divider, `| ${'FIELD'.padEnd(labelWidth)} | ${'DETAILS'.padEnd(58)} |`, divider, body.join(`\n${divider}\n`), divider].join('\n');
}

function dispatchMailto(companyEmail, subject, rows, statusEl) {
  const body = `New enquiry from the Vistarsolution website:\n\n${rowsToTextTable(rows)}\n`;
  const mailtoHref = `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  showStatus(
    statusEl,
    'success',
    `Opening your email client… If it does not open automatically, <a href="${mailtoHref}">click here to send directly</a>.`
  );

  setTimeout(() => {
    window.location.href = mailtoHref;
  }, 500);
}

/**
 * Post the whole form to the mail handler, falling back to mailto if the
 * request fails. `rows` is only used for that fallback.
 */
async function submitLead({ companyData, rows, source, statusEl, form }) {
  const contact = companyData?.contact || {};
  const companyEmail = contact.email || 'hello@vistarsolution.com';
  const endpoint = contact.form?.endpoint || DEFAULT_FORM_ENDPOINT;
  const subject = contact.form?.subject || 'New Contact Form Enquiry';

  const submitBtn = form?.querySelector('button[type="submit"]');
  const originalLabel = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
  }
  showStatus(statusEl, 'info', 'Sending your enquiry…');

  // Send the form as-is so every named field reaches the handler
  const payload = new FormData(form);
  payload.append('_source', source || document.title);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: payload
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(result.message || 'Submission failed');
    }

    form?.reset();
    showStatus(
      statusEl,
      'success',
      result.message || `Thank you — your enquiry has been sent to ${companyEmail}. We usually respond within one business day.`
    );
  } catch (error) {
    showStatus(statusEl, 'error', 'We could not send your enquiry automatically. Opening your email client instead…');
    setTimeout(() => dispatchMailto(companyEmail, subject, rows, statusEl), 1200);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  }
}

const val = (form, id) => form.querySelector(`#${id}`)?.value.trim() || '';

/* ---------------------------------------------------------------------------
 * Homepage inquiry form (#projectInquiryForm)
 * ------------------------------------------------------------------------- */
function setupInquiryForm(companyData) {
  const form = document.getElementById('projectInquiryForm');
  const statusEl = document.getElementById('formStatusMessage');
  if (!form) return;

  const validateForm = bindForm(form, {
    clientName: RULES.name,
    clientCompany: RULES.company,
    clientEmail: RULES.email,
    clientPhone: RULES.phone,
    projectType: RULES.select,
    projectDetails: RULES.message
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showStatus(statusEl, 'error', 'Please correct the highlighted fields and try again.');
      return;
    }
    hideStatus(statusEl);

    const name = val(form, 'clientName');
    const company = val(form, 'clientCompany');
    const email = val(form, 'clientEmail');
    const projectType = val(form, 'projectType');

    const rows = [
      ['Name', name],
      ['Company', company],
      ['Work Email', email],
      ['Mobile', val(form, 'clientPhone')],
      ['Project Scope', projectType || 'Not specified'],
      ['Target Timeline', val(form, 'projectBudget') || 'Flexible'],
      ['Project Brief', val(form, 'projectDetails')],
      ['Submitted From', 'Homepage enquiry widget'],
      ['Submitted On', new Date().toLocaleString('en-IN')]
    ];

    submitLead({ companyData, rows, source: 'Homepage enquiry widget', statusEl, form });
  });
}

/* ---------------------------------------------------------------------------
 * Contact page form (#contactForm)
 * ------------------------------------------------------------------------- */
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

  const validateForm = bindForm(form, {
    clientName: RULES.name,
    clientCompany: RULES.company,
    clientEmail: RULES.email,
    clientPhone: RULES.phone,
    projectScope: RULES.select,
    projectOverview: RULES.message
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showStatus(statusEl, 'error', 'Please correct the highlighted fields and resubmit.');
      return;
    }
    hideStatus(statusEl);

    const name = val(form, 'clientName');
    const company = val(form, 'clientCompany');
    const email = val(form, 'clientEmail');

    const rows = [
      ['Name', name],
      ['Company', company],
      ['Work Email', email],
      ['Mobile', val(form, 'clientPhone')],
      ['Engagement Scope', val(form, 'projectScope') || 'Not specified'],
      ['Target Timeline', val(form, 'projectTimeline') || 'Flexible'],
      ['Project Overview', val(form, 'projectOverview')],
      ['Submitted From', 'Contact page form'],
      ['Submitted On', new Date().toLocaleString('en-IN')]
    ];

    submitLead({ companyData, rows, source: 'Contact page form', statusEl, form });
  });
}

export function setupContactForm(companyData) {
  setupInquiryForm(companyData);
  setupContactPageForm(companyData);
}

export { isEmail };
