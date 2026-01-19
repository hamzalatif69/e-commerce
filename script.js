/* global localStorage */

const APP = {
  brand: {
    name: 'NovaLearn',
    tagline: 'Premium online courses built for real-world skills'
  },
  storageKeys: {
    enrollments: 'novalearn_enrollments',
    contact: 'novalearn_contact_requests'
  },
  state: {
    query: '',
    category: 'All'
  }
};

const COURSES = [
  {
    id: 'js-architect',
    title: 'JavaScript Systems: From Fundamentals to Architecture',
    price: 79,
    rating: 4.8,
    ratingCount: 1823,
    level: 'Intermediate',
    duration: '11h 30m',
    lessons: 54,
    category: 'Web',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=70',
    summary: 'Build production-ready JavaScript applications with clean modular architecture, robust state management, and performance-first patterns.',
    outcomes: [
      'Design scalable front-end architectures without frameworks',
      'Ship fast UIs with async patterns and rendering strategies',
      'Write maintainable modules, utilities, and feature boundaries',
      'Implement real caching, error handling, and telemetry basics'
    ]
  },
  {
    id: 'ui-engineering',
    title: 'UI Engineering: Design Systems & Motion',
    price: 69,
    rating: 4.7,
    ratingCount: 1164,
    level: 'All Levels',
    duration: '9h 05m',
    lessons: 41,
    category: 'Design',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=70',
    summary: 'Create premium dark UIs with consistent typography, spacing, components, and motion that feels expensive—not noisy.',
    outcomes: [
      'Build a reusable component foundation in CSS',
      'Master spacing, rhythm, and responsive scale',
      'Apply motion design with accessibility in mind',
      'Deliver UI polish that holds up in production'
    ]
  },
  {
    id: 'web-perf',
    title: 'Web Performance: Core Web Vitals Mastery',
    price: 89,
    rating: 4.9,
    ratingCount: 932,
    level: 'Advanced',
    duration: '8h 40m',
    lessons: 36,
    category: 'Web',
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1400&q=70',
    summary: 'Optimize real user metrics with practical audits, caching strategies, image pipelines, and shipping fewer bytes—without breaking UX.',
    outcomes: [
      'Improve LCP/INP/CLS with targeted techniques',
      'Implement caching and offline strategies with service workers',
      'Ship high-quality images and avoid layout shifts',
      'Build performance budgets and measure what matters'
    ]
  },
  {
    id: 'product-led',
    title: 'Product Strategy for Builders: SaaS Thinking',
    price: 59,
    rating: 4.6,
    ratingCount: 774,
    level: 'Beginner',
    duration: '6h 15m',
    lessons: 28,
    category: 'Business',
    badge: 'Practical',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=70',
    summary: 'Turn ideas into structured products: positioning, onboarding, pricing, retention loops, and high-signal metrics—built for makers.',
    outcomes: [
      'Define a clear product narrative and audience',
      'Craft pricing tiers and packaging that converts',
      'Map onboarding with activation milestones',
      'Select metrics that reflect real value creation'
    ]
  },
  {
    id: 'security-basics',
    title: 'Web Security Essentials: Practical Threat Modeling',
    price: 75,
    rating: 4.7,
    ratingCount: 623,
    level: 'Intermediate',
    duration: '7h 20m',
    lessons: 33,
    category: 'Security',
    badge: 'Must Have',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=70',
    summary: 'Protect your applications with a practical approach to common web threats, secure headers, authentication pitfalls, and safer defaults.',
    outcomes: [
      'Understand and mitigate common web vulnerabilities',
      'Design safer auth flows and session handling',
      'Apply secure-by-default HTTP headers',
      'Build a threat model that actually helps teams'
    ]
  },
  {
    id: 'data-fundamentals',
    title: 'Analytics Foundations: From Events to Insights',
    price: 64,
    rating: 4.5,
    ratingCount: 508,
    level: 'All Levels',
    duration: '5h 55m',
    lessons: 26,
    category: 'Data',
    badge: 'Hands-on',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=70',
    summary: 'Set up event tracking that is clean, consistent, and analysis-ready. Learn funnels, cohorts, and dashboards without noisy data.',
    outcomes: [
      'Define event schemas that remain stable over time',
      'Build funnels and cohort views that reveal retention',
      'Avoid analytics anti-patterns and data drift',
      'Communicate insights clearly to stakeholders'
    ]
  }
];

const elApp = document.getElementById('app');
const elRouteTitle = document.getElementById('routeTitle');
const elInstall = document.getElementById('installBtn');
const elEnrollmentsBtn = document.getElementById('enrollmentsBtn');

