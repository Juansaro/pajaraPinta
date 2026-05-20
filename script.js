// =====================================================
// PAJARA PINTA — MAIN SCRIPT
// Features: Hero carousel, scroll effects, catalog
// =====================================================

/* ─── DATA ─────────────────────────────────────────── */
const WHATSAPP_NUMBER = '573001234567'; // ← REEMPLAZA con tu número real
const WHATSAPP_MSG    = encodeURIComponent(
  '¡Hola! Vi tu página Pajara Pinta y me encantó. ¿Me puedes dar más información? 🎨'
);

const heroImages = [
  'images/hero_1.png',
  'images/hero_2.png',
  'images/hero_3.png',
];

const categories = [
  {
    id: 'ropa',
    name: 'Ropa Artística',
    img: 'images/cat_ropa.png',
    count: 12,
    products: [
      { name: 'Camiseta Abstracta Vol.1', desc: 'Pintura acrílica a mano, edición limitada', price: '$85.000', img: 'images/cat_ropa.png' },
      { name: 'Chaqueta Violeta Cosmos', desc: 'Técnica mixta sobre denim premium', price: '$180.000', img: 'images/cat_ropa.png' },
      { name: 'Blusón Galaxia', desc: 'Tonos violeta y negro, única pieza', price: '$120.000', img: 'images/cat_ropa.png' },
      { name: 'Top Splash', desc: 'Salpicaduras de acrílico multicolor', price: '$65.000', img: 'images/cat_ropa.png' },
    ]
  },
  {
    id: 'materas',
    name: 'Materas Pintadas',
    img: 'images/cat_materas.png',
    count: 8,
    products: [
      { name: 'Matera Luna Negra', desc: 'Barro negro con luna en violeta nacarado', price: '$45.000', img: 'images/cat_materas.png' },
      { name: 'Set Cactus Cosmos', desc: 'Tres materas pequeñas con constelaciones', price: '$90.000', img: 'images/cat_materas.png' },
      { name: 'Matera Floral Grande', desc: 'Diseño floral abstracto, 30cm alto', price: '$75.000', img: 'images/cat_materas.png' },
      { name: 'Matera Geométrica', desc: 'Formas geométricas en degradado violeta', price: '$55.000', img: 'images/cat_materas.png' },
    ]
  },
  {
    id: 'sets',
    name: 'Sets Combinados',
    img: 'images/cat_sets.png',
    count: 5,
    products: [
      { name: 'Set Artista Completo', desc: 'Camiseta + matera coordinadas', price: '$140.000', img: 'images/cat_sets.png' },
      { name: 'Dúo Cosmos', desc: 'Blusón + set de 2 materas', price: '$200.000', img: 'images/cat_sets.png' },
      { name: 'Pack Regalo', desc: 'Ítem sorpresa + matera + empaque artístico', price: '$110.000', img: 'images/cat_sets.png' },
    ]
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    img: 'images/cat_accesorios.png',
    count: 10,
    products: [
      { name: 'Tote Bag Salpicada', desc: 'Tela canvas pintada a mano', price: '$55.000', img: 'images/cat_accesorios.png' },
      { name: 'Cuaderno Artístico', desc: 'Portada pintada, 200 páginas', price: '$38.000', img: 'images/cat_accesorios.png' },
      { name: 'Pañoleta Galaxia', desc: 'Seda sintética con tintes artísticos', price: '$42.000', img: 'images/cat_accesorios.png' },
      { name: 'Pin Set Cosmos', desc: 'Pack de 5 pines pintados a mano', price: '$25.000', img: 'images/cat_accesorios.png' },
    ]
  },
];

