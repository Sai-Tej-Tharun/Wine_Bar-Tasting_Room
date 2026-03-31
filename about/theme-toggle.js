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