/**
 * =========================================================================
 * CONTACT & INQUIRY FORM INTERACTIONS
 * =========================================================================
 * Client-side contact handling without backend dependencies.
 * Generates pre-formatted mailto inquiries and provides WhatsApp direct links.
 */

export function setupContactForm(companyData) {
  const form = document.getElementById('projectInquiryForm');
  const statusEl = document.getElementById('formStatusMessage');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#clientName')?.value.trim();
    const email = form.querySelector('#clientEmail')?.value.trim();
    const projectType = form.querySelector('#projectType')?.value;
    const budget = form.querySelector('#projectBudget')?.value;
    const message = form.querySelector('#projectDetails')?.value.trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please fill out your name, email, and project description.';
      }
      return;
    }

    const companyEmail = companyData?.contact?.email || 'contact@yourcompany.com';
    const subject = encodeURIComponent(`New Project Inquiry from ${name} [${projectType || 'General'}]`);
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Service Needed: ${projectType || 'Not specified'}\n` +
      `Estimated Budget: ${budget || 'Flexible'}\n\n` +
      `Project Details:\n${message}\n`
    );

    // Show success feedback
    if (statusEl) {
      statusEl.className = 'form-status success';
      statusEl.innerHTML = `Preparing email client... If your email app does not open automatically, <a href="mailto:${companyEmail}?subject=${subject}&body=${body}" style="text-decoration: underline; color: var(--accent-cyan);">click here to send directly</a>.`;
    }

    // Launch email client
    setTimeout(() => {
      window.location.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;
    }, 600);
  });
}
