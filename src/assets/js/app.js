/**
 * NAJD THEME — Main Application
 * Initializes core functionality across all pages.
 * Premium features: Preloader, Newsletter Popup, Shipping Bar,
 *                   Transparent Header, Grid/List Toggle
 */

import AppHelpers from './app-helpers';

class NajdApp extends AppHelpers {
  constructor() {
    super();
    this.initPreloader();
    this.initHeader();
    this.initBackToTop();
    this.initScrollAnimations();
    this.initContentProtection();
    this.initNewsletterPopup();
    this.initDiscountPopup();
    this.initShippingBar();
    this.initTransparentHeader();
  }

  /** Hide preloader after page load */
  initPreloader() {
    if (!window.najdConfig?.preloader) return;
    const el = document.getElementById('najd-preloader');
    if (!el) return;

    const hide = () => {
      el.classList.add('is-hidden');
      setTimeout(() => el.remove(), 500);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide);
    }
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

  /** Transparent header — add scrolled class to body */
  initTransparentHeader() {
    if (window.najdConfig?.headerStyle !== 'transparent') return;

    const body = document.body;
    window.addEventListener('scroll', () => {
      body.classList.toggle('header-scrolled', window.scrollY > 80);
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

  /** Newsletter popup — show after delay, respect dismissal */
  initNewsletterPopup() {
    if (!window.najdConfig?.newsletterPopup) return;

    const popup = document.getElementById('najd-newsletter-popup');
    if (!popup) return;

    // Check if dismissed within last 7 days
    const dismissed = localStorage.getItem('najd-nl-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    const delay = (window.najdConfig?.newsletterDelay || 5) * 1000;
    setTimeout(() => {
      popup.style.display = 'flex';
    }, delay);
  }

  /** Discount popup — show after delay, respect localStorage dismissal */
  initDiscountPopup() {
    const popup = document.getElementById('najd-discount-popup');
    if (!popup) return;

    const dismissed = localStorage.getItem('najd-discount-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 3 * 24 * 60 * 60 * 1000) return;

    setTimeout(() => {
      popup.style.display = 'flex';
    }, 4000);
  }

  /** Free shipping progress bar */
  initShippingBar() {
    if (!window.najdConfig?.freeShippingBar) return;

    const bar = document.getElementById('najd-shipping-bar');
    const fill = document.getElementById('najd-shipping-fill');
    if (!bar || !fill) return;

    const goal = window.najdConfig?.freeShippingGoal || 200;

    const updateBar = (total) => {
      const pct = Math.min((total / goal) * 100, 100);
      fill.style.width = pct + '%';
      bar.classList.toggle('is-complete', pct >= 100);
    };

    // Listen for cart updates
    salla.event.on('cart::updated', (data) => {
      if (data?.data?.total) {
        updateBar(parseFloat(data.data.total));
      }
    });
  }
}

// Initialize when Salla SDK is ready
salla.onReady(() => new NajdApp());
