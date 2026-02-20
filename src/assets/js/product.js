/**
 * NAJD THEME — Product Page
 */

salla.onReady(() => {
  // Image zoom
  if (window.najdConfig?.imageZoom) {
    import('./partials/image-zoom').catch(() => {});
  }
});
