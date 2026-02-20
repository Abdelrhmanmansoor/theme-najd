/**
 * NAJD THEME — Product Image Zoom
 * Adds pinch-to-zoom and hover zoom on product images
 */
(function () {
  const imageContainer = document.querySelector('.product-img');
  if (!imageContainer) return;

  const images = imageContainer.querySelectorAll('img');
  images.forEach((img) => {
    img.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(1.8)';
    });

    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
})();
