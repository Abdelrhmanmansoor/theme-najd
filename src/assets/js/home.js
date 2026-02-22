/**
 * NAJD THEME — Home Page Scripts
 * Countdown timers, counter animations.
 */

import AppHelpers from './app-helpers';

class NajdHome extends AppHelpers {
  constructor() {
    super();
    this.initCountdowns();
    this.initCounterAnimations();
    this.initImageComparison();
    this.initProgressBars();
  }

  /** Countdown timers for special offers */
  initCountdowns() {
    document.querySelectorAll('.najd-countdown').forEach(countdown => {
      const endDate = new Date(countdown.dataset.endDate);
      if (isNaN(endDate.getTime())) return;

      const days    = countdown.querySelector('[data-days]');
      const hours   = countdown.querySelector('[data-hours]');
      const minutes = countdown.querySelector('[data-minutes]');
      const seconds = countdown.querySelector('[data-seconds]');

      const pad = n => String(n).padStart(2, '0');

      const update = () => {
        const diff = endDate - new Date();
        if (diff <= 0) {
          countdown.classList.add('is-expired');
          return;
        }

        days.textContent    = pad(Math.floor(diff / 86400000));
        hours.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
        minutes.textContent = pad(Math.floor((diff % 3600000) / 60000));
        seconds.textContent = pad(Math.floor((diff % 60000) / 1000));
      };

      update();
      setInterval(update, 1000);
    });
  }

  /** Image comparison — before/after drag slider */
  initImageComparison() {
    document.querySelectorAll('.najd-comparison').forEach(el => {
      const before = el.querySelector('.najd-comparison__before');
      const handle = el.querySelector('.najd-comparison__handle');
      if (!before || !handle) return;

      let isDragging = false;

      const updatePosition = (x) => {
        const rect = el.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.max(2, Math.min(98, pct));
        before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = pct + '%';
      };

      el.addEventListener('mousedown', (e) => { isDragging = true; updatePosition(e.clientX); });
      el.addEventListener('touchstart', (e) => { isDragging = true; updatePosition(e.touches[0].clientX); }, { passive: true });

      document.addEventListener('mousemove', (e) => { if (isDragging) updatePosition(e.clientX); });
      document.addEventListener('touchmove', (e) => { if (isDragging) updatePosition(e.touches[0].clientX); }, { passive: true });

      document.addEventListener('mouseup', () => { isDragging = false; });
      document.addEventListener('touchend', () => { isDragging = false; });
    });
  }

  /** Animated progress bars (statistics progress layout) */
  initProgressBars() {
    const bars = document.querySelectorAll('.najd-stats-progress__fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width || '0';
          entry.target.style.width = width + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
      bar.style.width = '0';
      observer.observe(bar);
    });
  }

  /** Animated counters (statistics section) */
  initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
  }
}

salla.onReady(() => new NajdHome());
