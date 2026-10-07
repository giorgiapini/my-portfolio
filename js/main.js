const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
  navLinks?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  navLinks?.classList.toggle('is-open', !isOpen);
});

navLinks?.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const sections = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-links a[aria-current="location"]').forEach((link) => link.removeAttribute('aria-current'));
    document.querySelector(`.nav-links a[href="#${entry.target.id}"]`)?.setAttribute('aria-current', 'location');
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('.placeholder-link').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
let isSubmitting = false;
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isSubmitting || !contactForm.reportValidity()) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);
  isSubmitting = true;
  submitButton.disabled = true;
  contactForm.setAttribute('aria-busy', 'true');
  formStatus.textContent = 'Sending your message...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      throw new Error('Message submission failed');
    }

    formStatus.textContent = "Message sent successfully. I'll get back to you soon!";
    contactForm.reset();
  } catch {
    formStatus.textContent = 'Your message could not be sent. Please try again in a moment.';
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    contactForm.removeAttribute('aria-busy');
  }
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
