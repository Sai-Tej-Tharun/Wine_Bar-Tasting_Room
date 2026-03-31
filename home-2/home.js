/* =====================================================================
   HEART AND WINE — HOME 2 PAGE JS
   Niche / Distillery variant
   All functions are modular, ES6+, no console.log in production
   ===================================================================== */

'use strict';

/* ===================================================================
   THEME TOGGLE
   Reads system preference on first load, persists in localStorage
   =================================================================== */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

/* Load saved theme or fall back to system preference */
const savedTheme  = localStorage.getItem('mashaletheme') ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

setTheme(savedTheme);

function setTheme(t) {
  html.setAttribute('data-theme', t);
  if (themeIcon) {
    themeIcon.className = t === 'dark' ? 'fa fa-moon' : 'fa fa-sun';
  }
  localStorage.setItem('mashaletheme', t);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}

/* ===================================================================
   SCROLL PROGRESS BAR
   =================================================================== */
const scrollProgress = document.getElementById('scrollProgress');

if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.body.scrollHeight - window.innerHeight;
    const percent      = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${percent}%`;
  }, { passive: true });
}

/* ===================================================================
   NAVBAR — Scroll state + colour change
   =================================================================== */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ===================================================================
   MOBILE MENU — Toggle with aria attributes for accessibility
   =================================================================== */
const navBurger  = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

if (navBurger && mobileMenu) {
  navBurger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  /* Close menu when a link inside is clicked */
  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navBurger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
    });
  });

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      navBurger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
      navBurger.focus();
    }
  });
}

/* ===================================================================
   REVEAL ON SCROLL — IntersectionObserver-based fade-in
   Staggered delay for grouped elements
   =================================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

revealEls.forEach(el => revealObserver.observe(el));

/* ===================================================================
   COUNT-UP ANIMATION — Runs once when stats enter viewport
   =================================================================== */

function countUp(el, target, duration = 1800) {
  const step      = 16; /* ~60fps */
  const increment = target / (duration / step);
  let current     = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = target >= 1000
      ? Math.floor(current).toLocaleString()
      : Math.floor(current);
  }, step);
}

/* Observer targets the philosophy stats section */
const statsEls = document.querySelectorAll('.pstat-num');

if (statsEls.length) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statsEls.forEach(el => {
          const target = parseInt(el.dataset.count, 10);
          if (!isNaN(target)) countUp(el, target);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const philosophySection = document.querySelector('.philosophy');
  if (philosophySection) statsObserver.observe(philosophySection);
}

/* ===================================================================
   FOAM CURSOR — Smooth trailing custom cursor
   =================================================================== */
const foamCursor = document.getElementById('foamCursor');

if (foamCursor) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    foamCursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    foamCursor.style.opacity = '0';
  });

  /* Smooth lerp-based animation loop */
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    foamCursor.style.left = `${cursorX}px`;
    foamCursor.style.top  = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

/* ===================================================================
   PARALLAX TAPROOM BACKGROUND
   Simple scroll-based translate on the background image
   =================================================================== */
const parallaxEl = document.querySelector('[data-parallax]');

if (parallaxEl) {
  window.addEventListener('scroll', () => {
    const taproomSection = parallaxEl.closest('.taproom-exp');
    if (!taproomSection) return;
    const rect   = taproomSection.getBoundingClientRect();
    const offset = (rect.top / window.innerHeight) * 30; /* 0-30px shift */
    parallaxEl.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

/* ===================================================================
   OPEN NOW BADGE
   Checks current local time against taproom hours and updates badge
   =================================================================== */
function updateOpenNow() {
  const badge  = document.getElementById('openNowBadge');
  const text   = document.getElementById('openNowText');
  const dot    = badge ? badge.querySelector('.open-dot') : null;

  if (!badge || !text || !dot) return;

  const now   = new Date();
  const day   = now.getDay(); /* 0=Sun … 6=Sat */
  const hour  = now.getHours();
  const mins  = now.getMinutes();
  const time  = hour + mins / 60;

  /* Hours: Mon-Thu 15-23, Fri-Sat 12-25 (1am), Sun 12-21 */
  let isOpen = false;

  if (day >= 1 && day <= 4) {            /* Mon – Thu */
    isOpen = time >= 15 && time < 23;
  } else if (day === 5 || day === 6) {   /* Fri – Sat */
    isOpen = time >= 12 || time < 1;
  } else {                               /* Sunday */
    isOpen = time >= 12 && time < 21;
  }

  if (isOpen) {
    text.textContent = 'Open Now — Come on in!';
    dot.style.background    = 'var(--success)';
    dot.style.boxShadow     = '0 0 8px rgba(45,217,98,0.6)';
    dot.style.animation     = 'blink 2s ease-in-out infinite';
  } else {
    text.textContent = 'Currently Closed — See you soon!';
    dot.style.background = 'var(--error)';
    dot.style.boxShadow  = '0 0 8px rgba(232,64,64,0.4)';
    dot.style.animation  = 'none';
  }
}

updateOpenNow();
setInterval(updateOpenNow, 60000); /* Re-check every minute */

/* ===================================================================
   BEER GLASS DECORATION — Animates the fill in the Reserve section
   =================================================================== */
function animateDecoGlass() {
  const fill = document.getElementById('decoFill');
  if (!fill) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          fill.style.height = '78%';
        }, 400);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(fill);
}

animateDecoGlass();

/* ===================================================================
   PROCESS STEP STAGGER — Additional stagger for timeline steps
   =================================================================== */
document.querySelectorAll('.process-step').forEach((step, i) => {
  step.style.transitionDelay = `${i * 100}ms`;
});

/* ===================================================================
   SPIRIT CARD SUBTLE TILT on mousemove (3D perspective effect)
   =================================================================== */
document.querySelectorAll('.spirit-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform    = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transition   = 'none';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s var(--ease), border-color 0.4s, box-shadow 0.4s';
  });
});

/* ===================================================================
   GALLERY ITEM — Keyboard accessibility (Enter = focus figcaption)
   =================================================================== */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.setAttribute('tabindex', '0');

  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      /* In a real project this would open a lightbox */
      e.preventDefault();
    }
  });
});

/* ===================================================================
   RESERVATION FORM VALIDATION
   Client-side validation with accessible error messages
   =================================================================== */
const reserveForm = document.getElementById('reserveForm');

if (reserveForm) {
  /* Set min date to today */
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  reserveForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    /* ── Name ── */
    const name    = document.getElementById('resName');
    const nameErr = document.getElementById('resNameError');
    if (name && nameErr) {
      if (!name.value.trim() || name.value.trim().length < 2) {
        nameErr.textContent    = 'Please enter your full name (at least 2 characters).';
        name.style.borderColor = 'var(--error)';
        valid = false;
      } else {
        nameErr.textContent    = '';
        name.style.borderColor = '';
      }
    }

    /* ── Email ── */
    const email    = document.getElementById('resEmail');
    const emailErr = document.getElementById('resEmailError');
    if (email && emailErr) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        emailErr.textContent    = 'Please enter a valid email address.';
        email.style.borderColor = 'var(--error)';
        valid = false;
      } else {
        emailErr.textContent    = '';
        email.style.borderColor = '';
      }
    }

    /* ── Date ── */
    const date    = document.getElementById('resDate');
    const dateErr = document.getElementById('resDateError');
    if (date && dateErr) {
      if (!date.value) {
        dateErr.textContent    = 'Please select a preferred date.';
        date.style.borderColor = 'var(--error)';
        valid = false;
      } else {
        dateErr.textContent    = '';
        date.style.borderColor = '';
      }
    }

    /* ── Time ── */
    const time    = document.getElementById('resTime');
    const timeErr = document.getElementById('resTimeError');
    if (time && timeErr) {
      if (!time.value) {
        timeErr.textContent    = 'Please select a time slot.';
        time.style.borderColor = 'var(--error)';
        valid = false;
      } else {
        timeErr.textContent    = '';
        time.style.borderColor = '';
      }
    }

    /* ── Guests ── */
    const guests    = document.getElementById('resGuests');
    const guestsErr = document.getElementById('resGuestsError');
    if (guests && guestsErr) {
      const guestVal = parseInt(guests.value, 10);
      if (!guests.value || isNaN(guestVal) || guestVal < 1 || guestVal > 80) {
        guestsErr.textContent    = 'Please enter a valid guest count between 1 and 80.';
        guests.style.borderColor = 'var(--error)';
        valid = false;
      } else {
        guestsErr.textContent    = '';
        guests.style.borderColor = '';
      }
    }

    /* ── Success ── */
    if (valid) {
      const successEl = document.getElementById('formSuccess');
      if (successEl) {
        successEl.classList.add('show');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      reserveForm.reset();

      /* Auto-hide success after 5s */
      setTimeout(() => {
        if (successEl) successEl.classList.remove('show');
      }, 5000);
    } else {
      /* Focus the first invalid field */
      const firstError = reserveForm.querySelector('[style*="var(--error)"]');
      if (firstError) firstError.focus();
    }
  });

  /* Real-time validation: clear error on input */
  reserveForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
      const errId = field.getAttribute('aria-describedby');
      if (errId) {
        const errEl = document.getElementById(errId);
        if (errEl) errEl.textContent = '';
      }
    });
  });
}

/* ===================================================================
   NEWSLETTER FORM
   =================================================================== */
const nlForm = document.getElementById('nlForm');

if (nlForm) {
  nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('nlEmail');
    const btn   = nlForm.querySelector('button[type="submit"]');
    if (!input || !btn) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(input.value)) {
      const original = btn.innerHTML;
      btn.innerHTML         = '<i class="fa fa-check" aria-hidden="true"></i> You\'re in!';
      btn.style.background  = 'linear-gradient(135deg,#1a9e3a,#2dd962)';
      btn.style.color       = '#fff';
      input.value           = '';

      setTimeout(() => {
        btn.innerHTML       = original;
        btn.style.background = '';
        btn.style.color     = '';
      }, 3000);
    } else {
      input.style.borderColor = 'var(--error)';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
    }
  });
}

/* ===================================================================
   CLICK RIPPLE — Amber ripple on every click (brand micro-interaction)
   =================================================================== */
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 0; height: 0;
    border-radius: 50%;
    border: 2px solid rgba(242,193,78,0.5);
    transform: translate(-50%, -50%);
    animation: rippleEffect 0.7s ease-out forwards;
    pointer-events: none;
    z-index: 9997;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

/* Inject ripple keyframe once */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleEffect {
    to { width: 70px; height: 70px; opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ===================================================================
   TIER CARD — Entrance animation on viewport entry
   =================================================================== */
const tierCards = document.querySelectorAll('.tier-card');

if (tierCards.length) {
  const tierObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 120);
        tierObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  /* Set initial state */
  tierCards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateX(-20px)';
    card.style.transition = 'opacity 0.5s var(--ease), transform 0.5s var(--ease)';
    tierObserver.observe(card);
  });
}

/* ===================================================================
   PRESS LOGOS — Subtle stagger entrance
   =================================================================== */
const pressLogos = document.querySelectorAll('.press-logo');

if (pressLogos.length) {
  const pressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pressLogos.forEach((logo, i) => {
          setTimeout(() => {
            logo.style.opacity   = '1';
            logo.style.transform = 'translateY(0)';
          }, i * 100);
        });
        pressObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  /* Initial state */
  pressLogos.forEach(logo => {
    logo.style.opacity    = '0';
    logo.style.transform  = 'translateY(12px)';
    logo.style.transition = 'opacity 0.5s var(--ease), transform 0.5s var(--ease)';
  });

  const pressSection = document.querySelector('.press');
  if (pressSection) pressObserver.observe(pressSection);
}

/* ===================================================================
   GALLERY ITEM HOVER SOUND EFFECT (visual substitute)
   Adds a quick border flash on hover to simulate tactile feedback
   =================================================================== */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.outline = '2px solid rgba(242,193,78,0.3)';
    item.style.outlineOffset = '-2px';
  });

  item.addEventListener('mouseleave', () => {
    item.style.outline = '';
    item.style.outlineOffset = '';
  });
});

/* ===================================================================
   SMOOTH ANCHOR SCROLLING with offset for fixed navbar
   =================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = navbar ? navbar.offsetHeight : 72;
    const top       = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});
document.querySelectorAll(".mob-drop-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement;
    parent.classList.toggle("active");
  });
});

