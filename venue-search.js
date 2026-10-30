/* Wedding Day 2 venue search
   Usage in the Squarespace Code block on the Venues page:
     <div id="wd2-venues-root"></div>
     <script>
     fetch('https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venue-search.js', {cache: 'no-cache'})
       .then(function (r) { return r.text(); })
       .then(function (t) { var s = document.createElement('script'); s.textContent = t; document.body.appendChild(s); });
     </script>
   Venues come from venues.json (the same file the venue pages use), so a venue
   added or changed there shows up here automatically. */
(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/conorclmurphy/wd2-venues/main/venues.json';
  var WATERMARK_LOGO_URL = 'https://images.squarespace-cdn.com/content/v1/68e3e2b74d7ab5214f499b88/d0f816a6-5802-418f-bd11-37ddd18df645/logo2027transparent.png?format=500w';

  var root = document.getElementById('wd2-venues-root');
  if (!root) return;

  if (!document.getElementById('wd2-search-fonts')) {
    var f = document.createElement('link');
    f.id = 'wd2-search-fonts'; f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Jost:wght@400;500;600&display=swap';
    document.head.appendChild(f);
  }

  var css = '\
#wd2-venues-root{--ink:#f1ede2;--cream:#000000;--card:#191919;--sage:#3dc2bb;--sage-dark:#8adcd7;--brass:#ffffff;--rose:#d9a394;--line:#2e2e2e;--radius:14px;\
font-family:"Jost","Work Sans",-apple-system,BlinkMacSystemFont,sans-serif;color:var(--ink);background:var(--cream);padding:40px 20px 56px;box-sizing:border-box;position:relative;overflow:hidden;border:1px solid var(--line);border-radius:24px}\
#wd2-venues-root .wd2-watermark{position:absolute;top:50%;left:50%;width:min(1100px,140vw);transform:translate(-50%,-50%);opacity:.05;filter:brightness(0) invert(1);pointer-events:none;z-index:0;user-select:none}\
#wd2-venues-root>.wd2-head,#wd2-venues-root>.wd2-filters,#wd2-venues-root>.wd2-reset,#wd2-venues-root>.wd2-count,#wd2-venues-root>.wd2-grid,#wd2-venues-root>.wd2-empty{position:relative;z-index:1}\
#wd2-venues-root *,#wd2-venues-root *::before,#wd2-venues-root *::after{box-sizing:border-box}\
#wd2-venues-root .wd2-head{max-width:1040px;margin:0 auto 28px;text-align:center}\
#wd2-venues-root .wd2-eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);font-weight:600;margin-bottom:8px}\
#wd2-venues-root .wd2-title{font-family:"Fraunces",serif;font-optical-sizing:auto;font-weight:500;font-size:clamp(28px,4vw,42px);margin:0 0 8px;color:var(--sage-dark)}\
#wd2-venues-root .wd2-sub{font-size:15px;color:#b7b2a1;margin:0}\
#wd2-venues-root .wd2-filters{max-width:1040px;margin:0 auto 30px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:20px 22px;display:grid;gap:16px;grid-template-columns:1.3fr 1fr 1fr}\
@media (max-width:720px){#wd2-venues-root .wd2-filters{grid-template-columns:1fr}}\
#wd2-venues-root .wd2-field label{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--sage-dark);margin-bottom:7px}\
#wd2-venues-root .wd2-field input[type="text"],#wd2-venues-root .wd2-field select{width:100%;padding:9px 12px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:14px;background:var(--cream);color:var(--ink)}\
#wd2-venues-root .wd2-field input[type="text"]:focus,#wd2-venues-root .wd2-field select:focus{outline:2px solid var(--sage);outline-offset:1px}\
#wd2-venues-root .wd2-chiprow{display:flex;flex-wrap:wrap;gap:8px}\
#wd2-venues-root .wd2-chip{padding:8px 14px;border-radius:999px;border:1px solid var(--line);background:var(--cream);font-size:13px;cursor:pointer;font-family:inherit;color:var(--ink);transition:all .15s ease}\
#wd2-venues-root .wd2-chip:hover{border-color:var(--sage)}\
#wd2-venues-root .wd2-chip[aria-pressed="true"]{background:var(--sage);border-color:var(--sage);color:#fff}\
#wd2-venues-root .wd2-capacity-row{display:flex;align-items:center;gap:10px}\
#wd2-venues-root .wd2-capacity-row input[type="range"]{flex:1;accent-color:var(--sage)}\
#wd2-venues-root .wd2-capacity-val{font-size:13px;font-weight:600;color:var(--sage-dark);min-width:74px;text-align:right}\
#wd2-venues-root .wd2-reset{max-width:1040px;margin:-14px auto 26px;text-align:right}\
#wd2-venues-root .wd2-reset button{background:none;border:none;font-family:inherit;font-size:13px;color:var(--brass);cursor:pointer;text-decoration:underline}\
#wd2-venues-root .wd2-count{max-width:1040px;margin:0 auto 16px;font-size:13px;color:#b7b2a1}\
#wd2-venues-root .wd2-grid{max-width:1040px;margin:0 auto;display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}\
#wd2-venues-root .wd2-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;text-decoration:none;color:inherit;transition:transform .18s ease,box-shadow .18s ease}\
#wd2-venues-root .wd2-card.wd2-live:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(32,40,31,.12)}\
#wd2-venues-root .wd2-card.wd2-soon{cursor:default;opacity:.82}\
#wd2-venues-root .wd2-card-img{width:100%;aspect-ratio:4/3;object-fit:cover;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%);display:block}\
#wd2-venues-root .wd2-card-img-fallback{width:100%;aspect-ratio:4/3;background:linear-gradient(135deg,var(--sage) 0%,var(--sage-dark) 100%);display:flex;align-items:center;justify-content:center;font-family:"Fraunces",serif;font-size:34px;color:#fff;opacity:.85}\
#wd2-venues-root .wd2-card-body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:8px;flex:1}\
#wd2-venues-root .wd2-card-name{font-family:"Fraunces",serif;font-weight:500;font-size:19px;margin:0;color:var(--sage-dark)}\
#wd2-venues-root .wd2-card-county{font-size:12.5px;color:#9a9484;letter-spacing:.02em}\
#wd2-venues-root .wd2-tagrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}\
#wd2-venues-root .wd2-tag{font-size:11px;padding:4px 9px;border-radius:999px;font-weight:600;letter-spacing:.02em}\
#wd2-venues-root .wd2-tag-cap{background:#eef1e9;color:var(--sage-dark)}\
#wd2-venues-root .wd2-tag-sitdown{background:#f3e6e2;color:#9a5646}\
#wd2-venues-root .wd2-tag-casual{background:#e9eef5;color:#3f5c80}\
#wd2-venues-root .wd2-tag-both{background:#f6ecd9;color:#8a6a2d}\
#wd2-venues-root .wd2-soon-badge{margin-top:auto;font-size:12px;font-weight:600;color:var(--brass);letter-spacing:.04em;text-transform:uppercase;padding-top:6px}\
#wd2-venues-root .wd2-view{margin-top:auto;font-size:12.5px;font-weight:600;color:var(--sage);letter-spacing:.03em}\
#wd2-venues-root .wd2-empty{max-width:1040px;margin:40px auto;text-align:center;padding:40px 20px;color:#9a9484;font-size:15px}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  root.innerHTML = '<div class="wd2-count" style="text-align:center">Loading venues…</div>';

  fetch(DATA_URL, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (DATA) {
      var VENUES = DATA.venues.map(function (v) {
        var pic = v.cardImg || v.heroImg;
        return {
          name: v.name,
          county: v.county,
          capacity: Number(v.capacity) || 0,
          foodStyle: v.foodStyle,
          live: !!(v.live && v.url),
          url: v.url,
          img: pic ? DATA.imageBase + pic + '?format=500w' : ''
        };
      });
      build(VENUES);
    })
    .catch(function () {
      root.innerHTML = '<div class="wd2-empty">Venues could not be loaded. Please refresh the page.</div>';
    });

  function build(VENUES) {
    var counties = Array.from(new Set(VENUES.map(function (v) { return v.county; }))).sort();
    var maxCapacity = Math.max.apply(null, VENUES.map(function (v) { return v.capacity; }).concat([50]));

    root.innerHTML = '\
      <img class="wd2-watermark" src="' + WATERMARK_LOGO_URL + '" alt="" aria-hidden="true" onerror="this.style.display=\'none\'" />\
      <div class="wd2-head">\
        <div class="wd2-eyebrow">Find Your Venue</div>\
        <h2 class="wd2-title">Search Wedding Day 2 Venues</h2>\
        <p class="wd2-sub">Filter by location, guest capacity and dining style to find the right fit.</p>\
      </div>\
      <div class="wd2-filters">\
        <div class="wd2-field">\
          <label for="wd2-search">Search by name</label>\
          <input type="text" id="wd2-search" placeholder="e.g. Dame Tavern" />\
        </div>\
        <div class="wd2-field">\
          <label for="wd2-county">Location</label>\
          <select id="wd2-county"><option value="">All counties</option>' +
            counties.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select>\
        </div>\
        <div class="wd2-field">\
          <label for="wd2-capacity">Minimum guest capacity</label>\
          <div class="wd2-capacity-row">\
            <input type="range" id="wd2-capacity" min="0" max="' + maxCapacity + '" step="10" value="0" />\
            <span class="wd2-capacity-val" id="wd2-capacity-val">Any</span>\
          </div>\
        </div>\
        <div class="wd2-field" style="grid-column: 1 / -1;">\
          <label>Dining style</label>\
          <div class="wd2-chiprow" id="wd2-food-chips">\
            <button type="button" class="wd2-chip" data-food="" aria-pressed="true">All</button>\
            <button type="button" class="wd2-chip" data-food="sitdown" aria-pressed="false">Sit-down</button>\
            <button type="button" class="wd2-chip" data-food="casual" aria-pressed="false">Casual</button>\
            <button type="button" class="wd2-chip" data-food="both" aria-pressed="false">Both</button>\
          </div>\
        </div>\
      </div>\
      <div class="wd2-reset"><button type="button" id="wd2-reset-btn">Reset filters</button></div>\
      <div class="wd2-count" id="wd2-count"></div>\
      <div class="wd2-grid" id="wd2-grid"></div>\
      <div class="wd2-empty" id="wd2-empty" style="display:none;">No venues match those filters yet. Try widening your search.</div>';

    var els = {
      search: root.querySelector('#wd2-search'),
      county: root.querySelector('#wd2-county'),
      capacity: root.querySelector('#wd2-capacity'),
      capacityVal: root.querySelector('#wd2-capacity-val'),
      chips: Array.prototype.slice.call(root.querySelectorAll('#wd2-food-chips .wd2-chip')),
      grid: root.querySelector('#wd2-grid'),
      empty: root.querySelector('#wd2-empty'),
      count: root.querySelector('#wd2-count'),
      reset: root.querySelector('#wd2-reset-btn')
    };
    var state = { search: '', county: '', minCapacity: 0, food: '' };
    var foodLabel = { sitdown: 'Sit-down', casual: 'Casual', both: 'Sit-down & Casual' };
    var foodTagClass = { sitdown: 'wd2-tag-sitdown', casual: 'wd2-tag-casual', both: 'wd2-tag-both' };

    function matchesFood(venueFood, filter) {
      if (!filter) return true;
      if (filter === 'both') return venueFood === 'both';
      return venueFood === filter || venueFood === 'both';
    }

    function render() {
      var q = state.search.trim().toLowerCase();
      var results = VENUES.filter(function (v) {
        return (!q || v.name.toLowerCase().indexOf(q) !== -1) &&
          (!state.county || v.county === state.county) &&
          (v.capacity >= state.minCapacity) &&
          matchesFood(v.foodStyle, state.food);
      });
      els.count.textContent = results.length + ' venue' + (results.length === 1 ? '' : 's') + ' found';
      els.empty.style.display = results.length ? 'none' : 'block';
      els.grid.innerHTML = results.map(function (v) {
        var imgBlock = v.img
          ? '<img class="wd2-card-img" src="' + esc(v.img) + '" alt="' + esc(v.name) + '" loading="lazy" onerror="this.outerHTML=\'<div class=&quot;wd2-card-img-fallback&quot;>' + esc(v.name.charAt(0)) + '</div>\'" />'
          : '<div class="wd2-card-img-fallback">' + esc(v.name.charAt(0)) + '</div>';
        var inner = imgBlock +
          '<div class="wd2-card-body">' +
            '<h3 class="wd2-card-name">' + esc(v.name) + '</h3>' +
            '<div class="wd2-card-county">' + esc(v.county) + '</div>' +
            '<div class="wd2-tagrow">' +
              '<span class="wd2-tag wd2-tag-cap">Up to ' + v.capacity + ' guests</span>' +
              '<span class="wd2-tag ' + (foodTagClass[v.foodStyle] || '') + '">' + esc(foodLabel[v.foodStyle] || v.foodStyle) + '</span>' +
            '</div>' +
            (v.live ? '<span class="wd2-view">View venue →</span>' : '<span class="wd2-soon-badge">Page coming soon</span>') +
          '</div>';
        return v.live
          ? '<a class="wd2-card wd2-live" href="' + esc(v.url) + '">' + inner + '</a>'
          : '<div class="wd2-card wd2-soon">' + inner + '</div>';
      }).join('');
    }

    els.search.addEventListener('input', function (e) { state.search = e.target.value; render(); });
    els.county.addEventListener('change', function (e) { state.county = e.target.value; render(); });
    els.capacity.addEventListener('input', function (e) {
      state.minCapacity = Number(e.target.value);
      els.capacityVal.textContent = state.minCapacity === 0 ? 'Any' : state.minCapacity + '+';
      render();
    });
    els.chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        els.chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        state.food = chip.getAttribute('data-food');
        render();
      });
    });
    els.reset.addEventListener('click', function () {
      state = { search: '', county: '', minCapacity: 0, food: '' };
      els.search.value = ''; els.county.value = ''; els.capacity.value = 0;
      els.capacityVal.textContent = 'Any';
      els.chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-food') === '' ? 'true' : 'false'); });
      render();
    });

    render();
  }
})();