/* ─── UTILITIES ─────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── NAVBAR SCROLL ─────────────────────────────────── */
function initNavbar() {
  const nav = $('#navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ─── HERO CAROUSEL ─────────────────────────────────── */
function initHeroCarousel() {
  const container = $('.hero-images');
  const indicators = $$('.indicator');
  let current = 0;
  let timer;

  // Build slides
  heroImages.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
    slide.style.backgroundImage = `url('${src}')`;
    container.prepend(slide); // insert before overlay div (hero-content)
  });

  const slides = $$('.hero-slide');

  function goTo(idx) {
    slides[current].classList.remove('active');
    indicators[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    indicators[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startTimer() { timer = setInterval(next, 5000); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  // Indicator clicks
  indicators.forEach((btn, i) => {
    btn.addEventListener('click', () => { goTo(i); resetTimer(); });
  });

  // Set first indicator active
  indicators[0]?.classList.add('active');
  startTimer();
}

/* ─── HERO SIDE PANEL TRANSITION ────────────────────── */
function initHeroSide() {
  const side    = $('.hero-side');
  const scrollBtn = $('#scroll-down');
  const catalog   = $('#catalog');

  // Intersection Observer watches catalog section
  const observer = new IntersectionObserver(
    ([entry]) => {
      side.classList.toggle('dark', entry.isIntersecting);
    },
    { threshold: 0.1 }
  );
  observer.observe(catalog);

  // Scroll button
  scrollBtn?.addEventListener('click', () => {
    catalog.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ─── CATALOG ───────────────────────────────────────── */
function initCatalog() {
  const catGrid    = $('#categories-grid');
  const prodPanel  = $('#products-panel');
  const prodGrid   = $('#products-grid');
  const prodTitle  = $('#products-title');
  const closeBtn   = $('#close-products');

  // Build category cards
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.dataset.id = cat.id;
    card.innerHTML = `
      <img src="${cat.img}" alt="${cat.name}" loading="lazy">
      <div class="cat-card-overlay">
        <p class="cat-card-name">${cat.name}</p>
        <p class="cat-card-count">${cat.count} piezas</p>
      </div>
      <div class="cat-card-arrow">
        <svg width="16" height="16" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    `;
    card.addEventListener('click', () => openCategory(cat));
    catGrid.appendChild(card);
  });

  function openCategory(cat) {
    // Highlight active tab
    $$('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat.id));

    // Populate products
    prodTitle.innerHTML = `Colección <span>${cat.name}</span>`;
    prodGrid.innerHTML  = '';

    cat.products.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.animationDelay = `${i * 80}ms`;

      const waMsg = encodeURIComponent(
        `Hola! Quiero información sobre: ${p.name} (${p.price}) 🎨`
      );

      card.innerHTML = `
        <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-info">
          <p class="product-name">${p.name}</p>
          <p class="product-desc">${p.desc}</p>
          <p class="product-price">${p.price}</p>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}" target="_blank" rel="noopener">
            <button class="product-btn">💬 Consultar por WhatsApp</button>
          </a>
        </div>
      `;
      prodGrid.appendChild(card);
    });

    // Show panel with animation
    prodPanel.classList.add('open');
    requestAnimationFrame(() => {
      prodPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Category tab clicks (in case you click tabs instead of cards)
  $$('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = categories.find(c => c.id === tab.dataset.cat);
      if (cat) openCategory(cat);
    });
  });

  // Close panel
  closeBtn?.addEventListener('click', () => {
    prodPanel.classList.remove('open');
    $$('.cat-tab').forEach(t => t.classList.remove('active'));
    catGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ─── WHATSAPP BUTTON ───────────────────────────────── */
function initWhatsApp() {
  const btn = $('#wa-float');
  if (btn) btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

  // Also set contact section button
  const mainWa = $('#wa-main-btn');
  if (mainWa) mainWa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
}

/* ─── SCROLL REVEAL ─────────────────────────────────── */
function initScrollReveal() {
  const els = $$('.reveal');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(el => observer.observe(el));
}

/* ─── INIT ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCarousel();
  initHeroSide();
  initCatalog();
  initWhatsApp();
  initScrollReveal();
});
