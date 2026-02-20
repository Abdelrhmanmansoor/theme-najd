/**
 * NAJD THEME — Main Application
 * Initializes core functionality across all pages.
 */

import AppHelpers from './app-helpers';

class NajdApp extends AppHelpers {
  constructor() {
    super();
    this.initHeader();
    this.initBackToTop();
    this.initScrollAnimations();
    this.initContentProtection();
  }

  /** Sticky header behavior */
  initHeader() {
    if (!window.najdConfig?.headerIsSticky) return;

    const header = document.getElementById('najd-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      header.classList.toggle('is-scrolled', current > 100);
      header.classList.toggle('is-hidden', current > lastScroll && current > 300);
      lastScroll = current;
    }, { passive: true });
  }

  /** Back-to-top button */
  initBackToTop() {
    const btn = document.getElementById('najd-back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /** Scroll-triggered reveal animations */
  initScrollAnimations() {
    if (!window.najdConfig?.enableAnimations) return;

    const elements = document.querySelectorAll('.najd-animate');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /** Content protection (disable copy/right-click) */
  initContentProtection() {
    if (!window.najdConfig?.protectContent) return;

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('copy', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
  }
}

// Initialize when Salla SDK is ready
salla.onReady(() => new NajdApp());
