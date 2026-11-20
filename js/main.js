const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
function closeMenu() { menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', 'Apri menu'); navLinks?.classList.remove('is-open'); }
menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu'); navLinks?.classList.toggle('is-open', open); });
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
let isSubmitting = false;
contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (isSubmitting || !contactForm.reportValidity()) return;
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  isSubmitting = true; submitButton.disabled = true; contactForm.setAttribute('aria-busy', 'true'); formStatus.textContent = 'Invio del messaggio in corso...';
  try {
    const response = await fetch(contactForm.action, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData)) });
    const result = await response.json();
    if (!response.ok || result.success !== true) throw new Error('Submission failed');
    formStatus.textContent = 'Messaggio inviato. Ti risponderò presto!'; contactForm.reset();
  } catch { formStatus.textContent = 'Non è stato possibile inviare il messaggio. Riprova tra qualche istante.'; }
  finally { isSubmitting = false; submitButton.disabled = false; contactForm.removeAttribute('aria-busy'); }
});
const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
