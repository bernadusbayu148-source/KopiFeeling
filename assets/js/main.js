
// Tahun footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll shadow
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 2);
});

// Mobile toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open');
});

// Dropdown (desktop & mobile, aksesibel)
document.querySelectorAll('.nav-item.dropdown').forEach(dd => {
  const btn = dd.querySelector('.dropdown-toggle');
  const menu = dd.querySelector('.dropdown-menu');

  // klik button
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = dd.classList.contains('open');
    document.querySelectorAll('.nav-item.dropdown.open').forEach(d => {
      d.classList.remove('open');
      d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','false');
    });
    if (!open) dd.classList.add('open');
    btn.setAttribute('aria-expanded', String(!open));
  });

  // klik di luar
  document.addEventListener('click', () => {
    dd.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });

  // akses keyboard
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });
});

// Hero slider sederhana
const slider = document.getElementById('heroSlider');
if (slider){
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const btnPrev = slider.querySelector('.prev');
  const btnNext = slider.querySelector('.next');
  const dotsWrap = slider.querySelector('.slider-dots');

  let index = 0;
  const setActive = (i) => {
    slides.forEach(s => s.classList.remove('is-active'));
    slides[i].classList.add('is-active');
    dotsWrap.querySelectorAll('.dot').forEach((d, di) => d.classList.toggle('active', di === i));
    index = i;
  };

  // dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Pilih slide ${i+1}`);
    dot.addEventListener('click', () => setActive(i));
    dotsWrap.appendChild(dot);
  });

  setActive(0);

  btnPrev.addEventListener('click', () => setActive((index - 1 + slides.length) % slides.length));
  btnNext.addEventListener('click', () => setActive((index + 1) % slides.length));

  // auto-rotate (pause di tab background)
  let timer = setInterval(() => setActive((index + 1) % slides.length), 6000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
    else timer = setInterval(() => setActive((index + 1) % slides.length), 6000);
  });

(function listenLeaderboardHeight(){
  const iframe = document.getElementById('leaderboardFrame');
  if (!iframe) return;
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (data && data.type === 'LB_HEIGHT' && typeof data.height === 'number') {
      iframe.style.height = (data.height + 20) + 'px';
    }
  });
})();


// ===== Mobile toggle (hamburger) =====
(function initMobileMenu(){
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
})();


