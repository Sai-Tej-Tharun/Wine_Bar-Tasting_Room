/* =====================================================================
   HEART AND WINE — BLOG DETAIL SHARED JS  (bd.js)
   Used by all 6 blog-detail pages.
   ===================================================================== */
'use strict';

/* ─── Theme ─────────────────────────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const saved = localStorage.getItem('mashaletheme') ||
  (window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
applyTheme(saved);
function applyTheme(t) {
  html.setAttribute('data-theme', t);
  if (themeIcon) themeIcon.className = t === 'dark' ? 'fa fa-moon' : 'fa fa-sun';
  localStorage.setItem('mashaletheme', t);
}
themeToggle?.addEventListener('click', () =>
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);

/* ─── Scroll progress bar ────────────────────────────────────────── */
const scrollProgress = document.getElementById('scrollProgress');
function updateProgress() {
  if (!scrollProgress) return;
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = max > 0 ? Math.min(window.scrollY / max * 100, 100) : 0;
  scrollProgress.style.width = pct + '%';

  // Reading progress in sidebar pill
  const fill = document.querySelector('.rp-fill');
  const pct2 = document.querySelector('.rp-pct');
  if (fill) fill.style.width = pct + '%';
  if (pct2) pct2.textContent = Math.round(pct) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ─── Navbar scroll ──────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () =>
  navbar?.classList.toggle('scrolled', window.scrollY > 40), { passive: true }
);

/* ─── Mobile menu ────────────────────────────────────────────────── */
const navBurger  = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
navBurger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', open);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    navBurger?.setAttribute('aria-expanded', false);
    navBurger?.focus();
  }
});

/* ─── Reveal on scroll ───────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Parallax hero background ───────────────────────────────────── */
const heroBg = document.querySelector('.ah-bg[data-parallax]');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
}

/* ─── Foam cursor ────────────────────────────────────────────────── */
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

/* ─── Table of contents — active highlight ───────────────────────── */
const tocLinks = document.querySelectorAll('.toc-link[href^="#"]');
if (tocLinks.length) {
  const headings = Array.from(tocLinks).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const tocObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const link = document.querySelector(`.toc-link[href="#${e.target.id}"]`);
      if (link) link.classList.toggle('active', e.isIntersecting);
    });
  }, { rootMargin: '-72px 0px -60% 0px' });
  headings.forEach(h => tocObs.observe(h));
}

/* ─── Smooth anchor scroll (accounts for fixed navbar) ──────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (navbar?.offsetHeight ?? 72) - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Share buttons ──────────────────────────────────────────────── */
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const platform = btn.dataset.platform;
    const url   = encodeURIComponent(location.href);
    const title = encodeURIComponent(document.title);
    const urls  = {
      twitter:  `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      copy:     null,
    };
    if (platform === 'copy') {
      navigator.clipboard?.writeText(location.href).then(() => {
        const icon = btn.querySelector('i');
        const prev = icon.className;
        icon.className = 'fa fa-check';
        btn.style.color = 'var(--gold)';
        setTimeout(() => { icon.className = prev; btn.style.color = ''; }, 2000);
      });
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  });
});

/* ─── Estimated reading time ──────────────────────────────────────── */
const artContent = document.querySelector('.art-content');
const readTimeEl = document.getElementById('readTime');
if (artContent && readTimeEl) {
  const words = artContent.innerText.split(/\s+/).length;
  readTimeEl.textContent = Math.max(1, Math.round(words / 200)) + ' min read';
}

/* ─── Click ripple ───────────────────────────────────────────────── */
const rs = document.createElement('style');
rs.textContent = '@keyframes bdRipple{to{width:64px;height:64px;opacity:0}}';
document.head.appendChild(rs);
document.addEventListener('click', e => {
  const d = document.createElement('div');
  d.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border-radius:50%;border:2px solid rgba(242,193,78,.38);transform:translate(-50%,-50%);animation:bdRipple .65s ease-out forwards;pointer-events:none;z-index:9997;`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 700);
});
document.querySelectorAll(".mob-drop-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement;
    parent.classList.toggle("active");
  });
});

