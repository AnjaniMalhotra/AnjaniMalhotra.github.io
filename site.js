/* Page behaviour below the hero: reveal-on-scroll, stat count-up, project carousel, resume link. */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- reveal sections as they scroll into view (staggered within a group) ----
  const reveals = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  }

  // ---- count the stats up the first time they appear ----
  const nums = [...document.querySelectorAll('.stat-num[data-count]')];
  const countUp = el => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), suffix = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1400;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { countUp(en.target); io2.unobserve(en.target); }
    }), { threshold: 0.6 });
    nums.forEach(n => io2.observe(n));
  }

  // ---- project carousel arrows ----
  const track = document.getElementById('projects');
  const btns = [...document.querySelectorAll('[data-scroll]')];
  if (track) {
    const step = () => {
      const card = track.querySelector('.card');
      return card ? card.getBoundingClientRect().width + 20 : 340;
    };
    btns.forEach(b => b.addEventListener('click', () => track.scrollBy({ left: step() * +b.dataset.scroll, behavior: 'smooth' })));
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      btns.forEach(b => { b.disabled = +b.dataset.scroll < 0 ? track.scrollLeft <= 2 : track.scrollLeft >= max; });
    };
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    // arrow keys when the carousel has focus
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });
  }

  // ---- resume: placeholder until the PDF is added (set data-href on the link to enable it) ----
  const resume = document.getElementById('resumeLink');
  if (resume) resume.addEventListener('click', e => { if (resume.getAttribute('aria-disabled') === 'true') e.preventDefault(); });
})();