// ===== Dropdown: open/close, click-outside, Escape (patch) =====
(function initDropdowns(){
  const dropdowns = document.querySelectorAll('.nav-item.dropdown');
  if (!dropdowns.length) return;

  const closeAll = () => {
    dropdowns.forEach(dd => {
      dd.classList.remove('open');
      const btn = dd.querySelector('.dropdown-toggle');
      btn?.setAttribute('aria-expanded','false');
    });
  };

  dropdowns.forEach(dd => {
    const btn = dd.querySelector('.dropdown-toggle');
    const menu = dd.querySelector('.dropdown-menu');
    if (!btn || !menu) return;

    // Klik toggle -> buka/tutup
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dd.classList.contains('open');
      closeAll(); // tutup dropdown lain
      if (!isOpen){
        dd.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      } else {
        dd.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      }
    });

    // Klik di luar -> tutup
    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
      }
    });

    // Keyboard Escape -> tutup
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape'){
        dd.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        btn.blur();
      }
    });
  });

  // Jangan auto-open di halaman Station
  if ((location.pathname || '').toLowerCase().includes('stations')) {
    closeAll();
  }
})();

  
// ===== Service Tabs (single-page) =====
(function initServiceTabs(){
  const tabsWrap = document.querySelector('.service-tabs');
  const tabs = document.querySelectorAll('.service-tabs .tab');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabsWrap || !tabs.length || !panels.length) return;

  const idFromTab = (tab) => tab?.dataset?.tab || '';
  const panelByKey = (key) => document.getElementById(`panel-${key}`);
  const tabByKey = (key) => document.getElementById(`tab-${key}`);

  const setActive = (key) => {
    // reset tabs
    tabs.forEach(t => {
      const active = idFromTab(t) === key;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    // reset panels
    panels.forEach(p => {
      const active = p.id === `panel-${key}`;
      if (active){ p.removeAttribute('hidden'); p.classList.add('is-active'); }
      else { p.setAttribute('hidden',''); p.classList.remove('is-active'); }
    });
    // update hash (deep-link)
    if (key) history.replaceState(null,'', `#${key}`);
  };

  // init from hash (e.g. services.html#everyday)
  const initial = (location.hash || '').replace('#','') || idFromTab(tabs[0]);
  setActive(['party','toyou','everyday','wedding'].includes(initial) ? initial : 'party');

  // click handlers
  tabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(idFromTab(btn));
    });
    // keyboard: Enter/Space
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); setActive(idFromTab(btn));
      }
    });
  });

  // handle back/forward if hash changes
  window.addEventListener('hashchange', () => {
    const key = (location.hash || '').replace('#','');
    if (tabByKey(key) && panelByKey(key)) setActive(key);
  });
})();

  
// ===== Service Tabs (single-page) =====
(function initServiceTabs(){
  const tabs = document.querySelectorAll('.service-tabs .tab');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabs.length || !panels.length) return;

  const getKey = (btn) => btn?.dataset?.tab || '';
  const setActive = (key) => {
    // toggle tombol
    tabs.forEach(t => {
      const active = getKey(t) === key;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    // toggle panel
    panels.forEach(p => {
      const active = p.id === `panel-${key}`;
      if (active){ p.classList.add('is-active'); p.removeAttribute('hidden'); }
      else { p.classList.remove('is-active'); p.setAttribute('hidden',''); }
    });
    // update hash (deep-link)
    if (key) history.replaceState(null,'', `#${key}`);
  };

  // inisialisasi dari hash (services.html#everyday)
  const initial = (location.hash || '').replace('#','');
  const defaultKey = getKey(tabs[0]);
  const startKey = ['party','toyou','everyday','wedding'].includes(initial) ? initial : defaultKey;
  setActive(startKey);

  // handler klik + keyboard
  tabs.forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); setActive(getKey(btn)); });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(getKey(btn)); }
    });
  });

  // back/forward hash
  window.addEventListener('hashchange', () => {
    const key = (location.hash || '').replace('#','');
    if (key) setActive(key);
  });
})();


// ===== Service Tabs (single-page) =====
(function initServiceTabs(){
  // Ambil semua tombol tab & panel
  const tabs   = document.querySelectorAll('.service-tabs .tab');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabs.length || !panels.length) return;

  // Ambil key dari tombol: "party", "toyou", "everyday", "wedding"
  const getKey = (btn) => btn?.dataset?.tab || '';

  // Fungsi untuk mengaktifkan tab + panel sesuai key
  const setActive = (key) => {
    // 1) Toggle state tombol (pill merah aktif)
    tabs.forEach(t => {
      const active = getKey(t) === key;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // 2) Tampilkan panel yang cocok, sembunyikan lainnya
    panels.forEach(p => {
      const active = p.id === `panel-${key}`;
      if (active) { p.classList.add('is-active'); p.removeAttribute('hidden'); }
      else        { p.classList.remove('is-active'); p.setAttribute('hidden', ''); }
    });

    // 3) Update hash agar bisa deep-link (services.html#everyday)
    if (key) history.replaceState(null, '', `#${key}`);
  };

  // Inisialisasi state awal dari hash (jika ada), atau dari tab pertama
  const allowed  = ['party','toyou','everyday','wedding'];
  const initial  = (location.hash || '').replace('#', '');
  const startKey = allowed.includes(initial) ? initial : getKey(tabs[0]);

  setActive(startKey);

  // Handler klik pada tombol tab
  tabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(getKey(btn));
    });

    // Aksesibilitas: Enter/Space juga memilih tab
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive(getKey(btn));
      }
    });
  });

  // Jika user menekan Back/Forward (hash berubah), sinkronkan panel
  window.addEventListener('hashchange', () => {
    const key = (location.hash || '').replace('#', '');
    if (allowed.includes(key)) setActive(key);
  });
})();

