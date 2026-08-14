// =====================================================
// PAJARA PINTA — MAIN SCRIPT
// =====================================================

const WHATSAPP_NUMBER = '573122676620';
const WHATSAPP_MSG = encodeURIComponent(
  '¡Hola! Vi tu página Pajara Pinta y me encantó. ¿Me puedes dar más información?'
);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const heroImages = [
  {
    webp: 'images_migration/principal/img_principal_ceramica.webp',
    jpeg: 'images_migration/principal/img_principal_ceramica.jpeg',
    alt: 'Cerámica pintada a mano de La Pajara Pinta',
    width: 1286,
    height: 1600,
  },
  {
    webp: 'images_migration/principal/img_principal_matera.webp',
    jpeg: 'images_migration/principal/img_principal_matera.jpeg',
    alt: 'Matera pintada a mano de La Pajara Pinta',
    width: 1396,
    height: 1459,
  },
  {
    webp: 'images_migration/principal/img_principal_ropa.webp',
    jpeg: 'images_migration/principal/img_principal_ropa.jpeg',
    alt: 'Ropa pintada a mano de La Pajara Pinta',
    width: 1080,
    height: 1318,
  },
];

const DESCS = {
  ceramica: 'Pieza de cerámica pintada a mano. Cada trazo es único; pregunta disponibilidad y medidas por WhatsApp.',
  materas: 'Matera pintada a mano, lista para sembrar. No hay dos iguales.',
  ropa: 'Prenda pintada a mano con diseño irrepetible. Pregunta talla y disponibilidad.',
};

function productPaths(folder, file) {
  return {
    img: `${folder}/imagenes_hijas/${file}.jpeg`,
    imgWebp: `${folder}/imagenes_hijas/${file}.webp`,
    thumb: `${folder}/imagenes_hijas/thumbs/${file}.jpeg`,
    thumbWebp: `${folder}/imagenes_hijas/thumbs/${file}.webp`,
  };
}

const categories = [
  {
    id: 'ceramica',
    name: 'Cerámica',
    count: 2,
    parentImgs: [
      'images_migration/productos_ceramicos_personalizados/thumbs/img_padre_ceramica_personalizada_1.webp',
      'images_migration/productos_ceramicos_personalizados/thumbs/img_padre_ceramica_personalizada_2.webp',
    ],
    products: [1, 2].map(n => ({
      cat: 'ceramica',
      name: `Cerámica Personalizada ${n}`,
      desc: DESCS.ceramica,
      ...productPaths(
        'images_migration/productos_ceramicos_personalizados',
        `img_hija_ceramica_personalizada_${n}`
      ),
    })),
  },
  {
    id: 'materas',
    name: 'Materas',
    count: 14,
    parentImgs: [
      'images_migration/productos_materas_personalizados/thumbs/img_padre_matera_personalizada_1.webp',
      'images_migration/productos_materas_personalizados/thumbs/img_padre_matera_personalizada_2.webp',
    ],
    products: Array.from({ length: 14 }, (_, i) => ({
      cat: 'materas',
      name: `Matera Personalizada ${i + 1}`,
      desc: DESCS.materas,
      ...productPaths(
        'images_migration/productos_materas_personalizados',
        `img_hija_matera_personalizada_${i + 1}`
      ),
    })),
  },
  {
    id: 'ropa',
    name: 'Ropa',
    count: 16,
    parentImgs: [
      'images_migration/productos_ropa_personalizados/thumbs/img_padre_ropa_personalizada_1.webp',
      'images_migration/productos_ropa_personalizados/thumbs/img_padre_ropa_personalizada_2.webp',
    ],
    products: Array.from({ length: 16 }, (_, i) => ({
      cat: 'ropa',
      name: `Prenda Personalizada ${i + 1}`,
      desc: DESCS.ropa,
      ...productPaths(
        'images_migration/productos_ropa_personalizados',
        `img_hija_ropa_personalizada_${i + 1}`
      ),
    })),
  },
];

const allProducts = categories.flatMap(c => c.products);

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function smoothScrollTo(el, offset = 80) {
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

/* ─── NAVBAR ──────────────────────────────────────── */
function initNavbar() {
  const nav = $('#navbar');
  const toggle = $('#nav-toggle');
  const menu = $('#nav-menu');
  let rafPending = false;

  window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
      rafPending = false;
    });
  }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 60);

  function setMenu(open) {
    nav.classList.toggle('menu-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  toggle?.addEventListener('click', () => {
    setMenu(!nav.classList.contains('menu-open'));
  });

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
  $('.nav-cta-mobile')?.addEventListener('click', () => setMenu(false));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('menu-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav.classList.contains('menu-open')) {
      setMenu(false);
    }
  });
}

