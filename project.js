/* Project pages: text is fixed below, images are discovered automatically.
   Name images 1, 2, 3 ... (jpg, jpeg, png, webp, avif) in the project's folder. Up to 100. */
const ORDER = ['chivasso', 'residence', 'smartwater', 'greenbuilding', 'restoration', 'parametric', 'hexagonal', 'library'];
const PAGE = { chivasso: 'chivasso.html', residence: 'residence.html', smartwater: 'smartwater.html', greenbuilding: 'greenbuilding.html', restoration: 'restoration.html', parametric: 'parametric.html', hexagonal: 'hexagonal.html', library: 'library.html' };
const P = {
  chivasso: { f: 'portfolio/work/chivasso', t: 'Da Ponte a Ponte', s: 'Una corona verde per Chivasso', tag: ['Professional Project', 'Urban Design Development & Executive Documentation'], loc: 'Chivasso, Italy', tx: [
`The project develops an urban greening strategy across six intervention areas in Chivasso, RIC2–RIC7. Working from the approved PFTE, the executive design reorganises existing streets and parking areas through coordinated proposals for greenery, pedestrian routes, urban furniture, traffic signs, permeable paving and rainwater management. The aim is to create more sustainable and efficient urban environments for pedestrians, vehicles and local residents.`,
`My work covered design development across all six areas. I determined parking capacity and the arrangement of perpendicular, parallel and 45-degree parking spaces, considering the corresponding street and manoeuvring widths with reference to Italy’s Codice della Strada. I also developed pedestrian paths and green areas and decided the placement of benches, waste bins and traffic signs.`,
`At pedestrian crossings, I incorporated pavement extensions aligned with the outer edge of roadside parking spaces. These allow pedestrians to move beyond parked vehicles before crossing, improving visibility between pedestrians and approaching drivers.`,
`I produced survey and existing-condition drawings, proposed plans and executive sections in **AutoCAD**. I also established a shared drawing structure using **external references (Xrefs)**, enabling **five team members to work simultaneously** on different parts of the project while maintaining a coordinated drawing set.`] },
  residence: { f: 'portfolio/work/collegno', t: 'Student Residence', s: 'Collegno', tag: ['Professional Project', 'Architectural Development & BIM Modelling'], loc: 'Collegno, Turin, Italy', tx: [
`The project proposes a new seven-storey student residence on Via Torino, near Corso Francia, in Collegno, Turin. Replacing existing structures, the development combines student housing units with shared spaces and service areas, providing accommodation within a well-connected urban setting.`,
`I worked across different project phases, developing and updating the architectural model in **Autodesk Revit** and coordinating existing-condition information with design proposals. My responsibilities included detailed BIM modelling and the production of plans, sections and elevations to describe the building’s spatial organisation and architectural development.`,
`**All project documentation and sheet layouts were produced in Revit.** This included comparative plans—red and yellow drawings—identifying demolition and proposed construction works. I also prepared **model-based quantity take-offs and schedules** for building elements and spaces, keeping the documentation consistent with the developing model.`,
`I produced **3D renderings directly in Revit** and assembled presentation sheets to communicate the proposed architecture, materials and spatial relationships. The project strengthened my ability to manage modelling, technical documentation and visual communication within a single BIM environment.`] },
  smartwater: { f: 'portfolio/thesis', t: 'Smart Water', s: 'BIM-based water efficiency assessment', tag: ['Individual Master’s Thesis', 'Politecnico di Torino'], loc: 'Turin, Italy · 2024', tx: [
`The thesis explores water conservation in buildings through a methodology combining **Autodesk Revit**, **Dynamo visual programming** and **Python scripting within selected Dynamo nodes**. Using the LEED Water Efficiency framework, it automates assessment calculations and helps users compare water-saving strategies during the early stages of design.`,
`I developed the complete research methodology and applied it to Ex Manifattura Tabacchi in Torino. A conceptual **Revit model**, created from existing CAD drawings, provides the geometric information needed to assess building water consumption and landscape irrigation demand. The approach requires a low-detail model and readily available inputs, allowing assessment before detailed architectural development.`,
`The **Dynamo workflow, supported by Python**, connects model information with parameters describing indoor fixtures, planting, irrigation schedules, rainfall, collection surfaces and storage capacity. Through Dynamo Player, users can change inputs and compare alternatives without modifying the underlying scripts.`,
`I tested three scenarios representing low, medium and high water demand. Five graphical outputs, accompanied by explanatory text, communicate monthly water balances, irrigation requirements, rainwater availability, storage adequacy, potable water savings and selected LEED Water Efficiency credit scores.`,
`The thesis demonstrates how BIM information can support measurable environmental assessment and informed design decisions. Its scope covers selected water-efficiency prerequisites and credits, while recognising that full LEED certification requires assessment across the wider certification framework.`] },
  greenbuilding: { f: 'portfolio/master/cape town', t: 'Guest House', s: 'Cape Town', tag: ['Academic Master’s Project', 'Team of Five'], loc: 'Cape Town, South Africa · 2022', tx: [
`The Guest House consists of six hexagonal clusters, each containing five rooms and a kitchen, connected by a shaded wooden pergola and organised around a central communal building. The proposal combines private accommodation with shared outdoor spaces, using the relationship between rooms, courtyards and connecting paths to support everyday social interaction.`,
`The hexagonal geometry establishes a modular system that allows repetition and future expansion. Locally sourced materials, including compressed earth blocks, support the project’s approach to resource-conscious construction. Self-construction and participatory design principles were also considered as ways to involve the community in the development.`,
`Drawing on African vernacular architecture, the design incorporates courtyards, patios and shaded circulation spaces. Cross ventilation, shading and material choices were evaluated using **DesignBuilder** to assess their suitability for Cape Town’s climate.`,
`Within the five-person team, I produced **architectural plans and sections in Autodesk Revit**, translating the shared design into coordinated drawings. I completed **post-production in Adobe Photoshop**, refining the drawings and presentation graphics to communicate the project’s spatial organisation, materials and architectural character.`] },
  restoration: { f: 'portfolio/master/restoration', t: 'Stupinigi Kennels', s: 'Metric survey & digital reconstruction', tag: ['Academic Master’s Project', 'Heritage Documentation & Scan-to-BIM'], loc: 'Turin, Italy · 2022', tx: [
`The project investigates the Stupinigi Kennels through metric survey, point-cloud processing and digital reconstruction. Situated within the wider heritage context of the Savoy royal residences, the study focuses on documenting the existing building as a basis for architectural understanding and restoration analysis.`,
`The methodology combines topographic measurements and laser scanning to establish a shared spatial reference and record the central hall and rear courtyard. Survey targets and control points support the alignment of different scans, allowing the captured geometry to be assembled into a coordinated representation.`,
`My work included participation in survey activities and **point-cloud registration, georeferencing, cleaning and merging in CloudCompare**. The processed data were prepared in **Autodesk ReCap** and transferred into **Revit** as a reference for reconstructing the existing architecture.`,
`Using the point cloud, I developed the digital representation of the central hall and rear courtyard and produced **plans, sections and elevations in Revit**. The workflow supported the study of irregular geometry, vaulted spaces and relationships between architectural elements, connecting measured survey information with drawings for restoration analysis.`] },
  parametric: { f: 'portfolio/master/parametric', t: 'Advanced Parametric Design', s: 'Convention centre & supermarket', tag: ['Academic Master’s Project', 'BIM Modelling & Building Performance'], loc: 'Turin, Italy · 2023', tx: [
`The project brings together a convention centre and a supermarket, using an existing historic barracks as a transition between the two functions and the centrepiece of a public plaza. The design organises spaces according to their functions while establishing a shared architectural identity through curved roofs.`,
`A car-free plaza connects the principal buildings and creates opportunities for public interaction. Defined entrances support access from the surrounding streets, while underground parking accommodates vehicles. Landscaping connects the development with nearby green spaces, including Giardino Nicola Grosa and the square on Corso Ferrucci.`,
`I developed the entire project in **Autodesk Revit**, including architectural modelling and the **family-based development of the roof assembly**. Its components include white cladding panels, a steel space frame, steel ball-node connectors and gypsum panels. The building envelope incorporates a **double-skin façade with shading panels**, linking architectural expression with environmental design.`,
`Using **DesignBuilder**, I evaluated daylighting, ventilation and thermal performance through graphical analysis, including illuminance maps and heat maps. The daylighting strategy targeted adequate illumination for visual tasks, reduced dependence on electric lighting, balanced luminance and glare control. Shading and glazing choices also aimed to limit direct solar discomfort and summer overheating. The glazing performance target combined 47% solar-energy reflectance with visible light transmittance above 61%.`,
`The project connected **parametric modelling, technical problem-solving and performance analysis**, using environmental assessment to inform architectural decisions.`] },
  hexagonal: { f: 'portfolio/tarhe 5', t: 'Hexagonal', s: 'Residential complex', tag: ['Bachelor’s Degree Project', 'Residential Design & Architectural Visualisation'], loc: '', tx: [
`Hexagonal explores an alternative to conventional residential complexes conceived as large blocks with limited outdoor space. My design strategy began with residents’ needs and proposed two-level homes with expansive terraces, strengthening the relationship between indoor living, greenery and open skies.`,
`I selected a hexagonal form to create multiple orientations and wider views of the surrounding landscape. The arrangement of the blocks maintains direct visual connections with the outdoors, while terraces extend everyday activities beyond the enclosed rooms. The design treats outdoor space as an integral part of the home.`,
`The complex contains three housing types with an identical first-level layout and different second-floor arrangements. **Type A has one bedroom, Type B has two bedrooms and Type C has three bedrooms**, allowing the architectural system to accommodate different household needs while retaining a consistent formal language.`,
`I developed the **3D architectural model in Autodesk 3ds Max** and produced **renderings using V-Ray**. The visualisations explore building forms, materials, daylight and the relationship between the residential blocks, terraces and surrounding landscape.`] },
  library: { f: 'portfolio/tarhe 3', t: 'Library Design', s: 'Tabriz, Iran', tag: ['Bachelor Individual Project'], loc: 'Tabriz, Iran · 2016', tx: [] }
};

