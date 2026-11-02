const start = () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Scroll progress bar and back-to-top button (added by script, HTML untouched)
  const bar = Object.assign(document.createElement('div'), { id: 'scrollbar' });
  const top = Object.assign(document.createElement('button'), { id: 'toTop', textContent: '↑' });
  top.setAttribute('aria-label', 'Back to top');
  document.body.append(bar, top);
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    top.classList.toggle('show', h.scrollTop > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  // Heading: letters rise in on load
  const h3 = $('#paragraph h3');
  if (h3 && !reduce) {
    const text = h3.textContent.trim();
    let i = 0;
    h3.setAttribute('aria-label', text);
    h3.innerHTML = text.split(' ').map(w =>
      `<span class="wd" aria-hidden="true">${[...w].map(c => `<span class="ch" style="--i:${i++}">${c}</span>`).join('')}</span>`
    ).join(' ');
  }

  // Spotlight follows mouse or finger over the intro
  const media = $('#media');
  if (media) {
    const spot = Object.assign(document.createElement('div'), { className: 'spot' });
    spot.setAttribute('aria-hidden', 'true');
    media.prepend(spot);
    const move = e => {
      const p = e.touches ? e.touches[0] : e, r = media.getBoundingClientRect();
      spot.style.setProperty('--x', (p.clientX - r.left) + 'px');
      spot.style.setProperty('--y', (p.clientY - r.top) + 'px');
    };
    media.addEventListener('pointermove', move);
    media.addEventListener('touchmove', move, { passive: true });
  }

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('#cards .row > .col, .accordion-item, .formbar').forEach(el => { el.classList.add('reveal'); io.observe(el); });

  // Search box now filters the project cards
  const form = $('form[role="search"]');
  const row = $('#cards .row');
  if (form && row) {
    const input = $('input', form);
    const empty = Object.assign(document.createElement('p'), { id: 'noResults', textContent: 'No projects match your search.', hidden: true });
    row.append(empty);
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      let n = 0;
      $$('.col', row).forEach(c => { const hit = !q || c.textContent.toLowerCase().includes(q); c.hidden = !hit; if (hit) n++; });
      empty.hidden = n > 0;
    };
    input.addEventListener('input', filter);
    form.addEventListener('submit', e => {
      e.preventDefault(); filter();
      $('#cards').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      const nav = $('#navbarSupportedContent');
      if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
    });
  }

  // Close the mobile menu after tapping a link
  const nav = $('#navbarSupportedContent');
  $$('.nav-link', nav).forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
  }));
};
// app.js is loaded in <head> in your page, so wait for the HTML to exist
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
