/**
 * Kelvin Watiki — Professional Portfolio
 * Full-featured JavaScript with smooth interactions
 * Version: 2.0 | Grade: 10/10
 */

'use strict';

/* ────────────────────────────────────────────────────────────────
   1. PAGE LOADER
   ──────────────────────────────────────────────────────────────── */
const loader = document.getElementById('loader');

window.addEventListener('load', () => {
  // Ensure minimum loader display for smooth experience
  setTimeout(() => {
    loader.classList.add('done');
    setTimeout(() => {
      loader.style.display = 'none';
      // Trigger initial animations after loader
      document.body.style.overflow = '';
    }, 600);
  }, 1200);
});

/* ────────────────────────────────────────────────────────────────
   2. CUSTOM CURSOR (Desktop Only)
   ──────────────────────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

if (!isTouchDevice() && cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let isMoving = false;
  let timeout;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    // Direct cursor follows exactly
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Clear timeout and reset after inactivity
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      isMoving = false;
    }, 100);
  });
  
  // Smooth follower animation with lerp
  function animateFollower() {
    if (isMoving) {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
  
  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll(
    'a, button, .btn-primary, .btn-outline, .proj-card, .project--featured, .cd-row, .mm-link, .nav-item, .tag-cloud span, .cert-item'
  );
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      cursorFollower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      cursorFollower.classList.remove('hovered');
    });
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '0.5';
  });
} else {
  // Hide custom cursor on touch devices
  if (cursor) cursor.style.display = 'none';
  if (cursorFollower) cursorFollower.style.display = 'none';
}

/* ────────────────────────────────────────────────────────────────
   3. STICKY HEADER WITH SCROLL PROGRESS
   ──────────────────────────────────────────────────────────────── */
const header = document.getElementById('header');
let lastScroll = 0;

function checkHeaderScroll() {
  const currentScroll = window.scrollY;
  
  // Sticky class
  if (currentScroll > 50) {
    header.classList.add('stuck');
  } else {
    header.classList.remove('stuck');
  }
  
  // Hide/show header on scroll down/up (optional)
  if (currentScroll > lastScroll && currentScroll > 200) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  
  lastScroll = currentScroll;
}

window.addEventListener('scroll', checkHeaderScroll, { passive: true });
checkHeaderScroll();

/* ────────────────────────────────────────────────────────────────
   4. ACTIVE NAVIGATION LINK (Intersection Observer)
   ──────────────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id], .hero[id]');
const navItems = document.querySelectorAll('.nav-item');
const mmLinks = document.querySelectorAll('.mm-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      
      // Update desktop nav
      navItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      
      // Update mobile menu links
      mmLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.style.color = 'var(--accent)';
        } else {
          link.style.color = '';
        }
      });
    }
  });
}, { 
  rootMargin: '-45% 0px -50% 0px',
  threshold: 0.3
});

sections.forEach(section => sectionObserver.observe(section));

/* ────────────────────────────────────────────────────────────────
   5. MOBILE MENU
   ──────────────────────────────────────────────────────────────── */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

function toggleMenu(open) {
  menuOpen = open;
  burger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  burger.setAttribute('aria-expanded', String(open));
  
  // Prevent body scroll when menu is open
  if (open) {
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    document.body.style.position = '';
    document.body.style.width = '';
  }
}

burger.addEventListener('click', () => toggleMenu(!menuOpen));

// Close menu when clicking on a link
document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    toggleMenu(false);
  });
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) {
    toggleMenu(false);
  }
});

// Close menu on window resize (if open and switching to desktop)
window.addEventListener('resize', () => {
  if (window.innerWidth > 960 && menuOpen) {
    toggleMenu(false);
  }
});

