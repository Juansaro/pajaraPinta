// =====================================================
// PAJARA PINTA — MAIN SCRIPT
// =====================================================

const WHATSAPP_NUMBER = '573122676620';
const WHATSAPP_MSG = encodeURIComponent(
  '¡Hola! Vi tu página Pajara Pinta y me encantó. ¿Me puedes dar más información?'
);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CAT_LABELS = {
  ceramica: 'Cerámica',
  materas: 'Materas',
  ropa: 'Ropa',
};

const DESCS = {
  ceramica: 'Pieza de cerámica pintada a mano. Cada trazo es único.',
  materas: 'Matera pintada a mano, lista para sembrar.',
  ropa: 'Prenda pintada a mano. Pregunta talla y disponibilidad.',
};

const SIZES = {
  ceramica: { 1: [1600, 1004], 2: [1204, 1600] },
  materas: {
    1: [1526, 1600], 2: [1329, 1600], 3: [750, 1020], 4: [1200, 1600],
    5: [756, 741], 6: [1426, 1484], 7: [962, 854], 8: [806, 854],
    9: [1036, 989], 10: [859, 779], 11: [848, 853], 12: [706, 894],
    13: [957, 1045], 14: [1200, 1382],
  },
  ropa: {
    1: [1079, 1363], 2: [1080, 1340], 3: [1062, 1442], 4: [1079, 1007],
    5: [1076, 1218], 6: [1080, 1247], 7: [770, 856], 8: [1080, 1324],
    9: [1073, 1334], 10: [1080, 1060], 11: [1080, 1332], 12: [1075, 1233],
    13: [1080, 1287], 14: [1080, 1390], 15: [1065, 1273], 16: [1080, 1352],
  },
};

function productPaths(folder, file) {
  return {
    img: `${folder}/imagenes_hijas/${file}.jpeg`,
    imgWebp: `${folder}/imagenes_hijas/${file}.webp`,
    thumb: `${folder}/imagenes_hijas/thumbs/${file}.jpeg`,
    thumbWebp: `${folder}/imagenes_hijas/thumbs/${file}.webp`,
  };
}

function makeProducts(cat, folder, prefix, count) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const [w, h] = SIZES[cat][n];
    const names = {
      ceramica: `Cerámica Personalizada ${n}`,
      materas: `Matera Personalizada ${n}`,
      ropa: `Prenda Personalizada ${n}`,
    };
    return {
      id: `${cat}-${n}`,
      cat,
      name: names[cat],
      desc: DESCS[cat],
      width: w,
      height: h,
      ...productPaths(folder, `${prefix}${n}`),
    };
  });
}

const allProducts = [
  ...makeProducts('ceramica', 'images_migration/productos_ceramicos_personalizados', 'img_hija_ceramica_personalizada_', 2),
  ...makeProducts('materas', 'images_migration/productos_materas_personalizados', 'img_hija_matera_personalizada_', 14),
  ...makeProducts('ropa', 'images_migration/productos_ropa_personalizados', 'img_hija_ropa_personalizada_', 16),
];

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

let activeFilter = 'all';
let lightboxIndex = 0;
let setCatalogFilter = () => {};

function visibleProducts() {
  return activeFilter === 'all'
    ? allProducts
    : allProducts.filter(p => p.cat === activeFilter);
}

function pieceLabel(n) {
  return n === 1 ? '1 pieza' : `${n} piezas`;
}

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
      nav.classList.toggle('scrolled', window.scrollY > 40);
      rafPending = false;
    });
  }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 40);

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

/* ─── HERO ────────────────────────────────────────── */
function initHero() {
  const counts = { ceramica: 0, materas: 0, ropa: 0 };
  allProducts.forEach(p => { counts[p.cat] += 1; });
  $$('[data-count-for]').forEach(el => {
    el.textContent = pieceLabel(counts[el.dataset.countFor] || 0);
  });

  $('#scroll-down')?.addEventListener('click', () => {
    setCatalogFilter('all');
    smoothScrollTo($('#catalog'), 20);
  });

  $$('[data-filter]').forEach(el => {
    el.addEventListener('click', () => {
      setCatalogFilter(el.dataset.filter);
      smoothScrollTo($('#catalog'), 20);
    });
  });
}

