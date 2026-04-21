/**
 * Kelvin Watiki — Portfolio Script
 * Handles: Navigation scroll/active state, hamburger menu,
 *          scroll-reveal animations, contact form feedback.
 */

'use strict';

/* ─────────────────────────────────────────────
   1. DOM References
────────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');
const revealEls   = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contact-form');


/* ─────────────────────────────────────────────
   2. Sticky Navbar — add/remove .scrolled class
────────────────────────────────────────────── */
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Run once on load


/* ─────────────────────────────────────────────
   3. Active Nav Link — highlights based on
      which section is in viewport
────────────────────────────────────────────── */
function updateActiveLink() {
  let current = '';

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();


/* ─────────────────────────────────────────────
   4. Hamburger Menu Toggle
────────────────────────────────────────────── */
function toggleMenu(open) {
  const isOpen = (open !== undefined) ? open : !navLinks.classList.contains('open');
  hamburger.classList.toggle('open', isOpen);
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu());

// Close menu when a nav link is clicked
navLinks.addEventListener('click', e => {
  if (e.target.classList.contains('nav-link')) {
    toggleMenu(false);
  }
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    toggleMenu(false);
  }
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    toggleMenu(false);
  }
});


/* ─────────────────────────────────────────────
   5. Scroll Reveal — IntersectionObserver
────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────
   6. Smooth scroll for all anchor links
────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────────
   7. Contact Form — Frontend-only feedback
────────────────────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameEl    = this.querySelector('#name');
    const emailEl   = this.querySelector('#email');
    const messageEl = this.querySelector('#message');
    const submitBtn = this.querySelector('button[type="submit"]');

    // Simple validation
    const name    = nameEl.value.trim();
    const email   = emailEl.value.trim();
    const message = messageEl.value.trim();

    if (!name || !email || !message) {
      showFormFeedback('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending — visual feedback only
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ph ph-circle-notch"></i> Sending…';
    submitBtn.disabled  = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="ph ph-check"></i> Message Sent!';
      submitBtn.style.background = '#5ef4ff';

      // Reset form
      setTimeout(() => {
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled  = false;
        submitBtn.style.background = '';
      }, 2500);
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormFeedback(message, type) {
  // Remove existing feedback
  const existing = document.querySelector('.form-feedback');
  if (existing) existing.remove();

  const el = document.createElement('p');
  el.className = 'form-feedback';
  el.textContent = message;
  el.style.cssText = `
    font-family: var(--font-mono, monospace);
    font-size: 0.78rem;
    margin-top: 0.5rem;
    color: ${type === 'error' ? '#ff6b6b' : '#7fff6e'};
    text-align: center;
    animation: fadeIn 0.3s ease;
  `;

  contactForm.appendChild(el);

  // Auto-remove after 4s
  setTimeout(() => el.remove(), 4000);
}


/* ─────────────────────────────────────────────
   8. Cursor glow effect — subtle pointer trail
────────────────────────────────────────────── */
(function initCursorGlow() {
  // Only on non-touch desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(127,255,110,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.4s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX  = 0, glowY  = 0;
  let animId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animateGlow() {
    // Smooth lerp follow
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    animId = requestAnimationFrame(animateGlow);
  }

  animateGlow();
})();


/* ─────────────────────────────────────────────
   9. Typed subtitle effect
   (cycles through role strings subtly)
────────────────────────────────────────────── */
(function initTyped() {
  const el = document.querySelector('.typed-wrapper');
  if (!el) return;

  const roles = [
    'Software Developer · AI Enthusiast',
    'Python & PHP Developer',
    'Machine Learning Engineer',
    'Cloud Computing Student',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const sep = '<span class="typed-sep"> · </span>';

  function type() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      // Typing forward
      const display = current.substring(0, charIndex + 1);
      el.innerHTML = display + '<span class="typed-cursor">|</span>';
      charIndex++;

      if (charIndex === current.length) {
        // Pause at end before deleting
        isDeleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      // Deleting
      const display = current.substring(0, charIndex - 1);
      el.innerHTML = display + '<span class="typed-cursor">|</span>';
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
      }
    }

    const speed = isDeleting ? 40 : 70;
    setTimeout(type, speed);
  }

  // Add cursor styles inline so no extra CSS file needed
  const style = document.createElement('style');
  style.textContent = `
    .typed-cursor {
      display: inline-block;
      color: #7fff6e;
      animation: blink 1s step-end infinite;
      font-weight: 300;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Start typing after hero reveal delay
  setTimeout(type, 1200);
})();


/* ─────────────────────────────────────────────
   10. Skills bar hover — subtle highlight
────────────────────────────────────────────── */
document.querySelectorAll('.skill-group').forEach(group => {
  group.addEventListener('mouseenter', () => {
    document.querySelectorAll('.skill-group').forEach(g => {
      if (g !== group) g.style.opacity = '0.5';
    });
  });
  group.addEventListener('mouseleave', () => {
    document.querySelectorAll('.skill-group').forEach(g => {
      g.style.opacity = '';
    });
  });
});