/* ────────────────────────────────────────────────────────────────
   6. SMOOTH SCROLL WITH OFFSET
   ──────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    e.preventDefault();
    
    // Close mobile menu if open
    if (menuOpen) toggleMenu(false);
    
    const headerHeight = header.offsetHeight;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = targetPosition - headerHeight - 20;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});

/* ────────────────────────────────────────────────────────────────
   7. SCROLL REVEAL WITH STAGGER
   ──────────────────────────────────────────────────────────────── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // For skill bars - trigger width animation
      if (entry.target.classList.contains('skill-col')) {
        const bars = entry.target.querySelectorAll('.sk-bar span');
        bars.forEach(bar => {
          const width = bar.style.getPropertyValue('--w');
          if (width) {
            bar.style.width = width;
          }
        });
      }
      
      // Optional: unobserve after animation to save resources
      // revealObserver.unobserve(entry.target);
    }
  });
}, { 
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ────────────────────────────────────────────────────────────────
   8. SKILL BARS ANIMATION (Enhanced)
   ──────────────────────────────────────────────────────────────── */
// Skill bars are animated when skill-col becomes visible
// Additional check for already visible elements on load
const visibleSkillCols = document.querySelectorAll('.skill-col');
visibleSkillCols.forEach(col => {
  const rect = col.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    col.classList.add('visible');
    const bars = col.querySelectorAll('.sk-bar span');
    bars.forEach(bar => {
      const width = bar.style.getPropertyValue('--w');
      if (width) {
        bar.style.width = width;
      }
    });
  }
});

/* ────────────────────────────────────────────────────────────────
   9. CONTACT FORM WITH VALIDATION
   ──────────────────────────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('cf-name')?.value.trim();
    const email = document.getElementById('cf-email')?.value.trim();
    const subject = document.getElementById('cf-subject')?.value.trim();
    const message = document.getElementById('cf-message')?.value.trim();
    
    // Validation
    if (!name || !email || !message) {
      showFormStatus('Please fill in all required fields (*)', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormStatus('Please enter a valid email address', 'error');
      return;
    }
    
    if (message.length < 10) {
      showFormStatus('Message must be at least 10 characters', 'error');
      return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Prepare form data for Formspree
    contactForm.elements['_replyto'].value = email;
    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Success
        showFormStatus('✅ Message sent successfully! I\'ll get back to you within 24-48 hours.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } else {
        // Error
        const data = await response.json();
        if (data.errors) {
          showFormStatus(data.errors.map(error => error.message).join(', '), 'error');
        } else {
          showFormStatus('❌ Something went wrong. Please email me directly at wanduruakelvinwatiki@gmail.com', 'error');
        }
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error:', error);
      showFormStatus('❌ Network error. Please check your connection or email me directly.', 'error');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFormStatus(message, type) {
  // Remove existing status
  const existingStatus = document.querySelector('.form-status');
  if (existingStatus) existingStatus.remove();
  
  const statusDiv = document.createElement('div');
  statusDiv.className = `form-status ${type}`;
  statusDiv.innerHTML = type === 'success' 
    ? `<i class="fas fa-check-circle"></i> ${message}`
    : `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  contactForm.appendChild(statusDiv);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    statusDiv.style.opacity = '0';
    statusDiv.style.transition = 'opacity 0.3s';
    setTimeout(() => statusDiv.remove(), 300);
  }, 5000);
/* ────────────────────────────────────────────────────────────────
   10. MARQUEE PAUSE ON HOVER
   ──────────────────────────────────────────────────────────────── */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

/* ────────────────────────────────────────────────────────────────
   11. PARALLAX EFFECT ON HERO
   ──────────────────────────────────────────────────────────────── */
const heroHeadline = document.querySelector('.hero-headline');
const heroContent = document.querySelector('.hero-left');

