/**
 * =========================================================================
 * CONTACT & CONSULTATION LEAD CAPTURE HANDLER
 * =========================================================================
 * Minimalist, high-conversion consultation capture with automated mailto formatting.
 */

export function setupContactForm(companyData) {
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

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please fill out all required fields (Name, Email, and Project Brief).';
      }
      return;
    }

    const companyEmail = companyData?.contact?.email || 'hello@diyaseva.com';
    const subject = encodeURIComponent(`Consultation Request: ${company} (${name}) — [${projectType || 'General'}]`);
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Company: ${company}\n` +
      `Work Email: ${email}\n` +
      `Project Scope: ${projectType || 'Not specified'}\n` +
      `Target Timeline: ${timeline || 'Flexible'}\n\n` +
      `Project Brief & Requirements:\n${message}\n`
    );

    // Show success feedback
    if (statusEl) {
      statusEl.className = 'form-status success';
      statusEl.innerHTML = `Preparing consultation request... If your mail client does not launch automatically, <a href="mailto:${companyEmail}?subject=${subject}&body=${body}" style="text-decoration: underline; color: var(--accent-cyan);">click here to dispatch directly</a>.`;
    }

    // Launch mail client
    setTimeout(() => {
      window.location.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;
    }, 500);
  });
}
