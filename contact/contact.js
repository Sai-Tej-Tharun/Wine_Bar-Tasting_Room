/* =====================================================================
   HEART AND WINE — CONTACT PAGE JS
   Modules: Theme · Scroll Progress · Navbar · Mobile Menu ·
            Reveal · Foam Cursor · Open-Now · Form Tabs ·
            Form Validation (x3) · FAQ Accordion ·
            Newsletter · Ripple · Smooth Scroll
   ===================================================================== */

'use strict';

/* ===================================================================
   THEME TOGGLE
   =================================================================== */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('mashaletheme') ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

applyTheme(savedTheme);

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  if (themeIcon) themeIcon.className = t === 'dark' ? 'fa fa-moon' : 'fa fa-sun';
  localStorage.setItem('mashaletheme', t);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () =>
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
  );
}

/* ===================================================================
   SCROLL PROGRESS BAR
   =================================================================== */
const scrollProgress = document.getElementById('scrollProgress');

if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    scrollProgress.style.width = `${Math.min(pct, 100)}%`;
  }, { passive: true });
}

/* ===================================================================
   NAVBAR SCROLL STATE
   =================================================================== */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () =>
    navbar.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
}

/* ===================================================================
   MOBILE MENU
   =================================================================== */
const navBurger  = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

if (navBurger && mobileMenu) {
  navBurger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    navBurger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  });

  mobileMenu.querySelectorAll('.mob-link').forEach(l =>
    l.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navBurger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
    })
  );

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
   REVEAL ON SCROLL
   =================================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ===================================================================
   FOAM CURSOR
   =================================================================== */
const foamCursor = document.getElementById('foamCursor');

if (foamCursor) {
  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    foamCursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => { foamCursor.style.opacity = '0'; });

  (function loop() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    foamCursor.style.left = `${cx}px`;
    foamCursor.style.top  = `${cy}px`;
    requestAnimationFrame(loop);
  })();
}

/* ===================================================================
   OPEN NOW — Updates hero badge + info-card badge
   =================================================================== */
function checkOpenNow() {
  const now  = new Date();
  const day  = now.getDay();              /* 0=Sun … 6=Sat */
  const t    = now.getHours() + now.getMinutes() / 60;

  let open = false;
  if      (day >= 1 && day <= 4)  open = t >= 15 && t < 23;       /* Mon-Thu */
  else if (day === 5 || day === 6) open = t >= 12 || t < 1;        /* Fri-Sat */
  else                              open = t >= 12 && t < 21;       /* Sun     */

  const label = open ? 'Open Now — Come on in!' : 'Currently Closed';

  /* Hero badge */
  const heroBadge = document.getElementById('openBadge');
  const heroText  = document.getElementById('openText');
  const heroDot   = heroBadge?.querySelector('.open-dot');

  if (heroText)  heroText.textContent = label;
  if (heroDot)   heroDot.classList.toggle('closed', !open);

  /* Info card badge */
  const icBadge = document.getElementById('icOpenNow');
  const icText  = document.getElementById('icOpenText');
  const icDot   = icBadge?.querySelector('.open-dot');

  if (icText)  icText.textContent = label;
  if (icDot)   icDot.classList.toggle('closed', !open);
}

checkOpenNow();
setInterval(checkOpenNow, 60_000);

/* ===================================================================
   FORM TABS — Accessible tab switching (role="tablist")
   =================================================================== */
const tabs   = document.querySelectorAll('.ftab');
const panels = document.querySelectorAll('.form-panel-body');

tabs.forEach(tab => {
  tab.addEventListener('click', () => activateTab(tab));

  /* Arrow-key navigation within the tablist */
  tab.addEventListener('keydown', e => {
    const all   = [...tabs];
    const idx   = all.indexOf(tab);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      activateTab(all[(idx + 1) % all.length]);
      all[(idx + 1) % all.length].focus();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      activateTab(all[(idx - 1 + all.length) % all.length]);
      all[(idx - 1 + all.length) % all.length].focus();
    }
  });
});

function activateTab(tab) {
  /* Deactivate all */
  tabs.forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', false);
  });
  panels.forEach(p => p.classList.add('hidden'));

  /* Activate clicked */
  tab.classList.add('active');
  tab.setAttribute('aria-selected', true);
  const target = document.getElementById(tab.getAttribute('aria-controls'));
  if (target) target.classList.remove('hidden');
}

/* ===================================================================
   HELPER — Validate a single field, return true if valid
   =================================================================== */
function validateField(input, errId, rule) {
  const errEl = document.getElementById(errId);
  if (!errEl) return true;

  const msg = rule(input.value);
  if (msg) {
    errEl.textContent    = msg;
    input.style.borderColor = 'var(--error)';
    return false;
  }
  errEl.textContent    = '';
  input.style.borderColor = '';
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Attach real-time clearing on input */
function bindLive(form) {
  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input', () => {
      f.style.borderColor = '';
      const errId = f.getAttribute('aria-describedby');
      if (errId) {
        const el = document.getElementById(errId);
        if (el) el.textContent = '';
      }
    });
  });
}

/* ===================================================================
   GENERAL FORM VALIDATION
   =================================================================== */
const generalForm = document.getElementById('generalForm');

