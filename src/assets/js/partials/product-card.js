/**
 * NAJD THEME — Product Card
 * Custom product card web component with premium features:
 * - Image swap on hover (shows second product image)
 * - "New" badge for recent products
 * - Sale percentage badge
 * - Color swatches display
 */

class NajdProductCard extends HTMLElement {
  constructor() {
    super();
    this.product = JSON.parse(this.getAttribute('product') || '{}');
  }

  connectedCallback() {
    if (!this.product.id) return;
    this.render();
    this.enhanceCard();
  }

  render() {
    // Delegate to Salla's built-in product card
    // This wrapper exists to allow future customization
  }

  enhanceCard() {
    // Wait for the card DOM to be ready
    requestAnimationFrame(() => {
      this.addHoverImage();
      this.addBadges();
      this.addSwatches();
    });
  }

  /** Add second image that shows on hover */
  addHoverImage() {
    const images = this.product.images || this.product.image?.urls || [];
    if (images.length < 2) return;

    const imageContainer = this.querySelector('.product-entry__image, .s-product-card-image');
    if (!imageContainer) return;

    // Avoid duplicating
    if (imageContainer.querySelector('.najd-hover-img')) return;

    const hoverImg = document.createElement('img');
    hoverImg.className = 'najd-hover-img';
    hoverImg.src = images[1].url || images[1];
    hoverImg.alt = this.product.name || '';
    hoverImg.loading = 'lazy';
    imageContainer.appendChild(hoverImg);
  }

  /** Add "New" and sale percentage badges */
  addBadges() {
    const imageContainer = this.querySelector('.product-entry__image, .s-product-card-image');
    if (!imageContainer) return;

    // "New" badge — products created within last 14 days
    if (this.product.created_at) {
      const created = new Date(this.product.created_at);
      const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince <= 14 && !imageContainer.querySelector('.najd-badge--new')) {
        const badge = document.createElement('span');
        badge.className = 'najd-badge--new';
        badge.textContent = 'جديد';
        imageContainer.appendChild(badge);
      }
    }

    // Sale percentage badge
    const price = this.product.price;
    const salePrice = this.product.sale_price;
    if (price && salePrice && salePrice < price) {
      const pct = Math.round(((price - salePrice) / price) * 100);
      if (pct > 0 && !imageContainer.querySelector('.najd-badge--sale')) {
        const badge = document.createElement('span');
        badge.className = 'najd-badge--sale';
        badge.textContent = '-' + pct + '%';
        imageContainer.appendChild(badge);
      }
    }
  }

  /** Add color swatches if product has color options */
  addSwatches() {
    const options = this.product.options || [];
    const colorOption = options.find(opt =>
      (opt.name || '').match(/لون|color|colour/i)
    );
    if (!colorOption || !colorOption.values || !colorOption.values.length) return;

    const content = this.querySelector('.product-entry__content, .s-product-card-content');
    if (!content || content.querySelector('.najd-swatches')) return;

    const container = document.createElement('div');
    container.className = 'najd-swatches';

    colorOption.values.forEach(val => {
      const swatch = document.createElement('span');
      swatch.className = 'najd-swatch';
      const color = val.color || val.display_value || val.name || '';
      if (color) {
        swatch.style.backgroundColor = color;
        swatch.title = val.name || color;
        container.appendChild(swatch);
      }
    });

    if (container.children.length) {
      content.appendChild(container);
    }
  }
}

if (!customElements.get('custom-salla-product-card')) {
  customElements.define('custom-salla-product-card', NajdProductCard);
}