(() => {
  const slug = document.body.dataset.slug, d = P[slug], $ = s => document.querySelector(s);
  const bold = s => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const i = ORDER.indexOf(slug), nx = ORDER[(i + 1) % ORDER.length], n2 = P[nx];
  document.title = `${d.t}: ${d.s} | Faezeh Nikmandan`;
  $('#app').innerHTML = `
  <header class="bar"><a href="./#cards" class="back">← Projects</a><span>${String(i + 1).padStart(2, '0')} / ${String(ORDER.length).padStart(2, '0')}</span></header>
  <section class="intro">
    <p class="chips">${d.tag.map(t => `<span>${t}</span>`).join('')}${d.loc ? `<span>${d.loc}</span>` : ''}</p>
    <h1>${d.t}</h1><p class="sub">${d.s}</p>
  </section>
  <figure class="hero" id="hero" hidden></figure>
  ${d.tx.length ? `<section class="text">${d.tx.map(p => `<p class="rv">${bold(p)}</p>`).join('')}</section>` : ''}
  <p class="count" id="count"></p>
  <section class="gallery" id="gal"></section>
  <a class="next" href="./${PAGE[nx]}"><small>Next project</small><span>${n2.t} →</span></a>
  <div class="lb" id="lb" hidden><button class="x" aria-label="Close">×</button><button class="p" aria-label="Previous">←</button><img alt=""><button class="n" aria-label="Next">→</button><span class="c"></span></div>`;
  const bar = document.createElement('div'); bar.id = 'pg'; document.body.append(bar);
  addEventListener('scroll', () => bar.style.width = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100 + '%', { passive: true });

  // ---- find images 1..100 ----
  const base = './' + encodeURI(d.f), EX = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'JPG', 'JPEG', 'PNG'];
  let pref = 0; const imgs = [];
  const ok = u => new Promise(r => { const m = new Image(); m.onload = () => r(true); m.onerror = () => r(false); m.src = u; });
  const find = async n => { for (let k = 0; k < EX.length; k++) { const e = (pref + k) % EX.length, u = `${base}/${n}.${EX[e]}`; if (await ok(u)) { pref = e; return u; } } return null; };
  const add = u => {
    const idx = imgs.push(u) - 1;
    if (idx === 0) { const h = $('#hero'); h.hidden = false; h.innerHTML = `<img src="${u}" alt="${d.t}" decoding="async">`; h.onclick = () => open(0); }
    else { const f = document.createElement('figure'); f.className = 'rv'; f.innerHTML = `<img src="${u}" alt="${d.t} ${idx + 1}" loading="lazy" decoding="async">`; f.onclick = () => open(idx); $('#gal').append(f); io.observe(f); }
    $('#count').textContent = imgs.length + (imgs.length === 1 ? ' image' : ' images');
  };
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .08 });
  document.querySelectorAll('.rv').forEach(e => io.observe(e));
  (async () => {
    for (let s = 1; s <= 100; s += 6) {
      const r = await Promise.all(Array.from({ length: Math.min(6, 101 - s) }, (_, k) => find(s + k)));
      const got = r.filter(Boolean); got.forEach(add);
      if (!got.length) break;
    }
    if (!imgs.length) $('#count').innerHTML = `No images yet. Add <b>1.jpg, 2.jpg, 3.jpg …</b> to <b>${d.f}</b>`;
  })();

  // ---- lightbox ----
  const lb = $('#lb'), li = lb.querySelector('img'), lc = lb.querySelector('.c'); let cur = 0;
  const show = k => { cur = (k + imgs.length) % imgs.length; li.src = imgs[cur]; lc.textContent = `${cur + 1} / ${imgs.length}`; };
  const open = k => { show(k); lb.hidden = false; document.body.style.overflow = 'hidden'; };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  lb.querySelector('.x').onclick = close; lb.querySelector('.p').onclick = () => show(cur - 1); lb.querySelector('.n').onclick = () => show(cur + 1);
  lb.onclick = e => e.target === lb && close();
  addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  let sx = 0; lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
})();