/* ─── CATALOG ─────────────────────────────────────── */
function initCatalog() {
  const prodGrid = $('#products-grid');
  const prodTitle = $('#products-title');
  const prodCount = $('#products-count');
  const chips = $$('.filter-chip');

  const labels = {
    all: 'Todas las piezas',
    ceramica: 'Cerámica',
    materas: 'Materas',
    ropa: 'Ropa',
  };

  allProducts.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.cat = p.cat;
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="product-img-wrap">
        <picture>
          <source type="image/webp" srcset="${p.thumbWebp}" />
          <img class="product-img" src="${p.thumb}" alt="${p.name}" loading="lazy" width="${p.width}" height="${p.height}" />
        </picture>
        <span class="product-badge">${CAT_LABELS[p.cat]}</span>
        <div class="product-overlay">
          <span class="product-overlay-cta">Ver pieza</span>
        </div>
      </div>
      <div class="product-meta">
        <p class="product-name">${p.name}</p>
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

  function setFilter(catId) {
    activeFilter = catId;
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
      if (show) visible += 1;
    });

    prodTitle.textContent = labels[catId] || 'Colección';
    prodCount.textContent = pieceLabel(visible);
  }

  setCatalogFilter = setFilter;

  chips.forEach(chip => {
    chip.addEventListener('click', () => setFilter(chip.dataset.cat));
  });

  setFilter('all');
}

/* ─── WHATSAPP ────────────────────────────────────── */
function initWhatsApp() {
  const float = $('#wa-float');
  const mainWa = $('#wa-main-btn');
  const heroWa = $('#hero-wa-btn');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
  if (float) float.href = url;
  if (mainWa) mainWa.href = url;
  if (heroWa) heroWa.href = url;

  const contact = $('#contact');
  if (!float || !contact) return;

  new IntersectionObserver(
    ([entry]) => { float.classList.toggle('is-hidden', entry.isIntersecting); },
    { threshold: 0.25 }
  ).observe(contact);
}

/* ─── LIGHTBOX ────────────────────────────────────── */
let modalCurrentZoom = 1;
let modalTranslateX = 0;
let modalTranslateY = 0;
let lastFocus = null;

function getFocusable(modal) {
  return $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modal)
    .filter(el => !el.hasAttribute('disabled'));
}

function fillLightbox(product) {
  $('#modal-img-webp').srcset = product.imgWebp;
  const modalImg = $('#modal-img');
  modalImg.src = product.img;
  modalImg.alt = product.name;
  $('#modal-cat').textContent = CAT_LABELS[product.cat] || '';
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
}

function openModal(product) {
  const modal = $('#product-modal');
  lastFocus = document.activeElement;
  const list = visibleProducts();
  lightboxIndex = Math.max(0, list.findIndex(p => p.id === product.id));
  fillLightbox(list[lightboxIndex]);

  modal.classList.remove('closing');
  modal.setAttribute('aria-hidden', 'false');
  modal.inert = false;
  document.body.classList.add('modal-open');

  requestAnimationFrame(() => {
    modal.classList.add('open');
    $('#modal-close')?.focus();
  });
}

function stepLightbox(dir) {
  const list = visibleProducts();
  if (!list.length) return;
  lightboxIndex = (lightboxIndex + dir + list.length) % list.length;
  fillLightbox(list[lightboxIndex]);
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
  $('#modal-prev')?.addEventListener('click', e => {
    e.stopPropagation();
    stepLightbox(-1);
  });
  $('#modal-next')?.addEventListener('click', e => {
    e.stopPropagation();
    stepLightbox(1);
  });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepLightbox(-1);
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepLightbox(1);
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
  initCatalog();
  initHero();
  initModal();
  initWhatsApp();
  initScrollReveal();
});
