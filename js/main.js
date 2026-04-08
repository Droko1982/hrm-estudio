/* ================================================
   HRM ESTUDIO — Main JavaScript
   Language, theme, animations, lightbox, counters
   ================================================ */

(function () {
  'use strict';

  // ---- State ----
  var currentLang = localStorage.getItem('hrm-lang') || 'es';
  var currentTheme = 'dark'; // Always start dark

  // ---- DOM Elements ----
  var html = document.documentElement;
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  var langToggle = document.getElementById('langToggle');
  var themeToggle = document.getElementById('themeToggle');
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');

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
    setupLightbox();
    setupCounters();
    setupHeroSlideshow();
    setupVideoPlayer();
    setupPromoBanner();
  }

  // ---- Theme ----
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('hrm-theme', theme);
  }

  function setupThemeToggle() {
    themeToggle.addEventListener('click', function () {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // ---- Language ----
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('hrm-lang', lang);
    langToggle.querySelector('.lang-label').textContent = lang === 'es' ? 'EN' : 'ES';
    html.setAttribute('lang', lang);

    document.querySelectorAll('[data-es][data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });
  }

  function setupLangToggle() {
    langToggle.addEventListener('click', function () {
      applyLanguage(currentLang === 'es' ? 'en' : 'es');
    });
  }

  // ---- Navbar (scroll show/hide) ----
  function setupNavbar() {
    var lastScroll = 0;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var currentScroll = window.pageYOffset;
          if (currentScroll > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---- Hamburger Mobile Menu ----
  function setupHamburger() {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

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
        tabButtons.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        tabContents.forEach(function (c) { c.classList.remove('active'); });
        var target = document.getElementById('tab-' + tab);
        if (target) target.classList.add('active');
      });
    });
  }

  // ---- Scroll Reveal with stagger ----
  function setupScrollReveal() {
    var revealSelectors = [
      '.service-card',
      '.gallery-item',
      '.contact-card',
      '.about-content',
      '.about-image',
      '.section-header',
      '.contact-whatsapp',
      '.contact-map',
      '.stat-item',
      '.testimonial-card',
      '.tip-card',
      '.faq-item',
      '.area-item',
      '.video-showcase',
      '.instagram-cta',
      '.strip-item'
    ];

    revealSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 0.08) + 's';
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Animated Counters ----
  function setupCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // ---- Hero Slideshow ----
  function setupHeroSlideshow() {
    var slides = document.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;

    var current = 0;
    var interval = 5000; // 5 seconds per slide

    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, interval);
  }

  // ---- Lightbox ----
  function setupLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');
    if (!lightbox) return;

    // Open lightbox on gallery item click
    document.querySelectorAll('[data-lightbox]').forEach(function (item) {
      item.style.cursor = 'zoom-in';
      item.addEventListener('click', function () {
        var src = this.getAttribute('data-lightbox');
        lightboxImg.src = src;
        lightboxImg.alt = this.querySelector('img') ? this.querySelector('img').alt : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ---- Video Player ----
  function setupVideoPlayer() {
    var playBtn = document.getElementById('videoPlayBtn');
    if (!playBtn) return;

    var video = playBtn.parentElement.querySelector('video');
    if (!video) return;

    playBtn.addEventListener('click', function () {
      video.play();
      playBtn.classList.add('hidden');
      video.setAttribute('controls', '');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime > 0) {
        playBtn.classList.remove('hidden');
      }
    });

    video.addEventListener('play', function () {
      playBtn.classList.add('hidden');
    });
  }

  // ---- Promo Banner ----
  function setupPromoBanner() {
    var banner = document.getElementById('promoBanner');
    var closeBtn = document.getElementById('promoClose');
    if (!banner || !closeBtn) return;

    if (sessionStorage.getItem('hrm-promo-closed')) {
      banner.classList.add('hidden');
      return;
    }

    closeBtn.addEventListener('click', function () {
      banner.classList.add('hidden');
      sessionStorage.setItem('hrm-promo-closed', '1');
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
