/**
 * NAJD THEME — Theme Mode Switcher
 * Handles Light / Dark / Glass mode transitions.
 * Persists choice in localStorage.
 */

(function () {
  const STORAGE_KEY = 'najd-theme-mode';
  const html = document.documentElement;
  const config = window.najdConfig || {};

  /**
   * Apply a theme mode to the document.
   * @param {'light'|'dark'|'glass'} mode
   */
  function applyMode(mode) {
    html.setAttribute('data-theme', mode);

    // Set blur intensity for glass mode
    if (mode === 'glass' && config.glassBlur) {
      html.setAttribute('data-glass-blur', config.glassBlur);
    } else {
      html.removeAttribute('data-glass-blur');
    }

    // Update switcher button states
    document.querySelectorAll('.najd-mode-switcher__btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.mode === mode);
    });

    // Persist
    localStorage.setItem(STORAGE_KEY, mode);
  }

  // Restore saved mode or use default
  const savedMode = localStorage.getItem(STORAGE_KEY);
  const initialMode = savedMode || config.defaultMode || 'light';
  applyMode(initialMode);

  // Bind switcher buttons (once DOM is ready)
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.najd-mode-switcher__btn').forEach(btn => {
      btn.addEventListener('click', () => applyMode(btn.dataset.mode));
    });
  });
})();
