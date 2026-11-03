const start = () => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const root = document.documentElement;
  const buzz = () => navigator.vibrate && navigator.vibrate(8);
  const make = (tag, props, parent = document.body) => parent.appendChild(Object.assign(document.createElement(tag), props));

  const h3 = $('#paragraph h3');

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

  // Cards: haptics, 3D tilt with glare (mouse)
  $$('.card').forEach(c => {
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

  // Desktop only: magnetic buttons
  if (fine && !reduce) {
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

  // Cover images: find the right file extension automatically
  $$('img[data-auto]').forEach(img => { const ex = ['jpeg', 'png', 'webp', 'avif', 'JPG', 'PNG']; let k = 0;
    img.addEventListener('error', () => { if (k < ex.length) img.src = img.src.replace(/\.\w+$/, '.' + ex[k++]); }); });

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

  // ===== Languages: EN / IT / DE / FR =====
  const R = [["CV", "", "Lebenslauf", ""], ["Get in Touch", "Contattami", "Kontakt", "Me contacter"], ["Search", "Cerca", "Suchen", "Rechercher"], ["Welcome to my webpage!", "Benvenuti sul mio sito!", "Willkommen auf meiner Webseite!", "Bienvenue sur mon site !"], ["Hi, I'm Faezeh Nikmandan, a passionate architect specializing in sustainable design. With a Master's degree in Architecture for Sustainability from Politecnico di Torino, I've cultivated a deep commitment to creating spaces that harmonize with the environment. Beyond formal education, my curiosity and drive have led me to independently learn digital tools like HTML, CSS, and JavaScript, which I used to build this website from scratch.", "Ciao, sono Faezeh Nikmandan, un'architetta appassionata di progettazione sostenibile. Con una laurea magistrale in Architettura per la Sostenibilità al Politecnico di Torino, ho sviluppato un forte impegno nel creare spazi che si armonizzano con l'ambiente. Oltre alla formazione, curiosità e determinazione mi hanno portata a imparare da autodidatta strumenti digitali come HTML, CSS e JavaScript, con cui ho costruito questo sito da zero.", "Hallo, ich bin Faezeh Nikmandan, eine leidenschaftliche Architektin mit Schwerpunkt auf nachhaltigem Entwerfen. Mit einem Master in Architektur für Nachhaltigkeit vom Politecnico di Torino habe ich mich dem Gestalten von Räumen verschrieben, die im Einklang mit der Umwelt stehen. Über die Ausbildung hinaus haben mich Neugier und Antrieb dazu gebracht, mir digitale Werkzeuge wie HTML, CSS und JavaScript selbst beizubringen, mit denen ich diese Webseite von Grund auf gebaut habe.", "Bonjour, je suis Faezeh Nikmandan, une architecte passionnée par la conception durable. Titulaire d'un master en Architecture pour la durabilité du Politecnico di Torino, je m'engage à créer des espaces en harmonie avec l'environnement. Au-delà de ma formation, ma curiosité et ma motivation m'ont conduite à apprendre seule des outils numériques comme HTML, CSS et JavaScript, avec lesquels j'ai construit ce site de A à Z."], ["My journey goes beyond architecture—I'm constantly expanding my skill set, from mastering advanced design software to diving into interior design and digital technologies like Dynamo in Revit for LEED compliance. This portfolio reflects my dedication to innovation, sustainability, and continuous learning. I believe in breaking boundaries and embracing versatility in everything I do.", "Il mio percorso va oltre l'architettura: amplio costantemente le mie competenze, dall'uso avanzato di software di progettazione all'interior design, fino a tecnologie digitali come Dynamo in Revit per la conformità LEED. Questo portfolio riflette il mio impegno per l'innovazione, la sostenibilità e l'apprendimento continuo. Credo nel superare i confini e nell'abbracciare la versatilità in tutto ciò che faccio.", "Mein Weg geht über die Architektur hinaus: Ich erweitere ständig meine Fähigkeiten, von fortgeschrittener Entwurfssoftware über Innenarchitektur bis zu digitalen Technologien wie Dynamo in Revit für die LEED-Konformität. Dieses Portfolio spiegelt mein Engagement für Innovation, Nachhaltigkeit und lebenslanges Lernen wider. Ich glaube daran, Grenzen zu überwinden und Vielseitigkeit in allem zu leben, was ich tue.", "Mon parcours dépasse l'architecture : j'élargis sans cesse mes compétences, de la maîtrise de logiciels de conception avancés à l'architecture d'intérieur, jusqu'aux technologies numériques comme Dynamo dans Revit pour la conformité LEED. Ce portfolio reflète mon engagement envers l'innovation, la durabilité et l'apprentissage continu. Je crois qu'il faut repousser les limites et cultiver la polyvalence en tout ce que je fais."], ["Education", "Formazione", "Ausbildung", "Formation"], ["Work Experiences", "Esperienze lavorative", "Berufserfahrung", "Expériences professionnelles"], ["Skills", "Competenze", "Kenntnisse", "Compétences"], ["Master of Sciences in Architecture for sustainability 2021-2024", "Laurea Magistrale in Architettura per la Sostenibilità 2021-2024", "Master of Science in Architektur für Nachhaltigkeit 2021-2024", "Master en Architecture pour la durabilité 2021-2024"], ["Bachelor in Architecture Engineering 2015-2019", "Laurea in Ingegneria Edile-Architettura 2015-2019", "Bachelor in Architekturingenieurwesen 2015-2019", "Licence en ingénierie architecturale 2015-2019"], ["Italy", "Italia", "Italien", "Italie"], ["Turin", "Torino", "", ""], ["On-site", "In sede", "Vor Ort", "Sur site"], ["Part-time", "", "Teilzeit", "Temps partiel"], ["Full-time", "Tempo pieno", "Vollzeit", "Temps plein"], ["Hybrid", "Ibrido", "", "Hybride"], ["Junior Architect", "Architetto Junior", "Junior-Architekt", "Architecte junior"], ["Curriculum Internship", "Tirocinio curricolare", "Pflichtpraktikum", "Stage curriculaire"], ["Motion Graphic Designer", "", "", "Motion designer"], ["Interior Designer", "", "Innenarchitekt", "Architecte d'intérieur"], ["English Teacher", "Insegnante di inglese", "Englischlehrer", "Professeur d'anglais"], ["Present", "Oggi", "heute", "aujourd'hui"], ["Jan", "Gen", "", "janv."], ["Mar", "", "Mär", "mars"], ["Apr", "", "", "avr."], ["Jun", "Giu", "", "juin"], ["Aug", "Ago", "", "août"], ["Sep", "Set", "", "sept."], ["Language", "Lingue", "Sprachen", "Langues"], ["Programming Language", "Linguaggi di programmazione", "Programmiersprachen", "Langages de programmation"], ["Software Proficiency", "Competenze software", "Software-Kenntnisse", "Maîtrise des logiciels"], ["Rendering", "", "", "Rendu"], ["English", "Inglese", "Englisch", "Anglais"], ["Italian", "Italiano", "Italienisch", "Italien"], ["Persian", "Persiano", "Persisch", "Persan"], ["Turkish", "Turco", "Türkisch", "Turc"], ["Azerbaijan", "Azero", "Aserbaidschanisch", "Azéri"], ["Advanced", "Avanzato", "Fortgeschritten", "Avancé"], ["Elementary", "Elementare", "Grundkenntnisse", "Élémentaire"], ["Native", "Madrelingua", "Muttersprache", "Langue maternelle"], ["Year", "Anno", "Jahr", "Année"], ["Type", "Tipo", "Typ", ""], ["Location", "Luogo", "Ort", "Lieu"], ["Self Practice", "Esercizio personale", "Eigenübung", "Exercice personnel"], ["Professional Project", "Progetto professionale", "Berufliches Projekt", "Projet professionnel"], ["Master Thesis", "Tesi di laurea magistrale", "Masterarbeit", "Mémoire de master"], ["Master Group Project", "Progetto di gruppo (Magistrale)", "Master-Gruppenprojekt", "Projet de groupe (master)"], ["Bachelor Individual Project", "Progetto individuale (Triennale)", "Individuelles Bachelor-Projekt", "Projet individuel (licence)"], ["Somewhere in the world", "In qualche parte del mondo", "Irgendwo auf der Welt", "Quelque part dans le monde"], ["South Al Sharqiyah Governorate, Oman", "Governatorato di Al Sharqiyah Sud, Oman", "Gouvernement Süd-Scharqiyya, Oman", "Gouvernorat d'Al Sharqiyah du Sud, Oman"], ["Cape Town, South Africa", "Città del Capo, Sudafrica", "Kapstadt, Südafrika", "Le Cap, Afrique du Sud"], ["Ras Al Hadd Improvement Project", "Progetto di riqualificazione di Ras Al Hadd", "Verbesserungsprojekt Ras Al Hadd", "Projet d'amélioration de Ras Al Hadd"], ["Club Med Sansicario Alto and Borgo", "Club Med Sansicario Alto e Borgo", "Club Med Sansicario Alto und Borgo", "Club Med Sansicario Alto et Borgo"], ["BIM and LEED Integration for Water Conservation", "Integrazione BIM e LEED per il risparmio idrico", "BIM- und LEED-Integration zur Wassereinsparung", "Intégration BIM et LEED pour la conservation de l'eau"], ["Green Building Design", "Progettazione di Green Building", "Entwurf nachhaltiger Gebäude", "Conception de bâtiments écologiques"], ["Restoration and Integrated Conservation", "Restauro e conservazione integrata", "Restaurierung und integrierte Konservierung", "Restauration et conservation intégrée"], ["Advanced Parametric Design", "Progettazione parametrica avanzata", "Fortgeschrittenes parametrisches Entwerfen", "Conception paramétrique avancée"], ["Library Design", "Progetto di una biblioteca", "Bibliotheksentwurf", "Conception d'une bibliothèque"], ["View Portfolio", "Vedi il portfolio", "Portfolio ansehen", "Voir le portfolio"], ["See projects", "Vedi i progetti", "Projekte ansehen", "Voir les projets"], ["Turin Metropolitan Area", "Area metropolitana di Torino", "Metropolregion Turin", "Aire métropolitaine de Turin"], ["Student Residence", "Residenza studentesca", "Studentenwohnheim", "Résidence étudiante"], ["Landscape Project", "Progetto di paesaggio", "Landschaftsprojekt", "Projet paysager"], ["Let's PLAY!", "Giochiamo!", "Los geht's!", "Jouons !"], ["Explore more!", "Scopri di più!", "Mehr entdecken!", "En savoir plus !"], ["Currently open to mentorship opportunities, junior architect , BIM specialist and freelance", "Attualmente disponibile per opportunità di mentorship, architetto junior, specialista BIM e freelance", "Derzeit offen für Mentoring-Möglichkeiten, Junior-Architekt, BIM-Spezialist und Freelance", "Actuellement ouverte aux opportunités de mentorat, architecte junior, spécialiste BIM et freelance"], ["Name", "Nome", "", "Nom"], ["Surname", "Cognome", "Nachname", "Nom de famille"], ["Please Enter Your Email Adress", "Inserisci il tuo indirizzo email", "Bitte gib deine E-Mail-Adresse ein", "Veuillez saisir votre adresse e-mail"], ["How Can I Help You?", "Come posso aiutarti?", "Wie kann ich dir helfen?", "Comment puis-je vous aider ?"], ["submit", "Invia", "Senden", "Envoyer"], ["No projects match your search.", "Nessun progetto corrisponde alla ricerca.", "Keine Projekte gefunden.", "Aucun projet ne correspond à votre recherche."]];
  const D = { it: {}, de: {}, fr: {} };
  ['it', 'de', 'fr'].forEach((l, i) => R.forEach(r => { if (r[i + 1]) D[l][r[0]] = r[i + 1]; }));
  const RX = {};
  const tr = (s, l) => {
    const d = D[l];
    RX[l] = RX[l] || new RegExp('(?<!\\w)(' + Object.keys(d).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?!\\w)', 'g');
    return s.split(/<br\s*\/?>/i).map(p => p.trim().replace(RX[l], m => d[m])).join('<br>');
  };
  const SEL = '.nav-link,.navbar form button,#paragraph h3,#paragraph p,#cvTabs [role=tab],.tl h4,.tl p,.sk h4,.lang span,.lang em,.card-title,.card-text,.card .btn,.cta a,.intro p,#noResults';
  const apply = lang => {
    $$(SEL).forEach(el => {
      el._en = el._en || el.innerHTML;
      el.innerHTML = lang === 'en' ? el._en : tr(el._en, lang);
      if (el.dataset.t !== undefined) el.dataset.t = el.textContent;
    });
    $$('[placeholder]').forEach(el => { el._ph = el._ph || el.placeholder; el.placeholder = lang === 'en' ? el._ph : tr(el._ph, lang); });
    $$('input[type=submit]').forEach(el => { el._v = el._v || el.value; el.value = lang === 'en' ? el._v : tr(el._v, lang); });
    root.lang = lang;
    $$('.lang-switch button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    if (typeof place === 'function') place();
  };
  let lang = 'en';
  try { lang = localStorage.getItem('lang') || ''; } catch (e) {}
  if (!D[lang] && lang !== 'en') lang = (navigator.language || 'en').slice(0, 2);
  if (!D[lang]) lang = 'en';
  apply(lang);
  $$('.lang-switch button').forEach(b => b.addEventListener('click', () => {
    lang = b.dataset.lang; apply(lang); buzz();
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }));
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
