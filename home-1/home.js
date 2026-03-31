/* ===== HEART AND WINE — HOME JS ===== */
'use strict';

/* ─── THEME TOGGLE ─── */
const html = document.documentElement;

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const savedTheme  = localStorage.getItem('mashaletheme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  setTheme(savedTheme);

  function setTheme(t) {
    html.setAttribute('data-theme', t);
    if (themeIcon) themeIcon.className = t === 'dark' ? 'fa fa-moon' : 'fa fa-sun';
    localStorage.setItem('mashaletheme', t);
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }
});

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── MOBILE MENU ─── */
const navBurger  = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
navBurger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});

/* ─── MOBILE DROPDOWNS ─── */
document.querySelectorAll('.mob-drop-toggle').forEach(btn => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('active'));
});

/* ─── REVEAL ON SCROLL ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   BACKGROUND CANVAS — wine-coloured rising bubbles
   (also used by cursor, scroll, and form effects)
   ═══════════════════════════════════════════════ */
const canvas = document.getElementById('beerCanvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const BUBBLE_COLORS = [
  'rgba(192,36,60,',
  'rgba(160,20,48,',
  'rgba(220,60,90,',
  'rgba(240,100,120,',
  'rgba(130,8,34,',
];

class Bubble {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x    = Math.random() * W;
    this.y    = init ? Math.random() * H : H + 20;
    this.r    = Math.random() * 6 + 1.5;
    this.speed = Math.random() * 0.55 + 0.15;
    this.drift = (Math.random() - 0.5) * 0.38;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = (Math.random() - 0.5) * 0.04;
    this.opacity = Math.random() * 0.45 + 0.08;
    this.color  = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
  }
  update() {
    this.y -= this.speed;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.4 + this.drift;
    if (this.y < -20) this.reset();
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(
      this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.1,
      this.x, this.y, this.r
    );
    g.addColorStop(0,   this.color + (this.opacity * 1.4) + ')');
    g.addColorStop(0.6, this.color + this.opacity + ')');
    g.addColorStop(1,   this.color + '0)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x - this.r * 0.35, this.y - this.r * 0.35, this.r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.opacity * 0.6})`;
    ctx.fill();
    ctx.restore();
  }
}

