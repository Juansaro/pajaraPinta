// =====================================================
// PAJARA PINTA — MAIN SCRIPT
// =====================================================

/* ─── CONFIG ──────────────────────────────────────── */
const WHATSAPP_NUMBER = '573122646620';
const WHATSAPP_MSG    = encodeURIComponent(
  '¡Hola! Vi tu página Pajara Pinta y me encantó. ¿Me puedes dar más información? 🎨'
);

/* ─── HERO IMAGES (imágenes reales) ──────────────── */
const heroImages = [
  'images_migration/principal/img_principal_ceramica.jpeg',
  'images_migration/principal/img_principal_matera.jpeg',
  'images_migration/principal/img_principal_ropa.jpeg',
];

/* ─── CATEGORÍAS CON IMÁGENES REALES ─────────────── */
const categories = [
  {
    id: 'ceramica',
    name: 'Cerámica Personalizada',
    count: 2,
    parentImgs: [
      'images_migration/productos_ceramicos_personalizados/img_padre_ceramica_personalizada_1.jpeg',
      'images_migration/productos_ceramicos_personalizados/img_padre_ceramica_personalizada_2.jpeg',
    ],
    products: [1, 2].map(n => ({
      name: `Cerámica Personalizada ${n}`,
      desc: 'Pieza cerámica única, pintada a mano con diseño exclusivo.',
      img: `images_migration/productos_ceramicos_personalizados/imagenes_hijas/img_hija_ceramica_personalizada_${n}.jpeg`,
    })),
  },
  {
    id: 'materas',
    name: 'Materas Personalizadas',
    count: 14,
    parentImgs: [
      'images_migration/productos_materas_personalizados/img_padre_matera_personalizada_1.jpeg',
      'images_migration/productos_materas_personalizados/img_padre_matera_personalizada_2.jpeg',
    ],
    products: Array.from({ length: 14 }, (_, i) => ({
      name: `Matera Personalizada ${i + 1}`,
      desc: 'Matera pintada a mano, pieza única irrepetible.',
      img: `images_migration/productos_materas_personalizados/imagenes_hijas/img_hija_matera_personalizada_${i + 1}.jpeg`,
    })),
  },
  {
    id: 'ropa',
    name: 'Ropa Personalizada',
    count: 16,
    parentImgs: [
      'images_migration/productos_ropa_personalizados/img_padre_ropa_personalizada_1.jpeg',
      'images_migration/productos_ropa_personalizados/img_padre_ropa_personalizada_2.jpeg',
    ],
    products: Array.from({ length: 16 }, (_, i) => ({
      name: `Prenda Personalizada ${i + 1}`,
      desc: 'Ropa pintada a mano con diseño artístico exclusivo.',
      img: `images_migration/productos_ropa_personalizados/imagenes_hijas/img_hija_ropa_personalizada_${i + 1}.jpeg`,
    })),
  },
];

/* ─── UTILITIES ───────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── NAVBAR SCROLL ───────────────────────────────── */
function initNavbar() {
  const nav = $('#navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ─── HERO CAROUSEL ───────────────────────────────── */
function initHeroCarousel() {
  const container  = $('.hero-images');
  const indicators = $$('.indicator');
  let current = 0;
  let timer;

  heroImages.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
    slide.style.backgroundImage = `url('${src}')`;
    container.prepend(slide);
  });

  const slides = $$('.hero-slide');

  function goTo(idx) {
    slides[current].classList.remove('active');
    indicators[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    indicators[current]?.classList.add('active');
  }

  function startTimer() { timer = setInterval(() => goTo(current + 1), 5000); }
  function resetTimer()  { clearInterval(timer); startTimer(); }

  indicators.forEach((btn, i) => {
    btn.addEventListener('click', () => { goTo(i); resetTimer(); });
  });
  indicators[0]?.classList.add('active');
  startTimer();
}

/* ─── HERO SIDE PANEL TRANSITION ─────────────────── */
function initHeroSide() {
  const side      = $('.hero-side');
  const scrollBtn = $('#scroll-down');
  const catalog   = $('#catalog');

  const observer = new IntersectionObserver(
    ([entry]) => { side.classList.toggle('dark', entry.isIntersecting); },
    { threshold: 0.1 }
  );
  observer.observe(catalog);

  scrollBtn?.addEventListener('click', () => {
    catalog.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ─── MINI CAROUSEL (en tarjetas de categoría) ───── */
function startMiniCarousel(card) {
  const slides = $$('.cat-mini-slide', card);
  if (slides.length < 2) return;
  let cur = 0;
  setInterval(() => {
    slides[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
  }, 3000);
}

/* ─── CATÁLOGO ────────────────────────────────────── */
function initCatalog() {
  const catGrid   = $('#categories-grid');
  const prodPanel = $('#products-panel');
  const prodGrid  = $('#products-grid');
  const prodTitle = $('#products-title');
  const closeBtn  = $('#close-products');

  /* Construir tarjetas de categoría */
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.dataset.id = cat.id;
    card.setAttribute('role', 'listitem');

    // Mini carrusel con imágenes padre
    const slidesHTML = cat.parentImgs.map((img, i) =>
      `<div class="cat-mini-slide${i === 0 ? ' active' : ''}" style="background-image:url('${img}')"></div>`
    ).join('');

    card.innerHTML = `
      <div class="cat-mini-carousel">${slidesHTML}</div>
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
    startMiniCarousel(card);
  });

  /* Sincronizar tabs con categorías */
  $$('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = categories.find(c => c.id === tab.dataset.cat);
      if (cat) openCategory(cat);
    });
  });

  /* Abrir categoría → mostrar productos hija */
  function openCategory(cat) {
    // Activar tab
    $$('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === cat.id));

    // Título
    prodTitle.innerHTML = `Colección <span>${cat.name}</span>`;

    // Limpiar y poblar productos
    prodGrid.innerHTML = '';
    cat.products.forEach((p, i) => {
      const waMsg = encodeURIComponent(
        `¡Hola Pajara Pinta! Me interesa: *${p.name}* 🎨 ¿Está disponible?`
      );
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.animationDelay = `${i * 60}ms`;
      card.innerHTML = `
        <div class="product-img-wrap">
          <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-info">
          <p class="product-name">${p.name}</p>
          <p class="product-desc">${p.desc}</p>
          <a class="product-wa-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer"
             aria-label="Consultar ${p.name} por WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      `;
      prodGrid.appendChild(card);
    });

    // Mostrar panel con animación
    prodPanel.classList.add('open');
    requestAnimationFrame(() => {
      prodPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* Cerrar panel */
  closeBtn?.addEventListener('click', () => {
    prodPanel.classList.remove('open');
    $$('.cat-tab').forEach(t => t.classList.remove('active'));
    catGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ─── WHATSAPP FLOTANTE ───────────────────────────── */
function initWhatsApp() {
  const float  = $('#wa-float');
  const mainWa = $('#wa-main-btn');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
  if (float)  float.href  = url;
  if (mainWa) mainWa.href = url;
}

/* ─── SCROLL REVEAL ───────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  $$('.reveal').forEach(el => observer.observe(el));
}

/* ─── INIT ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCarousel();
  initHeroSide();
  initCatalog();
  initWhatsApp();
  initScrollReveal();
});
