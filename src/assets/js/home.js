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