class WineWisp {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H * 0.4 : -10;
    this.r  = Math.random() * 4 + 1;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = Math.random() * 0.45 + 0.15;
    this.life  = 1;
    this.decay = Math.random() * 0.003 + 0.001;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    if (this.life <= 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,40,70,${this.life * 0.18})`;
    ctx.fill();
    ctx.restore();
  }
}

const bubbles = [];
const wisps   = [];
for (let i = 0; i < 80; i++) bubbles.push(new Bubble());
for (let i = 0; i < 30; i++) wisps.push(new WineWisp());

function bgLoop() {
  ctx.clearRect(0, 0, W, H);
  bubbles.forEach(b => { b.update(); b.draw(); });
  wisps.forEach(w => { w.update(); w.draw(); });
  requestAnimationFrame(bgLoop);
}
bgLoop();

/* ═══════════════════════════════════════════════
   WINE GLASS SVG + PARTICLE ENGINE
   ═══════════════════════════════════════════════ */
const wineCanvas = document.getElementById('wineParticleCanvas');
const wctx       = wineCanvas.getContext('2d');
const wineSVGEl  = document.getElementById('wineSVG');
const wineFillEl = document.getElementById('wineFill');
const wineMeniscus = document.getElementById('wineMeniscus');
const wineSheen  = document.getElementById('wineSheen');
const svgGlow    = document.getElementById('svgGlow');
const shine1El   = document.getElementById('shine1');
const shine2El   = document.getElementById('shine2');

function resizeWineCanvas() {
  const r = wineCanvas.getBoundingClientRect();
  wineCanvas.width  = r.width;
  wineCanvas.height = r.height;
}
resizeWineCanvas();
window.addEventListener('resize', () => { resizeWineCanvas(); }, { passive: true });

/* Map SVG viewBox (220×480) → particle canvas pixels */
function svgToParticle(sx, sy) {
  const sr = wineSVGEl.getBoundingClientRect();
  const cr = wineCanvas.getBoundingClientRect();
  return {
    x: (sr.left - cr.left) + sx * (sr.width  / 220),
    y: (sr.top  - cr.top)  + sy * (sr.height / 480),
  };
}

/* Bowl clip on particle canvas */
function clipToBowl(ctx2) {
  const pts = [
    [28,20],[8,90],[8,165],[10,220],[44,268],
    [68,292],[110,295],[152,292],[176,268],
    [210,230],[212,165],[214,90],[192,20]
  ];
  ctx2.beginPath();
  const p0 = svgToParticle(pts[0][0], pts[0][1]);
  ctx2.moveTo(p0.x, p0.y);
  for (let i = 1; i < pts.length; i++) {
    const p = svgToParticle(pts[i][0], pts[i][1]);
    ctx2.lineTo(p.x, p.y);
  }
  ctx2.closePath();
}

/* ── SVG FILL POUR ANIMATION ── */
const BOWL_FLOOR = 296;
const FILL_TARGET = 165;
let currentFill = 0;
let fillDone = false;

function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

let fillStartTs = null;
function animateFill(ts) {
  if (!fillStartTs) fillStartTs = ts;
  const t = Math.min((ts - fillStartTs) / 2800, 1);
  currentFill = easeOutQuint(t) * FILL_TARGET;

  const y = BOWL_FLOOR - currentFill;
  wineFillEl.setAttribute('y', y);
  wineFillEl.setAttribute('height', currentFill + 2);

  wineMeniscus.setAttribute('cy', y);
  wineMeniscus.setAttribute('opacity', (t * 0.68).toFixed(3));

  wineSheen.setAttribute('y', y - 5);
  wineSheen.setAttribute('opacity', (t * 0.92).toFixed(3));

  const glowRy = 60 + currentFill * 0.50;
  svgGlow.setAttribute('ry', glowRy.toFixed(1));
  svgGlow.setAttribute('cy', (y + currentFill * 0.45 + 55).toFixed(1));
  svgGlow.setAttribute('fill', `rgba(180,20,50,${(t * 0.14).toFixed(3)})`);

  if (t < 1) requestAnimationFrame(animateFill);
  else { fillDone = true; startSurfaceRipple(); }
}
setTimeout(() => requestAnimationFrame(animateFill), 700);

/* ── SURFACE RIPPLE ── */
let surfPhase = 0;
function startSurfaceRipple() {
  function ripple() {
    const base = BOWL_FLOOR - currentFill;
    wineMeniscus.setAttribute('cy', (base + Math.sin(surfPhase) * 2.4).toFixed(2));
    wineMeniscus.setAttribute('rx', (100 + Math.sin(surfPhase * 0.55) * 2.8).toFixed(2));
    wineSheen.setAttribute('y',     (base + Math.cos(surfPhase * 0.7) * 1.5 - 5).toFixed(2));
    wineSheen.setAttribute('x',     (-30 + Math.sin(surfPhase * 0.4) * 28).toFixed(2));
    surfPhase += 0.026;
    requestAnimationFrame(ripple);
  }
  ripple();
}

/* ── GLASS SHINE BREATHING ── */
let shinePhase = 0;
(function shineLoop() {
  shinePhase += 0.016;
  const a1 = (0.5 + Math.sin(shinePhase)       * 0.5) * 0.72 + 0.28;
  const a2 = (0.5 + Math.cos(shinePhase * 0.7) * 0.5) * 0.32 + 0.10;
  shine1El.setAttribute('stroke', `rgba(255,255,255,${a1.toFixed(2)})`);
  shine2El.setAttribute('stroke', `rgba(255,255,255,${a2.toFixed(2)})`);
  requestAnimationFrame(shineLoop);
})();

/* ── WINE BUBBLES (inside bowl) ── */
class WineBubble {
_bounds() {
    const sr  = wineSVGEl.getBoundingClientRect();
    const cr  = wineCanvas.getBoundingClientRect();
    const scX = sr.width  / 220;
    const scY = sr.height / 480;
    const offX = sr.left - cr.left;
    const offY = sr.top  - cr.top;
    const centerX  = offX + 110 * scX;
    const floorY   = offY + BOWL_FLOOR * scY;
    const surfaceY = floorY - currentFill * scY;
    return { scX, scY, centerX, floorY, surfaceY };
  }
  reset(init) {
    const { scX, centerX, floorY, surfaceY } = this._bounds();

    /* pick a random depth in the wine column */
    const depthFrac = Math.random();
    /* SVG Y of this bubble's spawn point inside the wine */
    const svgBubbleY = BOWL_FLOOR - depthFrac * (currentFill || 60);
    /* bowl half-width: glass goes from ~82px wide at top (svgY~20)
       down to ~30px at the floor (svgY~296).
       Linear interpolation clamped to wine region. */
    const taper = Math.max(0, Math.min(1, (svgBubbleY - 20) / (276)));
    const halfW = (80 - 50 * taper) * scX;

    this.x  = centerX + (Math.random() * 2 - 1) * halfW * 0.75;
    this.y  = init
      ? surfaceY + depthFrac * (floorY - surfaceY) * 0.92
      : floorY - 4;

    this.r    = Math.random() * 4 + 1.5;
    this.speed = Math.random() * 0.8 + 0.3;
    this.drift = (Math.random() - 0.5) * 0.2;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = (Math.random() - 0.5) * 0.045;
    this.opacity = Math.random() * 0.4 + 0.6;

    /* store spawn centerX so drift stays inside glass */
    this._cx  = centerX;
    this._hw  = halfW;
  }
  constructor(init) { this.reset(init); }
  update() {
    const { centerX, floorY, surfaceY } = this._bounds();
    this.y -= this.speed;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.4 + this.drift;

    /* clamp X so bubble never drifts outside glass walls */
    const margin = this.r * 1.2;
    this.x = Math.max(this._cx - this._hw + margin,
               Math.min(this._cx + this._hw - margin, this.x));

    if (this.y < surfaceY - 6) this.reset(false);
  }
draw(ctx2) {
    const r = this.r;
    ctx2.save();

    /* bright outer ring */
    ctx2.beginPath();
    ctx2.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx2.strokeStyle = `rgba(255,255,255,${this.opacity})`;
    ctx2.lineWidth = 1.6;
    ctx2.stroke();

    /* white radial fill — strong centre */
    const g = ctx2.createRadialGradient(
      this.x - r * 0.3, this.y - r * 0.3, 0,
      this.x, this.y, r
    );
    g.addColorStop(0,    `rgba(255,255,255,${this.opacity * 0.95})`);
    g.addColorStop(0.35, `rgba(255,255,255,${this.opacity * 0.55})`);
    g.addColorStop(0.75, `rgba(255,255,255,${this.opacity * 0.15})`);
    g.addColorStop(1,    `rgba(255,255,255,0)`);
    ctx2.beginPath();
    ctx2.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx2.fillStyle = g;
    ctx2.fill();

    /* large bright glint */
    ctx2.beginPath();
    ctx2.arc(this.x - r * 0.36, this.y - r * 0.36, r * 0.32, 0, Math.PI * 2);
    ctx2.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx2.fill();

    /* small secondary glint */
    ctx2.beginPath();
    ctx2.arc(this.x + r * 0.22, this.y - r * 0.48, r * 0.14, 0, Math.PI * 2);
    ctx2.fillStyle = `rgba(255,255,255,0.9)`;
    ctx2.fill();

    ctx2.restore();
  }
}

/* ── SPARKLE MOTES ── */
class Sparkle {
  reset() {
    const p = svgToParticle(
      26 + Math.random() * 168,
      BOWL_FLOOR - 6 - Math.random() * Math.max(currentFill - 8, 1)
    );
    this.x = p.x; this.y = p.y;
    this.r    = Math.random() * 1.8 + 0.3;
    this.life = 1;
    this.decay = Math.random() * 0.020 + 0.007;
    this.hue  = 340 + Math.random() * 32;
  }
  constructor() { this.reset(); }
  update() { this.life -= this.decay; if (this.life <= 0) this.reset(); }
  draw(ctx2) {
    if (!fillDone) return;
    ctx2.save();
    ctx2.globalAlpha = this.life * 0.88;
    ctx2.beginPath();
    ctx2.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx2.fillStyle = `hsla(${this.hue},88%,82%,0.9)`;
    ctx2.fill();
    ctx2.restore();
  }
}

/* ── AROMATIC WISPS (rise above rim) ── */
class GlassWisp {
  constructor() { this.reset(true); }
  reset(init = false) {
    const sr = wineSVGEl.getBoundingClientRect();
    const cr = wineCanvas.getBoundingClientRect();
    this.x = (sr.left - cr.left + sr.width * 0.5) + (Math.random() - 0.5) * sr.width * 0.55;
    this.y = init
      ? (sr.top - cr.top) + (12 / 480) * sr.height - Math.random() * 45
      : (sr.top - cr.top) + (12 / 480) * sr.height + 4;
    this.r  = Math.random() * 4.5 + 1.5;
    this.vx = (Math.random() - 0.5) * 0.62;
    this.vy = -(Math.random() * 0.52 + 0.18);
    this.life  = 0.65 + Math.random() * 0.35;
    this.decay = Math.random() * 0.006 + 0.003;
  }
  update() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.vx += (Math.random() - 0.5) * 0.038;
    this.life -= this.decay;
    if (this.life <= 0) this.reset(false);
  }
  draw() {
    wctx.save();
    wctx.beginPath();
    wctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    wctx.fillStyle = `rgba(200,42,72,${this.life * 0.20})`;
    wctx.fill();
    wctx.restore();
  }
}

/* ── CAUSTIC LIGHT POOL UNDER BASE ── */
let causticPhase = 0;
function drawCaustics() {
  causticPhase += 0.020;
  const bp = svgToParticle(110, 384);
  const sc = wineSVGEl.getBoundingClientRect().width / 220;
  const spots = [
    [-22 * sc, 0,        20 * sc, 5 * sc],
    [ 22 * sc, 2 * sc,   14 * sc, 4 * sc],
    [  0,      4 * sc,   26 * sc, 7 * sc],
  ];
  wctx.save();
  wctx.globalAlpha = 0.11 + Math.sin(causticPhase) * 0.045;
  spots.forEach(([ox, oy, rx, ry]) => {
    if (rx <= 0) return;
    const g = wctx.createRadialGradient(bp.x + ox, bp.y + oy, 0, bp.x + ox, bp.y + oy, rx);
    g.addColorStop(0, 'rgba(210,50,80,0.55)');
    g.addColorStop(1, 'rgba(210,50,80,0)');
    wctx.save();
    wctx.scale(1, ry / rx);
    wctx.beginPath();
    wctx.arc(bp.x + ox, (bp.y + oy) * (rx / ry), rx, 0, Math.PI * 2);
    wctx.fillStyle = g;
    wctx.fill();
    wctx.restore();
  });
  wctx.restore();
}

/* ── INIT GLASS PARTICLES ── */
const wineBubbles = Array.from({ length: 70 }, (_, i) => new WineBubble(i % 2 === 0));
const sparkles    = Array.from({ length: 28 }, () => new Sparkle());
const glassWisps  = Array.from({ length: 24 }, () => new GlassWisp(true));

/* ── WINE GLASS CANVAS LOOP ── */
function wineLoop() {
  wctx.clearRect(0, 0, wineCanvas.width, wineCanvas.height);
  glassWisps.forEach(w => { w.update(); w.draw(); });
  drawCaustics();
  if (currentFill > 5) {
    wineBubbles.forEach(b => { b.update(); b.draw(wctx); });
    sparkles.forEach(s => { s.update(); s.draw(wctx); });
  }
  requestAnimationFrame(wineLoop);
}
wineLoop();

/* ═══════════════════════════════════════════════
   FOAM CURSOR
   ═══════════════════════════════════════════════ */
const foamCursor = document.getElementById('foamCursor');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  foamCursor.style.opacity = '1';
  if (Math.random() < 0.15) {
    const b = new Bubble();
    b.x = mouseX + (Math.random() - 0.5) * 30;
    b.y = mouseY;
    b.speed = Math.random() * 1.5 + 0.5;
    b.r = Math.random() * 5 + 2;
    bubbles.push(b);
    if (bubbles.length > 120) bubbles.shift();
  }
});
document.addEventListener('mouseleave', () => { foamCursor.style.opacity = '0'; });

(function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  foamCursor.style.left = cursorX + 'px';
  foamCursor.style.top  = cursorY + 'px';
  requestAnimationFrame(animateCursor);
})();

/* ─── COUNT-UP STATS ─── */
function countUp(el, target) {
  let start = 0;
  const step = 16;
  const increment = target / (1800 / step);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = target >= 1000 ? Math.floor(start).toLocaleString() : Math.floor(start);
  }, step);
}
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => countUp(el, parseInt(el.dataset.count)));
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statObserver.observe(statsEl);

/* ─── METER BAR ANIMATE ─── */
const meterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.meter-fill').forEach(bar => {
        const target = bar.style.getPropertyValue('--fill');
        bar.style.setProperty('--fill', '0%');
        setTimeout(() => bar.style.setProperty('--fill', target), 200);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.brew-card').forEach(c => meterObserver.observe(c));

/* ─── TESTIMONIAL SLIDER ─── */
const track  = document.getElementById('testTrack');
const dotsEl = document.getElementById('testDots');
const cards  = track ? [...track.querySelectorAll('.test-card')] : [];
let currentDot = 0;

if (cards.length && dotsEl) {
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'test-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Testimonial ${i + 1}`);
    d.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(d);
  });
  function goToSlide(i) {
    currentDot = i;
    dotsEl.querySelectorAll('.test-dot').forEach((d, j) => d.classList.toggle('active', j === i));
    const cardW = cards[0].offsetWidth + 24;
    track.style.transform  = `translateX(-${i * cardW}px)`;
    track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  }
  setInterval(() => goToSlide((currentDot + 1) % Math.max(1, cards.length - 2)), 5000);
}