/* ─── HERO CAROUSEL ───────────────────────────────── */
function initHeroCarousel() {
  const container = $('.hero-images');
  const indicators = $$('.indicator');
  let current = 0;
  let timer;
  let inView = true;

  const heroContent = $('.hero-content');
  heroImages.slice(1).forEach(img => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide';
    slide.innerHTML = `
      <picture>
        <source srcset="${img.webp}" type="image/webp" />
        <img src="${img.jpeg}" alt="${img.alt}" width="${img.width}" height="${img.height}" loading="lazy" />
      </picture>
    `;
    container.insertBefore(slide, heroContent);
  });

  const slides = $$('.hero-slide');

  function goTo(idx) {
    slides[current].classList.remove('active');
    indicators[current]?.classList.remove('active');
    indicators[current]?.setAttribute('aria-selected', 'false');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    indicators[current]?.classList.add('active');
    indicators[current]?.setAttribute('aria-selected', 'true');
  }

  function startTimer() {
    if (prefersReducedMotion) return;
    clearInterval(timer);
    timer = setInterval(() => {
      if (inView) goTo(current + 1);
    }, 5000);
  }

  indicators.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      goTo(i);
      startTimer();
    });
  });

  const hero = $('#hero');
  new IntersectionObserver(
    ([entry]) => { inView = entry.isIntersecting; },
    { threshold: 0.2 }
  ).observe(hero);

  startTimer();

  $('#scroll-down')?.addEventListener('click', () => {
    smoothScrollTo($('#catalog'), 20);
  });
}

/* ─── MINI CAROUSEL ───────────────────────────────── */
function startMiniCarousel(card) {
  const slides = $$('.cat-mini-slide', card);
  if (slides.length < 2 || prefersReducedMotion) return;
  let cur = 0;
  let timer;

  function tick() {
    slides[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
  }

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!timer) timer = setInterval(tick, 3200);
    } else if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }, { threshold: 0.15 });

  io.observe(card);
}

