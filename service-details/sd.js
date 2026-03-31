/* =====================================================================
   HEART AND WINE — SERVICE DETAILS SHARED JS
   Used by all 6 service-detail pages.
   ===================================================================== */
'use strict';

/* ─── Theme ─────────────────────────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

const savedTheme  = localStorage.getItem('mashaletheme') ||
  (window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  if (themeIcon) themeIcon.className = t === 'dark' ? 'fa fa-moon' : 'fa fa-sun';
  localStorage.setItem('mashaletheme', t);
}
themeToggle?.addEventListener('click', () =>
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);

/* ─── Scroll Progress ────────────────────────────────────────────── */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (scrollProgress) {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    scrollProgress.style.width = Math.min(pct, 100) + '%';
  }
}, { passive: true });

/* ─── Navbar Scroll ──────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () =>
  navbar?.classList.toggle('scrolled', window.scrollY > 40), { passive: true }
);

/* ─── Mobile Menu ────────────────────────────────────────────────── */
const navBurger  = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

navBurger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});
mobileMenu?.querySelectorAll('.mob-link').forEach(l =>
  l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navBurger?.setAttribute('aria-expanded', false);
  })
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    navBurger?.setAttribute('aria-expanded', false);
    navBurger?.focus();
  }
});

/* ─── Reveal on Scroll ───────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 75);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Parallax Hero Background ───────────────────────────────────── */
const heroParallaxBg = document.querySelector('.sd-hero-bg[data-parallax]');
if (heroParallaxBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.35;
    heroParallaxBg.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}

/* ─── Foam Cursor ────────────────────────────────────────────────── */
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
    foamCursor.style.left = cx + 'px';
    foamCursor.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ─── Count Up ───────────────────────────────────────────────────── */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const isK    = target >= 1000;
  const cObs   = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    let start = 0;
    const dur = 1800, step = 1000 / 60;
    const t = setInterval(() => {
      start += step;
      const p = Math.min(start / dur, 1);
      const v = target * p;
      el.textContent = isK ? (v / 1000).toFixed(1) + 'K' + suffix : Math.round(v) + suffix;
      if (start >= dur) {
        el.textContent = isK ? (target / 1000).toFixed(1) + 'K' + suffix : target + suffix;
        clearInterval(t);
      }
    }, step);
    cObs.unobserve(el);
  }, { threshold: 0.5 });
  cObs.observe(el);
});

/* ─── FAQ Accordion ──────────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const body     = document.getElementById(btn.getAttribute('aria-controls'));

    // Close all
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', false);
      const bd = document.getElementById(b.getAttribute('aria-controls'));
      if (bd) bd.hidden = true;
    });

    // Toggle clicked
    if (!expanded) {
      btn.setAttribute('aria-expanded', true);
      if (body) body.hidden = false;
    }
  });
});

/* ─── Pricing card hover tilt ────────────────────────────────────── */
document.querySelectorAll('.pc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform  = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform .4s var(--ease),border-color .4s,box-shadow .4s';
  });
});

/* ─── Gallery lightbox (simple overlay) ─────────────────────────── */
const gallery = document.querySelector('.gallery-grid');
if (gallery) {
  // Build lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image lightbox');
  lb.style.cssText = `
    position:fixed;inset:0;background:rgba(7,4,0,.95);
    display:none;align-items:center;justify-content:center;
    z-index:5000;padding:24px;
  `;
  lb.innerHTML = `
    <button id="lbClose" style="position:absolute;top:24px;right:28px;background:none;border:1px solid rgba(242,193,78,.35);color:var(--gold);width:44px;height:44px;border-radius:50%;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;" aria-label="Close lightbox">✕</button>
    <img id="lbImg" src="" alt="" style="max-width:90vw;max-height:86vh;border-radius:8px;border:1px solid rgba(196,130,30,.3);object-fit:contain;" />
    <p id="lbCaption" style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%);font-family:'DM Sans',sans-serif;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(242,193,78,.7);"></p>
  `;
  document.body.appendChild(lb);

  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');

  gallery.querySelectorAll('.gg-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    const img     = item.querySelector('img');
    const caption = item.querySelector('.gg-caption span');
    const open = () => {
      if (!img) return;
      lbImg.src = img.src.replace('w=300', 'w=1200');
      lbImg.alt = img.alt;
      lbCaption.textContent = caption?.textContent || '';
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      document.getElementById('lbClose')?.focus();
    };
    item.addEventListener('click', open);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });

  const closeLb = () => {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  };
  document.getElementById('lbClose')?.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.style.display !== 'none') closeLb(); });
}

/* ─── Smooth anchor scroll ───────────────────────────────────────── */
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

/* ─── Click Ripple ───────────────────────────────────────────────── */
const rs = document.createElement('style');
rs.textContent = '@keyframes sdRipple{to{width:64px;height:64px;opacity:0}}';
document.head.appendChild(rs);
document.addEventListener('click', e => {
  const d = document.createElement('div');
  d.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border-radius:50%;border:2px solid rgba(242,193,78,.42);transform:translate(-50%,-50%);animation:sdRipple .65s ease-out forwards;pointer-events:none;z-index:9997;`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 700);
});
document.querySelectorAll(".mob-drop-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement;
    parent.classList.toggle("active");
  });
});