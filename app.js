(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero name: letters rise one by one
  const name = document.getElementById('heroName');
  if (name && !reduce) {
    const label = name.getAttribute('aria-label');
    let i = 0;
    name.innerHTML = name.innerHTML.split('<br>').map(word =>
      `<span class="w" aria-hidden="true">${[...word].map(c => `<span class="ch" style="--i:${i++}">${c}</span>`).join('')}</span>`
    ).join('<br>');
    name.setAttribute('aria-label', label);
  }

  // Spotlight follows mouse or finger
  const hero = document.getElementById('hero');
  const spot = hero.querySelector('.spotlight');
  const move = e => {
    const p = e.touches ? e.touches[0] : e;
    const r = hero.getBoundingClientRect();
    spot.style.setProperty('--x', (p.clientX - r.left) + 'px');
    spot.style.setProperty('--y', (p.clientY - r.top) + 'px');
  };
  hero.addEventListener('pointermove', move);
  hero.addEventListener('touchmove', move, { passive: true });

  // Scroll progress + back-to-top
  const bar = document.getElementById('progress');
  const top = document.getElementById('toTop');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    top.classList.toggle('show', h.scrollTop > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll('#work .row > .col').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Skill bar values
  document.querySelectorAll('[data-bars] li').forEach(li => li.style.setProperty('--v', li.dataset.v));

  // Close mobile menu after tapping a link
  const nav = document.getElementById('nav');
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
  }));
})();