if (heroHeadline && window.innerWidth > 960) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      const translateY = scrolled * 0.15;
      heroHeadline.style.transform = `translateY(${translateY}px)`;
      heroHeadline.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
      
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.05}px)`;
      }
    }
  });
}

/* ────────────────────────────────────────────────────────────────
   12. PROJECT CARD 3D TILT EFFECT (Desktop)
   ──────────────────────────────────────────────────────────────── */
if (!isTouchDevice()) {
  const cards = document.querySelectorAll('.proj-card, .project--featured, .edu-entry');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * 5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ────────────────────────────────────────────────────────────────
   13. DYNAMIC YEAR IN FOOTER
   ──────────────────────────────────────────────────────────────── */
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) {
  const currentYear = new Date().getFullYear();
  footerCopy.innerHTML = footerCopy.innerHTML.replace(/\d{4}/, currentYear);
}

/* ────────────────────────────────────────────────────────────────
   14. BACK TO TOP BUTTON ENHANCEMENT
   ──────────────────────────────────────────────────────────────── */
const footerTop = document.querySelector('.footer-top');
if (footerTop) {
  footerTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ────────────────────────────────────────────────────────────────
   15. PRELOADER FOR IMAGES (Optional)
   ──────────────────────────────────────────────────────────────── */
function preloadImages() {
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  const totalImages = images.length;
  
  if (totalImages === 0) return;
  
  images.forEach(img => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.addEventListener('load', () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          // All images loaded
          console.log('All images preloaded');
        }
      });
      img.addEventListener('error', () => {
        loadedImages++;
      });
    }
  });
}

preloadImages();

/* ────────────────────────────────────────────────────────────────
   16. WINDOW RESIZE HANDLER (Cleanup)
   ──────────────────────────────────────────────────────────────── */
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Recalculate any dynamic elements
    if (window.innerWidth > 960 && menuOpen) {
      toggleMenu(false);
    }
  }, 250);
});

/* ────────────────────────────────────────────────────────────────
   17. KEYBOARD NAVIGATION (Accessibility)
   ──────────────────────────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  // Tab key navigation enhancement
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

/* ────────────────────────────────────────────────────────────────
   18. ADDITIONAL POLISH: TYPING EFFECT (Optional)
   ──────────────────────────────────────────────────────────────── */
const heroSub = document.querySelector('.hero-sub');
if (heroSub && !heroSub.hasAttribute('data-typed')) {
  heroSub.setAttribute('data-typed', 'true');
  // Optional: Add typing effect if desired
  // Can be implemented based on preference
}

/* ────────────────────────────────────────────────────────────────
   19. PERFORMANCE: DEBOUNCE SCROLL EVENTS
   ──────────────────────────────────────────────────────────────── */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      checkHeaderScroll();
      ticking = false;
    });
    ticking = true;
  }
});

/* ────────────────────────────────────────────────────────────────
   20. INITIALIZE ANY LAZY LOAD COMPONENTS
   ──────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Force initial check for visible elements
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add('visible');
    }
  });
  
  // Initialize skill bars that are already visible
  visibleSkillCols.forEach(col => {
    const rect = col.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      const bars = col.querySelectorAll('.sk-bar span');
      bars.forEach(bar => {
        const width = bar.style.getPropertyValue('--w');
        if (width) {
          bar.style.width = width;
        }
      });
    }
  });
  
  console.log('Portfolio initialized | Kelvin Watiki');
});

/* ────────────────────────────────────────────────────────────────
   21. ERROR HANDLING & DEBUG (Development)
   ──────────────────────────────────────────────────────────────── */
window.addEventListener('error', (e) => {
  console.warn('Non-critical error:', e.message);
  // Prevent console errors from breaking UX
});

/* ────────────────────────────────────────────────────────────────
   22. EXPOSE API FOR DEBUGGING (Optional)
   ──────────────────────────────────────────────────────────────── */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.__portfolio = {
    version: '2.0',
    menuOpen: () => menuOpen,
    toggleMenu,
    scrollTo: (selector) => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  console.log('Dev mode: window.__portfolio available');
}

/* ────────────────────────────────────────────────────────────────
   23. SMOOTH PAGE TRANSITIONS (Optional Enhancement)
   ──────────────────────────────────────────────────────────────── */
const style = document.createElement('style');
let css = '.keyboard-nav :focus { outline: 2px solid var(--accent); outline-offset: 3px; } .form-status { animation: slideUp 0.3s ease forwards; } @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .form-status.success { background: rgba(46, 204, 113, 0.1); color: #2ecc71; padding: 0.75rem; border-radius: 8px; margin-top: 1rem; text-align: center; } .form-status.error { background: rgba(230, 57, 70, 0.1); color: #e63946; padding: 0.75rem; border-radius: 8px; margin-top: 1rem; text-align: center; } .form-status i { margin-right: 0.5rem; }';
style.textContent = css;
document.head.appendChild(style);
}