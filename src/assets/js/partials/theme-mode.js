/**
 * NAJD THEME — Theme Mode Switcher
 * Handles Light / Dark / Glass mode transitions.
 * Persists choice in localStorage.
 * Applies data-theme on <body> to match the Twig template.
 */

(function () {
  const STORAGE_KEY = 'najd-theme-mode';
  const config = window.najdConfig || {};

  /**
   * Apply a theme mode to the document.
   * @param {'light'|'dark'|'glass'} mode
   * @param {boolean} userAction — true if triggered by user click
   */
  function applyMode(mode, userAction) {
    const target = document.body || document.documentElement;
    target.setAttribute('data-theme', mode);

    // Keep html in sync for CSS :root fallback
    document.documentElement.setAttribute('data-theme', mode);

    // Set blur intensity for glass mode
    if (mode === 'glass' && config.glassBlur) {
      target.setAttribute('data-glass-blur', config.glassBlur);
    } else {
      target.removeAttribute('data-glass-blur');
    }

    // Update switcher button states
    document.querySelectorAll('.najd-mode-switcher__btn').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.mode === mode);
    });

    // Only persist if user explicitly clicked a mode button
    if (userAction) {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }

  // Use the server-rendered default mode (from twilight.json).
  // Only restore localStorage preference if user explicitly chose before.
  var savedMode = localStorage.getItem(STORAGE_KEY);
  var defaultMode = config.defaultMode || 'light';

  // Apply: prefer saved user choice, fall back to server default
  var initialMode = savedMode || defaultMode;
  applyMode(initialMode, false);

  // Bind switcher buttons (once DOM is ready)
  document.addEventListener('DOMContentLoaded', function () {
    // Re-apply on body now that it's guaranteed to exist
    var current = document.body.getAttribute('data-theme') ||
                  document.documentElement.getAttribute('data-theme') ||
                  defaultMode;
    applyMode(current, false);

    document.querySelectorAll('.najd-mode-switcher__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyMode(btn.dataset.mode, true);
      });
    });
  });
})();
