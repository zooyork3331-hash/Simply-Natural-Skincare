/*
  SIMPLY NATURAL SKINCARE — EASY WEBSITE EDITS
  -------------------------------------------
  1. Products and scent descriptions come from the Simply Natural product menu.
  2. Fill in real prices, sizes, and product photo paths when provided.
  3. Set the email and Instagram URL to real business contact details.
  4. For actual product photography, place photos in assets/ and set image to
     something like 'assets/my-scrub.jpg'. Leave image blank for a labeled placeholder.
  5. This is a GitHub Pages-friendly INQUIRY catalog, not a payment checkout.
  IMPORTANT: Do not list unverified ingredients, claims, or prices.
*/
const SITE_SETTINGS = {
  demoMode: false,
  email: '', // Example: 'hello@example.com' — replace with the REAL business email
  instagram: '' // Example: 'https://www.instagram.com/your-real-handle/'
};

const SCENTS = [
  { name: 'Warm Vanilla', description: 'Warm, sweet, and comforting.' },
  { name: 'Berry Bliss', description: 'Juicy, sweet, and bright.' },
  { name: 'Floral Silk', description: 'Soft, feminine, and elegant.' },
  { name: 'Clean Aura', description: 'Fresh, light, and clean.' },
  { name: 'Golden Hour', description: 'Warm, rich, and luxurious.' }
];

// These five product types and descriptions are from the business's provided product menu.
// Individual product/scent combinations have NOT been confirmed; inquire about availability.
const PRODUCTS = [
  {
    id: 'body-scrub', name: 'Body Scrub', shortName: 'body scrub', category: 'body',
    mood: 'EXFOLIATE & GLOW', description: 'Exfoliate, smooth, and glow with natural ingredients.',
    note: 'Ask which scents are currently available for this product.',
    price: null, size: '', badge: 'Body care', art: 'cozy', icon: 'scrub', image: ''
  },
  {
    id: 'body-butter', name: 'Body Butter', shortName: 'body butter', category: 'body',
    mood: 'RICH & CREAMY', description: 'Rich, creamy hydration for soft, nourished skin.',
    note: 'Ask which scents are currently available for this product.',
    price: null, size: '', badge: 'Body care', art: 'floral', icon: 'butter', image: ''
  },
  {
    id: 'deodorant', name: 'Deodorant', shortName: 'deodorant', category: 'body',
    mood: 'FRESH EVERY DAY', description: 'Natural odor protection that keeps you fresh.',
    note: 'Ask which scents are currently available for this product.',
    price: null, size: '', badge: 'Body care', art: 'fresh', icon: 'deodorant', image: ''
  },
  {
    id: 'face-scrub', name: 'Face Scrub', shortName: 'face scrub', category: 'face',
    mood: 'SOFT & RADIANT', description: 'Gently exfoliates and refreshes for soft, radiant skin.',
    note: 'Ask which scents are currently available for this product.',
    price: null, size: '', badge: 'Face care', art: 'rose', icon: 'face', image: ''
  },
  {
    id: 'lip-balm', name: 'Lip Balm', shortName: 'lip balm', category: 'face',
    mood: 'A LITTLE SOFTNESS', description: 'Hydrates and protects for soft, healthy lips.',
    note: 'Ask which scents are currently available for this product.',
    price: null, size: '', badge: 'Lip care', art: 'cozy', icon: 'lip', image: ''
  }
];

const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const getProduct = (id) => PRODUCTS.find((product) => product.id === id);
const formatPrice = (price) => typeof price === 'number' && Number.isFinite(price) ? new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(price) : 'Ask for price';
let activeFilter = 'all';
let cart = readCart();
let toastTimer;
let lastModalFocus = null;

