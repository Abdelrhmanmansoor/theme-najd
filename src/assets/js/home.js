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
    this.initShopTheLook();
    this.initParallaxBanners();
    this.initCouponSections();
    this.initSizeChart();
    this.initProductFinder();
    this.initFaqFilter();
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

  /** Shop the Look — toggle product popup on hotspot click */
  initShopTheLook() {
    document.querySelectorAll('.najd-shop-look').forEach(container => {
      const hotspots = container.querySelectorAll('.najd-shop-look__hotspot');
      const popups = container.querySelectorAll('.najd-shop-look__popup');

      hotspots.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = btn.dataset.hotspot;
          const popup = container.querySelector(`[data-popup="${idx}"]`);
          if (!popup) return;

          const wasVisible = popup.classList.contains('is-visible');
          popups.forEach(p => p.classList.remove('is-visible'));
          hotspots.forEach(h => h.classList.remove('is-active'));

          if (!wasVisible) {
            popup.classList.add('is-visible');
            btn.classList.add('is-active');
          }
        });
      });

      document.addEventListener('click', () => {
        popups.forEach(p => p.classList.remove('is-visible'));
        hotspots.forEach(h => h.classList.remove('is-active'));
      });
    });
  }

  /** Parallax banners — scroll-based background movement */
  initParallaxBanners() {
    const banners = document.querySelectorAll('.najd-parallax-banner');
    if (!banners.length) return;

    const onScroll = () => {
      banners.forEach(banner => {
        const rect = banner.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const speed = 0.3;
        const yPos = -(rect.top * speed);
        banner.style.backgroundPositionY = yPos + 'px';
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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

  /** ⭐ Coupon sections — copy to clipboard + reveal toggle */
  initCouponSections() {
    document.querySelectorAll('.najd-coupon').forEach(coupon => {
      const code = coupon.dataset.coupon;
      if (!code) return;

      const copyBtn = coupon.querySelector('.najd-coupon__copy');
      const codeEl = coupon.querySelector('.najd-coupon__code');

      // Copy button
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(code).then(() => {
            coupon.classList.add('is-copied');
            setTimeout(() => coupon.classList.remove('is-copied'), 2500);
          }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = code;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            coupon.classList.add('is-copied');
            setTimeout(() => coupon.classList.remove('is-copied'), 2500);
          });
        });
      }

      // Reveal on click (blur → clear)
      if (coupon.classList.contains('najd-coupon--reveal') && codeEl) {
        codeEl.addEventListener('click', () => {
          coupon.classList.add('is-revealed');
        });
      }
    });
  }

  /** ⭐ Size Chart: unit toggle + row highlight + size calculator */
  initSizeChart() {
    document.querySelectorAll('.najd-block--sizechart').forEach(section => {
      const unitToggle = section.querySelector('[data-unit-toggle]');

      // Unit toggle
      if (unitToggle) {
        const btns = unitToggle.querySelectorAll('.najd-sizechart__unit-btn');
        btns.forEach(btn => {
          btn.addEventListener('click', () => {
            const unit = btn.dataset.unit;
            btns.forEach(b => b.classList.toggle('is-active', b.dataset.unit === unit));
            unitToggle.classList.toggle('is-inch', unit === 'inch');
            section.classList.toggle('is-inch', unit === 'inch');
          });
        });
      }

      // Row click highlight (classic table)
      section.querySelectorAll('.najd-sizechart__row').forEach(row => {
        row.addEventListener('click', () => {
          section.querySelectorAll('.najd-sizechart__row').forEach(r => r.classList.remove('is-selected'));
          row.classList.add('is-selected');
        });
      });

      // Card click highlight (cards layout)
      section.querySelectorAll('.najd-sizechart__card').forEach(card => {
        card.addEventListener('click', () => {
          section.querySelectorAll('.najd-sizechart__card').forEach(c => c.classList.remove('is-selected'));
          card.classList.add('is-selected');
        });
      });

      // Tabs layout
      const tabWrap = section.querySelector('[data-chart-tabs]');
      if (tabWrap) {
        tabWrap.querySelectorAll('.najd-sizechart__tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = btn.dataset.tab;
            tabWrap.querySelectorAll('.najd-sizechart__tab-btn').forEach(b => b.classList.toggle('is-active', b.dataset.tab === idx));
            tabWrap.querySelectorAll('.najd-sizechart__tab-panel').forEach(p => p.classList.toggle('is-active', p.dataset.panel === idx));
          });
        });
      }

      // Size finder / calculator
      const finder = section.querySelector('[data-size-finder]');
      if (!finder) return;

      const dataEl = finder.querySelector('.najd-sizechart__data');
      if (!dataEl) return;

      let chartData;
      try { chartData = JSON.parse(dataEl.textContent); } catch(e) { return; }

      const findBtn = finder.querySelector('[data-find-size]');
      const resultEl = finder.querySelector('[data-finder-result]');
      const resultSize = finder.querySelector('[data-result-size]');
      if (!findBtn || !resultEl || !resultSize) return;

      findBtn.addEventListener('click', () => {
        const inputs = [...finder.querySelectorAll('.najd-sizechart__finder-input')];
        const isInch = section.classList.contains('is-inch');
        const userVals = inputs.map(inp => parseFloat(inp.value) || 0);

        let bestMatch = null;
        let bestScore = Infinity;

        chartData.rows.forEach(row => {
          const rawVals = isInch ? row.inch : row.cm;
          if (!rawVals) return;
          const rowVals = rawVals.split('|').map(v => parseFloat(v.trim()) || 0);
          let score = 0;
          userVals.forEach((uv, i) => {
            if (uv > 0 && rowVals[i]) {
              score += Math.abs(uv - rowVals[i]);
            }
          });
          if (score < bestScore) {
            bestScore = score;
            bestMatch = row.size;
          }
        });

        if (bestMatch) {
          resultSize.textContent = bestMatch;
          resultEl.hidden = false;
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }
  /** ⭐ Product Finder Quiz — step navigation + result display */
  initProductFinder() {
    document.querySelectorAll('.najd-finder').forEach(finder => {
      const total = parseInt(finder.dataset.finderTotal) || 0;
      if (!total) return;

      let history = []; // navigation history for back support
      let pendingResult = null;

      const screens = {
        intro: finder.querySelector('[data-screen="intro"]'),
        result: finder.querySelector('[data-screen="result"]'),
        progress: finder.querySelector('[data-progress]'),
        progressFill: finder.querySelector('[data-progress-fill]'),
        progressText: finder.querySelector('[data-progress-text]'),
        currentQ: finder.querySelector('[data-current-q]'),
      };

      const showScreen = (el) => {
        finder.querySelectorAll('.najd-finder__screen').forEach(s => s.hidden = true);
        finder.querySelectorAll('[data-progress]').forEach(s => s.hidden = true);
        if (el) el.hidden = false;
      };

      const showStep = (stepNum) => {
        const stepEl = finder.querySelector(`[data-step="${stepNum}"]`);
        if (!stepEl) return;
        showScreen(stepEl);
        if (screens.progress) screens.progress.hidden = false;
        if (screens.progressFill) screens.progressFill.style.width = `${((stepNum - 1) / total) * 100}%`;
        if (screens.currentQ) screens.currentQ.textContent = stepNum;
      };

      const showResult = (result) => {
        showScreen(screens.result);
        if (!result) return;

        const imgWrap = screens.result.querySelector('[data-result-img-wrap]');
        const img = screens.result.querySelector('[data-result-img]');
        const title = screens.result.querySelector('[data-result-title]');
        const desc = screens.result.querySelector('[data-result-desc]');
        const price = screens.result.querySelector('[data-result-price]');
        const url = screens.result.querySelector('[data-result-url]');

        if (img && result.image) { img.src = result.image; img.alt = result.title || ''; }
        if (imgWrap) imgWrap.hidden = !result.image;
        if (title) title.textContent = result.title || '';
        if (desc) desc.textContent = result.description || '';
        if (price) price.textContent = result.price || '';
        if (url) url.href = result.url || '#';
        if (screens.progressFill) screens.progressFill.style.width = '100%';
      };

      // Start button
      const startBtn = finder.querySelector('[data-start]');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          history = [];
          pendingResult = null;
          showStep(1);
        });
      }

      // Option buttons
      finder.addEventListener('click', e => {
        const optBtn = e.target.closest('.najd-finder__option');
        if (!optBtn) return;

        const qi = parseInt(optBtn.dataset.qi);
        const next = parseInt(optBtn.dataset.next);
        let result = null;

        try { result = JSON.parse(optBtn.dataset.result); } catch(err) {}

        // Visual feedback
        optBtn.classList.add('is-selected');
        setTimeout(() => optBtn.classList.remove('is-selected'), 300);

        history.push(qi + 1);

        if (result && (result.title || result.image || result.url)) {
          pendingResult = result;
        }

        // Navigate: next=0 → show result, next>0 → go to that step
        setTimeout(() => {
          if (next > 0 && finder.querySelector(`[data-step="${next}"]`)) {
            showStep(next);
          } else if (qi + 2 <= total && !next) {
            showStep(qi + 2);
          } else {
            showResult(pendingResult);
          }
        }, 200);
      });

      // Restart button
      const restartBtn = finder.querySelector('[data-restart]');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          pendingResult = null;
          history = [];
          showScreen(screens.intro);
        });
      }
    });
  }

  /** ⭐ FAQ Category Filter Tabs */
  initFaqFilter() {
    document.querySelectorAll('[data-faq-filter]').forEach(tabBar => {
      const section = tabBar.closest('.najd-block--faq');
      if (!section) return;

      tabBar.querySelectorAll('.najd-faq__filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.dataset.cat;
          tabBar.querySelectorAll('.najd-faq__filter-btn').forEach(b => b.classList.toggle('is-active', b === btn));
          section.querySelectorAll('[data-item-cat]').forEach(item => {
            if (cat === 'all' || !item.dataset.itemCat || item.dataset.itemCat === cat) {
              item.classList.remove('is-hidden');
            } else {
              item.classList.add('is-hidden');
            }
          });
        });
      });
    });
  }
}

salla.onReady(() => new NajdHome());