/* ─── BOOKING FORM ─── */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('bookName');
    const nameErr = document.getElementById('bookNameError');
    if (!name.value.trim()) {
      nameErr.textContent = 'Please enter your name.';
      name.style.borderColor = '#e84040'; valid = false;
    } else { nameErr.textContent = ''; name.style.borderColor = ''; }

    const email    = document.getElementById('bookEmail');
    const emailErr = document.getElementById('bookEmailError');
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      emailErr.textContent = 'Please enter a valid email address.';
      email.style.borderColor = '#e84040'; valid = false;
    } else { emailErr.textContent = ''; email.style.borderColor = ''; }

    const date    = document.getElementById('bookDate');
    const dateErr = document.getElementById('bookDateError');
    if (!date.value) {
      dateErr.textContent = 'Please select a date.';
      date.style.borderColor = '#e84040'; valid = false;
    } else { dateErr.textContent = ''; date.style.borderColor = ''; }

    if (valid) {
      document.getElementById('formSuccess').classList.add('show');
      bookingForm.reset();
      for (let i = 0; i < 20; i++) {
        const b = new Bubble();
        b.x = W / 2 + (Math.random() - 0.5) * 200;
        b.y = H / 2;
        b.speed = Math.random() * 3 + 1;
        b.r = Math.random() * 10 + 4;
        bubbles.push(b);
      }
    }
  });
}

