/**
 * ANIMATIONS.JS
 * Technical Drafting-Table Grid Background and Scroll Reveal Observer.
 * Creates an intelligent, minimal engineering aesthetic.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. SCROLL REVEAL OBSERVER
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });
    
    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('revealed'));
  }

  // Grid canvas coordinate tracker was removed to support Modern Editorial design.
});