const elDrawerBackdrop = document.getElementById('drawerBackdrop');
const elDrawer = document.getElementById('drawer');
const elDrawerBody = document.getElementById('drawerBody');
const elDrawerTitle = document.getElementById('drawerTitle');
const elDrawerClose = document.getElementById('drawerClose');

const elToastWrap = document.getElementById('toastWrap');

function formatMoney(n){
  return `$${Number(n).toFixed(0)}`;
}

function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

function stars(rating){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

function safeText(s){
  return String(s).replace(/[&<>"']/g, (c)=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[c]));
}

function getEnrollments(){
  try{
    const raw = localStorage.getItem(APP.storageKeys.enrollments);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  }catch{
    return [];
  }
}

function setEnrollments(ids){
  localStorage.setItem(APP.storageKeys.enrollments, JSON.stringify(ids));
  updateEnrollmentsBadge();
}

function updateEnrollmentsBadge(){
  const count = getEnrollments().length;
  elEnrollmentsBtn.setAttribute('data-count', String(count));
  elEnrollmentsBtn.innerHTML = count ? `Enrollments (${count})` : 'Enrollments';
}

function toast(title, message){
  const node = document.createElement('div');
  node.className = 'toast';
  node.innerHTML = `<strong>${safeText(title)}</strong><span>${safeText(message)}</span>`;
  elToastWrap.appendChild(node);
  window.setTimeout(()=>{ node.style.opacity = '0'; node.style.transform = 'translateY(6px)'; }, 2600);
  window.setTimeout(()=>{ node.remove(); }, 3200);
}

function openDrawer(title, html){
  elDrawerTitle.textContent = title;
  elDrawerBody.innerHTML = html;
  elDrawerBackdrop.classList.add('open');
  elDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer(){
  elDrawerBackdrop.classList.remove('open');
  elDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

elDrawerBackdrop.addEventListener('click', closeDrawer);
elDrawerClose.addEventListener('click', closeDrawer);

function enrollCourse(courseId){
  const course = COURSES.find(c=>c.id === courseId);
  if(!course){
    toast('Not found', 'This course is no longer available.');
    return;
  }
  const ids = getEnrollments();
  if(!ids.includes(courseId)){
    ids.unshift(courseId);
    setEnrollments(ids);
    toast('Added to enrollments', `${course.title} is ready to checkout.`);
  }else{
    toast('Already added', 'This course is already in your enrollments.');
  }
}

function removeEnrollment(courseId){
  const ids = getEnrollments().filter(id=>id !== courseId);
  setEnrollments(ids);
  renderEnrollmentsDrawer();
}

function renderEnrollmentsDrawer(){
  const ids = getEnrollments();
  const selected = ids.map(id => COURSES.find(c=>c.id===id)).filter(Boolean);
  const total = selected.reduce((sum,c)=>sum+c.price,0);

  const list = selected.length ? selected.map(c=>{
    return `
      <div class="item">
        <div class="item-top">
          <div>
            <strong>${safeText(c.title)}</strong>
            <small>${safeText(c.level)} • ${safeText(c.duration)} • ${formatMoney(c.price)}</small>
          </div>
          <button class="btn btn-danger" data-remove="${safeText(c.id)}">Remove</button>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="item">
      <strong>No courses selected</strong>
      <small class="muted">Browse courses and press Enroll to add them here.</small>
    </div>
  `;

  const checkout = `
    <div class="item">
      <div class="item-top">
        <div>
          <strong>Order summary</strong>
          <small>${selected.length} course${selected.length===1?'':'s'} • Total ${formatMoney(total)}</small>
        </div>
      </div>
    </div>

    <div class="item">
      <strong>Complete enrollment</strong>
      <small class="muted">This site is a static PWA. We securely store your request locally and provide next steps.</small>
      <form class="form" id="checkoutForm">
        <div>
          <label for="checkoutEmail">Email</label>
          <input class="input" id="checkoutEmail" name="email" type="email" autocomplete="email" required placeholder="you@domain.com" />
        </div>
        <div>
          <label for="checkoutName">Full name</label>
          <input class="input" id="checkoutName" name="name" type="text" autocomplete="name" required placeholder="Your name" />
        </div>
        <button class="btn btn-primary" type="submit" ${selected.length? '' : 'disabled'}>Confirm enrollment</button>
      </form>
    </div>
  `;

  openDrawer('Enrollments', `<div>${list}</div>${checkout}`);

  elDrawerBody.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', ()=> removeEnrollment(btn.getAttribute('data-remove')));
  });

  const form = elDrawerBody.querySelector('#checkoutForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(!selected.length) return;
      const fd = new FormData(form);
      const email = String(fd.get('email')||'').trim();
      const name = String(fd.get('name')||'').trim();
      if(!email || !name){
        toast('Missing details', 'Please fill name and email.');
        return;
      }
      setEnrollments([]);
      closeDrawer();
      toast('Enrollment confirmed', `Thanks ${name}. A confirmation has been saved on this device.`);
    });
  }
}

elEnrollmentsBtn.addEventListener('click', renderEnrollmentsDrawer);

function route(){
  const hash = location.hash || '#/';
  const [pathPart, queryPart] = hash.slice(1).split('?');
  const path = pathPart || '/';
  const params = new URLSearchParams(queryPart || '');
  return { path, params };
}

function setCurrentNav(path){
  document.querySelectorAll('[data-nav]').forEach(a=>{
    const p = a.getAttribute('data-nav');
    if(p === path) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
}

function courseCard(course){
  const badge = course.badge ? `<span class="pill">${safeText(course.badge)}</span>` : '';
  return `
    <article class="card reveal">
      <div class="card-media">
        <img loading="lazy" decoding="async" src="${safeText(course.image)}" alt="${safeText(course.title)}" />
      </div>
      <div class="card-body">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px">
          <h3 class="card-title">${safeText(course.title)}</h3>
          ${badge}
        </div>
        <div class="card-meta">
          <div class="rating"><span class="stars">${safeText(stars(course.rating))}</span><span>${course.rating.toFixed(1)} (${course.ratingCount.toLocaleString()})</span></div>
          <div class="price">${formatMoney(course.price)}</div>
        </div>
        <div class="card-actions">
          <a class="btn" href="#/course?id=${encodeURIComponent(course.id)}">Details</a>
          <button class="btn btn-primary" data-enroll="${safeText(course.id)}">Enroll</button>
        </div>
      </div>
    </article>
  `;
}

function mount(html, title, navPath){
  elApp.innerHTML = html;
  document.title = `${APP.brand.name} — ${title}`;
  elRouteTitle.textContent = title;
  setCurrentNav(navPath);
  window.scrollTo({top:0, behavior:'instant'});
  bindEnrollButtons();
  setupReveal();
}

function bindEnrollButtons(){
  elApp.querySelectorAll('[data-enroll]').forEach(btn=>{
    btn.addEventListener('click', ()=> enrollCourse(btn.getAttribute('data-enroll')));
  });
}

function setupReveal(){
  const els = Array.from(document.querySelectorAll('.reveal'));
  if(!('IntersectionObserver' in window)){
    els.forEach(el=>el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.16 });
  els.forEach(el=>io.observe(el));
}

function viewHome(){
  const featured = COURSES.slice(0,3).map(courseCard).join('');
  const benefits = [
    {t:'Premium curriculum', d:'Tight lessons, real projects, and the engineering decisions that matter in production.'},
    {t:'Offline-ready learning', d:'Install the app and keep browsing course details—even when the network drops.'},
    {t:'Built for momentum', d:'Clear outcomes, structured lessons, and a focused experience designed to get you shipping.'}
  ];

  mount(`
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-card">
            <div class="hero-content">
              <span class="pill">Dark-premium learning platform • PWA</span>
              <h1>Build skills that ship products.</h1>
              <p>${safeText(APP.brand.tagline)} Browse modern courses, save them for enrollment, and install the app for an offline-first experience.</p>
              <div class="hero-cta">
                <a class="btn btn-primary" href="#/courses">Browse courses</a>
                <button class="btn" id="heroInstall" type="button">Install app</button>
              </div>
              <div class="metrics">
                <div class="metric"><strong>4.8/5</strong><span>Average rating</span></div>
                <div class="metric"><strong>20k+</strong><span>Active learners</span></div>
                <div class="metric"><strong>Offline</strong><span>PWA-ready</span></div>
              </div>
            </div>
          </div>

          <div class="hero-side">
            <div class="side-card">
              <div class="side-title">What you get</div>
              <p class="side-text">A clean course-buying flow, premium UI, smooth motion, and a GitHub Pages-friendly PWA implementation.</p>
            </div>
            <div class="side-card">
              <div class="side-title">Built for performance</div>
              <p class="side-text">No heavy frameworks. Fast rendering, local persistence, and an app-shell service worker strategy.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Featured courses</h2>
            <p>Hand-picked tracks with high-signal lessons and outcomes you can apply immediately.</p>
          </div>
          <a class="btn" href="#/courses">View all</a>
        </div>
        <div class="grid">${featured}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Why NovaLearn</h2>
            <p>Premium content meets a premium experience: fast, offline-capable, and designed with product-grade UI patterns.</p>
          </div>
        </div>
        <div class="grid">
          ${benefits.map(b=>`
            <div class="panel reveal" style="grid-column: span 4;">
              <h3>${safeText(b.t)}</h3>
              <p>${safeText(b.d)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `, 'Home', '/');

  const heroInstall = document.getElementById('heroInstall');
  if(heroInstall){
    heroInstall.addEventListener('click', ()=>{
      if(!elInstall.hidden) elInstall.click();
      else toast('Install not ready', 'When the app becomes installable, the Install button will appear in the top bar.');
    });
  }
}

function uniqueCategories(){
  const set = new Set(COURSES.map(c=>c.category));
  return ['All', ...Array.from(set).sort((a,b)=>a.localeCompare(b))];
}

function filteredCourses(){
  const q = APP.state.query.trim().toLowerCase();
  return COURSES.filter(c=>{
    const inCat = APP.state.category === 'All' || c.category === APP.state.category;
    const inQuery = !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
    return inCat && inQuery;
  });
}

function viewCourses(){
  const categories = uniqueCategories();
  const results = filteredCourses();

  mount(`
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Courses</h2>
            <p>Choose a track, review outcomes, and enroll. Your selection is saved locally so you can continue offline.</p>
          </div>
        </div>

        <div class="toolbar">
          <input class="input" id="courseSearch" type="search" placeholder="Search courses" value="${safeText(APP.state.query)}" aria-label="Search courses" />
          <div class="pills" id="catPills" aria-label="Categories">
            ${categories.map(cat=>`
              <button class="btn ${cat===APP.state.category ? 'active' : ''}" type="button" data-cat="${safeText(cat)}">${safeText(cat)}</button>
            `).join('')}
          </div>
        </div>

        <div class="muted" style="margin: 0 0 12px">Showing <strong>${results.length}</strong> course${results.length===1?'':'s'}</div>

        <div class="grid" id="courseGrid">
          ${results.map(courseCard).join('')}
        </div>
      </div>
    </section>
  `, 'Courses', '/courses');

  const input = document.getElementById('courseSearch');
  input.addEventListener('input', ()=>{
    APP.state.query = input.value;
    viewCourses();
  }, { passive: true });

  document.querySelectorAll('[data-cat]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      APP.state.category = btn.getAttribute('data-cat') || 'All';
      viewCourses();
    });
  });
}

function viewCourseDetails(courseId){
  const course = COURSES.find(c=>c.id === courseId);
  if(!course){
    mount(`
      <section class="section">
        <div class="container">
          <div class="panel">
            <h3>Course not found</h3>
            <p>The course you’re looking for doesn’t exist. Browse all courses to continue.</p>
            <div style="margin-top:12px"><a class="btn btn-primary" href="#/courses">Browse courses</a></div>
          </div>
        </div>
      </section>
    `, 'Course', '/courses');
    return;
  }

  mount(`
    <section class="section">
      <div class="container">
        <div class="panel reveal" style="overflow:hidden; padding:0">
          <div class="card-media" style="aspect-ratio: 21/9">
            <img loading="eager" decoding="async" src="${safeText(course.image)}" alt="${safeText(course.title)}" />
          </div>
          <div style="padding:16px">
            <div class="pill" style="justify-content:space-between">
              <span>${safeText(course.category)} • ${safeText(course.level)}</span>
              <span class="price">${formatMoney(course.price)}</span>
            </div>
            <h2 style="margin:12px 0 8px; letter-spacing:-.4px">${safeText(course.title)}</h2>
            <p class="muted" style="margin:0; line-height:1.65">${safeText(course.summary)}</p>

            <div class="kv">
              <div class="pill"><span>Duration</span><strong>${safeText(course.duration)}</strong></div>
              <div class="pill"><span>Lessons</span><strong>${course.lessons}</strong></div>
              <div class="pill"><span>Rating</span><strong>${course.rating.toFixed(1)}/5</strong></div>
              <div class="pill"><span>Reviews</span><strong>${course.ratingCount.toLocaleString()}</strong></div>
            </div>

            <div class="card-actions" style="margin-top:14px">
              <a class="btn" href="#/courses">Back</a>
              <button class="btn btn-primary" data-enroll="${safeText(course.id)}">Enroll</button>
            </div>
          </div>
        </div>

        <div class="split" style="margin-top:14px">
          <div class="panel reveal">
            <h3>What you’ll build</h3>
            <p>${safeText(course.outcomes[0])}</p>
            <p style="margin-top:10px">${safeText(course.outcomes[1])}</p>
          </div>
          <div class="panel reveal">
            <h3>Learning outcomes</h3>
            <div style="display:grid; gap:8px; margin-top:10px">
              ${course.outcomes.map(o=>`<div class="pill" style="justify-content:flex-start">${safeText(o)}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `, 'Course details', '/courses');
}

function viewAbout(){
  mount(`
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>About</h2>
            <p>NovaLearn is a course platform designed like a premium SaaS product: fast, offline-capable, and built for focused learning.</p>
          </div>
        </div>

        <div class="split">
          <div class="panel reveal">
            <h3>Mission</h3>
            <p>Make high-quality education feel as polished as the products we build. Clear outcomes, modern UX, and a platform you can install and trust.</p>
            <div style="margin-top:12px" class="pill">Offline-ready • GitHub Pages compatible • Vanilla JS</div>
          </div>
          <div class="panel reveal">
            <h3>How it works</h3>
            <p>Browse courses, add them to your enrollments, and confirm. Your selections are stored locally so the app remains usable even if the network drops.</p>
          </div>
        </div>
      </div>
    </section>
  `, 'About', '/about');
}

function viewContact(){
  mount(`
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>Contact</h2>
            <p>Send a message and we’ll keep it on this device for reference. You can export it later if you add a backend.</p>
          </div>
        </div>

        <div class="panel reveal">
          <h3>Message</h3>
          <form class="form" id="contactForm">
            <div>
              <label for="cName">Name</label>
              <input class="input" id="cName" name="name" type="text" autocomplete="name" required placeholder="Your name" />
            </div>
            <div>
              <label for="cEmail">Email</label>
              <input class="input" id="cEmail" name="email" type="email" autocomplete="email" required placeholder="you@domain.com" />
            </div>
            <div>
              <label for="cMsg">Message</label>
              <textarea class="input" id="cMsg" name="message" required placeholder="Tell us what you want to learn or build"></textarea>
            </div>
            <button class="btn btn-primary" type="submit">Send message</button>
          </form>
        </div>
      </div>
    </section>
  `, 'Contact', '/contact');

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const entry = {
      name: String(fd.get('name')||'').trim(),
      email: String(fd.get('email')||'').trim(),
      message: String(fd.get('message')||'').trim(),
      at: new Date().toISOString()
    };
    if(!entry.name || !entry.email || !entry.message){
      toast('Missing fields', 'Please complete all fields.');
      return;
    }
    try{
      const raw = localStorage.getItem(APP.storageKeys.contact);
      const arr = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(arr) ? arr : [];
      next.unshift(entry);
      localStorage.setItem(APP.storageKeys.contact, JSON.stringify(next.slice(0, 25)));
      form.reset();
      toast('Message saved', 'Your message was saved on this device.');
    }catch{
      toast('Error', 'Unable to store the message locally.');
    }
  });
}

function renderRoute(){
  const r = route();

  if(r.path === '/' || r.path === '') return viewHome();
  if(r.path === '/courses') return viewCourses();
  if(r.path === '/course') return viewCourseDetails(String(r.params.get('id')||''));
  if(r.path === '/about') return viewAbout();
  if(r.path === '/contact') return viewContact();

  mount(`
    <section class="section">
      <div class="container">
        <div class="panel">
          <h3>Page not found</h3>
          <p class="muted">That route doesn’t exist. Use the navigation to continue.</p>
          <div style="margin-top:12px"><a class="btn btn-primary" href="#/">Go home</a></div>
        </div>
      </div>
    </section>
  `, 'Not found', '/');
}

window.addEventListener('hashchange', renderRoute);

function setupInstall(){
  let deferred = null;

  function showInstall(show){
    elInstall.hidden = !show;
  }

  showInstall(false);

  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferred = e;
    showInstall(true);
  });

  elInstall.addEventListener('click', async ()=>{
    if(!deferred) return;
    deferred.prompt();
    try{ await deferred.userChoice; } finally{
      deferred = null;
      showInstall(false);
      toast('Install', 'If you accepted, NovaLearn will appear on your home screen.');
    }
  });

  window.addEventListener('appinstalled', ()=>{
    deferred = null;
    showInstall(false);
    toast('Installed', 'NovaLearn is now installed on this device.');
  });
}

function boot(){
  updateEnrollmentsBadge();
  setupInstall();
  renderRoute();
}

boot();
