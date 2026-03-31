/* ==========================================================
   HEART AND WINE — navbar.js
   Drop ONE script tag anywhere in <body> on every page:

     <script src="../global-js/navbar.js"></script>

   That's it. The script:
     ✓ Injects all CSS into <head>
     ✓ Injects the full navbar HTML before the first <body> child
     ✓ Auto-resolves all links relative to the current page depth
     ✓ Auto-highlights the active link by matching the current URL
     ✓ Wires up all interactivity (dropdowns, burger, theme, scroll)
========================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. RESOLVE BASE PATH
     Count how many folders deep the current page is, then
     build the correct number of "../" jumps to reach root.

       /index.html                       depth 0  →  "./"
       /blogs/blogs.html                 depth 1  →  "../"
       /blog-details/barrel-aging.html   depth 1  →  "../"
       /admin/panel/index.html           depth 2  →  "../../"
  ---------------------------------------------------------- */
  const segments = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const depth    = (segments.length && segments.at(-1).includes('.'))
                   ? segments.length - 1
                   : segments.length;
  const base     = depth === 0 ? './' : '../'.repeat(depth);
  const url      = path => base + path;   // resolve any root-relative path

  /* ----------------------------------------------------------
     2. INJECT CSS
  ---------------------------------------------------------- */
  const css = document.createElement('style');
  css.id = 'navbar-css';
  css.textContent = `
/* body offset */
body{padding-top:72px}

/* progress bar */
#nb-bar{
  position:fixed;top:0;left:0;width:0;height:3px;
  background:linear-gradient(135deg,#D4A030,#F2C14E,#D4A030);
  z-index:9999;border-radius:0 2px 2px 0;pointer-events:none;
  transition:width .1s linear;
}

/* shell */
#nb{
  position:fixed;top:0;left:0;right:0;z-index:500;
  transition:background .4s,box-shadow .4s,border-color .4s;
}
#nb.nb-scrolled{
  background:rgba(12,8,0,.96);
  backdrop-filter:blur(20px) saturate(1.4);
  -webkit-backdrop-filter:blur(20px) saturate(1.4);
  box-shadow:0 8px 48px rgba(0,0,0,.72),0 2px 16px rgba(0,0,0,.5);
  border-bottom:1px solid rgba(196,130,30,.22);
}
[data-theme=light] #nb.nb-scrolled{
  background:rgba(255,248,231,.96);
  box-shadow:0 8px 48px rgba(0,0,0,.14),0 2px 16px rgba(0,0,0,.08);
}

/* container */
.nb-wrap{
  max-width:1340px;margin:0 auto;padding:0 32px;
  height:72px;display:flex;align-items:center;
}

/* logo */
.nb-logo{display:flex;align-items:center;gap:10px;flex-shrink:0;margin-right:auto;text-decoration:none}
.nb-logo-icon{
  width:36px;height:36px;border-radius:8px;
  background:linear-gradient(135deg,#D4A030,#F2C14E,#D4A030);
  display:flex;align-items:center;justify-content:center;
  font-size:1.1rem;box-shadow:0 2px 12px rgba(212,160,48,.35);
  transition:transform .3s,box-shadow .3s;flex-shrink:0;
}
.nb-logo:hover .nb-logo-icon{transform:rotate(-8deg) scale(1.08);box-shadow:0 4px 20px rgba(242,193,78,.5)}
.nb-logo-text{font-family:'Bebas Neue',sans-serif;font-size:1.45rem;letter-spacing:.08em;color:var(--txt,#FFF8E7)}
.nb-logo-text em{color:#F2C14E;font-style:normal}

/* desktop links row */
.nb-links{display:flex;align-items:center;gap:2px;margin-right:16px}

/* nav item wrapper */
.nb-item{position:relative}

/* base link */
.nb-link{
  display:flex;align-items:center;gap:5px;
  font-family:'DM Sans',sans-serif;font-size:.86rem;font-weight:500;
  color:var(--txt2,#CFA96E);padding:8px 13px;border-radius:6px;
  white-space:nowrap;text-decoration:none;cursor:pointer;
  transition:color .25s,background .25s;position:relative;
}
.nb-link::after{
  content:'';position:absolute;bottom:4px;left:13px;right:13px;
  height:1.5px;background:#F2C14E;border-radius:999px;
  transform:scaleX(0);transition:transform .3s;
}
.nb-link:hover,.nb-link.nb-active{color:var(--txt,#FFF8E7)}
.nb-link:hover::after,.nb-link.nb-active::after{transform:scaleX(1)}

/* chevron */
.nb-chev{font-size:.6rem;opacity:.6;flex-shrink:0;transition:transform .3s,opacity .3s}
.nb-item.nb-open .nb-chev{transform:rotate(180deg);opacity:1}

/* cta */
.nb-cta{
  background:linear-gradient(135deg,#D4A030,#F2C14E,#D4A030)!important;
  color:#0c0800!important;font-weight:700;padding:8px 20px;border-radius:6px;
  box-shadow:0 2px 14px rgba(212,160,48,.3);
}
.nb-cta::after{display:none}
.nb-cta:hover{transform:translateY(-1px);box-shadow:0 5px 22px rgba(242,193,78,.45)!important}

/* login */
.nb-login{border:1px solid rgba(196,130,30,.22);padding:7px 14px;border-radius:6px;gap:7px}
.nb-login::after{display:none}
.nb-login:hover{border-color:rgba(242,193,78,.42);color:#F2C14E!important}

/* ----------------------------------------------------------
   DROPDOWN
   • top:100%      → flush under trigger, no pixel gap
   • padding-top   → invisible hover bridge so cursor never
                     leaves a hittable surface going downward
   • JS adds .nb-open to the .nb-item to show the panel
---------------------------------------------------------- */
.nb-drop{
  position:absolute;top:100%;left:50%;
  transform:translateX(-50%);
  padding-top:10px;          /* hover bridge — do NOT remove */
  min-width:220px;
  opacity:0;pointer-events:none;
  transition:opacity .22s;z-index:600;background:transparent;
}
.nb-item.nb-open .nb-drop{opacity:1;pointer-events:auto}

/* alignment variants */
.nb-drop.left {left:0;transform:none}
.nb-drop.left  .nb-drop-inner::before{left:28px}
.nb-drop.right{left:auto;right:0;transform:none}
.nb-drop.right .nb-drop-inner::before{left:auto;right:28px}

/* visible card */
.nb-drop-inner{
  background:rgba(22,14,2,.97);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(196,130,30,.22);border-radius:12px;
  box-shadow:0 8px 48px rgba(0,0,0,.72),0 2px 16px rgba(0,0,0,.5);
  overflow:hidden;position:relative;
  transform:translateY(6px);transition:transform .22s;
}
[data-theme=light] .nb-drop-inner{background:rgba(253,243,216,.97)}
.nb-item.nb-open .nb-drop-inner{transform:translateY(0)}

/* arrow tip */
.nb-drop-inner::before{
  content:'';position:absolute;top:-6px;left:50%;
  transform:translateX(-50%);width:12px;height:12px;
  background:rgba(22,14,2,.97);
  border-left:1px solid rgba(196,130,30,.22);
  border-top:1px solid rgba(196,130,30,.22);
  rotate:45deg;border-radius:2px 0 0 0;
}
[data-theme=light] .nb-drop-inner::before{background:rgba(253,243,216,.97)}

/* dropdown label */
.nb-dd-label{
  font-family:'DM Sans',sans-serif;font-size:.62rem;font-weight:700;
  letter-spacing:.18em;text-transform:uppercase;color:var(--txt3,#8A6A3A);
  padding:14px 16px 8px;border-bottom:1px solid rgba(196,130,30,.22);margin-bottom:4px;
}

/* "view all" link */
.nb-dd-main{
  display:flex;align-items:center;justify-content:space-between;
  padding:12px 16px 10px;font-family:'DM Sans',sans-serif;
  font-size:.82rem;font-weight:700;color:#F2C14E;letter-spacing:.04em;
  border-bottom:1px solid rgba(196,130,30,.22);margin-bottom:4px;
  text-decoration:none;transition:color .2s,background .2s;
}
.nb-dd-main:hover{background:rgba(242,193,78,.06);color:#FFD970}
.nb-dd-main i{font-size:.7rem;transition:transform .25s}
.nb-dd-main:hover i{transform:translateX(4px)}

/* dropdown item */
.nb-dd-item{
  display:flex;align-items:center;gap:10px;padding:10px 16px;
  font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;
  color:var(--txt2,#CFA96E);text-decoration:none;
  transition:color .2s,background .2s,padding-left .2s;
}
.nb-dd-item:last-child{margin-bottom:4px}
.nb-dd-item:hover{color:#F2C14E;background:rgba(242,193,78,.06);padding-left:20px}

.nb-dd-icon{
  width:28px;height:28px;background:rgba(242,193,78,.07);
  border:1px solid rgba(196,130,30,.22);border-radius:6px;
  display:flex;align-items:center;justify-content:center;
  font-size:.72rem;color:#D4A030;flex-shrink:0;
  transition:background .2s,border-color .2s;
}
.nb-dd-item:hover .nb-dd-icon{background:rgba(242,193,78,.14);border-color:rgba(242,193,78,.42)}

.nb-dd-text{display:flex;flex-direction:column;gap:1px;flex:1}
.nb-dd-name{color:var(--txt,#FFF8E7);font-weight:600;font-size:.83rem;line-height:1.2}
.nb-dd-item:hover .nb-dd-name{color:#FFD970}
.nb-dd-sub{font-size:.72rem;color:var(--txt3,#8A6A3A);font-weight:400;line-height:1.2}

/* actions */
.nb-actions{display:flex;align-items:center;gap:10px;flex-shrink:0}

.nb-theme{
  width:38px;height:38px;background:none;
  border:1px solid rgba(196,130,30,.22);border-radius:50%;
  color:var(--txt2,#CFA96E);font-size:.88rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:border-color .3s,color .3s,transform .3s;
}
.nb-theme:hover{border-color:#F2C14E;color:#F2C14E;transform:rotate(20deg)}

/* hamburger */
.nb-burger{
  display:none;flex-direction:column;justify-content:center;align-items:center;
  width:42px;height:42px;background:none;
  border:1px solid rgba(196,130,30,.22);border-radius:8px;
  padding:10px;cursor:pointer;position:relative;transition:border-color .3s;
}
.nb-burger:hover{border-color:#F2C14E}
.nb-burger span{
  display:block;width:20px;height:2px;background:var(--txt2,#CFA96E);
  border-radius:2px;position:absolute;
  transition:transform .35s,opacity .3s,top .35s,background .3s;
}
.nb-burger span:nth-child(1){top:13px}
.nb-burger span:nth-child(2){top:20px}
.nb-burger span:nth-child(3){top:27px}
.nb-burger.open span{background:#F2C14E}
.nb-burger.open span:nth-child(1){top:20px;transform:rotate(45deg)}
.nb-burger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.nb-burger.open span:nth-child(3){top:20px;transform:rotate(-45deg)}

/* mobile menu */
.nb-mobile{
  display:none;flex-direction:column;
  background:rgba(12,8,0,.99);
  border-top:1px solid rgba(196,130,30,.22);
  max-height:0;overflow:hidden;overflow-y:auto;
  transition:max-height .45s;
}
[data-theme=light] .nb-mobile{background:rgba(255,248,231,.99)}
.nb-mobile.open{max-height:100dvh}

/* flat mobile link */
.nb-mob-link{
  font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:500;
  color:var(--txt2,#CFA96E);padding:14px 28px;
  border-bottom:1px solid rgba(196,130,30,.22);
  display:flex;align-items:center;text-decoration:none;
  transition:color .25s,background .25s,padding-left .25s;
}
.nb-mob-link:hover{color:#F2C14E;background:rgba(242,193,78,.04);padding-left:36px}
.nb-mob-link.cta{
  color:#0c0800!important;font-weight:700;
  background:linear-gradient(135deg,#D4A030,#F2C14E,#D4A030);
  margin:12px 20px;border-radius:8px;border-bottom:none;justify-content:center;
}
.nb-mob-link.cta:hover{padding-left:28px}
.nb-mob-link.login{color:#F2C14E;font-weight:600;gap:8px}

/* mobile accordion toggle */
.nb-mob-toggle{
  display:flex;align-items:center;justify-content:space-between;
  width:100%;background:none;border:none;
  border-bottom:1px solid rgba(196,130,30,.22);
  padding:14px 28px;font-family:'DM Sans',sans-serif;
  font-size:1rem;font-weight:500;color:var(--txt2,#CFA96E);
  text-align:left;cursor:pointer;transition:color .25s,background .25s;
}
.nb-mob-toggle:hover,.nb-mob-toggle.open{color:#F2C14E;background:rgba(242,193,78,.04)}
.nb-mob-chev{font-size:.72rem;opacity:.7;transition:transform .35s}
.nb-mob-toggle.open .nb-mob-chev{transform:rotate(180deg);opacity:1}

/* mobile accordion panel */
.nb-mob-panel{
  overflow:hidden;max-height:0;
  transition:max-height .4s;background:rgba(255,255,255,.02);
}
[data-theme=light] .nb-mob-panel{background:rgba(0,0,0,.02)}
.nb-mob-panel.open{max-height:700px}

/* "all" link inside panel */
.nb-mob-all{
  display:flex;align-items:center;gap:10px;
  padding:12px 28px 10px 40px;
  font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:700;
  color:#F2C14E;border-bottom:1px solid rgba(196,130,30,.22);
  text-decoration:none;transition:color .2s,background .2s;
}
.nb-mob-all:hover{background:rgba(242,193,78,.06);color:#FFD970}

/* mobile sub item */
.nb-mob-sub{
  display:flex;align-items:center;gap:12px;
  padding:11px 28px 11px 40px;
  font-family:'DM Sans',sans-serif;font-size:.86rem;font-weight:500;
  color:var(--txt2,#CFA96E);border-bottom:1px solid rgba(196,130,30,.1);
  text-decoration:none;transition:color .2s,background .2s,padding-left .2s;
}
.nb-mob-sub:last-child{border-bottom:none}
.nb-mob-sub:hover{color:#F2C14E;background:rgba(242,193,78,.05);padding-left:48px}
.nb-mob-icon{
  width:26px;height:26px;background:rgba(242,193,78,.07);
  border:1px solid rgba(196,130,30,.22);border-radius:5px;
  display:flex;align-items:center;justify-content:center;
  font-size:.68rem;color:#D4A030;flex-shrink:0;
  transition:background .2s,border-color .2s;
}
.nb-mob-sub:hover .nb-mob-icon{background:rgba(242,193,78,.14);border-color:rgba(242,193,78,.42)}

.nb-mob-footer{padding:16px 20px 24px;border-top:1px solid rgba(196,130,30,.22)}

/* responsive */
@media(max-width:900px){
  .nb-links{display:none}
  .nb-burger{display:flex}
  .nb-mobile{display:flex}
}
@media(max-width:480px){
  .nb-wrap{padding:0 20px}
  .nb-logo-text{font-size:1.3rem}
}
`;
  document.head.insertBefore(css, document.head.firstChild);

  /* ----------------------------------------------------------
     3. BUILD & INJECT HTML
     Every anchor that should be checked for active state gets
     data-nb-link so the highlighter can find them efficiently.
  ---------------------------------------------------------- */
  const u = url; // alias

  const template = `
<div id="nb-bar"></div>
<header id="nb" role="banner">
  <div class="nb-wrap">

    <a href="${u('home-1/home.html')}" class="nb-logo" data-nb-link>
      <div class="nb-logo-icon">🍺</div>
      <span class="nb-logo-text">MASH <em>&amp;</em> ALE</span>
    </a>

    <nav class="nb-links" role="navigation" aria-label="Main navigation">

      <!-- HOME -->
      <div class="nb-item">
        <a href="${u('home-1/home.html')}" class="nb-link" data-nb-link aria-haspopup="true" aria-expanded="false">
          Home <i class="fa fa-chevron-down nb-chev"></i>
        </a>
        <div class="nb-drop" role="menu">
          <div class="nb-drop-inner">
            <div class="nb-dd-label">Choose a homepage</div>
            <a href="${u('home-1/home.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-beer-mug-empty"></i></div>
              <div class="nb-dd-text">
                <span class="nb-dd-name">Craft &amp; Taproom</span>
                <span class="nb-dd-sub">Main homepage — brewery &amp; taproom</span>
              </div>
            </a>
            <a href="${u('home-2/home.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-whiskey-glass"></i></div>
              <div class="nb-dd-text">
                <span class="nb-dd-name">Reserve &amp; Distillery</span>
                <span class="nb-dd-sub">Barrel-aged spirits &amp; reserve editions</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- SERVICES -->
      <div class="nb-item">
        <a href="${u('services/services.html')}" class="nb-link" data-nb-link aria-haspopup="true" aria-expanded="false">
          Services <i class="fa fa-chevron-down nb-chev"></i>
        </a>
        <div class="nb-drop left" role="menu" style="min-width:260px">
          <div class="nb-drop-inner">
            <a href="${u('services/services.html')}" class="nb-dd-main" data-nb-link role="menuitem">All Services <i class="fa fa-arrow-right"></i></a>
            <a href="${u('service-details/taproom-tours.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-route"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Taproom &amp; Cellar Tours</span><span class="nb-dd-sub">Behind-the-scenes brewery access</span></div>
            </a>
            <a href="${u('service-details/private-events.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-champagne-glasses"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Private Events &amp; Hire</span><span class="nb-dd-sub">Exclusive venue for any occasion</span></div>
            </a>
            <a href="${u('service-details/beer-club.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-id-card"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Beer Club Membership</span><span class="nb-dd-sub">Monthly allocations &amp; perks</span></div>
            </a>
            <a href="${u('service-details/custom-brewing.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-flask"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Custom Batch Brewing</span><span class="nb-dd-sub">Your recipe, our brewhouse</span></div>
            </a>
            <a href="${u('service-details/wholesale.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-truck"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Wholesale &amp; Distribution</span><span class="nb-dd-sub">Trade accounts &amp; keg supply</span></div>
            </a>
            <a href="${u('service-details/tasting-masterclasses.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-graduation-cap"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Tasting Masterclasses</span><span class="nb-dd-sub">Beer education &amp; sensory sessions</span></div>
            </a>
          </div>
        </div>
      </div>

      <!-- BLOG -->
      <div class="nb-item">
        <a href="${u('blogs/blogs.html')}" class="nb-link" data-nb-link aria-haspopup="true" aria-expanded="false">
          Blog <i class="fa fa-chevron-down nb-chev"></i>
        </a>
        <div class="nb-drop right" role="menu" style="min-width:270px">
          <div class="nb-drop-inner">
            <a href="${u('blogs/blogs.html')}" class="nb-dd-main" data-nb-link role="menuitem">The Journal <i class="fa fa-arrow-right"></i></a>
            <a href="${u('blog-details/flagship-ipa.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-beer-mug-empty"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Our Flagship IPA Story</span><span class="nb-dd-sub">3 years · 14 batches</span></div>
            </a>
            <a href="${u('blog-details/barrel-aging.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-wine-bottle"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Barrel Aging 101</span><span class="nb-dd-sub">Oak, time &amp; transformation</span></div>
            </a>
            <a href="${u('blog-details/hop-varieties.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-leaf"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Hop Varieties Guide</span><span class="nb-dd-sub">Citra, Mosaic, Saaz &amp; more</span></div>
            </a>
            <a href="${u('blog-details/food-pairing.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-utensils"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Beer &amp; Food Pairing</span><span class="nb-dd-sub">Contrast, complement, cut</span></div>
            </a>
            <a href="${u('blog-details/water-chemistry.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-flask"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">Water Chemistry</span><span class="nb-dd-sub">The invisible ingredient</span></div>
            </a>
            <a href="${u('blog-details/beer-calendar-2025.html')}" class="nb-dd-item" data-nb-link role="menuitem">
              <div class="nb-dd-icon"><i class="fa fa-calendar-days"></i></div>
              <div class="nb-dd-text"><span class="nb-dd-name">2025 Release Calendar</span><span class="nb-dd-sub">14 beers, all revealed</span></div>
            </a>
          </div>
        </div>
      </div>

      <a href="${u('about/about.html')}"            class="nb-link" data-nb-link>About</a>
      <a href="${u('contact/contact.html')}"         class="nb-link" data-nb-link>Contact</a>
      <a href="${u('home-1/home.html')}#book"        class="nb-link nb-cta">Book Now</a>
      <a href="${u('login/login.html')}"          class="nb-link nb-login" data-nb-link>
        <i class="fa fa-user"></i> Login
      </a>
    </nav>

    <div class="nb-actions">
      <button class="nb-theme" id="nb-theme-btn" aria-label="Toggle theme">
        <i class="fa fa-moon" id="nb-theme-icon"></i>
      </button>
      <button class="nb-burger" id="nb-burger" aria-label="Toggle menu"
              aria-expanded="false" aria-controls="nb-mobile">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <!-- MOBILE MENU -->
  <div class="nb-mobile" id="nb-mobile" aria-hidden="true">

    <button class="nb-mob-toggle" data-panel="nb-p-home" aria-expanded="false">
      <span>Home</span><i class="fa fa-chevron-down nb-mob-chev"></i>
    </button>
    <div class="nb-mob-panel" id="nb-p-home">
      <a href="${u('home-1/home.html')}" class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-beer-mug-empty"></i></div>Craft &amp; Taproom</a>
      <a href="${u('home-2/home.html')}" class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-whiskey-glass"></i></div>Reserve &amp; Distillery</a>
    </div>

    <button class="nb-mob-toggle" data-panel="nb-p-serv" aria-expanded="false">
      <span>Services</span><i class="fa fa-chevron-down nb-mob-chev"></i>
    </button>
    <div class="nb-mob-panel" id="nb-p-serv">
      <a href="${u('services/services.html')}" class="nb-mob-all" data-nb-link><i class="fa fa-arrow-right"></i>All Services</a>
      <a href="${u('service-details/taproom-tours.html')}"       class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-route"></i></div>Taproom &amp; Cellar Tours</a>
      <a href="${u('service-details/private-events.html')}"      class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-champagne-glasses"></i></div>Private Events &amp; Hire</a>
      <a href="${u('service-details/beer-club.html')}"           class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-id-card"></i></div>Beer Club Membership</a>
      <a href="${u('service-details/custom-brewing.html')}"      class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-flask"></i></div>Custom Batch Brewing</a>
      <a href="${u('service-details/wholesale.html')}"           class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-truck"></i></div>Wholesale &amp; Distribution</a>
      <a href="${u('service-details/tasting-masterclasses.html')}" class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-graduation-cap"></i></div>Tasting Masterclasses</a>
    </div>

    <button class="nb-mob-toggle" data-panel="nb-p-blog" aria-expanded="false">
      <span>Blog</span><i class="fa fa-chevron-down nb-mob-chev"></i>
    </button>
    <div class="nb-mob-panel" id="nb-p-blog">
      <a href="${u('blogs/blogs.html')}" class="nb-mob-all" data-nb-link><i class="fa fa-arrow-right"></i>The Journal — All Posts</a>
      <a href="${u('blog-details/flagship-ipa.html')}"       class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-beer-mug-empty"></i></div>Flagship IPA Story</a>
      <a href="${u('blog-details/barrel-aging.html')}"       class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-wine-bottle"></i></div>Barrel Aging 101</a>
      <a href="${u('blog-details/hop-varieties.html')}"      class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-leaf"></i></div>Hop Varieties Guide</a>
      <a href="${u('blog-details/food-pairing.html')}"       class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-utensils"></i></div>Beer &amp; Food Pairing</a>
      <a href="${u('blog-details/water-chemistry.html')}"    class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-flask"></i></div>Water Chemistry</a>
      <a href="${u('blog-details/beer-calendar-2025.html')}" class="nb-mob-sub" data-nb-link><div class="nb-mob-icon"><i class="fa fa-calendar-days"></i></div>2025 Release Calendar</a>
    </div>

    <a href="${u('about/about.html')}"    class="nb-mob-link" data-nb-link>About</a>
    <a href="${u('contact/contact.html')}" class="nb-mob-link" data-nb-link>Contact</a>

    <div class="nb-mob-footer">
      <a href="${u('home-1/home.html')}#book" class="nb-mob-link cta">Book Now</a>
      <a href="${u('login/login.html')}"   class="nb-mob-link login" data-nb-link>
        <i class="fa fa-user"></i> Login &amp; Register
      </a>
    </div>
  </div>
</header>`;

  /* inject at top of body */
  const frag = document.createElement('div');
  frag.innerHTML = template;
  while (frag.firstChild) document.body.insertBefore(frag.firstChild, document.body.firstChild);

  /* ----------------------------------------------------------
     4. AUTO ACTIVE HIGHLIGHT
     Resolve every [data-nb-link] href to an absolute URL and
     compare pathname to the current page pathname.
     On a match:
       • add .nb-active to the anchor
       • if it's inside a mobile panel, auto-open that panel
  ---------------------------------------------------------- */
  const currentPath = location.pathname;

  document.querySelectorAll('[data-nb-link]').forEach(a => {
    const resolved = new URL(a.getAttribute('href'), location.href);

    if (resolved.pathname === currentPath) {
      a.classList.add('nb-active');

      // Auto-open the mobile accordion containing this link
      const panel = a.closest('.nb-mob-panel');
      if (panel) {
        panel.classList.add('open');
        const btn = document.querySelector(`.nb-mob-toggle[data-panel="${panel.id}"]`);
        if (btn) { btn.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      }
    }
  });

  /* ----------------------------------------------------------
     5. THEME
  ---------------------------------------------------------- */
  const root      = document.documentElement;
  const themeBtn  = document.getElementById('nb-theme-btn');
  const themeIcon = document.getElementById('nb-theme-icon');

  const saved = localStorage.getItem('mashaletheme') ||
    (window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  setTheme(saved);

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeIcon) themeIcon.className = t === 'dark' ? 'fa fa-moon' : 'fa fa-sun';
    localStorage.setItem('mashaletheme', t);
  }

  themeBtn?.addEventListener('click', () =>
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
  );

  /* ----------------------------------------------------------
     6. SCROLL — progress bar + glass effect
  ---------------------------------------------------------- */
  const navbar = document.getElementById('nb');
  const bar    = document.getElementById('nb-bar');

  function onScroll() {
    const max = document.body.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? Math.min(window.scrollY / max * 100, 100) : 0) + '%';
    navbar.classList.toggle('nb-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     7. DESKTOP DROPDOWNS
     • mouseenter opens immediately, cancels any pending close
     • mouseleave schedules close after 150 ms
     • mouseenter on the dropdown itself cancels the timer
     • CSS padding-top:10px on .nb-drop is an invisible hover
       bridge so there's no dead zone between trigger & panel
  ---------------------------------------------------------- */
  document.querySelectorAll('.nb-item').forEach(item => {
    const trigger  = item.querySelector('.nb-link');
    const dropdown = item.querySelector('.nb-drop');
    if (!dropdown) return;

    let timer;

    const open = () => {
      clearTimeout(timer);
      document.querySelectorAll('.nb-item.nb-open').forEach(o => {
        if (o !== item) collapse(o);
      });
      item.classList.add('nb-open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const collapse = (target = item) => {
      target.classList.remove('nb-open');
      target.querySelector('.nb-link')?.setAttribute('aria-expanded', 'false');
    };

    const later = () => { timer = setTimeout(collapse, 150); };
    const hold  = () => clearTimeout(timer);

    item    .addEventListener('mouseenter', open);
    item    .addEventListener('mouseleave', later);
    dropdown.addEventListener('mouseenter', hold);
    dropdown.addEventListener('mouseleave', later);

    // keyboard
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.classList.contains('nb-open') ? collapse() : open(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); open(); dropdown.querySelector('[role=menuitem]')?.focus(); }
    });
    dropdown.addEventListener('keydown', e => {
      const all = [...dropdown.querySelectorAll('[role=menuitem]')];
      const i   = all.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); all[(i+1) % all.length]?.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); all[(i-1+all.length) % all.length]?.focus(); }
      if (e.key === 'Escape')    { collapse(); trigger.focus(); }
    });
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target))
      document.querySelectorAll('.nb-item.nb-open').forEach(o => {
        o.classList.remove('nb-open');
        o.querySelector('.nb-link')?.setAttribute('aria-expanded', 'false');
      });
  });

  /* ----------------------------------------------------------
     8. HAMBURGER + MOBILE MENU
  ---------------------------------------------------------- */
  const burger = document.getElementById('nb-burger');
  const mobile = document.getElementById('nb-mobile');
  let   mOpen  = false;

  burger?.addEventListener('click', () => {
    mOpen = !mOpen;
    burger.classList.toggle('open', mOpen);
    burger.setAttribute('aria-expanded', String(mOpen));
    mobile.classList.toggle('open', mOpen);
    mobile.setAttribute('aria-hidden', String(!mOpen));
    document.body.style.overflow = mOpen ? 'hidden' : '';
  });

  const closeMenu = () => {
    if (!mOpen) return;
    mOpen = false;
    burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
    mobile.classList.remove('open'); mobile.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  mobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setTimeout(closeMenu, 80)));

  /* ----------------------------------------------------------
     9. MOBILE ACCORDIONS — one open at a time
  ---------------------------------------------------------- */
  document.querySelectorAll('.nb-mob-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel  = document.getElementById(btn.dataset.panel);
      const wasOpen = btn.classList.contains('open');

      document.querySelectorAll('.nb-mob-toggle').forEach(b => {
        b.classList.remove('open'); b.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.nb-mob-panel').forEach(p => p.classList.remove('open'));

      if (!wasOpen && panel) {
        btn.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
      }
    });
  });

  /* ----------------------------------------------------------
     10. GLOBAL ESCAPE
  ---------------------------------------------------------- */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.nb-item.nb-open').forEach(o => {
      o.classList.remove('nb-open');
      o.querySelector('.nb-link')?.setAttribute('aria-expanded', 'false');
    });
    closeMenu();
  });

})();