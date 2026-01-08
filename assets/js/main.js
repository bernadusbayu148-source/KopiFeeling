
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