function readCart() {
  try {
    const data = JSON.parse(localStorage.getItem('sns-inquiry-cart') || '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    return Object.fromEntries(Object.entries(data).filter(([id, qty]) => getProduct(id) && Number.isInteger(qty) && qty > 0 && qty <= 99));
  } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem('sns-inquiry-cart', JSON.stringify(cart)); } catch { /* Browsers with blocked storage still work for this session. */ }
  renderCart();
}
function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function productIcon(product) {
  const icons = {
    scrub: '<rect x="18" y="30" width="44" height="37" rx="8"/><rect x="16" y="21" width="48" height="11" rx="4"/><path d="M28 46h24M28 53h24"/>',
    butter: '<rect x="15" y="31" width="50" height="34" rx="9"/><rect x="13" y="23" width="54" height="10" rx="4"/><path d="M30 49c5-7 15-7 20 0-4 8-16 8-20 0Z"/>',
    deodorant: '<rect x="24" y="24" width="32" height="45" rx="8"/><rect x="24" y="17" width="32" height="15" rx="6"/><path d="M32 50h16"/>',
    face: '<rect x="17" y="31" width="46" height="35" rx="8"/><rect x="14" y="24" width="52" height="11" rx="4"/><path d="M39 42v13M32 49h14"/>',
    lip: '<rect x="29" y="34" width="22" height="34" rx="4"/><path d="M29 44h22M34 24h12v10H34zM35 24v-8h10v8"/>'
  };
  return `<svg class="placeholder-drawing" viewBox="0 0 80 84" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[product.icon] || icons.scrub}</svg>`;
}
function artMarkup(product, asButton = false) {
  const tag = asButton ? 'button' : 'div';
  const name = escapeHtml(product.name);
  const buttonAttrs = asButton ? `type="button" data-action="details" data-id="${escapeHtml(product.id)}" aria-label="View ${name} details"` : `role="img" aria-label="Illustrated placeholder for ${name}; real photo coming soon"`;
  const content = product.image
    ? `<img class="product-image" src="${escapeHtml(product.image)}" alt="${name} product photo" loading="lazy">`
    : `<div class="product-photo-placeholder">${productIcon(product)}<span class="placeholder-product-name">${name}</span><span class="placeholder-subtitle">PHOTO COMING SOON</span></div>`;
  return `<${tag} class="product-art art-${escapeHtml(product.art)}" ${buttonAttrs}>${content}${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ''}</${tag}>`;
}
function renderProducts() {
  const grid = $('productsGrid');
  if (!grid) return;
  const allMatching = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeFilter);
  const limit = Number.parseInt(grid.dataset.limit || '0', 10);
  const shown = limit > 0 ? allMatching.slice(0, limit) : allMatching;
  grid.innerHTML = shown.map((product) => `<article class="product-card">${artMarkup(product, true)}<div class="product-card-info"><div class="product-overline">${escapeHtml(product.mood)}</div><div class="product-card-top"><h3>${escapeHtml(product.name)}</h3><span class="product-price">${formatPrice(product.price)}</span></div><p class="product-desc">${escapeHtml(product.description)}</p><div class="product-buttons"><button type="button" class="add-button" data-action="add" data-id="${escapeHtml(product.id)}">+ Add to inquiry</button><button type="button" class="detail-button" data-action="details" data-id="${escapeHtml(product.id)}">Details</button></div></div></article>`).join('');
  if ($('productTotal')) $('productTotal').textContent = `${shown.length} ${shown.length === 1 ? 'product' : 'products'}`;
}
function addToCart(id) {
  if (!getProduct(id)) return;
  cart[id] = Math.min(99, (cart[id] || 0) + 1);
  saveCart();
  showToast('Added to your inquiry bag ♡');
}
function changeQuantity(id, by) {
  if (!getProduct(id)) return;
  const next = (cart[id] || 0) + by;
  if (next <= 0) delete cart[id];
  else cart[id] = Math.min(99, next);
  saveCart();
}
function renderCart() {
  const entries = Object.entries(cart).map(([id, qty]) => ({product: getProduct(id), qty})).filter(({product}) => product);
  const count = entries.reduce((sum, entry) => sum + entry.qty, 0);
  $('cartCount').textContent = String(count);
  $('cartHeadingCount').textContent = `(${count})`;
  $('cartItems').innerHTML = !entries.length ? `<div class="cart-empty"><div class="empty-icon" aria-hidden="true">♡</div><h3>Your bag is waiting.</h3><p>Explore <a href="scrubs.html">the products</a> and save a few favorites to send an inquiry.</p></div>` : entries.map(({product, qty}) => `<div class="cart-row"><div class="cart-art art-${escapeHtml(product.art)}" aria-hidden="true">✳</div><div class="cart-item-details"><h3>${escapeHtml(product.name)}</h3><span>${formatPrice(product.price)}${product.size ? ' · ' + escapeHtml(product.size) : ''}</span><div class="cart-quantity"><button type="button" data-cart="minus" data-id="${escapeHtml(product.id)}" aria-label="Remove one ${escapeHtml(product.name)}">−</button><span>${qty}</span><button type="button" data-cart="plus" data-id="${escapeHtml(product.id)}" aria-label="Add one ${escapeHtml(product.name)}">+</button><button type="button" class="cart-remove" data-cart="remove" data-id="${escapeHtml(product.id)}">Remove</button></div></div></div>`).join('');
  $('copyRequest').disabled = count === 0;
  $('emailRequest').disabled = count === 0 || !validEmail(SITE_SETTINGS.email);
  $('emailRequest').title = validEmail(SITE_SETTINGS.email) ? '' : 'Set a business email address in script.js to enable email inquiries';
}
function validEmail(value) { return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function requestText() {
  const lines = ['Hello Simply Natural Skincare!', '', "I'd like to ask about these products:"];
  Object.entries(cart).forEach(([id, qty]) => { const p = getProduct(id); if (p) lines.push(`- ${p.name} × ${qty}${p.size ? ' (' + p.size + ')' : ''}`); });
  lines.push('', 'Preferred scent(s), if available: __________________', '', 'Could you please confirm scent options, availability, prices, ingredients, and pickup/shipping options?', '', 'Thank you!');
  return lines.join('\n');
}
async function copyRequest() {
  const content = requestText();
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(content);
    else {
      const area = document.createElement('textarea');
      area.value = content;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();
      if (!document.execCommand('copy')) throw new Error('Copy not supported');
      area.remove();
    }
    $('cartFeedback').textContent = 'Inquiry copied! You can paste it into a message.';
    showToast('Inquiry copied to clipboard');
  } catch { $('cartFeedback').textContent = 'Automatic copying is unavailable in this browser. Try the email option once it is configured.'; }
}
function emailRequest() {
  if (!validEmail(SITE_SETTINGS.email)) return;
  window.location.href = `mailto:${encodeURIComponent(SITE_SETTINGS.email)}?subject=${encodeURIComponent('Product inquiry — Simply Natural Skincare')}&body=${encodeURIComponent(requestText())}`;
}
function setDrawer(open) {
  $('cartDrawer').hidden = !open;
  $('cartBackdrop').hidden = !open;
  document.body.classList.toggle('no-scroll', open || !$('productModal').hidden);
  if (open) {$('closeCart').focus();$('cartFeedback').textContent = '';}
  else $('openCart').focus();
}
function showDetails(id) {
  const p = getProduct(id);if (!p)return;
  lastModalFocus = document.activeElement;
  $('modalContent').innerHTML = `<div class="modal-grid">${artMarkup(p)}<div class="modal-text"><span class="eyebrow eyebrow-soft">${escapeHtml(p.mood)}</span><h2 id="modalProductName">${escapeHtml(p.name)}</h2><p>${escapeHtml(p.description)}</p><p>${escapeHtml(p.note)}</p><div class="modal-meta"><strong>Price:</strong> ${formatPrice(p.price)}<br><strong>Size:</strong> ${escapeHtml(p.size || 'Ask for details')}<br><strong>Ingredients:</strong> Please request the verified ingredient list before ordering.<br><strong>Scents:</strong> Ask which of our five menu scents can be paired with this product.</div><button type="button" class="btn btn-dark" data-action="add" data-id="${escapeHtml(p.id)}">Add to inquiry <span aria-hidden="true">↗</span></button></div></div>`;
  $('productModal').hidden = false;
  $('productBackdrop').hidden = false;
  document.body.classList.add('no-scroll');
  $('closeProduct').focus();
}
function hideDetails() {
  $('productModal').hidden = true;
  $('productBackdrop').hidden = true;
  document.body.classList.toggle('no-scroll', !$('cartDrawer').hidden);
  if(lastModalFocus && typeof lastModalFocus.focus === 'function') lastModalFocus.focus();
}
function updateContacts() {
  const email = $('contactEmail'), insta = $('contactInstagram');
  if (!email || !insta) return;
  if (validEmail(SITE_SETTINGS.email)) { email.href = `mailto:${encodeURIComponent(SITE_SETTINGS.email)}`;email.removeAttribute('aria-disabled'); }
  if (/^https:\/\/((www\.)?instagram\.com|instagr\.am)\/[\w.]+\/?(?:\?.*)?$/.test(SITE_SETTINGS.instagram)) {
    insta.href = SITE_SETTINGS.instagram;insta.target = '_blank';insta.rel = 'noopener noreferrer';insta.removeAttribute('aria-disabled');
  }
  $('contactStatus').textContent = validEmail(SITE_SETTINGS.email) ? 'We look forward to hearing from you ♡' : 'Contact details coming soon — check back shortly.';
  [email, insta].forEach((link) => link.addEventListener('click', (event) => {if(link.getAttribute('aria-disabled') === 'true'){event.preventDefault();showToast('This contact link has not been set up yet.');}}));
}
function setupEvents() {
  if ($('filters')) $('filters').addEventListener('click', (event) => {
    const chip = event.target.closest('[data-filter]');if(!chip)return;
    activeFilter = chip.dataset.filter;
    $('filters').querySelectorAll('[data-filter]').forEach((button) => {const active = button === chip;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    renderProducts();
  });
  const onAction = (event) => {
    const el = event.target.closest('[data-action]');if(!el)return;
    if (el.dataset.action === 'add')addToCart(el.dataset.id);
    else if(el.dataset.action === 'details')showDetails(el.dataset.id);
  };
  if ($('productsGrid')) $('productsGrid').addEventListener('click', onAction);
  $('modalContent').addEventListener('click', onAction);
  $('cartItems').addEventListener('click', (event) => {
    const el = event.target.closest('[data-cart]');if(!el)return;
    if(el.dataset.cart === 'remove'){delete cart[el.dataset.id];saveCart();}
    else changeQuantity(el.dataset.id, el.dataset.cart === 'plus' ? 1 : -1);
  });
  $('openCart').addEventListener('click', () => setDrawer(true));
  $('closeCart').addEventListener('click', () => setDrawer(false));
  $('cartBackdrop').addEventListener('click', () => setDrawer(false));
  $('copyRequest').addEventListener('click', copyRequest);
  $('emailRequest').addEventListener('click', emailRequest);
  $('closeProduct').addEventListener('click', hideDetails);
  $('productBackdrop').addEventListener('click', hideDetails);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if(!$('productModal').hidden)hideDetails();
      else if(!$('cartDrawer').hidden)setDrawer(false);
      else if($('menuButton').getAttribute('aria-expanded') === 'true')toggleMobileNav(false);
    }
    if(event.key === 'Tab'){
      const dialog = !$('productModal').hidden ? $('productModal') : (!$('cartDrawer').hidden ? $('cartDrawer') : null);
      if(!dialog)return;
      const focusables = [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')].filter(el=>el.offsetParent!==null);
      if(!focusables.length)return;
      const first=focusables[0],last=focusables[focusables.length-1];
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  $('menuButton').addEventListener('click',()=>toggleMobileNav($('mobileNav').hidden));
  $('mobileNav').addEventListener('click',(event)=>{if(event.target.closest('a'))toggleMobileNav(false);});
}
function toggleMobileNav(open){$('mobileNav').hidden=!open;$('menuButton').setAttribute('aria-expanded',String(open));$('menuButton').setAttribute('aria-label',open?'Close menu':'Open menu');}

function init(){
  $('year').textContent = new Date().getFullYear();
  $('demoNotice').hidden = !SITE_SETTINGS.demoMode;
  renderProducts();renderCart();updateContacts();setupEvents();
}
init();