if (generalForm) {
  bindLive(generalForm);

  generalForm.addEventListener('submit', e => {
    e.preventDefault();

    /* Honeypot check */
    if (document.getElementById('hpot')?.value) return;

    let ok = true;
    ok = validateField(document.getElementById('gName'),    'gNameErr',    v => !v.trim() ? 'Please enter your name.' : '') && ok;
    ok = validateField(document.getElementById('gEmail'),   'gEmailErr',   v => !EMAIL_RE.test(v) ? 'Please enter a valid email.' : '') && ok;
    ok = validateField(document.getElementById('gSubject'), 'gSubjectErr', v => !v ? 'Please choose a topic.' : '') && ok;
    ok = validateField(document.getElementById('gMessage'), 'gMessageErr', v => v.trim().length < 10 ? 'Message must be at least 10 characters.' : '') && ok;

    if (ok) showSuccess(generalForm, 'generalSuccess');
    else    focusFirstError(generalForm);
  });
}

/* ===================================================================
   EVENT FORM VALIDATION
   =================================================================== */
const eventForm = document.getElementById('eventForm');

if (eventForm) {
  bindLive(eventForm);

  /* Set min date */
  const evDate = document.getElementById('evDate');
  if (evDate) evDate.min = new Date().toISOString().split('T')[0];

  eventForm.addEventListener('submit', e => {
    e.preventDefault();

    let ok = true;
    ok = validateField(document.getElementById('evName'),   'evNameErr',   v => !v.trim() ? 'Please enter a contact name.' : '') && ok;
    ok = validateField(document.getElementById('evEmail'),  'evEmailErr',  v => !EMAIL_RE.test(v) ? 'Please enter a valid email.' : '') && ok;
    ok = validateField(document.getElementById('evType'),   'evTypeErr',   v => !v ? 'Please select an event type.' : '') && ok;
    ok = validateField(document.getElementById('evGuests'), 'evGuestsErr', v => {
      const n = parseInt(v, 10);
      return (!v || isNaN(n) || n < 2 || n > 200) ? 'Enter a guest count between 2 and 200.' : '';
    }) && ok;
    ok = validateField(document.getElementById('evDate'),   'evDateErr',   v => !v ? 'Please select a preferred date.' : '') && ok;

    if (ok) showSuccess(eventForm, 'eventSuccess');
    else    focusFirstError(eventForm);
  });
}

/* ===================================================================
   MEMBERSHIP FORM VALIDATION
   =================================================================== */
const memberForm = document.getElementById('memberForm');

if (memberForm) {
  bindLive(memberForm);

  memberForm.addEventListener('submit', e => {
    e.preventDefault();

    let ok = true;
    ok = validateField(document.getElementById('mbName'),     'mbNameErr',     v => !v.trim() ? 'Please enter your name.' : '') && ok;
    ok = validateField(document.getElementById('mbEmail'),    'mbEmailErr',    v => !EMAIL_RE.test(v) ? 'Please enter a valid email.' : '') && ok;
    ok = validateField(document.getElementById('mbQuestion'), 'mbQuestionErr', v => v.trim().length < 5 ? 'Please enter your question.' : '') && ok;

    if (ok) showSuccess(memberForm, 'memberSuccess');
    else    focusFirstError(memberForm);
  });
}

/* ── Helpers ── */
function showSuccess(form, successId) {
  const el = document.getElementById(successId);
  if (el) {
    el.classList.add('show');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  form.reset();
  setTimeout(() => el && el.classList.remove('show'), 6000);
}

function focusFirstError(form) {
  const first = form.querySelector('[style*="var(--error)"]');
  if (first) first.focus();
}

/* ===================================================================
   FAQ ACCORDION
   =================================================================== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const body     = document.getElementById(btn.getAttribute('aria-controls'));

    /* Close all others */
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', false);
      const bd = document.getElementById(b.getAttribute('aria-controls'));
      if (bd) bd.hidden = true;
    });

    /* Toggle clicked */
    if (!expanded) {
      btn.setAttribute('aria-expanded', true);
      if (body) body.hidden = false;
    }
  });
});

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

    if (EMAIL_RE.test(input.value)) {
      const orig = btn.innerHTML;
      btn.innerHTML        = '<i class="fa fa-check" aria-hidden="true"></i> You\'re in!';
      btn.style.background = 'linear-gradient(135deg,#1a9e3a,#2dd962)';
      btn.style.color      = '#fff';
      input.value          = '';
      setTimeout(() => {
        btn.innerHTML        = orig;
        btn.style.background = '';
        btn.style.color      = '';
      }, 3000);
    } else {
      input.style.borderColor = 'var(--error)';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
    }
  });
}

/* ===================================================================
   CLICK RIPPLE
   =================================================================== */
const ripStyle = document.createElement('style');
ripStyle.textContent = '@keyframes ctRipple { to { width:70px;height:70px;opacity:0; } }';
document.head.appendChild(ripStyle);

document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border-radius:50%;border:2px solid rgba(242,193,78,.5);transform:translate(-50%,-50%);animation:ctRipple .7s ease-out forwards;pointer-events:none;z-index:9997;`;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

/* ===================================================================
   SMOOTH ANCHOR SCROLL with navbar offset
   =================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id     = a.getAttribute('href');
    const target = id === '#' ? null : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (navbar?.offsetHeight ?? 72) - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===================================================================
   INFO CARDS — stagger entrance
   =================================================================== */
document.querySelectorAll('.info-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

/* ===================================================================
   VISIT CARDS — 3D tilt
   =================================================================== */
document.querySelectorAll('.visit-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform  = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform .4s var(--ease),border-color .4s,box-shadow .4s';
  });
});
document.querySelectorAll(".mob-drop-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement;
    parent.classList.toggle("active");
  });
});