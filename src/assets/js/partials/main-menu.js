/**
 * NAJD THEME — Main Menu
 * Desktop mega menu + mobile drawer.
 */

import MmenuLight from 'mmenu-light';

class NajdMainMenu extends HTMLElement {
  connectedCallback() {
    this.initMobileMenu();
  }

  initMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;

    const mmenu = new MmenuLight(menu, '(max-width: 1023px)');
    const drawer = mmenu.offcanvas({ position: salla.config.get('theme.is_rtl') ? 'right' : 'left' });

    // Open via hamburger
    document.querySelectorAll('[href="#mobile-menu"]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        drawer.open();
      });
    });
  }
}

if (!customElements.get('custom-main-menu')) {
  customElements.define('custom-main-menu', NajdMainMenu);
}
