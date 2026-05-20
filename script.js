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
      card.style.cursor = 'pointer'; // Make entire card clickable
      card.innerHTML = `
        <div class="product-img-wrap">
          <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="product-info">
          <p class="product-name">${p.name}</p>
          <p class="product-desc">${p.desc}</p>
          <div class="product-wa-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            Ver detalles
          </div>
        </div>
      `;
      // Open modal on click
      card.addEventListener('click', () => openModal(p));
      prodGrid.appendChild(card);
    });

    // Mostrar panel con animación
    prodPanel.classList.add('open');
    requestAnimationFrame(() => {
      const offset = window.innerWidth < 768 ? 80 : 120;
      const topPos = prodPanel.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    });
  }

  /* Cerrar panel */
  closeBtn?.addEventListener('click', () => {
    prodPanel.classList.remove('open');
    $$('.cat-tab').forEach(t => t.classList.remove('active'));
    const catalogTop = $('#catalog').getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: catalogTop, behavior: 'smooth' });
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

/* ─── MODAL LOGIC ─────────────────────────────────── */
let modalCurrentZoom = 1;
let modalTranslateX = 0;
let modalTranslateY = 0;

function openModal(product) {
  const modal = $('#product-modal');
  $('#modal-img').src = product.img;
  $('#modal-title').textContent = product.name;
  $('#modal-desc').textContent = product.desc;
  
  const waMsg = encodeURIComponent(
    `¡Hola Pajara Pinta! Me interesa: *${product.name}* 🎨 ¿Está disponible?`
  );
  $('#modal-wa-btn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;
  
  // Reseteamos zoom al abrir
  modalCurrentZoom = 1;
  modalTranslateX = 0;
  modalTranslateY = 0;
  const modalImg = $('#modal-img');
  if (modalImg) {
    modalImg.style.transform = 'translate(0px, 0px) scale(1)';
  }
  
  modal.classList.remove('closing');
  
  requestAnimationFrame(() => {
    modal.classList.add('open');
  });
  
  // Evitar scroll de fondo
  document.body.style.overflow = 'hidden';
}

function initModal() {
  const modal = $('#product-modal');
  const closeBtn = $('#modal-close');
  const overlay = $('.modal-overlay');
  
  // Controles de zoom y arrastre
  const btnZoomIn = $('#btn-zoom-in');
  const btnZoomOut = $('#btn-zoom-out');
  const modalImg = $('#modal-img');
  const imgWrap = $('#modal-img-wrap');
  
  let isDragging = false;
  let startX, startY;
  
  function updateZoom() {
    if (modalCurrentZoom === 1) {
      modalTranslateX = 0;
      modalTranslateY = 0;
      if(imgWrap) imgWrap.style.cursor = 'default';
    } else {
      if(imgWrap) imgWrap.style.cursor = 'grab';
    }
    modalImg.style.transition = 'opacity 0.6s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    modalImg.style.transform = `translate(${modalTranslateX}px, ${modalTranslateY}px) scale(${modalCurrentZoom})`;
  }
  
  btnZoomIn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    modalCurrentZoom = Math.min(modalCurrentZoom + 0.8, 3.4); // Incremento de zoom
    updateZoom();
  });
  
  btnZoomOut?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    modalCurrentZoom = 1; 
    updateZoom();
  });
  
  // Lógica de arrastre (Pan)
  imgWrap?.addEventListener('mousedown', (e) => {
    if (modalCurrentZoom > 1) {
      isDragging = true;
      startX = e.clientX - modalTranslateX;
      startY = e.clientY - modalTranslateY;
      imgWrap.style.cursor = 'grabbing';
      modalImg.style.transition = 'none'; // Sin transición durante el arrastre
      e.preventDefault();
    }
  });
  
  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      modalTranslateX = e.clientX - startX;
      modalTranslateY = e.clientY - startY;
      
      // Limitar el desplazamiento a los bordes de la imagen escalada
      const maxPanX = (imgWrap.offsetWidth * modalCurrentZoom - imgWrap.offsetWidth) / 2;
      const maxPanY = (imgWrap.offsetHeight * modalCurrentZoom - imgWrap.offsetHeight) / 2;
      
      modalTranslateX = Math.max(-maxPanX, Math.min(maxPanX, modalTranslateX));
      modalTranslateY = Math.max(-maxPanY, Math.min(maxPanY, modalTranslateY));
      
      modalImg.style.transform = `translate(${modalTranslateX}px, ${modalTranslateY}px) scale(${modalCurrentZoom})`;
    }
  });
  
  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      if(imgWrap) imgWrap.style.cursor = modalCurrentZoom > 1 ? 'grab' : 'default';
      modalImg.style.transition = 'opacity 0.6s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  });
  
  function closeModal() {
    modal.classList.add('closing');
    
    setTimeout(() => {
      modal.classList.remove('open');
      modal.classList.remove('closing');
      document.body.style.overflow = '';
      
      // Restablecer zoom al cerrar
      modalCurrentZoom = 1;
      updateZoom();
    }, 700); 
  }
  
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);
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
  initModal();
  initWhatsApp();
  initScrollReveal();
});
