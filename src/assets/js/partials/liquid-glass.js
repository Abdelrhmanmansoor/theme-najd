/**
 * NAJD THEME — Liquid Glass Effects
 * Mouse-tracking highlight + adaptive glass behavior.
 * Only active in glass mode for performance.
 */

(function () {
  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;

  /**
   * Add a soft radial highlight that follows the cursor
   * on glass-surface elements.
   */
  function updateGlassHighlight() {
    const isGlass = document.documentElement.dataset.theme === 'glass';
    if (!isGlass) {
      rafId = null;
      return;
    }

    const cards = document.querySelectorAll(
      '.najd-block .glass-surface, .product-entry, .najd-review, .najd-stat'
    );

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;

      // Only apply when cursor is near the card
      if (x < -60 || x > rect.width + 60 || y < -60 || y > rect.height + 60) return;

      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);

      // Inject glow layer once
      if (!card.querySelector('.najd-glass-glow')) {
        const glow = document.createElement('div');
        glow.className = 'najd-glass-glow';
        glow.setAttribute('aria-hidden', 'true');
        card.appendChild(glow);
      }
    });

    rafId = null;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(updateGlassHighlight);
  }, { passive: true });

  // Inject the glow CSS once
  const style = document.createElement('style');
  style.textContent = `
    .najd-glass-glow {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: radial-gradient(
        250px circle at var(--glow-x, 50%) var(--glow-y, 50%),
        rgba(255, 255, 255, 0.05),
        transparent 60%
      );
      pointer-events: none;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    [data-theme="glass"] .najd-glass-glow {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
})();
