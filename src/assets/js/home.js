/**
 * NAJD THEME — Home Page Scripts
 * Countdown timers, counter animations, image comparison,
 * product tabs, scrolling text, progress bars.
 */

import AppHelpers from './app-helpers';

class NajdHome extends AppHelpers {
  constructor() {
    super();
    this.initCountdowns();
    this.initCounterAnimations();
    this.initImageComparison();
    this.initProgressBars();
    this.initProductTabs();
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

  /** Image comparison — advanced before/after with orientation, autoplay, start position */
  initImageComparison() {
    document.querySelectorAll('.najd-comparison').forEach(el => {
      const before = el.querySelector('.najd-comparison__before');
      const handle = el.querySelector('.najd-comparison__handle');
      if (!before || !handle) return;

      const isVertical = el.dataset.orientation === 'vertical';
      const startPos = parseInt(el.dataset.start) || 50;
      const autoplay = el.dataset.autoplay === 'true';
      const speed = (parseInt(el.dataset.autoplaySpeed) || 3) * 1000;

      let isDragging = false;
      let currentPct = startPos;

      const setPosition = (pct) => {
        pct = Math.max(2, Math.min(98, pct));
        currentPct = pct;

        if (isVertical) {
          before.style.clipPath = `inset(0 0 ${100 - pct}% 0)`;
          handle.style.top = pct + '%';
          handle.style.left = '';
        } else {
          before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
          handle.style.left = pct + '%';
          handle.style.top = '';
        }
      };

      const getPositionFromEvent = (clientX, clientY) => {
        const rect = el.getBoundingClientRect();
        if (isVertical) {
          return ((clientY - rect.top) / rect.height) * 100;
        }
        return ((clientX - rect.left) / rect.width) * 100;
      };

      // Set initial position
      setPosition(startPos);

      // Mouse/touch events
      el.addEventListener('mousedown', (e) => { isDragging = true; setPosition(getPositionFromEvent(e.clientX, e.clientY)); });
      el.addEventListener('touchstart', (e) => { isDragging = true; setPosition(getPositionFromEvent(e.touches[0].clientX, e.touches[0].clientY)); }, { passive: true });

      document.addEventListener('mousemove', (e) => { if (isDragging) setPosition(getPositionFromEvent(e.clientX, e.clientY)); });
      document.addEventListener('touchmove', (e) => { if (isDragging) setPosition(getPositionFromEvent(e.touches[0].clientX, e.touches[0].clientY)); }, { passive: true });

      document.addEventListener('mouseup', () => { isDragging = false; });
      document.addEventListener('touchend', () => { isDragging = false; });

      // Autoplay: smooth back-and-forth oscillation
      if (autoplay) {
        let direction = 1;
        let animPct = startPos;
        const step = 0.5;
        const minPct = 15;
        const maxPct = 85;

        const animate = () => {
          if (isDragging) { requestAnimationFrame(animate); return; }
          animPct += step * direction;
          if (animPct >= maxPct) { direction = -1; animPct = maxPct; }
          if (animPct <= minPct) { direction = 1; animPct = minPct; }
          setPosition(animPct);
          requestAnimationFrame(animate);
        };

        // Start autoplay after a delay
        setTimeout(() => requestAnimationFrame(animate), speed);
      }
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

  /** Product tabs — switch between tabbed product sliders */
  initProductTabs() {
    document.querySelectorAll('.najd-product-tabs').forEach(container => {
      const buttons = container.querySelectorAll('.najd-product-tabs__btn');
      const panels = container.querySelectorAll('.najd-product-tabs__panel');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = btn.dataset.tabIndex;

          buttons.forEach(b => b.classList.remove('is-active'));
          panels.forEach(p => p.classList.remove('is-active'));

          btn.classList.add('is-active');
          const panel = container.querySelector(`[data-tab-panel="${index}"]`);
          if (panel) panel.classList.add('is-active');
        });
      });
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
