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

  // ==========================================================================
  // 2. CANVAS TECHNICAL GRID & COORDINATE TRACKER (DRAFTING TABLE EFFECT)
  // ==========================================================================
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track Mouse Coordinate
  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Render Loop
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Faint grid spacing
    const gridSpacing = 40;
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.4)'; // Very faint slate-200
    ctx.lineWidth = 0.5;

    // Draw grid
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Crosshair coordinate lines under cursor (faint blueprints feel)
    if (mouse.x !== null && mouse.y !== null) {
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.08)'; // Accent Blue at low opacity
      ctx.lineWidth = 1;
      
      // Horizontal crosshair
      ctx.beginPath();
      ctx.moveTo(0, mouse.y);
      ctx.lineTo(width, mouse.y);
      ctx.stroke();

      // Vertical crosshair
      ctx.beginPath();
      ctx.moveTo(mouse.x, 0);
      ctx.lineTo(mouse.x, height);
      ctx.stroke();

      // Coordinate label text
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
      ctx.fillText(`SYS_LOC: [${mouse.x}px, ${mouse.y}px]`, mouse.x + 12, mouse.y - 12);

      // Anchor circle
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
});