/* ─── CATALOG ─────────────────────────────────────── */
function initCatalog() {
  const catGrid = $('#categories-grid');
  const prodGrid = $('#products-grid');
  const prodTitle = $('#products-title');
  const prodCount = $('#products-count');
  const chips = $$('.filter-chip');
  let activeCat = 'all';

  const labels = {
    all: 'Todas las piezas',
    ceramica: 'Cerámica',
    materas: 'Materas',
    ropa: 'Ropa',
  };

  categories.forEach(cat => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'cat-card';
    card.dataset.id = cat.id;
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `Ver ${cat.name}, ${cat.count} piezas`);

    const slidesHTML = cat.parentImgs.map((img, i) =>
      `<div class="cat-mini-slide${i === 0 ? ' active' : ''}" style="background-image:url('${img}')"></div>`
    ).join('');

    card.innerHTML = `
      <div class="cat-mini-carousel">${slidesHTML}</div>
      <div class="cat-card-overlay">
        <span class="cat-card-name">${cat.name}</span>
        <span class="cat-card-count">${cat.count} piezas</span>
      </div>
      <div class="cat-card-arrow" aria-hidden="true">
        <svg width="16" height="16" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    `;

    card.addEventListener('click', () => {
      setFilter(cat.id, true);
    });
    catGrid.appendChild(card);
    startMiniCarousel(card);
  });

  allProducts.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.cat = p.cat;
    card.style.animationDelay = `${Math.min(i, 12) * 40}ms`;
    card.innerHTML = `
      <div class="product-img-wrap">
        <picture>
          <source type="image/webp" srcset="${p.thumbWebp}" />
          <img class="product-img" src="${p.thumb}" alt="${p.name}" loading="lazy" width="600" height="600" />
        </picture>
      </div>
      <div class="product-info">
        <p class="product-name">${p.name}</p>
        <p class="product-desc">${p.desc}</p>
        <span class="product-open-btn">Ver pieza</span>
      </div>
    `;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver ${p.name}`);
    card.addEventListener('click', () => openModal(p));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(p);
      }
    });
    prodGrid.appendChild(card);
  });

  function setFilter(catId, scroll) {
    activeCat = catId;
    chips.forEach(chip => {
      const on = chip.dataset.cat === catId;
      chip.classList.toggle('active', on);
      chip.setAttribute('aria-selected', String(on));
    });

    const cards = $$('.product-card', prodGrid);
    let visible = 0;
    cards.forEach(card => {
      const show = catId === 'all' || card.dataset.cat === catId;
      card.classList.toggle('is-hidden', !show);
      if (show) {
        visible += 1;
        card.classList.remove('animate-in');
        void card.offsetWidth;
        card.classList.add('animate-in');
      }
    });

    prodTitle.textContent = labels[catId] || 'Colección';
    prodCount.textContent = visible === 1 ? '1 pieza' : `${visible} piezas`;

    if (scroll) smoothScrollTo($('#filter-bar'), 8);
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => setFilter(chip.dataset.cat, false));
  });

  setFilter('all', false);
}

/* ─── WHATSAPP ────────────────────────────────────── */
function initWhatsApp() {
  const float = $('#wa-float');
  const mainWa = $('#wa-main-btn');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
  if (float) float.href = url;
  if (mainWa) mainWa.href = url;

  const contact = $('#contact');
  if (!float || !contact) return;

  new IntersectionObserver(
    ([entry]) => { float.classList.toggle('is-hidden', entry.isIntersecting); },
    { threshold: 0.25 }
  ).observe(contact);
}

/* ─── MODAL ───────────────────────────────────────── */
let modalCurrentZoom = 1;
let modalTranslateX = 0;
let modalTranslateY = 0;
let lastFocus = null;

function getFocusable(modal) {
  return $$('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])', modal)
    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
}

function openModal(product) {
  const modal = $('#product-modal');
  lastFocus = document.activeElement;

  $('#modal-img-webp').srcset = product.imgWebp;
  const modalImg = $('#modal-img');
  modalImg.src = product.img;
  modalImg.alt = product.name;
  $('#modal-title').textContent = product.name;
  $('#modal-desc').textContent = product.desc;

  const waMsg = encodeURIComponent(
    `¡Hola Pajara Pinta! Me interesa: *${product.name}*. ¿Está disponible?`
  );
  $('#modal-wa-btn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  modalCurrentZoom = 1;
  modalTranslateX = 0;
  modalTranslateY = 0;
  modalImg.style.transform = 'translate(0px, 0px) scale(1)';

  modal.classList.remove('closing');
  modal.setAttribute('aria-hidden', 'false');
  modal.inert = false;
  document.body.classList.add('modal-open');

  requestAnimationFrame(() => {
    modal.classList.add('open');
    $('#modal-close')?.focus();
  });
}

function initModal() {
  const modal = $('#product-modal');
  const closeBtn = $('#modal-close');
  const overlay = $('.modal-overlay');
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
      if (imgWrap) imgWrap.style.cursor = 'default';
    } else if (imgWrap) {
      imgWrap.style.cursor = 'grab';
    }
    const motion = prefersReducedMotion ? 'none' : 'opacity 0.4s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    modalImg.style.transition = motion;
    modalImg.style.transform = `translate(${modalTranslateX}px, ${modalTranslateY}px) scale(${modalCurrentZoom})`;
  }

  btnZoomIn?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    modalCurrentZoom = Math.min(modalCurrentZoom + 0.8, 3.4);
    updateZoom();
  });

  btnZoomOut?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    modalCurrentZoom = 1;
    updateZoom();
  });

  function startDrag(e) {
    if (modalCurrentZoom <= 1) return;
    isDragging = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    startX = clientX - modalTranslateX;
    startY = clientY - modalTranslateY;
    if (imgWrap) imgWrap.style.cursor = 'grabbing';
    modalImg.style.transition = 'none';
    if (e.cancelable) e.preventDefault();
  }

  function doDrag(e) {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    modalTranslateX = clientX - startX;
    modalTranslateY = clientY - startY;
    const maxPanX = (imgWrap.offsetWidth * modalCurrentZoom - imgWrap.offsetWidth) / 2;
    const maxPanY = (imgWrap.offsetHeight * modalCurrentZoom - imgWrap.offsetHeight) / 2;
    modalTranslateX = Math.max(-maxPanX, Math.min(maxPanX, modalTranslateX));
    modalTranslateY = Math.max(-maxPanY, Math.min(maxPanY, modalTranslateY));
    modalImg.style.transform = `translate(${modalTranslateX}px, ${modalTranslateY}px) scale(${modalCurrentZoom})`;
    if (e.cancelable) e.preventDefault();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    if (imgWrap) imgWrap.style.cursor = modalCurrentZoom > 1 ? 'grab' : 'default';
    if (!prefersReducedMotion) {
      modalImg.style.transition = 'opacity 0.4s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }

  imgWrap?.addEventListener('mousedown', startDrag);
  imgWrap?.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('mousemove', doDrag);
  window.addEventListener('touchmove', doDrag, { passive: false });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  function closeModal() {
    modal.classList.add('closing');
    modal.setAttribute('aria-hidden', 'true');
    const delay = prefersReducedMotion ? 0 : 400;
    setTimeout(() => {
      modal.classList.remove('open', 'closing');
      modal.inert = true;
      document.body.classList.remove('modal-open');
      modalCurrentZoom = 1;
      updateZoom();
      lastFocus?.focus?.();
    }, delay);
  }

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(modal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* ─── SCROLL REVEAL ───────────────────────────────── */
function initScrollReveal() {
  if (prefersReducedMotion) {
    $$('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  $$('.reveal').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = $('#product-modal');
  if (modal) modal.inert = true;
  initNavbar();
  initHeroCarousel();
  initCatalog();
  initModal();
  initWhatsApp();
  initScrollReveal();
});
