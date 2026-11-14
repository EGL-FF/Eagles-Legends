(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
  const bar = $('.progress'), glow = $('.cursor-glow');
  addEventListener('scroll', () => { const m = document.documentElement; bar.style.transform = `scaleX(${scrollY / Math.max(1, m.scrollHeight - innerHeight)})`; }, { passive: true });
  if (fine && !calm) {
    addEventListener('pointermove', e => { glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; glow.style.opacity = 1; const c = $('.crest-wrap'); if (c) c.style.transform = `translate(${(e.clientX / innerWidth - .5) * 18}px,${(e.clientY / innerHeight - .5) * 14}px)`; });
    $$('.tilt, .comp-card, .role-card').forEach(el => {
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`; });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const n = +e.target.dataset.count, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 1200); e.target.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    calm ? e.target.textContent = n : requestAnimationFrame(step);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => io.observe(el));
  const links = $$('.main-nav a[href^="#"]'), sec = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  sec.forEach(s => spy.observe(s));
})();
