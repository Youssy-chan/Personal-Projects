/* ============================================================
   LUMINO — scroll.js
   IntersectionObserver per animazioni on-scroll
   ============================================================ */

'use strict';

// Observe all elements with .animate-on-scroll
const animTargets = document.querySelectorAll('.animate-on-scroll');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after animation — fire once only
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,          // Trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px'  // Slight bottom offset for better feel
    }
  );

  animTargets.forEach(el => observer.observe(el));

} else {
  // Fallback: show all elements immediately if IO not supported
  animTargets.forEach(el => el.classList.add('is-visible'));
}
