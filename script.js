/*
  SIMPLY NATURAL SKINCARE — PRODUCTS & PRICES
  -----------------------------------------
  Product names, prices, sizes and ingredient lists below were provided by the business.
  The four existing product photos are in assets/. Lip Scrub and Lip Balm await photos.
  Lip Balm ingredients have not been provided; do not invent them.
  The five scent choices are inquiry requests, not a promise of availability.
  Update SITE_SETTINGS to enable email/Instagram links.
  This website collects inquiries; it does not collect payment.
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

// Six products from the business's product list. "ingredients" is the supplied
// formula listing, NOT a third-party verified label declaration.
const PRODUCTS = [
  {
    id: 'body-scrub', name: 'Body Scrub', shortName: 'body scrub', category: 'body',
    mood: 'EXFOLIATE & GLOW', description: 'Exfoliate, smooth, and glow with natural ingredients.',
    note: 'Ask which scents are currently available for this product.',
    price: 12, size: '10 oz', badge: 'Body care', art: 'cozy', icon: 'scrub', image: 'assets/body_scrub_berry_bliss.webp',
    ingredients: 'Sucrose (Cane Sugar), Simmondsia Chinensis (Jojoba) Seed Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Cocos Nucifera (Coconut) Oil, Tocopherol (Vitamin E), Essential Oils.'
  },
  {
    id: 'body-butter', name: 'Body Butter', shortName: 'body butter', category: 'body',
    mood: 'RICH & CREAMY', description: 'Rich, creamy hydration for soft, nourished skin.',
    note: 'Ask which scents are currently available for this product.',
    price: 16, size: '6 oz', badge: 'Body care', art: 'floral', icon: 'butter', image: 'assets/body_butter_golden_hour.webp',
    ingredients: 'Butyrospermum Parkii (Shea) Butter, Simmondsia Chinensis (Jojoba) Seed Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Maranta Arundinacea (Arrowroot) Powder, Tocopherol (Vitamin E), Essential Oils.'
  },
  {
    id: 'deodorant', name: 'Deodorant', shortName: 'deodorant', category: 'body',
    mood: 'FRESH EVERY DAY', description: 'Natural odor protection that keeps you fresh.',
    note: 'Ask which scents are currently available for this product.',
    price: 14, size: '2 oz', badge: 'Body care', art: 'fresh', icon: 'deodorant', image: 'assets/deodorant_floral_silk.webp',
    ingredients: 'Cocos Nucifera (Coconut) Oil, Cera Alba (Beeswax), Maranta Arundinacea (Arrowroot) Powder, Butyrospermum Parkii (Shea) Butter, Tocopherol (Vitamin E), Essential Oils.'
  },
  {
    id: 'face-scrub', name: 'Face Scrub', shortName: 'face scrub', category: 'face',
    mood: 'SOFT & RADIANT', description: 'Gently exfoliates and refreshes for soft, radiant skin.',
    note: 'Ask which scents are currently available for this product.',
    price: 10, size: '4 oz', badge: 'Face care', art: 'rose', icon: 'face', image: 'assets/face_scrub_warm_vanilla.webp',
    ingredients: 'Sucrose (Fine White Sugar), Simmondsia Chinensis (Jojoba) Seed Oil, Vitis Vinifera (Grape) Seed Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Tocopherol (Vitamin E), Essential Oils.'
  },
  {
    id: 'lip-scrub', name: 'Lip Scrub', shortName: 'lip scrub', category: 'face',
    mood: 'A LITTLE POLISH', description: 'A sugar-based lip scrub made for a little extra softness.',
    note: 'Ask which scents are currently available for this product.',
    price: 8, size: '2 oz', badge: 'Lip care', art: 'rose', icon: 'scrub', image: '',
    ingredients: 'Sucrose (Fine White Sugar), Simmondsia Chinensis (Jojoba) Seed Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Cocos Nucifera (Coconut) Oil, Theobroma Cacao (Cocoa) Seed Butter, Tocopherol (Vitamin E), Essential Oils.'
  },
  {
    id: 'lip-balm', name: 'Lip Balm', shortName: 'lip balm', category: 'face',
    mood: 'A LITTLE SOFTNESS', description: 'Hydrates and protects for soft, healthy lips.',
    note: 'Ask which scents are currently available for this product.',
    price: 6, size: '4.5 mL', badge: 'Lip care', art: 'cozy', icon: 'lip', image: '',
    ingredients: null
  }
];

const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const getProduct = (id) => PRODUCTS.find((product) => product.id === id);
const formatPrice = (price) => typeof price === 'number' && Number.isFinite(price) ? new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(price) : 'Ask for price';
let activeFilter = 'all';
let toastTimer;
let lastModalFocus = null;
let pendingLegacyProductId = null;

// Each scent has its own inquiry-bag entry, so the same product can be requested
// in different scents and quantities without losing the customer's selection.
const scentSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const scentBySlug = (slug) => SCENTS.find((scent) => scentSlug(scent.name) === slug);
const cartKey = (productId, scentName) => `${productId}::${scentSlug(scentName)}`;
function cartEntry(key, qty) {
  const [productId, scentCode, ...extra] = key.split('::');
  const product = getProduct(productId);
  if (!product || extra.length || !Number.isInteger(qty) || qty < 1 || qty > 99) return null;
  // Read old unscented inquiries created before the scent selector was added.
  if (key === productId) return {key, product, scent: null, qty};
  const scent = scentBySlug(scentCode);
  return scent ? {key, product, scent, qty} : null;
}

let cart = readCart();
function readCart() {
  try {
    const data = JSON.parse(localStorage.getItem('sns-inquiry-cart') || '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    return Object.fromEntries(Object.entries(data).filter(([key, qty]) => cartEntry(key, qty)));
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
  const buttonAttrs = asButton
    ? `type="button" data-action="details" data-id="${escapeHtml(product.id)}" aria-label="View ${name} details"`
    : (product.image ? '' : `role="img" aria-label="Illustrated placeholder for ${name}; real photo coming soon"`);
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
  grid.innerHTML = shown.map((product) => `<article class="product-card">${artMarkup(product, true)}<div class="product-card-info"><div class="product-overline">${escapeHtml(product.mood)}</div><div class="product-card-top"><h3>${escapeHtml(product.name)}</h3><span class="product-price">${formatPrice(product.price)}</span></div><span class="product-size">${escapeHtml(product.size)}</span><p class="product-desc">${escapeHtml(product.description)}</p><div class="product-buttons"><button type="button" class="add-button" data-action="details" data-id="${escapeHtml(product.id)}">Choose scent</button><button type="button" class="detail-button" data-action="details" data-id="${escapeHtml(product.id)}">Details</button></div></div></article>`).join('');
  if ($('productTotal')) $('productTotal').textContent = `${shown.length} ${shown.length === 1 ? 'product' : 'products'}`;
}
function addToCart(id, scentName, quantity = 1) {
  const product = getProduct(id);
  const scent = SCENTS.find((entry) => entry.name === scentName);
  if (!product || !scent) return;
  // Convert any old, unselected bag quantity after a customer assigns its scent.
  if (pendingLegacyProductId === id && cart[id]) {
    quantity = cart[id];
    delete cart[id];
  }
  pendingLegacyProductId = null;
  const key = cartKey(id, scent.name);
  cart[key] = Math.min(99, (cart[key] || 0) + quantity);
  saveCart();
  showToast(`${product.name} · ${scent.name} added to your inquiry bag ♡`);
}
function changeQuantity(key, by) {
  if (!cartEntry(key, cart[key] || 0)) return;
  const next = (cart[key] || 0) + by;
  if (next <= 0) delete cart[key];
  else cart[key] = Math.min(99, next);
  saveCart();
}
function renderCart() {
  const entries = Object.entries(cart).map(([key, qty]) => cartEntry(key, qty)).filter(Boolean);
  const count = entries.reduce((sum, entry) => sum + entry.qty, 0);
  $('cartCount').textContent = String(count);
  $('cartHeadingCount').textContent = `(${count})`;
  $('cartItems').innerHTML = !entries.length
    ? `<div class="cart-empty"><div class="empty-icon" aria-hidden="true">♡</div><h3>Your bag is waiting.</h3><p>Explore <a href="scrubs.html">the products</a> and choose your favorite scents to send an inquiry.</p></div>`
    : entries.map(({key, product, scent, qty}) => `<div class="cart-row"><div class="cart-art art-${escapeHtml(product.art)}" aria-hidden="true">✳</div><div class="cart-item-details"><h3>${escapeHtml(product.name)}</h3><span>${formatPrice(product.price)}${product.size ? ' · ' + escapeHtml(product.size) : ''}</span><p class="cart-scent"><strong>Preferred scent:</strong> ${scent ? escapeHtml(scent.name) : 'Not selected yet'}</p>${!scent ? `<button type="button" class="cart-set-scent" data-cart="choose" data-id="${escapeHtml(product.id)}">Choose a scent</button>` : ''}<div class="cart-quantity"><button type="button" data-cart="minus" data-key="${escapeHtml(key)}" aria-label="Remove one ${escapeHtml(product.name)}${scent ? ' in ' + escapeHtml(scent.name) : ''}">−</button><span>${qty}</span><button type="button" data-cart="plus" data-key="${escapeHtml(key)}" aria-label="Add one ${escapeHtml(product.name)}${scent ? ' in ' + escapeHtml(scent.name) : ''}">+</button><button type="button" class="cart-remove" data-cart="remove" data-key="${escapeHtml(key)}">Remove</button></div></div></div>`).join('');
  $('copyRequest').disabled = count === 0;
  $('emailRequest').disabled = count === 0 || !validEmail(SITE_SETTINGS.email);
  $('emailRequest').title = validEmail(SITE_SETTINGS.email) ? '' : 'Set a business email address in script.js to enable email inquiries';
}
function validEmail(value) { return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function requestText() {
  const lines = ['Hello Simply Natural Skincare!', '', "I'd like to ask about these products:"];
  Object.entries(cart).forEach(([key, qty]) => {
    const entry = cartEntry(key, qty);
    if (entry) lines.push(`- ${entry.product.name} — ${entry.scent ? entry.scent.name : 'Scent not selected'} × ${qty}${entry.product.size ? ' (' + entry.product.size + ')' : ''} — ${formatPrice(entry.product.price)}`);
  });
  lines.push('', 'Please confirm my selected scents, stock availability, final pricing, ingredient details, and pickup/shipping options.', '', 'Thank you!');
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
  const p = getProduct(id);
  if (!p) return;
  lastModalFocus = document.activeElement;
  const options = SCENTS.map((scent) => `<option value="${escapeHtml(scent.name)}">${escapeHtml(scent.name)}</option>`).join('');
  $('modalContent').innerHTML = `<div class="modal-grid">${artMarkup(p)}<div class="modal-text"><span class="eyebrow eyebrow-soft">${escapeHtml(p.mood)}</span><h2 id="modalProductName">${escapeHtml(p.name)}</h2><p>${escapeHtml(p.description)}</p><div class="modal-meta"><strong>Price:</strong> ${formatPrice(p.price)}<br><strong>Size:</strong> ${escapeHtml(p.size || 'Ask for details')}</div><details class="ingredient-panel"><summary>Full ingredients <span aria-hidden="true">+</span></summary><p>${p.ingredients ? escapeHtml(p.ingredients) : 'Ingredients for this product have not been provided yet. Please request the complete ingredient list before ordering.'}</p></details><div class="scent-picker"><label for="modalScent">Choose your scent <span aria-hidden="true">✳</span></label><div class="scent-select-wrap"><select id="modalScent" name="scent" required aria-describedby="modalScentDescription"><option value="">Select a scent...</option>${options}</select><span class="scent-select-arrow" aria-hidden="true">⌄</span></div><p class="scent-help" id="modalScentDescription" aria-live="polite">Choose your favorite from our five signature scents.</p></div><p class="availability-note">Scent selections are requests; we’ll confirm what's available before an order is placed.</p><button id="modalAddScent" type="button" class="btn btn-dark" data-action="add" data-id="${escapeHtml(p.id)}" disabled>Add selected scent to inquiry <span aria-hidden="true">↗</span></button></div></div>`;
  $('productModal').hidden = false;
  $('productBackdrop').hidden = false;
  document.body.classList.add('no-scroll');
  $('closeProduct').focus();
}
function hideDetails() {
  pendingLegacyProductId = null;
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
    if (el.dataset.action === 'details') {
      pendingLegacyProductId = null;
      showDetails(el.dataset.id);
    } else if (el.dataset.action === 'add' && el.closest('#modalContent')) {
      const selectedScent = $('modalScent').value;
      if (!SCENTS.some((scent) => scent.name === selectedScent)) return;
      addToCart(el.dataset.id, selectedScent);
      hideDetails();
    }
  };
  if ($('productsGrid')) $('productsGrid').addEventListener('click', onAction);
  $('modalContent').addEventListener('click', onAction);
  $('modalContent').addEventListener('change', (event) => {
    if (event.target.id !== 'modalScent') return;
    const scent = SCENTS.find((entry) => entry.name === event.target.value);
    $('modalAddScent').disabled = !scent;
    $('modalScentDescription').textContent = scent
      ? scent.description
      : 'Choose your favorite from our five signature scents.';
  });
  $('cartItems').addEventListener('click', (event) => {
    const el = event.target.closest('[data-cart]');if(!el)return;
    if (el.dataset.cart === 'choose') {
      pendingLegacyProductId = el.dataset.id;
      showDetails(el.dataset.id);
    } else if(el.dataset.cart === 'remove') {
      delete cart[el.dataset.key];
      saveCart();
    } else changeQuantity(el.dataset.key, el.dataset.cart === 'plus' ? 1 : -1);
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
      const focusables = [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])')].filter(el=>el.offsetParent!==null);
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
