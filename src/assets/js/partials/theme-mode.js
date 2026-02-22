/**
 * NAJD THEME — Theme Mode
 * Reads the default mode from dashboard settings and applies it.
 * Mode is controlled from Settings > default_theme_mode (no floating switcher).
 */

(function () {
  var config = window.najdConfig || {};

  function applyMode(mode) {
    var target = document.body || document.documentElement;
    target.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-theme', mode);

    if (mode === 'glass' && config.glassBlur) {
      target.setAttribute('data-glass-blur', config.glassBlur);
    } else {
      target.removeAttribute('data-glass-blur');
    }
  }

  var defaultMode = config.defaultMode || 'light';
  applyMode(defaultMode);

  document.addEventListener('DOMContentLoaded', function () {
    applyMode(defaultMode);
  });
})();