/* ─── NEWSLETTER FORM ─── */
const nlForm = document.getElementById('nlForm');
if (nlForm) {
  nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('nlEmail');
    const btn   = nlForm.querySelector('button');
    if (input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      btn.textContent = "✓ You're in!";
      btn.style.background = 'linear-gradient(135deg,#1a9e3a,#2dd962)';
      btn.style.color = '#fff';
      input.value = '';
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; btn.style.color = ''; }, 3000);
    }
  });
}

/* ─── POUR EFFECT ON SCROLL ─── */
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const delta = Math.abs(window.scrollY - lastScroll);
  if (delta > 30 && Math.random() < 0.4) {
    const b = new Bubble();
    b.x = Math.random() * W;
    b.y = H + 10;
    b.speed = Math.random() * 2 + 1;
    bubbles.push(b);
    if (bubbles.length > 130) bubbles.shift();
  }
  lastScroll = window.scrollY;
}, { passive: true });

/* ─── BREW CARD TILT ─── */
document.querySelectorAll('.brew-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform  = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s, border-color 0.4s';
  });
});

/* ─── CLICK RIPPLE ─── */
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border-radius:50%;border:2px solid rgba(242,193,78,0.6);transform:translate(-50%,-50%);animation:beerRipple .8s ease-out forwards;pointer-events:none;z-index:9998;`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);
});
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes beerRipple{to{width:80px;height:80px;opacity:0}}';
document.head.appendChild(rippleStyle);