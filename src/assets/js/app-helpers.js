/**
 * NAJD THEME — App Helpers
 * Base class with DOM utility methods.
 */

export default class AppHelpers {
  constructor() {
    // Notification handler
    salla.notify.setNotifier(function (message) {
      if (typeof Swal === 'undefined') return;
      return Swal.mixin({
        toast:            true,
        position:         salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer:            3500,
        timerProgressBar:  true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      }).fire({ icon: message.icon, title: message.title });
    });
  }

  /**
   * Animate a number from 0 to target.
   * @param {HTMLElement} el  - Element with data-count attribute
   */
  animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
