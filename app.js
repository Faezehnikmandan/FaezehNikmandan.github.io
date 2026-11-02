const start = () => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const root = document.documentElement;
  const buzz = () => navigator.vibrate && navigator.vibrate(8);
  const make = (tag, props, parent = document.body) => parent.appendChild(Object.assign(document.createElement(tag), props));

  // Text scramble (decode effect)
  const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/+*';
  const scramble = (el, to = el.dataset.t || el.textContent) => {
    el.dataset.t = to; el.setAttribute('aria-label', to);
    if (reduce) { el.textContent = to; return; }
    let f = 0; clearInterval(el._t);
    el._t = setInterval(() => {
      el.textContent = [...to].map((c, i) => c === ' ' || i < f / 2 ? c : GL[Math.random() * GL.length | 0]).join('');
      if (++f > to.length * 2) { clearInterval(el._t); el.textContent = to; }
    }, 30);
  };

  // Loader with counter, once per visit
  const loader = $('#loader'), ldn = $('#ldn'), h3 = $('#paragraph h3');
  const intro = () => { loader.classList.add('done'); setTimeout(() => h3 && scramble(h3), 350); };
  let seen = false; try { seen = sessionStorage.getItem('seen'); sessionStorage.setItem('seen', 1); } catch (e) {}
  if (seen || reduce) { loader.style.display = 'none'; h3 && scramble(h3); }
  else {
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / 1100);
      ldn.textContent = Math.round(p * 100);
      p < 1 ? requestAnimationFrame(tick) : setTimeout(intro, 150);
    })(t0);
  }

  // Scroll progress and back-to-top
  const bar = make('div', { id: 'scrollbar' });
  const top = make('button', { id: 'toTop', textContent: '↑' }); top.setAttribute('aria-label', 'Back to top');
  const onScroll = () => {
    const h = root; bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    top.classList.toggle('show', h.scrollTop > 600);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.onclick = () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

  // Negative (blueprint) mode: button or triple-tap the portrait
  make('div', { id: 'neg' }).setAttribute('aria-hidden', 'true');
  const inv = make('button', { id: 'inv', textContent: '◐' }); inv.setAttribute('aria-label', 'Invert black and white');
  const setNeg = on => { root.classList.toggle('neg', on); try { localStorage.setItem('neg', on ? 1 : ''); } catch (e) {} buzz(); };
  try { if (localStorage.getItem('neg')) root.classList.add('neg'); } catch (e) {}
  inv.onclick = () => setNeg(!root.classList.contains('neg'));
  let taps = 0, tt; $('#pic') && $('#pic').addEventListener('click', () => {
    clearTimeout(tt); if (++taps >= 3) { taps = 0; setNeg(!root.classList.contains('neg')); } else tt = setTimeout(() => taps = 0, 600);
  });

  // Spotlight in intro
  const media = $('#media');
  if (media) {
    const spot = make('div', { className: 'spot' }, media); media.prepend(spot);
    const mv = e => { const p = e.touches ? e.touches[0] : e, r = media.getBoundingClientRect(); spot.style.setProperty('--x', p.clientX - r.left + 'px'); spot.style.setProperty('--y', p.clientY - r.top + 'px'); };
    media.addEventListener('pointermove', mv); media.addEventListener('touchmove', mv, { passive: true });
  }

  // Marquee driven by scroll speed and direction
  const mt = $('.mtrack');
  if (mt && !reduce) {
    let x = 0, dir = -1, vel = 0, last = scrollY;
    (function loop() {
      const dy = scrollY - last; last = scrollY;
      if (dy) dir = dy > 0 ? -1 : 1;
      vel += (Math.min(Math.abs(dy), 60) - vel) * .1;
      x += dir * (.7 + vel * .35);
      const half = mt.scrollWidth / 2; if (x <= -half) x += half; if (x > 0) x -= half;
      mt.style.transform = `translateX(${x}px) skewX(${-dir * Math.min(vel, 30) * .4}deg)`;
      requestAnimationFrame(loop);
    })();
  }

  // Reveal with stagger
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('#cards .row > .col').forEach((el, i) => el.style.transitionDelay = (i % 3) * 90 + 'ms');
  $$('#cards .row > .col, #cvTabs, .formbar').forEach(el => { el.classList.add('reveal'); io.observe(el); });

  // Cards: scramble title, haptics, 3D tilt with glare (mouse)
  $$('.card').forEach(c => {
    const t = $('.card-title', c);
    if (t) c.addEventListener('pointerenter', () => scramble(t));
    c.addEventListener('pointerdown', buzz);
    if (fine) {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.classList.add('tilt');
        c.style.setProperty('--ry', (x - .5) * 10 + 'deg'); c.style.setProperty('--rx', (.5 - y) * 10 + 'deg');
        c.style.setProperty('--gx', x * 100 + '%'); c.style.setProperty('--gy', y * 100 + '%');
      });
      c.addEventListener('pointerleave', () => { c.classList.remove('tilt'); c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    }
  });

  // Tabs (replaces accordion)
  const tabs = $$('#cvTabs [role=tab]'), pill = $('#cvTabs .pill');
  const place = () => { const t = tabs.find(b => b.getAttribute('aria-selected') === 'true'); if (t && pill) { pill.style.width = t.offsetWidth + 'px'; pill.style.transform = `translateX(${t.offsetLeft}px)`; } };
  const pick = t => { tabs.forEach(b => { const on = b === t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
      const p = $('#' + b.getAttribute('aria-controls')); p.hidden = !on; p.classList.toggle('active', on); }); place(); buzz(); };
  tabs.forEach((t, i) => { t.addEventListener('click', () => pick(t));
    t.addEventListener('keydown', e => { const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (k) { const n = tabs[(i + k + tabs.length) % tabs.length]; n.focus(); pick(n); } }); });
  place(); addEventListener('resize', place); document.fonts && document.fonts.ready.then(place);

  // Whole card is clickable (not only the button)
  $$('.card').forEach(c => c.addEventListener('click', e => {
    if (e.target.closest('a,button,.carousel-control-prev,.carousel-control-next')) return;
    const a = $('a.stretched-link', c); if (!a) return;
    if (e.metaKey || e.ctrlKey || a.target === '_blank') window.open(a.href, '_blank', 'noopener'); else location.href = a.href;
  }));

  // Desktop only: blend-mode cursor ring and magnetic buttons
  if (fine && !reduce) {
    const ring = make('div', { id: 'ring' }); let tx = -100, ty = -100, rx = -100, ry = -100;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
    (function f() { rx += (tx - rx) * .18; ry += (ty - ry) * .18; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(f); })();
    document.addEventListener('pointerover', e => ring.classList.toggle('big', !!e.target.closest('a,button,.card,input,textarea')));
    $$('.btn:not(.card .btn), #toTop, #inv, #endfooter a').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .3}px ${(e.clientY - r.top - r.height / 2) * .3}px`; });
      b.addEventListener('pointerleave', () => b.style.translate = '');
    });
  }

  // Live Turin time in the footer
  const loc = $('#endfooter p');
  if (loc) {
    const clock = make('span', { id: 'clock' }, loc); loc.append(' · ');
    loc.append(clock);
    const tick = () => clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }).format(new Date());
    tick(); setInterval(tick, 10000);
  }

  // Search filters cards
  const form = $('form[role="search"]'), row = $('#cards .row'), nav = $('#navbarSupportedContent');
  const closeNav = () => nav.classList.contains('show') && bootstrap.Collapse.getOrCreateInstance(nav).hide();
  if (form && row) {
    const input = $('input', form), empty = make('p', { id: 'noResults', textContent: 'No projects match your search.', hidden: true }, row);
    const filter = () => { const q = input.value.trim().toLowerCase(); let n = 0;
      $$('.col', row).forEach(c => { const hit = !q || c.textContent.toLowerCase().includes(q); c.hidden = !hit; if (hit) n++; }); empty.hidden = n > 0; };
    input.addEventListener('input', filter);
    form.addEventListener('submit', e => { e.preventDefault(); filter(); $('#cards').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); closeNav(); });
  }
  $$('.nav-link', nav).forEach(a => a.addEventListener('click', closeNav));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
