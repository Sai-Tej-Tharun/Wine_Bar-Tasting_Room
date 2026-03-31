/* =====================================================================
   HEART AND WINE — ABOUT PAGE JS
   Sections: Theme · Scroll Progress · Navbar · Mobile Menu ·
             Reveal · Count-Up · Parallax · Cursor · Timeline ·
             Smooth Scroll · Click Ripple
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
  themeToggle.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
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
   NAVBAR — Scrolled state
   =================================================================== */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
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

  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navBurger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
    });
  });

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
   REVEAL ON SCROLL — IntersectionObserver staggered fade-in
   =================================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ===================================================================
   COUNT-UP — Hero stats bar + any element with [data-count]
   =================================================================== */
function countUp(el, target, duration = 1800) {
  const step      = 16;
  const increment = target / (duration / step);
  let   current   = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = target >= 1000
      ? Math.floor(current).toLocaleString()
      : Math.floor(current);
  }, step);
}

/* Trigger count-up when the stats bar enters viewport */
const statsBar = document.querySelector('.ah-stats-bar');

if (statsBar) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.ahstat-num[data-count]').forEach(el => {
          countUp(el, parseInt(el.dataset.count, 10));
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  statsObserver.observe(statsBar);
}

/* ===================================================================
   HERO PARALLAX — Subtle depth on the about-hero background
   =================================================================== */
const parallaxBg = document.querySelector('.ah-bg[data-parallax]');

if (parallaxBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.35;
    parallaxBg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

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
   TIMELINE — Stagger reveal for each item as it enters viewport
   =================================================================== */
const tlItems = document.querySelectorAll('.tl-item');

if (tlItems.length) {
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  /* Items are already .reveal, this adds extra border flash on entry */
  tlItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 60}ms`;
    tlObserver.observe(item);
  });
}

/* ===================================================================
   VALUE CARDS — Entrance stagger
   =================================================================== */
document.querySelectorAll('.value-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});

/* ===================================================================
   TEAM CARD — 3D perspective tilt
   =================================================================== */
document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform  = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'none';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform .4s var(--ease), border-color .4s, box-shadow .4s';
  });
});

/* ===================================================================
   AWARD TROPHIES — Pop entrance when section enters viewport
   =================================================================== */
const trophies = document.querySelectorAll('.award-trophy');

if (trophies.length) {
  const trophyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trophies.forEach((t, i) => {
          setTimeout(() => {
            t.style.opacity   = '1';
            t.style.transform = 'translateY(0) scale(1)';
          }, i * 90);
        });
        trophyObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  /* Initial hidden state */
  trophies.forEach(t => {
    t.style.opacity    = '0';
    t.style.transform  = 'translateY(20px) scale(0.95)';
    t.style.transition = 'opacity .5s var(--ease), transform .5s var(--ease)';
  });

  const awardsSection = document.querySelector('.awards');
  if (awardsSection) trophyObserver.observe(awardsSection);
}

/* ===================================================================
   TESTIMONIAL CARDS — Masonry hover lift
   Already handled in CSS but JS adds keyboard focus state
   =================================================================== */
document.querySelectorAll('.tq-card').forEach(card => {
  card.setAttribute('tabindex', '0');
});

/* ===================================================================
   CLICK RIPPLE — Amber ring on every click
   =================================================================== */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes aboutRipple {
    to { width: 70px; height: 70px; opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    width:0; height:0; border-radius:50%;
    border:2px solid rgba(242,193,78,.5);
    transform:translate(-50%,-50%);
    animation:aboutRipple .7s ease-out forwards;
    pointer-events:none; z-index:9997;
  `;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

/* ===================================================================
   SMOOTH ANCHOR SCROLLING with navbar offset
   =================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id     = anchor.getAttribute('href');
    const target = id === '#' ? null : document.querySelector(id);
    if (!target) return;
    e.preventDefault();

    const navH = navbar ? navbar.offsetHeight : 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===================================================================
   STORY IMAGES — Intersection-triggered slide-in
   =================================================================== */
const storyImages = document.querySelector('.story-images');

if (storyImages) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateX(0)';
        imgObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  storyImages.style.opacity   = '0';
  storyImages.style.transform = 'translateX(-30px)';
  storyImages.style.transition = 'opacity .8s var(--ease), transform .8s var(--ease)';
  imgObserver.observe(storyImages);
}

/* ===================================================================
   MOBILE DROPDOWN MENU
   =================================================================== */

const mobDropdowns = document.querySelectorAll('.mob-dropdown');

mobDropdowns.forEach(drop => {

  const btn = drop.querySelector('.mob-drop-toggle');

  if (!btn) return;

  btn.addEventListener('click', () => {

    /* close other dropdowns */
    mobDropdowns.forEach(d => {
      if (d !== drop) d.classList.remove('active');
    });

    /* toggle current */
    drop.classList.toggle('active');

  });

});