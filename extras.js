/* Simply Natural Skincare: seasonal collection, bundle, and customer review setup.
   SEASON RULES: Northern Hemisphere calendar months. Calendar "in season" alone never
   means a product is available. To announce a collection, add real items and set
   published:true after the business has confirmed stock. No fictional products,
   offers, reviews, ratings, or sale prices are displayed.
*/
const SNS_SEASONS = {
  spring: {label:'Spring', months:[2,3,4], published:false, items:[]},
  summer: {label:'Summer', months:[5,6,7], published:false, items:[]},
  autumn: {label:'Autumn', months:[8,9,10], published:false, items:[]},
  winter: {label:'Winter', months:[11,0,1], published:false, items:[]}
};
// Later: replace the empty lists with business-confirmed bundles and approved reviews.
const SNS_BUNDLES = [];
const SNS_REVIEWS = [];
const snsEscape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function snsCurrentSeason(){
  const month=new Date().getMonth();
  return Object.keys(SNS_SEASONS).find(k=>SNS_SEASONS[k].months.includes(month));
}
function snsSeasonState(key){
  const season=SNS_SEASONS[key], current=snsCurrentSeason()===key;
  const ready=Boolean(season.published && Array.isArray(season.items) && season.items.length);
  if(!current) return {text:'Off season',cls:'is-off-season',available:false};
  if(!ready) return {text:'In season · Coming soon',cls:'is-coming-soon',available:false};
  return {text:'Available now',cls:'is-available',available:true};
}
function snsRenderSeasons(){
  const active=snsCurrentSeason();
  const header=document.getElementById('seasonNowText');
  if (header) header.textContent=`It's ${SNS_SEASONS[active].label.toLowerCase()} right now. Collection status is shown below.`;
  document.querySelectorAll('[data-season-status]').forEach(el=>{
    const key=el.getAttribute('data-season-status');
    if(!SNS_SEASONS[key])return;
    const state=snsSeasonState(key);
    el.textContent=state.text;
    el.classList.add(state.cls);
  });
  const list=document.getElementById('seasonalProducts');
  if(!list)return;
  const key=list.getAttribute('data-season');
  if(!SNS_SEASONS[key])return;
  const state=snsSeasonState(key);
  if (!state.available) return; // preserve helpful coming-soon / off-season display
  list.innerHTML=SNS_SEASONS[key].items.map(item=>{
    const image=item.image?`<img alt="${snsEscape(item.name)}" src="${snsEscape(item.image)}" loading="lazy">`:'<div class="season-item-no-photo">Photo coming soon</div>';
    const price=Number.isFinite(item.price)?`$${Number(item.price).toFixed(2)}`:'Ask for price';
    return `<article class="season-product-card"><div class="season-product-art">${image}</div><div class="season-product-text"><h3>${snsEscape(item.name)}</h3><p>${snsEscape(item.description||'')}</p><span>${snsEscape(item.size||'')} · ${price}</span><a href="contact.html">Ask about this product</a></div></article>`;
  }).join('');
}
function snsRenderBundles(){
  const list=document.getElementById('bundleListings');
  if(!list || !SNS_BUNDLES.length)return;
  list.innerHTML=SNS_BUNDLES.filter(b=>b.published===true).map(bundle=>{
    const img=bundle.image?`<img src="${snsEscape(bundle.image)}" alt="${snsEscape(bundle.name)}" loading="lazy">`:'';
    const price=Number.isFinite(bundle.price)?`$${Number(bundle.price).toFixed(2)}`:'Ask for price';
    return `<article class="bundle-card bundle-live">${img}<span class="bundle-state is-available">Available offer</span><h3>${snsEscape(bundle.name)}</h3><p>${snsEscape(bundle.description||'')}</p><strong>${price}</strong><a class="text-link" href="contact.html">Ask about this offer</a></article>`;
  }).join('') || list.innerHTML;
}
function snsRenderReviews(){
  const list=document.getElementById('reviewsList');
  if(!list || !SNS_REVIEWS.length)return;
  const published=SNS_REVIEWS.filter(r=>r.approved===true);
  if (!published.length) return;
  list.innerHTML=published.map(r=>`<blockquote class="review-quote-card"><p>“${snsEscape(r.quote)}”</p><footer>— ${snsEscape(r.displayName)}</footer></blockquote>`).join('');
}
document.addEventListener('DOMContentLoaded',()=>{snsRenderSeasons();snsRenderBundles();snsRenderReviews();});
