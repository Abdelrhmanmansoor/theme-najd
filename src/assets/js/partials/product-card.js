/**
 * NAJD THEME — Product Card
 * Custom product card web component.
 */

class NajdProductCard extends HTMLElement {
  constructor() {
    super();
    this.product = JSON.parse(this.getAttribute('product') || '{}');
  }

  connectedCallback() {
    if (!this.product.id) return;
    this.render();
  }

  render() {
    // Delegate to Salla's built-in product card
    // This wrapper exists to allow future customization
  }
}

if (!customElements.get('custom-salla-product-card')) {
  customElements.define('custom-salla-product-card', NajdProductCard);
}
