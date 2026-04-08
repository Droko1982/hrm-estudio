/* ================================================
   HRM ESTUDIO — Main JavaScript
   Language toggle, theme toggle, animations, nav
   ================================================ */

(function () {
  'use strict';

  // ---- State ----
  let currentLang = localStorage.getItem('hrm-lang') || 'es';
  let currentTheme = localStorage.getItem('hrm-theme') || 'dark';

  // ---- DOM Elements ----
  const html = document.documentElement;
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const langToggle = document.getElementById('langToggle');
  const themeToggle = document.getElementById('themeToggle');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // ---- Initialize ----
  function init() {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    setupNavbar();
    setupHamburger();
    setupThemeToggle();
    setupLangToggle();
    setupTabs();
    setupScrollReveal();
    setupSmoothScroll();
    setupLazyIframes();
  }

  // ---- Theme ----
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('hrm-theme', theme);
  }

  function setupThemeToggle() {
    themeToggle.addEventListener('click', function () {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // ---- Language ----
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('hrm-lang', lang);

    // Update toggle button label
    langToggle.querySelector('.lang-label').textContent = lang === 'es' ? 'EN' : 'ES';

    // Update html lang attribute
    html.setAttribute('lang', lang);

    // Update all elements with data-es and data-en attributes
    document.querySelectorAll('[data-es][data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });
  }

  function setupLangToggle() {
    langToggle.addEventListener('click', function () {
      var newLang = currentLang === 'es' ? 'en' : 'es';
      applyLanguage(newLang);
    });
  }

  // ---- Navbar ----
  function setupNavbar() {
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;

      // Add scrolled class
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ---- Hamburger Mobile Menu ----
  function setupHamburger() {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Service Tabs ----
  function setupTabs() {
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = this.getAttribute('data-tab');

        // Update buttons
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Update content
        tabContents.forEach(function (content) {
          content.classList.remove('active');
        });

        var target = document.getElementById('tab-' + tab);
        if (target) {
          target.classList.add('active');
        }
      });
    });
  }

  // ---- Scroll Reveal ----
  function setupScrollReveal() {
    // Add reveal class to elements
    var revealSelectors = [
      '.service-card',
      '.gallery-item',
      '.contact-card',
      '.about-content',
      '.about-image',
      '.section-header',
      '.contact-whatsapp',
      '.contact-map'
    ];

    revealSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('reveal');
      });
    });

    // Intersection Observer
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Lazy Load Iframes (map) ----
  function setupLazyIframes() {
    var iframes = document.querySelectorAll('iframe[data-src]');
    if (!iframes.length) return;

    var iframeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var iframe = entry.target;
          iframe.src = iframe.getAttribute('data-src');
          iframe.removeAttribute('data-src');
          iframeObserver.unobserve(iframe);
        }
      });
    }, { rootMargin: '200px' });

    iframes.forEach(function (iframe) {
      iframeObserver.observe(iframe);
    });
  }

  // ---- Smooth Scroll ----
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Run ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
